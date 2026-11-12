const nodemailer = require('nodemailer');
const SettingsModel = require('../models/SettingsModel');

class AlertService {
  /**
   * Send low-stock alert email to the store owner.
   * Uses mock SMTP (Ethereal) for development.
   *
   * @param {Array} lowStockBatches - Batches below threshold
   * @param {number} threshold - Current threshold percentage
   */
  static async sendLowStockAlert(lowStockBatches, threshold) {
    try {
      const storeEmail = await SettingsModel.get('alert_email_to') || process.env.ALERT_EMAIL_TO;
      const storeName = await SettingsModel.get('store_name') || 'Toko POS';

      // Group by item name
      const grouped = {};
      lowStockBatches.forEach(batch => {
        if (!grouped[batch.item_name]) grouped[batch.item_name] = [];
        grouped[batch.item_name].push(batch);
      });

      // Build email body
      let body = `<h2>⚠️ Peringatan Stok Rendah - ${storeName}</h2>`;
      body += `<p>Berikut item dengan stok di bawah ${threshold}%:</p><ul>`;
      for (const [itemName, batches] of Object.entries(grouped)) {
        for (const b of batches) {
          const pct = ((parseFloat(b.remaining_quantity) / parseFloat(b.initial_quantity)) * 100).toFixed(1);
          body += `<li><strong>${itemName}</strong> (Batch #${b.id}): ${parseFloat(b.remaining_quantity).toFixed(2)} / ${parseFloat(b.initial_quantity).toFixed(2)} unit dasar (${pct}%)</li>`;
        }
      }
      body += '</ul>';

      // Create transporter (mock/ethereal for dev)
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: parseInt(process.env.SMTP_PORT) || 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      const info = await transporter.sendMail({
        from: `"${storeName} System" <noreply@pos.local>`,
        to: storeEmail,
        subject: `[${storeName}] ⚠️ Peringatan Stok Rendah`,
        html: body
      });

      console.log('[AlertService] Low stock email sent:', info.messageId);
      return { sent: true, messageId: info.messageId };
    } catch (err) {
      // Don't crash the app if email fails, just log
      console.error('[AlertService] Failed to send low stock alert:', err.message);
      return { sent: false, error: err.message };
    }
  }
}

module.exports = AlertService;
