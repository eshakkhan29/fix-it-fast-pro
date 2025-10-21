export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are 0-based
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


export const formatDisplayDate = (dateString: string | undefined): string => {
  if (!dateString) return 'No close date available';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'No close date available';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};


export const formatDatePart = (dateString: string): string => {
  if (!dateString) return 'No date available';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';
  
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  const year = date.getFullYear();
  
  return `${month} ${day}, ${year}`;
};

export const formatTimePart = (dateString: string): string => {
  if (!dateString) return 'No time available';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid time';
  
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = String(hours % 12 || 12).padStart(2, '0');
  
  return `${formattedHours}:${minutes} ${ampm}`;
};
