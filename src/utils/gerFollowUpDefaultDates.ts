export const getFollowUpDefaultDates = () => {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    return {
      from: oneMonthAgo.toISOString().split('T')[0],
      to: tomorrow.toISOString().split('T')[0]
    };
  };

  
