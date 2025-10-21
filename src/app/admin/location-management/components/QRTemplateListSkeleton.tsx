import React from 'react'
import { Card, Group, SimpleGrid, Skeleton, Stack } from '@mantine/core'

const QRTemplateCardSkeleton = () => {
  return (
    <Card withBorder shadow="sm" p="md" className='!relative'>
      {/* Top right buttons */}
      <Group className="!absolute !top-[2px] !right-1" gap={5}>
        <Skeleton height={28} width={60} radius="sm" />
        <Skeleton height={28} width={50} radius="sm" />
      </Group>
      
      <Stack gap="md" align="center">
        {/* Header */}
        <Stack gap="xs" w="100%" pt={15}>
          <Skeleton height={24} width="80%" mx="auto" />
          <Skeleton height={16} width="60%" mx="auto" />
        </Stack>

        {/* QR Code */}
        <Skeleton height={60} width={60} radius="sm" />

        {/* Footer */}
        <Stack gap="xs" w="100%">
          <Skeleton height={16} width="70%" mx="auto" />
          <Skeleton height={14} width="50%" mx="auto" />
        </Stack>

        {/* Metadata */}
        <Group gap="sm" justify="center" mt="md">
          <Skeleton height={14} width={60} />
          <Skeleton height={14} width={80} />
          <Skeleton height={14} width={90} />
          <Skeleton height={14} width={70} />
        </Group>
      </Stack>
    </Card>
  )
}

const QRTemplateListSkeleton = () => {
  return (
    <SimpleGrid cols={{base:1, md:2, lg:3}} spacing={10}>
      {Array.from({ length: 6 }).map((_, index) => (
        <QRTemplateCardSkeleton key={index} />
      ))}
    </SimpleGrid>
  )
}

export default QRTemplateListSkeleton