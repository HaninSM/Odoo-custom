const db = require('../config/database');
const ExpenseModel = require('../models/ExpenseModel');

function normalizeDateRange(startDate, endDate) {
  const start = startDate ? (startDate.length === 10 ? `${startDate} 00:00:00` : startDate.replace('T', ' ')) : null;
  const end = endDate ? (endDate.length === 10 ? `${endDate} 23:59:59` : endDate.replace('T', ' ')) : null;
  return { start, end };
}

class ReportService {
  /**
   * Generate sales summary report.
   * Groups by date and calculates totals.
   */
  static async getSalesReport({ startDate, endDate, userId } = {}) {
    const { start, end } = normalizeDateRange(startDate, endDate);

    let query = db('transactions')
      .join('users', 'transactions.user_id', 'users.id')
      .where('transactions.payment_status', 'paid');

    if (start) query = query.whereRaw("datetime(transactions.transaction_date, 'localtime') >= ?", [start]);
    if (end) query = query.whereRaw("datetime(transactions.transaction_date, 'localtime') <= ?", [end]);
    if (userId) query = query.where('transactions.user_id', userId);

    const transactions = await query.select(
      'transactions.*',
      'users.name as cashier_name',
      'users.role as cashier_role'
    ).orderBy('transactions.transaction_date', 'desc');

    const totalOmzet = transactions.reduce((sum, t) => sum + parseFloat(t.total_amount), 0);
    const totalTransactions = transactions.length;

    return { transactions, totalOmzet, totalTransactions };
  }

  /**
   * Generate detailed sales report with per-item breakdown.
   * Shows cost (HPP) vs selling price for each transaction item.
   */
  static async getDetailedSalesReport({ startDate, endDate } = {}) {
    const { start, end } = normalizeDateRange(startDate, endDate);

    let query = db('transaction_items')
      .join('transactions', 'transaction_items.transaction_id', 'transactions.id')
      .join('product_units', 'transaction_items.product_unit_id', 'product_units.id')
      .join('users', 'transactions.user_id', 'users.id')
      .where('transactions.payment_status', 'paid');

    if (start) query = query.whereRaw("datetime(transactions.transaction_date, 'localtime') >= ?", [start]);
    if (end) query = query.whereRaw("datetime(transactions.transaction_date, 'localtime') <= ?", [end]);

    const items = await query.select(
      'transaction_items.*',
      'product_units.item_name',
      'product_units.unit_name',
      'transactions.transaction_date',
      'users.name as cashier_name',
      'users.role as cashier_role'
    ).orderBy('transactions.transaction_date', 'desc');

    return items;
  }

  /**
   * Generate Profit & Loss report.
   *
   * Gross Profit = Total Revenue - Total COGS (HPP)
   * Net Profit = Gross Profit - Total Expenses
   */
  static async getProfitReport({ startDate, endDate }) {
    const { start, end } = normalizeDateRange(startDate, endDate);

    // Total revenue (omzet) from paid transactions
    let revQuery = db('transactions').where('payment_status', 'paid');
    if (start) revQuery = revQuery.whereRaw("datetime(transaction_date, 'localtime') >= ?", [start]);
    if (end) revQuery = revQuery.whereRaw("datetime(transaction_date, 'localtime') <= ?", [end]);
    const revenueResult = await revQuery.sum('total_amount as total');
    const totalRevenue = parseFloat(revenueResult[0]?.total) || 0;

    // Total COGS (HPP) from transaction items
    let cogsQuery = db('transaction_items')
      .join('transactions', 'transaction_items.transaction_id', 'transactions.id')
      .where('transactions.payment_status', 'paid');

    if (start) cogsQuery = cogsQuery.whereRaw("datetime(transactions.transaction_date, 'localtime') >= ?", [start]);
    if (end) cogsQuery = cogsQuery.whereRaw("datetime(transactions.transaction_date, 'localtime') <= ?", [end]);

    const cogsResult = await cogsQuery.select(
      db.raw('SUM(transaction_items.cost_price * transaction_items.quantity_sold) as total_cogs')
    );
    const totalCogs = parseFloat(cogsResult[0]?.total_cogs) || 0;

    // Total expenses
    const totalExpenses = await ExpenseModel.getTotalByDateRange(startDate, endDate);

    const grossProfit = totalRevenue - totalCogs;
    const netProfit = grossProfit - totalExpenses;

    return {
      period: { startDate, endDate },
      totalRevenue,
      totalCogs,
      grossProfit,
      totalExpenses,
      netProfit,
      grossMarginPercent: totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(2) : '0.00',
      netMarginPercent: totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(2) : '0.00'
    };
  }

  /**
   * Get sales summary grouped by user (cashier/reseller performance).
   */
  static async getSalesByUser({ startDate, endDate } = {}) {
    const { start, end } = normalizeDateRange(startDate, endDate);

    let query = db('transactions')
      .join('users', 'transactions.user_id', 'users.id')
      .where('transactions.payment_status', 'paid');

    if (start) query = query.whereRaw("datetime(transactions.transaction_date, 'localtime') >= ?", [start]);
    if (end) query = query.whereRaw("datetime(transactions.transaction_date, 'localtime') <= ?", [end]);

    return query.select(
      'users.id as user_id',
      'users.name',
      'users.role',
      db.raw('COUNT(transactions.id) as total_transactions'),
      db.raw('SUM(transactions.total_amount) as total_sales')
    )
    .groupBy('users.id', 'users.name', 'users.role')
    .orderBy('total_sales', 'desc');
  }
}

module.exports = ReportService;
