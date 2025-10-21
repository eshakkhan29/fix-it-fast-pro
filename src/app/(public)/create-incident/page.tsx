import React, { Suspense } from 'react';
import { Container, Stack } from '@mantine/core';
import IncidentForm from './components/IncidentForm';
import IncidentSkeleton from './components/IncidentSkeleton';
import CreateIncidentPageWrapper from './components/CreateIncidentPageWrapper';
import { UserRoleProvider } from './context/UserRoleContext';

function CreateIncidentPage() {
  return (
    <Suspense fallback={<IncidentSkeleton />}>
      <CreateIncidentPageWrapper>
        <Container py={20} px={{ base: 0, sm: 'auto' }}>
          <UserRoleProvider>
            <Stack justify="center" align="center">
              <IncidentForm />
            </Stack>
          </UserRoleProvider>
        </Container>
      </CreateIncidentPageWrapper>
    </Suspense>
  );
}

export default CreateIncidentPage;
