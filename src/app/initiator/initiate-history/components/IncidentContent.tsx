/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';

import { useAccountIdStore } from '@/stores/user/accountId-store';
import { useSession } from 'next-auth/react';
import Cookies from 'js-cookie';
import { useGetFollowUpsListByFilters } from '@/app/evaluator/hooks/useGetFollowUpListByFilters';

import { ScanHistory } from './ScanHistory';

import InitiateHistorySkeleton from './InitiateHistorySkeleton';
import { useGetFollowUpStatuses } from '@/app/admin/hooks/useGetFollowUpStatues';

const IncidentContent = () => {
  const { userAccountId } = useAccountIdStore();
  const session: any = useSession();
  const roleId = Cookies.get('fifRoleId');
  
  const [dates, setDates] = useState<[string | null, string | null]>([
    null,
    null,
  ]);
  const [pageSize, setPageSize] = useState<string>('10');
  const [activePage, setActivePage] = useState(1);
  
  const { data: statusData, isLoading: isStatusLoading } =
    useGetFollowUpStatuses({
      accountId: Number(userAccountId),
    });
    
  const selectStatusData = statusData?.map((status: any) => ({
    label: status.StatusName === 'Closed' ? 'Resolved' : status.StatusName,
    value: status.GlobalId.toString(),
  }));
  
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedOverdue, setSelectedOverdue] = useState<string[]>([]);

  const getDefaultDates = () => {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    return {
      from: oneMonthAgo.toISOString().split('T')[0],
      to: tomorrow.toISOString().split('T')[0],
    };
  };

  const defaultDates = getDefaultDates();

  // Format dates for API - only use selected dates if both are present
  const getFormattedDates = () => {
    if (dates[0] && dates[1]) {
      const fromDate = typeof dates[0] === 'string' ? new Date(dates[0]) : dates[0];
      const toDate = typeof dates[1] === 'string' ? new Date(dates[1]) : dates[1];
      return {
        from: fromDate.toISOString().split('T')[0],
        to: toDate.toISOString().split('T')[0]
      };
    }
    return defaultDates;
  };

  const formattedDates = getFormattedDates();
  
  const handlePageSizeChange = (value: string | null) => {
    if (value) {
      setPageSize(value);
      setActivePage(1); // Reset to first page when page size changes
    }
  };

  const params = {
    AccountId: Number(userAccountId),
    UserId: session?.data?.user?.id || '',
    RoleId: Number(roleId),
    PageNumber: activePage, // Use activePage instead of hardcoded 1
    PageSize: Number(pageSize),
    Sorted: true,
    CreatedDateFrom: formattedDates.from,
    CreatedDateTo: formattedDates.to,
    LocationNodeLevelType: '',
    ...(selectedStatus.length > 0 && {
      StatusIds: selectedStatus.map((id) => Number(id)),
    }),
    ...(selectedOverdue.length > 0 && {
      OverDueFlag: selectedOverdue,
    }),
  };

  const {
    data: followUpsList,
    isLoading,
    error,
  } = useGetFollowUpsListByFilters(params);

  console.log(followUpsList, 'list for table')

  if (isLoading) {
    return <InitiateHistorySkeleton />;
  }

  return (
    <>
      <ScanHistory
        selectStatusData={selectStatusData}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedOverdue={selectedOverdue}
        setSelectedOverdue={setSelectedOverdue}
        handlePageSizeChange={handlePageSizeChange}
        dates={dates}
        setDates={setDates}
        data={followUpsList?.data || []}
        isLoading={isLoading}
        error={error}
        pageSize={pageSize}
        setPageSize={setPageSize}
        activePage={activePage}
        setActivePage={setActivePage}
        isStatusLoading={isStatusLoading}
      />
    </>
  );
};

export default IncidentContent;