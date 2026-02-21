const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Format number as USD currency
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export const formatPrice = (amount: number): string => {
    return formatCurrency(amount, 'MKD');
};

/**
 * Legacy export for backward compatibility
 * @deprecated Use formatPrice instead
 */
export const priceFmt = formatPrice;

/**
 * Format number with custom currency
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'MKD',
  locale: string = 'mk-MK',
): string => {
  // Manual handling for currencies to ensure server/client consistency (Hydration Mismatch Fix)
  // We use standard delimiters and fixed symbol placement to avoid Intl variation
  
  const formattedNumber = amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  if (currency === 'MKD') {
      return `${formattedNumber} ден.`;
  }

  if (currency === 'EUR') {
      // User reported mismatch: €140,000 vs 140.000 €
      // We will stick to a standard: Symbol + Space + Number with dot separators
      return `€${formattedNumber}`;
  }

  // Fallback for other currencies
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch (e) {
    return `${currency} ${formattedNumber}`;
  }
};

/**
 * Format number as compact currency (e.g., "$1.2K", "$3.4M")
 * Useful for displaying large numbers
 */
export const formatCompactPrice = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(amount);
};

/**
 * Format number with thousands separator
 * @param num - The number to format
 * @returns Formatted number string (e.g., "1,234")
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Format percentage
 * @param value - The value to format (e.g., 0.15 for 15%)
 * @param decimals - Number of decimal places (default: 0)
 */
export const formatPercentage = (
  value: number,
  decimals: number = 0,
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Calculate and format discount percentage
 * @param originalPrice - Original price
 * @param discountedPrice - Discounted price
 * @returns Formatted discount string (e.g., "25% off")
 */
export const formatDiscount = (
  originalPrice: number,
  discountedPrice: number,
): string => {
  if (originalPrice <= 0 || discountedPrice >= originalPrice) {
    return '';
  }

  const discountPercent = (originalPrice - discountedPrice) / originalPrice;
  return `${formatPercentage(discountPercent)}% off`;
};

/**
 * Format date for order display
 * @param date - Date object, ISO string, or timestamp
 * @returns Formatted date (e.g., "Jan 15, 2024")
 */
export const formatOrderDate = (date: string | Date | number): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

/**
 * Format date with time
 * @param date - Date object, ISO string, or timestamp
 * @returns Formatted date with time (e.g., "Jan 15, 2024, 3:45 PM")
 */
export const formatDateTime = (date: string | Date | number): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date));
};

/**
 * Format relative time (e.g., "2 hours ago", "3 days ago")
 * @param dateInput - Date object, ISO string, or timestamp
 */
export const formatRelativeTime = (dateInput: string | Date | number): string => {
  const date = new Date(dateInput);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60)
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  if (diffInHours < 24)
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  if (diffInDays < 7)
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;

  return formatOrderDate(dateInput);
};
