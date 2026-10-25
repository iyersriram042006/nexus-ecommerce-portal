/**
 * Utility functions for currency and date formatting in Indian standards (INR)
 */

export const formatINR = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercent = (value) => {
  return `${Math.round(value)}%`;
};

export const formatDate = (dateValue) => {
  if (!dateValue) return '';
  const date = dateValue?.toDate ? dateValue.toDate() : new Date(dateValue);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatDateTime = (dateValue) => {
  if (!dateValue) return '';
  const date = dateValue?.toDate ? dateValue.toDate() : new Date(dateValue);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};
