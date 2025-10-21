export interface DateRange {
  from: string;
  to: string;
}

export const getDateRange = (timePeriod: string): DateRange => {
  const today = new Date();
  let from: Date;
  let to: Date;

  switch (timePeriod) {
    case 'Yearly':
      from = new Date(today.getFullYear(), 0, 1); // Jan 1
      to = new Date(today.getFullYear(), 11, 31); // Dec 31
      break;

    case 'Monthly':
      from = new Date(today.getFullYear(), today.getMonth(), 1);
      to = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of month
      break;

    case 'Weekly':
      from = new Date(today);
      from.setDate(today.getDate() - 6); // Last 7 days
      to = new Date(today);
      break;

    default:
      from = new Date(today.getFullYear(), today.getMonth(), 1);
      to = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  }

  // Format dates to YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return {
    from: formatDate(from),
    to: formatDate(to),
  };
};


