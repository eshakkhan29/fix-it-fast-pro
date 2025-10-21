export const getFollowUpStatusColor = (status: string) => {
  switch (status) {
    case 'Open':
      return '#6B39F4';
    case 'Closed':
      return 'primary';
      case 'Resolved':
      return 'primary';
    case 'Blocked':
      return '#DF1C41';
    default:
      return 'dimmed';
  }
}