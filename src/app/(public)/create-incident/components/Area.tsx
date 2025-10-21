import { Select } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useLocationModelStore } from '@/stores/location/location-model-store';

interface Area {
  value: number;
  text: string;
  children: any[];
}

function Area({ form }: { form: any }) {
  const { area, setRoom } = useLocationModelStore()
  const [dropdownOpened, setDropdownOpened] = useState(true);

  // Format area data for the select component
  const formattedAreaData = area?.length > 0 &&
    area?.map((item: Area) => ({
      value: item.value.toString(),
      label: item.text,
    })) || [];

  // handle area select
  const handleAreaSelect = (value: string) => {
    form.setFieldValue('areaId', value);
    const selectedArea: any = area?.find((item) => item.value === Number(value));
    setRoom(selectedArea?.children || []);
  };

  // Auto-select the area when only one option is available
  useEffect(() => {
    if (
      !form?.values?.areaId &&
      formattedAreaData.length === 1
    ) {
      const onlyArea = formattedAreaData[0];
      const onlyValue = onlyArea?.value?.toString();
      if (!form?.values?.areaId || form?.values?.areaId !== onlyValue) {
        handleAreaSelect(onlyValue);
        setDropdownOpened(false);
      }
    } else if (
      formattedAreaData.length > 1 &&
      !form?.values?.areaId
    ) {
      setDropdownOpened(true);
    }
  }, [formattedAreaData, form?.values?.floorId]);


  return (
    <Select
      dropdownOpened={dropdownOpened}
      onDropdownOpen={() => setDropdownOpened(true)}
      onDropdownClose={() => setDropdownOpened(false)}
      searchable
      w="48%"
      className="flex-grow"
      label="Area"
      placeholder="Select an area"
      data={formattedAreaData || []}
      value={form?.values?.areaId || null}
      onChange={(value: any) => handleAreaSelect(value)}
      disabled={!form?.values?.floorId}
    />
  );
}

export default Area;
