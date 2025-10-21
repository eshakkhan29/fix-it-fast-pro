import { Select } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useLocationModelStore } from '@/stores/location/location-model-store';

interface Room {
  value: number;
  text: string;
  children: any[];
}

function Room({ form }: { form: any }) {
  const { room } = useLocationModelStore()
  const [dropdownOpened, setDropdownOpened] = useState(true);

  // Format room data for the select component
  const formattedRoomData = room?.length > 0 &&
    room?.map((item: Room) => ({
      value: item.value.toString(),
      label: item.text,
    })) || [];

  // handle room select
  const handleRoomSelect = (value: string) => {
    form.setFieldValue('roomId', value);
  };


  // Auto-select the room when only one option is available
  useEffect(() => {
    if (
      !form?.values?.roomId &&
      formattedRoomData.length === 1
    ) {
      const onlyRoom = formattedRoomData[0];
      const onlyValue = onlyRoom?.value?.toString();
      if (!form?.values?.roomId || form?.values?.roomId !== onlyValue) {
        handleRoomSelect(onlyValue);
        setDropdownOpened(false);
      }
    } else if (
      formattedRoomData.length > 1 &&
      !form?.values?.roomId
    ) {
      setDropdownOpened(true);
    }
  }, [formattedRoomData, form?.values?.areaId]);





  return (
    <Select
      dropdownOpened={dropdownOpened}
      onDropdownOpen={() => setDropdownOpened(true)}
      onDropdownClose={() => setDropdownOpened(false)}
      searchable
      w="48%"
      className="flex-grow"
      label="Room"
      placeholder="Select a room"
      data={formattedRoomData || []}
      value={form?.values?.roomId || null}
      onChange={(value: any) => handleRoomSelect(value)}
      disabled={!form?.values?.areaId}
    />
  );
}

export default Room;
