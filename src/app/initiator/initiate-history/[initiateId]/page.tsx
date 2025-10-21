import FollowUpDetailsCard from '@/app/admin/incident-management/[followupId]/components/FollowUpDetailsCard';
import { Stack } from '@mantine/core';
import React from 'react'

async function InitiateDetailsPage({ params }: { params: { initiateId: string } }) {
    const { initiateId } = params;
    return (
        <Stack p={{ base: 15, md: 25 }}>
            <FollowUpDetailsCard role="initiator" followupId={initiateId} />
        </Stack>
    )
}

export default InitiateDetailsPage