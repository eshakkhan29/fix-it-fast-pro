 export const getColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'campus':
        return 'primary';
      case 'building':
        return 'secondary';
      case 'floor':
        return 'success';
      case 'area':
        return 'warning';
      case 'room':
        return 'indigo';
      default:
        return 'gray';
    }
  };
