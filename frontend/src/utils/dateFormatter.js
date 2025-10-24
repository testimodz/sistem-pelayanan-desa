/**
 * Format date ke dd/MM/yyyy - FIXED UTC
 */
export const formatDate = (date) => {
  if (!date) return '-';
  
  const d = new Date(date);
  
  if (isNaN(d.getTime())) return '-';
  
  // Use UTC to avoid timezone shift
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const year = d.getUTCFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Format date ke format input HTML (yyyy-MM-dd)
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  
  if (isNaN(d.getTime())) return '';
  
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Format date ke Indonesia long format
 */
export const formatDateLong = (date) => {
  if (!date) return '-';
  
  const d = new Date(date);
  
  if (isNaN(d.getTime())) return '-';
  
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  });
};

/**
 * Format date ke Indonesia dengan hari
 */
export const formatDateWithDay = (date) => {
  if (!date) return '-';
  
  const d = new Date(date);
  
  if (isNaN(d.getTime())) return '-';
  
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  });
};

/**
 * Convert dd/MM/yyyy string ke Date object
 */
export const parseDate = (dateStr) => {
  if (!dateStr) return null;
  
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  
  return new Date(Date.UTC(year, month, day));
};
