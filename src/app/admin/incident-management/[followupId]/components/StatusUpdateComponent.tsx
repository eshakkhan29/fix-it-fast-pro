import { useGetFollowUpStatuses } from '@/app/evaluator/hooks/useGetFollowUpStatues';
import { useAccountIdStore } from '@/stores/user/accountId-store';
import { Select } from '@mantine/core';
import React from 'react'
import { useTranslations } from 'next-intl';

const StatusUpdateComponent = ({ form }: { form: any }) => {
  //  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const { userAccountId } = useAccountIdStore();
  const { data } = useGetFollowUpStatuses({
    accountId: Number(userAccountId),
  });

  const t = useTranslations('IncidentManagement');
  const tDashboard = useTranslations('Dashboard');

  const statusData = data?.map((status: any) => ({
    label: status.StatusName === "Closed" ? tDashboard('status.resolved') : status.StatusName,
    value: status.GlobalId.toString(),
  }));
  return (
    <Select
      label={t('labels.status')}
      placeholder={t('filters.selectPlaceholder')}
      data={statusData}
      styles={{
        label: {
          color: '#808897'
        }
      }}
      {...form.getInputProps('statusId')} // Bind to form's statusId field
    />
  )
}

export default StatusUpdateComponent