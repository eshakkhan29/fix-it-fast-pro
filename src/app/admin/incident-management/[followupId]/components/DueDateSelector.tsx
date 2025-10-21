import React, { useRef } from 'react';
import { DateInput, TimeInput } from '@mantine/dates';
import { ActionIcon, Grid, Stack } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';

const DueDateSelector = ({ 
  form, 
  followUpStatus ,
  role
}: { 
  form: any; 
  followUpStatus: string;
  role?:string
}) => {
  const timeRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('IncidentManagement');

  const pickerControl = (
    <ActionIcon 
      variant="subtle" 
      color="gray" 
      onClick={() => timeRef.current?.showPicker()}
      disabled={followUpStatus === 'Closed'}
    >
      <IconClock size={16} stroke={1.5} />
    </ActionIcon>
  );

  const currentDate = form.values.dueDate ? new Date(form.values.dueDate) : null;

  const handleDateChange = (value: Date | null) => {
    const date = value ? new Date(value) : null;
    
    if (date && currentDate) {
      // Preserve the time when date changes
      date.setHours(currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds());
      form.setFieldValue('dueDate', date);
    } else if (date) {
      // New date without time - set to current time or default
      date.setHours(12, 0, 0);
      form.setFieldValue('dueDate', date);
    } else {
      form.setFieldValue('dueDate', null);
    }
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = event.target.value; // Format: "HH:MM"
    
    if (timeValue && currentDate) {
      const [hours, minutes] = timeValue.split(':').map(Number);
      const newDate = new Date(currentDate);
      newDate.setHours(hours, minutes, 0);
      form.setFieldValue('dueDate', newDate);
    } else if (timeValue && !currentDate) {
      // If time is set but no date, set date to today
      const newDate = new Date();
      const [hours, minutes] = timeValue.split(':').map(Number);
      newDate.setHours(hours, minutes, 0);
      form.setFieldValue('dueDate', newDate);
    }
  };

  // Format time for TimeInput (HH:MM format)
  const timeValue = currentDate 
    ? `${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}`
    : '';

  return (
    <Stack gap="xs">
      <Grid>
        <Grid.Col span={{base:12, md:8}}>
          <DateInput
          
            minDate={dayjs().format('YYYY-MM-DD')}
            disabled={followUpStatus === 'Closed' || role ==='operator'}
            radius="lg"
            label={t('labels.dueDate')}
            placeholder={t('filters.pickDatePlaceholder')}
            value={currentDate}
            onChange={handleDateChange as any}
            styles={{
              label: {
                color: '#808897',
              },
            }}
          />
        </Grid.Col>
        <Grid.Col span={{base:12, md:4}}>
          <TimeInput
           
            
            disabled={followUpStatus === 'Closed' || role ==='operator'}
            radius="lg"
            label={t('labels.time')}
            ref={timeRef}
            rightSection={pickerControl}
            value={timeValue}
            onChange={handleTimeChange}
            onClick={() => timeRef.current?.showPicker()}
            styles={{
              label: {
                color: '#808897',
              },
            }}
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );
};

export default DueDateSelector;