import FollowUpDetailsCard from '@/app/admin/incident-management/[followupId]/components/FollowUpDetailsCard';
import { Stack } from '@mantine/core';
import React from 'react'

async function IncidentDetailsPage({ params }: { params: { incidentId: string } }) {
    const { incidentId } = params;
    return (
        <Stack p={{ base: 15, md: 25 }}>
            <FollowUpDetailsCard role="operator" followupId={incidentId} />
        </Stack>
    )
}

export default IncidentDetailsPage
