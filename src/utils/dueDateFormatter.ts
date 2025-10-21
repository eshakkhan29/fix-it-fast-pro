export const dueDateFormatter = (date: Date | string | null): string => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};


// export const dueDateFormatter = (date: Date | string | null): string => {
//   if (!date) return '';
  
//   // Convert string to Date object if needed
//   const dateObj = typeof date === 'string' ? new Date(date) : date;
  
//   const month = String(dateObj.getMonth() + 1).padStart(2, '0');
//   const day = String(dateObj.getDate()).padStart(2, '0');
//   const year = dateObj.getFullYear();
  
//   return `${month}-${day}-${year}`;
// };