'use client';
import { Select } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { getData } from '../action/getData';
import { useAccountIdStore } from '@/stores/user/accountId-store';
import { useLocationModelStore } from '@/stores/location/location-model-store';

interface Assignment {
  Id: number;
  Name: string;
  LocationTypes: any[];
}

function Assignment({ form }: { form: any }) {
  const { fetchCampusByLocationTypes, reset } = useLocationModelStore()
  const { userAccountId: accountId } = useAccountIdStore();
  const [dropdownOpened, setDropdownOpened] = useState(false);
  const [assignment, setAssignment] = useState<Assignment[]>([]);


  // set accountId to form when it is changed
  useEffect(() => {
    if (accountId) form.setFieldValue('accountId', accountId);
  }, [accountId]);


  // Format assignment data for the select component
  const formattedAssignmentData = assignment?.length > 0 &&
    assignment?.map((item) => ({
      value: item.Id.toString(),
      label: item.Name,
    })) || [];

  // get assignment data
  useEffect(() => {
    const getDataAssignment = async () => {
      const data = await getData(
        `/Assignment/GetbyAccountId?accountId=${accountId}`
      );
      if (data?.length > 0) {
        setAssignment(data as Assignment[]);
      }
    };
    if (accountId) getDataAssignment();
  }, [accountId]);

  // handle select assignment
  const handleSelectAssignment = (value: string) => {
    reset();
    form.setFieldValue('assignmentId', value);
    const selectedAssignment = assignment?.find((item) => item.Id === Number(value));
    if (selectedAssignment) {
      fetchCampusByLocationTypes(accountId?.toString() || '', selectedAssignment?.LocationTypes || [])
    }
    // form reset without assignment and account id
    form.resetField('campusId');
    form.resetField('buildingId');
    form.resetField('floorId');
    form.resetField('areaId');
    form.resetField('roomId');
  };

  // set dropdownOpened to true when accountId is changed
  useEffect(() => {
    setDropdownOpened(true);
  }, [form?.values?.accountId, assignment]);

  return (
    <Select
      dropdownOpened={dropdownOpened}
      onDropdownOpen={() => setDropdownOpened(true)}
      onDropdownClose={() => setDropdownOpened(false)}
      searchable
      w="48%"
      className="flex-grow"
      label="Assignment"
      placeholder="Select an assignment"
      data={formattedAssignmentData || []}
      value={form?.values?.assignmentId}
      onChange={(value: any) => handleSelectAssignment(value)}
      disabled={!form?.values?.accountId}
    />
  );
}

export default Assignment;
