export interface FollowUp {
  FollowupId: number;
  InspectionId: number;
  Location: string;
  DueDate: string;
  CreatedOn: string;
  AssignedTo: string;
  CreatedBy: string;
  Topic: string;
  OverDueFlag: string;
  Question: string;
  StatusId: number;
  OverDueDay: number;
  Status: string;
  InspectionTemplateName: string;
  TotalResult: number;
  PageCount: number;
}

export interface GetFollowUpsListResponse {
  data: FollowUp[] | undefined;
}

interface ChartData {
  name: string;
  value: number;
  isCurrent: boolean;
}

export const getAnalyticChartData = (
  followUpsList: GetFollowUpsListResponse | undefined,
  timePeriod: string,
  currentMonth: string,
  currentDay: string,
  currentYear: number
): ChartData[] => {
  // Define dummy data inside the function
  const dummyData: ChartData[] = [
    { name: 'Jan', value: 2000, isCurrent: currentMonth === 'Jan' },
    { name: 'Feb', value: 3500, isCurrent: currentMonth === 'Feb' },
    { name: 'Mar', value: 5000, isCurrent: currentMonth === 'Mar' },
    { name: 'Apr', value: 4200, isCurrent: currentMonth === 'Apr' },
    { name: 'May', value: 6000, isCurrent: currentMonth === 'May' },
    { name: 'Jun', value: 4800, isCurrent: currentMonth === 'Jun' },
    { name: 'Jul', value: 5500, isCurrent: currentMonth === 'Jul' },
    { name: 'Aug', value: 7000, isCurrent: currentMonth === 'Aug' },
    { name: 'Sep', value: 6500, isCurrent: currentMonth === 'Sep' },
    { name: 'Oct', value: 5800, isCurrent: currentMonth === 'Oct' },
    { name: 'Nov', value: 4500, isCurrent: currentMonth === 'Nov' },
    { name: 'Dec', value: 6200, isCurrent: currentMonth === 'Dec' },
  ];

  if (!followUpsList || !followUpsList?.data || followUpsList?.data?.length === 0) {
    return dummyData;
  }

  // Weekly: Count follow-ups per day of the week
  if (timePeriod === 'Weekly') {
    const counts: { [key: string]: number } = {
      Sat: 0,
      Sun: 0,
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
    };

    followUpsList.data.forEach((item: FollowUp) => {
      const createdDate = new Date(item.CreatedOn);
      if (isNaN(createdDate.getTime())) return; // Skip invalid dates
      const dayName = createdDate.toLocaleString('en-US', { weekday: 'short' });
      if (dayName in counts) {
        counts[dayName]++;
      }
    });

    // Reorder days to start from the day after current day and end with current day
    const allDays = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const currentDayIndex = allDays.indexOf(currentDay);
    const order = [
      ...allDays.slice(currentDayIndex + 1),
      ...allDays.slice(0, currentDayIndex + 1),
    ];

    return order.map((day) => ({
      name: day,
      value: counts[day],
      isCurrent: day === currentDay,
    }));
  }

  // Monthly: Count follow-ups per week of the month
  if (timePeriod === 'Monthly') {
    const counts: { [key: string]: number } = {
      'Week 1': 0,
      'Week 2': 0,
      'Week 3': 0,
      'Week 4': 0,
    };

    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    followUpsList.data.forEach((item: FollowUp) => {
      const createdDate = new Date(item.CreatedOn);
      if (isNaN(createdDate.getTime())) return; // Skip invalid dates

      // Calculate the week number (1-4) based on the day of the month
      const dayOfMonth = createdDate.getDate();
      const weekNumber = Math.ceil((dayOfMonth + firstDayOfMonth.getDay()) / 7);
      const weekKey = `Week ${weekNumber > 4 ? 4 : weekNumber}`; // Cap at Week 4
      if (weekKey in counts) {
        counts[weekKey]++;
      }
    });

    const order = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const currentWeek = Math.ceil((new Date().getDate() + firstDayOfMonth.getDay()) / 7);
    return order.map((week) => ({
      name: week,
      value: counts[week],
      isCurrent: week === `Week ${currentWeek > 4 ? 4 : currentWeek}`,
    }));
  }

  // Yearly: Count follow-ups per month
  if (timePeriod === 'Yearly') {
    const counts: { [key: string]: number } = {
      Jan: 0,
      Feb: 0,
      Mar: 0,
      Apr: 0,
      May: 0,
      Jun: 0,
      Jul: 0,
      Aug: 0,
      Sep: 0,
      Oct: 0,
      Nov: 0,
      Dec: 0,
    };

    followUpsList.data.forEach((item: FollowUp) => {
      const createdDate = new Date(item.CreatedOn);
      if (isNaN(createdDate.getTime())) return; // Skip invalid dates
      const monthName = createdDate.toLocaleString('en-US', { month: 'short' });
      if (monthName in counts) {
        counts[monthName]++;
      }
    });

    const order = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return order.map((month) => ({
      name: month,
      value: counts[month],
      isCurrent: month === currentMonth && new Date().getFullYear() === currentYear,
    }));
  }

  // Fallback to dummy data
  return dummyData;
};