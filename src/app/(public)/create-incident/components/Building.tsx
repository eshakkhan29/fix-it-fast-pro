import { Select } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useLocationModelStore } from '@/stores/location/location-model-store';

interface Building {
  value: number;
  text: string;
  children: any[];
}

function Building({ form }: { form: any }) {
  const { building, setFloor } = useLocationModelStore()
  const [dropdownOpened, setDropdownOpened] = useState(true);

  // Format building data for the select component
  const formattedBuildingData = building?.length > 0 &&
    building?.map((item: Building) => ({
      value: item.value.toString(),
      label: item.text,
    })) || [];


  // handle building select
  const handleBuildingSelect = (value: string) => {
    form.setFieldValue('buildingId', value);
    const selectedBuilding: any = building?.find((item) => item.value === Number(value));
    setFloor(selectedBuilding?.children || []);
  };


  // Auto-select the building when only one option is available
  useEffect(() => {
    if (
      !form?.values?.buildingId &&
      formattedBuildingData.length === 1
    ) {
      const onlyBuilding = formattedBuildingData[0];
      const onlyValue = onlyBuilding?.value?.toString();
      if (!form?.values?.buildingId || form?.values?.buildingId !== onlyValue) {
        handleBuildingSelect(onlyValue);
        setDropdownOpened(false);
      }
    } else if (
      formattedBuildingData.length > 1 &&
      !form?.values?.buildingId
    ) {
      setDropdownOpened(true);
    }
  }, [formattedBuildingData, form?.values?.campusId]);



  return (
    <Select
      dropdownOpened={dropdownOpened}
      onDropdownOpen={() => setDropdownOpened(true)}
      onDropdownClose={() => setDropdownOpened(false)}
      searchable
      w="48%"
      className="flex-grow"
      label="Building"
      placeholder="Select a building"
      data={formattedBuildingData || []}
      value={form?.values?.buildingId || null}
      onChange={(value: any) => handleBuildingSelect(value)}
      disabled={!form?.values?.campusId}
    />
  );
}

export default Building;
