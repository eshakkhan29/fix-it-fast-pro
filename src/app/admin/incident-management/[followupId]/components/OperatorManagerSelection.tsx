'use client';

import { useEffect, useState } from 'react';
import { useGetAssignmentDetails } from '@/app/evaluator/hooks/useGetAssignmentDetails';
import { useAccountIdStore } from '@/stores/user/accountId-store';
import { MultiSelect, Text } from '@mantine/core';
import OperatorManagerSkeleton from './OperatorManagerSkeleton';
import { useTranslations } from 'next-intl';



const OperatorManagerSelection = ({
  role,
  form,
  assignmentId,
  onAssignmentLoad,
 
  managers
}: {
  role: string;
  form: any;
  assignmentId: number;
  
  onAssignmentLoad?: (data: any) => void;
 
  managers: { Name: string; UserId: string; Id: number }[];
}) => {
  const { userAccountId } = useAccountIdStore();
  const { data: assignmentDetails, isLoading, isError } = useGetAssignmentDetails({
    accountId: Number(userAccountId),
    id: assignmentId,
  });

  const [dropdownOpened, setDropdownOpened] = useState(false);
  const t = useTranslations('IncidentManagement');
  // const hasOpenedOnce = useRef(false); // Track if we've opened it once

  // Pass assignment details to parent when loaded
  useEffect(() => {
    if (assignmentDetails?.data && onAssignmentLoad) {
      onAssignmentLoad(assignmentDetails.data);
    }
  }, [assignmentDetails, onAssignmentLoad]);

  // Auto-open dropdown only once when component mounts (when Edit is clicked)
  useEffect(() => {
    setDropdownOpened(true);

  }, [isLoading]);

  const operatorsSelectionData =
    assignmentDetails?.data?.Operators?.map((operator: any) => ({
      value: operator?.UserId,
      label: operator?.Name || t('messages.unknownOperator'),
    })) || [];

  
    
   

  // Build managerSelectionData from assignmentDetails.Managers
  const managerSelectionData =
   managers?.map((manager: any) => ({
      value: manager?.UserId,
      label: manager?.Name || t('messages.unknownManager'),
    })) || [];

  
  

  if (isLoading) {
    return <OperatorManagerSkeleton />;
  }
  if (isError) {
    return <Text>{t('errors.fetchOperatorsFailed')}</Text>;
  }
  console.log(form.values.operator, 'form oppp')
  return (
    <>
      {operatorsSelectionData.length > 0 ? (
        <MultiSelect
          dropdownOpened={dropdownOpened}
          onDropdownOpen={() => setDropdownOpened(true)}
          onDropdownClose={() => setDropdownOpened(false)}
          disabled={role === 'operator'}
          radius="lg"
          label={t('labels.operators')}
          placeholder={t('filters.searchPlaceholder')}
          data={operatorsSelectionData}
          clearable
          searchable
          {...form.getInputProps('operator')}
          styles={{
            label: {
              color: '#808897',
            },
          }}
        />
      ) : (
        <Text>{t('messages.noOperatorsAvailable')}</Text>
      )}

      {/* {finalManagerSelectionData.length > 0 ? ( */}
        <MultiSelect

          disabled={role === 'operator'}
          placeholder={t('filters.searchPlaceholder')}
          radius="lg"
          label={t('labels.managers')}

          data={managerSelectionData}
          clearable
          searchable
          {...form.getInputProps('manager')}
          styles={{
            label: {
              color: '#808897',
            },
          }}
        />
      {/* ) : ( */}
        {/* <Text>No Managers Available for this Assignment</Text>
      )} */}
    </>
  );
};

export default OperatorManagerSelection;



