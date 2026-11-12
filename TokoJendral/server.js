require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const authRoutes = require('./src/routes/auth');
const supplierRoutes = require('./src/routes/suppliers');
const purchaseRoutes = require('./src/routes/purchases');
const productRoutes = require('./src/routes/products');
const transactionRoutes = require('./src/routes/transactions');
const reportRoutes = require('./src/routes/reports');
const expenseRoutes = require('./src/routes/expenses');
const settingsRoutes = require('./src/routes/settings');
const itemRoutes = require('./src/routes/items');
const developerRoutes = require('./src/routes/developer');

const app = express();
const PORT = process.env.PORT || 3000;

// Security & parsing middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/developer', developerRoutes);

// SPA fallback — serve dashboard.html for non-API routes
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'dashboard.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`POS Server running on http://localhost:${PORT}`);
});

module.exports = app;
