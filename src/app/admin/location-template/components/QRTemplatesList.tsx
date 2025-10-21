import React from 'react'
import { useGetAllQRTemplates } from '../../hooks/QRTemplate/useGetQRTemplates';

import QRTemplateCard from '../../location-management/components/QRTemplateCard';
import { SimpleGrid } from '@mantine/core';
import QRTemplateListSkeleton from '../../location-management/components/QRTemplateListSkeleton';

const QRTemplatesList = () => {
  const { data: qrCodeTemplates, isLoading, error } = useGetAllQRTemplates();

  if (isLoading) {
    return <QRTemplateListSkeleton />;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing={10}>
        {
          qrCodeTemplates?.map((template) => (
            <QRTemplateCard key={template?.Id} template={template} />
          ))
        }
      </SimpleGrid>


    </>
  )
}

export default QRTemplatesList