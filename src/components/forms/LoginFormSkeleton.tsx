import React from 'react';
import { Paper, Stack, Skeleton } from '@mantine/core';

const LoginFormSkeleton = () => {
  return (
    <Paper
      withBorder
      shadow="lg"
      p="xl"
      radius="lg"
      className="w-full"
      style={{ maxWidth: 420, margin: '0 auto' }}
    >
      <Stack gap="xl">
        {/* Header Section */}
        <div style={{ textAlign: 'center' }}>
          {/* Logo Circle */}
          <Skeleton
            height={60}
            width={60}
            radius="50%"
            style={{ margin: '0 auto 1.5rem' }}
          />
          {/* Title */}
          <Skeleton height={32} width={150} style={{ margin: '0 auto 8px' }} />
          {/* Subtitle */}
          <Skeleton height={20} width={200} style={{ margin: '0 auto' }} />
        </div>

        {/* Form Section */}
        <Stack gap="lg" className="w-full">
          {/* Email Input */}
          <div>
            <Skeleton height={16} width={100} mb="xs" />
            <Skeleton height={48} width="100%" radius="lg" />
          </div>

          {/* Password Input */}
          <div>
            <Skeleton height={16} width={80} mb="xs" />
            <Skeleton height={48} width="100%" radius="lg" />
          </div>

          {/* Submit Button */}
          <Skeleton height={48} width="100%" radius="lg" mt="md" />
        </Stack>
      </Stack>
    </Paper>
  );
};

export default LoginFormSkeleton;