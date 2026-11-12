const DeveloperService = require('../services/DeveloperService');

const DeveloperController = {
  async getStats(req, res, next) {
    try {
      const stats = await DeveloperService.getStats();
      res.json({ success: true, data: stats });
    } catch (err) {
      next(err);
    }
  },

  async cleanup(req, res, next) {
    try {
      const { mode, forms, startDate, endDate } = req.body;

      if (!mode || (mode !== 'all' && mode !== 'filtered')) {
        return res.status(400).json({
          success: false,
          message: "Mode tidak valid. Pilih 'all' (semua data) atau 'filtered' (pilihan form & periode)."
        });
      }

      if (mode === 'filtered') {
        if (!Array.isArray(forms) || forms.length === 0) {
          return res.status(400).json({
            success: false,
            message: 'Pilih minimal 1 form/modul untuk dihapus.'
          });
        }
      }

      const result = await DeveloperService.cleanupData({
        mode,
        forms: forms || [],
        startDate,
        endDate
      });

      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = DeveloperController;
