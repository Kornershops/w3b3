/**
 * utility functions for high-fidelity data representation.
 */

/**
 * Formats a numeric value into a localized USD currency string.
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Formats a raw token balance for display.
 */
export const formatTokenBalance = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
};
