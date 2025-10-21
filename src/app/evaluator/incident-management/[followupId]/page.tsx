import FollowUpDetailsCard from '@/app/admin/incident-management/[followupId]/components/FollowUpDetailsCard'
import { Stack } from '@mantine/core'
import React from 'react'

const FollowupDetailsPage = ({ params }: { params: { followupId: string } }) => {


  return (
    <Stack p={{ base: 15, md: 25 }}>
      <FollowUpDetailsCard followupId={params.followupId} role="evaluator" />
    </Stack>
  )
}

export default FollowupDetailsPage