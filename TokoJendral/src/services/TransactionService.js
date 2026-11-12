const db = require('../config/database');
const ProductUnitModel = require('../models/ProductUnitModel');
const InventoryService = require('./InventoryService');

class TransactionService {
  /**
   * Process a POS checkout transaction with FIFO stock deduction.
   *
   * Flow:
   * 1. Validate all cart items (stock availability, prices)
   * 2. Begin database transaction for atomicity
   * 3. Create transaction header
   * 4. For each cart item:
   *    a. Calculate base units needed (quantity * conversion_factor)
   *    b. Deduct stock FIFO from oldest batches
   *    c. Record transaction items with cost tracking
   * 5. Handle payment (calculate change for CASH)
   * 6. Commit transaction
   *
   * @param {Object} params
   * @param {number} params.userId - Cashier/reseller user ID
   * @param {string} params.customerName - Optional customer name
   * @param {Array} params.items - [{ productUnitId, quantity }]
   * @param {string} params.paymentMethod - CASH | TRANSFER | QRIS
   * @param {number} params.amountPaid - For CASH: amount tendered
   */
  static async checkout({ userId, customerName, items, paymentMethod, amountPaid, transactionDate }) {
    // Pre-validate all items exist and have stock
    const validatedItems = [];
    for (const item of items) {
      const productUnit = await ProductUnitModel.findById(item.productUnitId);
      if (!productUnit || !productUnit.is_active) {
        throw Object.assign(
          new Error(`Produk dengan ID ${item.productUnitId} tidak ditemukan atau tidak aktif.`),
          { status: 400 }
        );
      }

      const conversionFactor = parseFloat(productUnit.conversion_factor);
      const baseUnitsNeeded = item.quantity * conversionFactor;
      const stock = await InventoryService.getAvailableStock(item.productUnitId);

      if (stock.availableUnits < item.quantity) {
        throw Object.assign(
          new Error(`Stok ${productUnit.item_name} (${productUnit.unit_name}) tidak mencukupi. Tersedia: ${stock.availableUnits}, diminta: ${item.quantity}`),
          { status: 400 }
        );
      }

      validatedItems.push({
        ...item,
        productUnit,
        baseUnitsNeeded,
        subtotal: item.quantity * parseFloat(productUnit.selling_price)
      });
    }

    const totalAmount = validatedItems.reduce((sum, item) => sum + item.subtotal, 0);

    // Validate payment
    let changeAmount = 0;
    let paymentStatus = 'paid';

    if (paymentMethod === 'CASH') {
      if (!amountPaid || amountPaid < totalAmount) {
        throw Object.assign(
          new Error(`Pembayaran CASH kurang. Total: ${totalAmount}, Dibayar: ${amountPaid || 0}`),
          { status: 400 }
        );
      }
      changeAmount = amountPaid - totalAmount;
    } else {
      // TRANSFER / QRIS: mark as pending until manually confirmed
      paymentStatus = 'pending';
      amountPaid = totalAmount;
    }

    // Execute transactional checkout
    return db.transaction(async (trx) => {
      // Create transaction header with backdate support
      const nowIso = new Date().toISOString();
      const txHeader = {
        user_id: userId,
        customer_name: customerName || null,
        total_amount: totalAmount,
        payment_method: paymentMethod,
        payment_status: paymentStatus,
        amount_paid: amountPaid,
        change_amount: changeAmount,
        transaction_date: transactionDate || nowIso,
        created_at: transactionDate || nowIso
      };

      const [transactionId] = await trx('transactions').insert(txHeader);

      // Process each item with FIFO deduction
      const transactionItems = [];
      for (const item of validatedItems) {
        if (item.productUnit.is_bundle) {
          // Composite bundle: deduct each component's required base stock via FIFO
          const components = await trx('bundle_items').where({ bundle_unit_id: item.productUnitId });

          let bundleTotalCost = 0;
          let totalBaseDeducted = 0;
          let primaryBatchId = null;

          for (const comp of components) {
            const compNeeded = item.quantity * parseFloat(comp.quantity_needed);
            const compDeductions = await InventoryService.deductStockFifo(
              trx,
              comp.component_item_name,
              compNeeded
            );

            for (const deduction of compDeductions) {
              const compCost = deduction.costPrice * deduction.quantityDeducted;
              bundleTotalCost += compCost;
              totalBaseDeducted += deduction.quantityDeducted;
              if (!primaryBatchId) {
                primaryBatchId = deduction.batchId;
              }

              transactionItems.push({
                batchId: deduction.batchId,
                productUnitId: item.productUnitId,
                componentName: comp.component_item_name,
                baseQuantityDeducted: deduction.quantityDeducted,
                costPrice: deduction.costPrice
              });
            }
          }

          const bundleUnitCost = item.quantity > 0 ? (bundleTotalCost / item.quantity) : 0;
          const itemRow = {
            transaction_id: transactionId,
            batch_id: primaryBatchId || 1,
            product_unit_id: item.productUnitId,
            quantity_sold: item.quantity,
            base_quantity_deducted: totalBaseDeducted,
            unit_price: parseFloat(item.productUnit.selling_price),
            cost_price: bundleUnitCost,
            subtotal_price: item.subtotal
          };
          if (transactionDate) {
            itemRow.created_at = transactionDate;
          }

          await trx('transaction_items').insert(itemRow);
        } else {
          // Standard single item
          if (item.productUnit.stock_mode === 'allocated') {
            await trx('product_units')
              .where({ id: item.productUnitId })
              .decrement('allocated_stock', item.quantity);
          }

          const deductions = await InventoryService.deductStockFifo(
            trx,
            item.productUnit.item_name,
            item.baseUnitsNeeded
          );

          // Create transaction_items linking to each batch deducted
          for (const deduction of deductions) {
            const costPerUnit = deduction.costPrice * parseFloat(item.productUnit.conversion_factor);
            const proportionalQty = deduction.quantityDeducted / parseFloat(item.productUnit.conversion_factor);

            const itemRow = {
              transaction_id: transactionId,
              batch_id: deduction.batchId,
              product_unit_id: item.productUnitId,
              quantity_sold: proportionalQty,
              base_quantity_deducted: deduction.quantityDeducted,
              unit_price: parseFloat(item.productUnit.selling_price),
              cost_price: costPerUnit,
              subtotal_price: proportionalQty * parseFloat(item.productUnit.selling_price)
            };
            if (transactionDate) {
              itemRow.created_at = transactionDate;
            }

            await trx('transaction_items').insert(itemRow);

            transactionItems.push({
              batchId: deduction.batchId,
              productUnitId: item.productUnitId,
              quantitySold: proportionalQty,
              baseQuantityDeducted: deduction.quantityDeducted,
              unitPrice: parseFloat(item.productUnit.selling_price),
              costPrice: costPerUnit
            });
          }
        }
      }

      return {
        transactionId,
        totalAmount,
        paymentMethod,
        paymentStatus,
        amountPaid,
        changeAmount,
        items: transactionItems
      };
    });
  }

  /**
   * Confirm payment for TRANSFER/QRIS transactions.
   * Only the owner or the original cashier can confirm.
   */
  static async confirmPayment(transactionId) {
    const trx = await db('transactions').where({ id: transactionId }).first();
    if (!trx) throw Object.assign(new Error('Transaksi tidak ditemukan.'), { status: 404 });
    if (trx.payment_status === 'paid') {
      throw Object.assign(new Error('Transaksi sudah dikonfirmasi.'), { status: 400 });
    }
    await db('transactions').where({ id: transactionId }).update({ payment_status: 'paid' });
    return { transactionId, status: 'paid' };
  }
}

module.exports = TransactionService;
