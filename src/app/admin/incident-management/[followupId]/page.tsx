import { Stack } from '@mantine/core'
import React from 'react'
import FollowUpDetailsCard from './components/FollowUpDetailsCard'

const FollowupDetailsPage = ({ params }: { params: { followupId: string } }) => {


  return (
    <Stack p={{ base: 15, md: 25 }}>
      <FollowUpDetailsCard followupId={params.followupId} role="evaluator" />
    </Stack>
  )
}

export default FollowupDetailsPage