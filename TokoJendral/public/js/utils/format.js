/**
 * Utility functions for formatting currency, dates, and numbers.
 */
const Format = {
  /** Format number as Indonesian Rupiah */
  currency(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  },

  /** Format number with decimal places */
  number(num, decimals = 2) {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  },

  /** Format ISO date string to locale date */
  date(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  },

  /** Format ISO date string to locale datetime */
  datetime(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('id-ID', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  },

  /** Format percentage */
  percent(value) {
    return `${parseFloat(value).toFixed(1)}%`;
  },

  /** Get local date string YYYY-MM-DD */
  localDate(d = new Date()) {
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().split('T')[0];
  },

  /** Get start of month YYYY-MM-01 in local date */
  localMonthStart(d = new Date()) {
    return this.localDate(d).slice(0, 7) + '-01';
  }
};
