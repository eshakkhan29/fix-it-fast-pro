'use client';

import { WidgetWrapper } from '@/components/widget-wrapper';
import React, { useState, useEffect } from 'react';
import LocationHeatMapContent from './LocationHeatMapDetails';
import { ScrollArea, Select, Skeleton, Stack, Text } from '@mantine/core';

import { useGetAssignmentsList } from '@/app/evaluator/hooks/useGetAssignmentList';
import { useAccountIdStore } from '@/stores/user/accountId-store';
import { useGetNestedLocation } from '../../hooks/locatoins/useGetNestedLocation';
import LocationHeatMapSkeleton from './LocationHeatMapSkeleton';
import { useTranslations } from 'next-intl';

interface LocationNode {
  value: number;
  level: string;
  text: string;
  children: LocationNode[];
}

interface LevelSummary {
  level: string;
  count: number;
}

// Define the order of levels for sorting
const LEVEL_ORDER = ['Campus', 'Building', 'Floor', 'Area', 'Room'];

const flattenTree = (nodes: LocationNode[]): Omit<LocationNode, 'children'>[] => {
  return nodes.reduce((acc, node) => {
    const { children, ...rest } = node;
    return [...acc, rest, ...flattenTree(children || [])];
  }, [] as Omit<LocationNode, 'children'>[]);
};

const LocationHeatmapCard = () => {
  const t = useTranslations('Dashboard');
  const { userAccountId } = useAccountIdStore();
  const accountId = Number(userAccountId);
  const { data: assignmentList, isLoading: isLoadingAssignments } = useGetAssignmentsList({ accountId });

  const assignmentSelectData = assignmentList?.map((item) => ({
    value: item?.Id.toString(),
    label: item?.Name,
  })) || [];

  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);

  // Set the first assignment as default when assignmentList is loaded
  useEffect(() => {
    if (assignmentList?.length && !selectedAssignmentId) {
      setSelectedAssignmentId(assignmentList[0].Id.toString());
    }
  }, [assignmentList, selectedAssignmentId]);

  const selectedAssignment = assignmentList?.find((item) => item.Id.toString() === selectedAssignmentId);
  const locationTypeIds = selectedAssignment?.LocationTypes?.map((type) => type.Id) || [];

  const params = {
    accountId: accountId || 0,
    locationTypes: locationTypeIds,
  };

  const { data: nestedLocation, isLoading: isLoadingNestedLocation, isError, error } = useGetNestedLocation(params);
  const flatLocations = nestedLocation ? flattenTree(nestedLocation) : [];

  // Group and summarize locations by level (only level and count)
  const levelSummaries: LevelSummary[] = Object.entries(
    flatLocations.reduce((acc, location) => {
      const level = location.level;
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
    .map(([level, count]) => ({
      level,
      count,
    }))
    .sort((a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level));


  return (
    <WidgetWrapper
      title={t('widgetTitles.locationHeatmap')}
      primaryActionSection={
        <>
          {isLoadingAssignments ? (
            <Skeleton w={200} h={30} />
          ) : (
            <Select
              placeholder={t('select.assignmentPlaceholder')}
              data={assignmentSelectData}
              value={selectedAssignmentId}
              onChange={setSelectedAssignmentId}
            />
          )}
        </>
      }
    >
      <ScrollArea h={250}>
        <Stack gap={10}>
          {isLoadingNestedLocation ? (
            <LocationHeatMapSkeleton />
          ) : isError ? (
            <Text c="red">{t('errors.errorPrefix')}: {error?.message}</Text>
          ) : levelSummaries.length > 0 ? (
            levelSummaries.map((summary) => (
              <LocationHeatMapContent
                key={summary.level}
                location={{
                  level: summary.level,
                  count: summary.count,
                }}
              />
            ))
          ) : (
            <Text>{t('messages.noLocations')}</Text>
          )}
        </Stack>
      </ScrollArea>
    </WidgetWrapper>
  );
};

export default LocationHeatmapCard;