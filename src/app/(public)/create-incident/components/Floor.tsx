import { Select } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useLocationModelStore } from '@/stores/location/location-model-store';

interface Floor {
  value: number;
  text: string;
  children: any[];
}

function Floor({ form }: { form: any }) {
  const { floor, setArea } = useLocationModelStore()
  const [dropdownOpened, setDropdownOpened] = useState(true);

  // Format floor data for the select component
  const formattedFloorData = floor?.length > 0 &&
    floor?.map((item: Floor) => ({
      value: item.value.toString(),
      label: item.text,
    })) || [];

  // handle floor select
  const handleFloorSelect = (value: string) => {
    form.setFieldValue('floorId', value);
    const selectedFloor: any = floor?.find((item) => item.value === Number(value));
    setArea(selectedFloor?.children || []);
  };

  // Auto-select the floor when only one option is available
  useEffect(() => {
    if (
      !form?.values?.floorId &&
      formattedFloorData.length === 1
    ) {
      const onlyFloor = formattedFloorData[0];
      const onlyValue = onlyFloor?.value?.toString();
      if (!form?.values?.floorId || form?.values?.floorId !== onlyValue) {
        handleFloorSelect(onlyValue);
        setDropdownOpened(false);
      }
    } else if (
      formattedFloorData.length > 1 &&
      !form?.values?.floorId
    ) {
      setDropdownOpened(true);
    }
  }, [formattedFloorData, form?.values?.buildingId]);




  return (
    <Select
      dropdownOpened={dropdownOpened}
      onDropdownOpen={() => setDropdownOpened(true)}
      onDropdownClose={() => setDropdownOpened(false)}
      searchable
      w="48%"
      className="flex-grow"
      label="Floor"
      placeholder="Select a floor"
      data={formattedFloorData || []}
      value={form?.values?.floorId || null}
      onChange={(value: any) => handleFloorSelect(value)}
      disabled={!form?.values?.buildingId}
    />
  );
}

export default Floor;
