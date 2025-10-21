import React from 'react'
import { Skeleton, Stack } from '@mantine/core'

const OperatorManagerSkeleton = () => {
  return (
    <>
      <Stack gap={5}>
        <Skeleton height={16} width={80} />
        <Skeleton height={36} width="100%" radius="lg" />
      </Stack>
      
      <Stack gap={5}>
        <Skeleton height={16} width={80} />
        <Skeleton height={36} width="100%" radius="lg" />
      </Stack>
    </>
  )
}

export default OperatorManagerSkeleton