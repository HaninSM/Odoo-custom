const { body } = require('express-validator');
const ProductUnitModel = require('../models/ProductUnitModel');
const ItemModel = require('../models/ItemModel');
const PricingService = require('../services/PricingService');
const InventoryService = require('../services/InventoryService');

const ProductController = {
  validation: [
    body('itemName').trim().notEmpty().withMessage('Nama item wajib diisi.'),
    body('unitName').trim().notEmpty().withMessage('Nama satuan wajib diisi.'),
    body('conversionFactor').isFloat({ gt: 0 }).withMessage('Faktor konversi harus lebih dari 0.'),
    body('sellingPrice').isFloat({ gt: 0 }).withMessage('Harga jual harus lebih dari 0.')
  ],

  batchSetupValidation: [
    body('itemName').trim().notEmpty().withMessage('Nama barang master wajib diisi.'),
    body('units').isArray({ min: 1 }).withMessage('Minimal 1 satuan jual harus diisi.'),
    body('units.*.unitName').trim().notEmpty().withMessage('Nama satuan jual wajib diisi.'),
    body('units.*.conversionFactor').isFloat({ gt: 0 }).withMessage('Kebutuhan bahan / konversi harus > 0.')
  ],

  async list(req, res, next) {
    try {
      let products;
      if (req.user.role === 'reseller') {
        products = await ProductUnitModel.findResellerVisible();
      } else {
        products = await ProductUnitModel.findAll();
      }
      res.json({ success: true, data: products });
    } catch (err) {
      next(err);
    }
  },

  async listGrouped(req, res, next) {
    try {
      const grouped = await ItemModel.getItemsWithUnitsAndStock();
      res.json({ success: true, data: grouped });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const product = await ProductUnitModel.findById(req.params.id);
      if (!product) return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
      res.json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      // Auto resolve or create master item
      let itemId = req.body.itemId;
      if (!itemId && req.body.itemName) {
        const item = await ItemModel.findOrCreate({
          name: req.body.itemName,
          baseUnit: req.body.baseUnit || 'Meter'
        });
        itemId = item.id;
      }

      const id = await ProductUnitModel.create({
        ...req.body,
        itemId
      });
      res.status(201).json({ success: true, data: { id, itemId, ...req.body } });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Challenge: One-time setup for multi-units (e.g. XXX with Sprei M, L, XL)
   */
  async batchSetup(req, res, next) {
    try {
      const result = await ProductUnitModel.batchSetup(req.body);
      res.status(201).json({
        success: true,
        message: `Berhasil setup ${result.units.length} satuan untuk barang ${result.item.name}.`,
        data: result
      });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      await ProductUnitModel.update(req.params.id, req.body);
      res.json({ success: true, message: 'Produk berhasil diupdate.' });
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      await ProductUnitModel.deactivate(req.params.id);
      res.json({ success: true, message: 'Produk berhasil dihapus.' });
    } catch (err) {
      next(err);
    }
  },

  async getHpp(req, res, next) {
    try {
      const hpp = await PricingService.calculateHpp(req.params.id);
      res.json({ success: true, data: hpp });
    } catch (err) {
      next(err);
    }
  },

  async getItemBaseCost(req, res, next) {
    try {
      const { itemName, itemId } = req.query;
      const target = itemId || itemName;
      if (!target) {
        return res.status(400).json({ success: false, message: 'itemName atau itemId wajib diisi.' });
      }

      const costInfo = await PricingService.calculateItemBaseCost(target);
      res.json({ success: true, data: costInfo });
    } catch (err) {
      next(err);
    }
  },

  async updatePrice(req, res, next) {
    try {
      const result = await PricingService.updatePrice(req.params.id, req.body);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async getStock(req, res, next) {
    try {
      const stock = await InventoryService.getStockSummary();
      res.json({ success: true, data: stock });
    } catch (err) {
      next(err);
    }
  },

  async checkLowStock(req, res, next) {
    try {
      const lowStock = await InventoryService.checkLowStock();
      res.json({ success: true, data: lowStock });
    } catch (err) {
      next(err);
    }
  },

  async repackage(req, res, next) {
    try {
      const result = await InventoryService.repackageItemStock(req.body);
      res.json({
        success: true,
        message: `Alokasi kuota stok fisik untuk ${result.itemName} berhasil disimpan.`,
        data: result
      });
    } catch (err) {
      next(err);
    }
  },

  async resetRepackage(req, res, next) {
    try {
      const result = await InventoryService.resetToFloating(req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async createBundle(req, res, next) {
    try {
      const result = await InventoryService.createBundlePackage(req.body);
      res.status(201).json({
        success: true,
        message: `Paket bundling / hampers "${result.bundleItem.name}" berhasil dibuat.`,
        data: result
      });
    } catch (err) {
      next(err);
    }
  },

  async getBundleRecipe(req, res, next) {
    try {
      const recipe = await InventoryService.getBundleRecipe(req.params.id);
      res.json({ success: true, data: recipe });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = ProductController;
