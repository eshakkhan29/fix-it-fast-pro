'use client';
import { Select } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useLocationModelStore } from '@/stores/location/location-model-store';

interface Campus {
  value: number;
  text: string;
  children: any[];
}

function Campus({ form }: { form: any }) {
  const { campus, setBuilding } = useLocationModelStore();
  const [dropdownOpened, setDropdownOpened] = useState(true);
  console.log(campus, 'campus from store');

  // Format campus data for the select component, ensuring unique values
  const formattedCampusData = campus?.length > 0
    ? Array.from(
        new Map(
          campus.map((item: Campus) => [item.value.toString(), {
            value: item.value.toString(),
            label: item.text,
          }])
        ).values()
      )
    : [];

  // Handle campus select
  const handleCampusSelect = (value: string) => {
    form.setFieldValue('campusId', value);
    const selectedCampus: Campus | undefined = campus?.find((item) => item.value === Number(value));
    setBuilding(selectedCampus?.children || []);
    setDropdownOpened(false);
  };

  // Auto-select the campus when only one option is available
  useEffect(() => {
    if (
      formattedCampusData.length === 1 &&
      !form?.values?.campusId
    ) {
      const onlyCampus = formattedCampusData[0];
      const onlyValue = onlyCampus?.value?.toString();
      if (!form?.values?.campusId || form?.values?.campusId !== onlyValue) {
        handleCampusSelect(onlyValue);
      }
    } else if (
      formattedCampusData.length > 1 &&
      !form?.values?.campusId
    ) {
      setDropdownOpened(true);
    }
  }, [formattedCampusData, form?.values?.assignmentId]);

  return (
    <Select
      dropdownOpened={dropdownOpened}
      onDropdownOpen={() => setDropdownOpened(true)}
      onDropdownClose={() => setDropdownOpened(false)}
      searchable
      w="48%"
      className="flex-grow"
      label="Campus"
      placeholder="Select a campus"
      data={formattedCampusData}
      value={form?.values?.campusId || null}
      onChange={(value: string | null) => value && handleCampusSelect(value)}
      disabled={!form?.values?.assignmentId}
    />
  );
}

export default Campus;