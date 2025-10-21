'use client';
import { useAccountIdStore } from '@/stores/user/accountId-store';
import React, { useEffect, useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import {
  Container,
  Title,
  Card,
  Stack,
  Group,
  Text,
  ActionIcon,
  Collapse,
  Badge,
  Box,
  ScrollArea,
  Divider,
  Paper,
  Button,
  Loader,
  Checkbox,
  Select,
  SimpleGrid,
  Modal,
  Grid,
} from '@mantine/core';
import { Icon } from '@iconify/react';
import QRCodeGenerator from './QRCodeGenerator';
import BulkQRDownload from './BulkQRDownload';
import QRCodeTemplate2 from './QRCodeTemplate2';
import { useQRPreGeneration } from '../hooks/useQRPreGeneration';
import { getAssignment } from '../actions/assignment';
import { getLocationHierarchy } from '../actions/location';
import { useGetQRTemplateByAssignmentId } from '../../hooks/QRTemplate/useGetQRTemplateByAssignmentId';
import { QRCodeTemplateItem } from '../../hooks/QRTemplate/useGetQRTemplates';
import { getColor } from '@/lib/getColorOfLocationLevel';
import LocationManagementSkeleton from './LocationManagementSkeleton';
import LocationHierarchySkeleton from './LocationHierarchySkeleton';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface LocationNode {
  value: number;
  level: string;
  text: string;
  children: LocationNode[];
}

interface LocationType {
  Id: number;
  Name: string;
}

interface Assignment {
  Id: string | number;
  Name: string;
  LocationTypes: LocationType[];
  [key: string]: any;
}

interface LocationHierarchy {
  accountId: string;
  assignmentId?: string;
  campusId?: string;
  buildingId?: string;
  floorId?: string;
  areaId?: string;
  roomId?: string;
  campusName?: string;
  buildingName?: string;
  floorName?: string;
  areaName?: string;
  roomName?: string;
}

export interface SelectedLocation {
  id: string;
  name: string;
  level: string;
  hierarchy: LocationHierarchy;
}

function LocationTreeNode({
  qrTemplate,
  node,
  depth = 0,
  parentHierarchy = {},
  selectedItems = [],
  onSelectionChange,
  userAccountId,
  selectedLocationTypes,
  locationTypeToAssignmentMap,
}: {
  qrTemplate?: QRCodeTemplateItem;
  node: LocationNode;
  depth?: number;
  parentHierarchy?: Partial<LocationHierarchy>;
  selectedItems?: SelectedLocation[];
  onSelectionChange?: (items: SelectedLocation[], isSelected: boolean) => void;
  userAccountId?: string;
  selectedLocationTypes?: string[];
  locationTypeToAssignmentMap?: Map<string, string>;
}) {
  const t = useTranslations('LocationManagement');
  const [isExpanded, setIsExpanded] = useState(depth < 2);

  const hasChildren = node.children && node.children.length > 0;

  const assignmentId = useMemo(() => {
    if (
      !selectedLocationTypes ||
      selectedLocationTypes.length === 0 ||
      !locationTypeToAssignmentMap
    ) {
      return undefined;
    }
    for (const locationTypeId of selectedLocationTypes) {
      const assignmentId = locationTypeToAssignmentMap.get(locationTypeId);
      if (assignmentId) {
        return assignmentId;
      }
    }

    return undefined;
  }, [selectedLocationTypes, locationTypeToAssignmentMap]);

  const currentHierarchy: LocationHierarchy = {
    accountId: userAccountId || '',
    assignmentId: assignmentId,
    ...parentHierarchy,
  };

  if (!userAccountId) {
    console.warn('userAccountId is not available, skipping selection');
  }

  switch (node.level.toLowerCase()) {
    case 'campus':
      currentHierarchy.campusId = node.value.toString();
      currentHierarchy.campusName = node.text;
      break;
    case 'building':
      currentHierarchy.buildingId = node.value.toString();
      currentHierarchy.buildingName = node.text;
      break;
    case 'floor':
      currentHierarchy.floorId = node.value.toString();
      currentHierarchy.floorName = node.text;
      break;
    case 'area':
      currentHierarchy.areaId = node.value.toString();
      currentHierarchy.areaName = node.text;
      break;
    case 'room':
      currentHierarchy.roomId = node.value.toString();
      currentHierarchy.roomName = node.text;
      break;
  }

  const currentItem: SelectedLocation = {
    id: `${node.level}-${node.value}`,
    name: node.text,
    level: node.level,
    hierarchy: currentHierarchy,
  };

  const isSelected = selectedItems.some((item) => item.id === currentItem.id);

  const handleSelectionChange = (checked: boolean) => {
    if (onSelectionChange && userAccountId) {
      onSelectionChange([currentItem], checked);
    }
  };

  // NEW: Function to collect all children recursively
  const getAllChildren = (node: LocationNode, parentHierarchy: Partial<LocationHierarchy>): SelectedLocation[] => {
    const children: SelectedLocation[] = [];

    if (!node.children || node.children.length === 0) {
      return children;
    }

    node.children.forEach((child) => {
      const childHierarchy: LocationHierarchy = {
        accountId: userAccountId || '',
        assignmentId: assignmentId,
        ...parentHierarchy,
      };

      switch (child.level.toLowerCase()) {
        case 'campus':
          childHierarchy.campusId = child.value.toString();
          childHierarchy.campusName = child.text;
          break;
        case 'building':
          childHierarchy.buildingId = child.value.toString();
          childHierarchy.buildingName = child.text;
          break;
        case 'floor':
          childHierarchy.floorId = child.value.toString();
          childHierarchy.floorName = child.text;
          break;
        case 'area':
          childHierarchy.areaId = child.value.toString();
          childHierarchy.areaName = child.text;
          break;
        case 'room':
          childHierarchy.roomId = child.value.toString();
          childHierarchy.roomName = child.text;
          break;
      }

      const childItem: SelectedLocation = {
        id: `${child.level}-${child.value}`,
        name: child.text,
        level: child.level,
        hierarchy: childHierarchy,
      };

      children.push(childItem);

      // Recursively get all descendants
      const descendants = getAllChildren(child, childHierarchy);
      children.push(...descendants);
    });

    return children;
  };

  // NEW: Check if all children are selected
  const areAllChildrenSelected = useMemo(() => {
    if (!hasChildren) return false;
    const allChildren = getAllChildren(node, currentHierarchy);
    return allChildren.every((child) =>
      selectedItems.some((item) => item.id === child.id)
    );
  }, [node, currentHierarchy, selectedItems, hasChildren]);

  // NEW: Handle select/deselect all children
  const handleSelectChildren = () => {
    if (!onSelectionChange || !userAccountId) return;

    const allChildren = getAllChildren(node, currentHierarchy);
    
    if (areAllChildrenSelected) {
      // Deselect all children
      onSelectionChange(allChildren, false);
    } else {
      // Select all children
      onSelectionChange(allChildren, true);
    }
  };

  const getIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'campus':
        return 'mdi:domain';
      case 'building':
        return 'mdi:office-building';
      case 'floor':
        return 'mdi:layers';
      case 'area':
        return 'mdi:vector-square';
      case 'room':
        return 'mdi:door';
      default:
        return 'mdi:map-marker';
    }
  };

  const paddingLeft = depth * 24;

  return (
    <Box
      style={{
        minWidth: 'max-content',
      }}
    >
      <Paper
        p="sm"
        withBorder
        style={{
          marginLeft: paddingLeft,
          marginBottom: 4,
          borderLeft:
            depth > 0
              ? `3px solid var(--mantine-color-${getColor(node.level)}-3)`
              : undefined,
        }}
      >
        <Group justify="space-between" wrap="nowrap">
          <Group gap="sm" wrap="nowrap">
            {onSelectionChange && (
              <Checkbox
                checked={isSelected}
                onChange={(event) =>
                  handleSelectionChange(event.currentTarget.checked)
                }
                size="sm"
                color={getColor(node.level)}
              />
            )}

            {hasChildren && (
              <ActionIcon
                variant="subtle"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                color={getColor(node.level)}
              >
                <Icon
                  icon={isExpanded ? 'mdi:chevron-down' : 'mdi:chevron-right'}
                  style={{ fontSize: 16 }}
                />
              </ActionIcon>
            )}
            {!hasChildren && <Box w={28} />}

            <Icon
              icon={getIcon(node.level)}
              style={{
                fontSize: 20,
                color: `var(--mantine-color-${getColor(node.level)}-6)`,
              }}
            />

            <Stack gap={2}>
              <Text fw={500} size="sm">
                {node.text}
              </Text>
              <Group gap="xs">
                <Badge size="xs" variant="outline" color={getColor(node.level)}>
                  {node.level}
                </Badge>
                <Text size="xs" c="dimmed">
          {t('labels.id')}: {node.value}
        </Text>
              </Group>
            </Stack>
          </Group>
          { hasChildren &&  <Button
            color={getColor(node.level)}
            variant="light"
            size="compact-sm"
            onClick={handleSelectChildren}
          >
            {areAllChildrenSelected ? t('actions.deselectChildren') : t('actions.selectChildren')}
          </Button>

          }
         

          <Group gap="xs">
            <QRCodeGenerator
              qrTemplate={qrTemplate}
              hierarchy={currentHierarchy}
              locationName={node.text}
              level={node.level}
              autoGenerate={true}
            />

            {hasChildren && (
              <Stack >
                <Badge variant="outline" size="sm" color={getColor(node.level)}>
                  {node.children.length}{' '}
                  {node.children.length === 1 ? t('labels.item') : t('labels.items')}
                </Badge>
               
              </Stack>
            )}
          </Group>
        </Group>
      </Paper>

      {hasChildren && (
        <Collapse in={isExpanded}>
          <Stack gap={0} mt="xs">
            {node.children.map((child) => (
              <LocationTreeNode
                qrTemplate={qrTemplate}
                key={child.value}
                node={child}
                depth={depth + 1}
                parentHierarchy={currentHierarchy}
                selectedItems={selectedItems}
                onSelectionChange={onSelectionChange}
                userAccountId={userAccountId}
                selectedLocationTypes={selectedLocationTypes}
                locationTypeToAssignmentMap={locationTypeToAssignmentMap}
              />
            ))}
          </Stack>
        </Collapse>
      )}
    </Box>
  );
}

function LocationManagementContent() {
  const t = useTranslations('LocationManagement');
  const { data: session } = useSession();
  const {
    userAccountId,
    isLoading: accountLoading,
    error: accountError,
    initializeAccountId,
  } = useAccountIdStore();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [locationHierarchy, setLocationHierarchy] = useState<
    LocationNode[] | null
  >(null);

  const { data: qrTemplate } = useGetQRTemplateByAssignmentId({
    assignmentId: Number(selectedAssignment?.Id) || 0,
    accountId: Number(userAccountId) || 0,
    enabled: true, // optional, defaults to true
  });
  const [locationTypes, setLocationTypes] = useState<LocationType[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedLocation[]>([]);
  const [showBulkDownload, setShowBulkDownload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);
  const [locationTypesLoading, setLocationTypesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationTypeToAssignmentMap, setLocationTypeToAssignmentMap] =
    useState<Map<string, string>>(new Map());
  const [selectedLevels, setSelectedLevels] = useState<{
    [key: string]: boolean;
  }>({
    campus: false,
    building: false,
    floor: false,
    area: false,
    room: false,
  });
  const [isQRTemplateModalOpen, setIsQRTemplateModalOpen] = useState(false);

  useQRPreGeneration(selectedItems);

  useEffect(() => {
    if (session?.user && !userAccountId && !accountLoading) {
      initializeAccountId((session.user as any).id);
    }
  }, [session?.user, userAccountId, accountLoading, initializeAccountId]);

  useEffect(() => {
    if (!userAccountId) return;

    const fetchAssignments = async () => {
      try {
        setAssignmentsLoading(true);
        const assignmentData = await getAssignment(
          `/Assignment/GetbyAccountId?accountId=${userAccountId}`
        );
        if (
          assignmentData &&
          Array.isArray(assignmentData) &&
          assignmentData.length > 0
        ) {
          setAssignments(assignmentData);
          setSelectedAssignment(assignmentData[0]);
        }
      } catch (err) {
        console.error('Error fetching assignments:', err);
        setError(t('errors.failedToLoadAssignments'));
      } finally {
        setAssignmentsLoading(false);
      }
    };

    fetchAssignments();
  }, [userAccountId]);

  useEffect(() => {
    if (!selectedAssignment) {
      setLocationTypes([]);
      setLocationTypeToAssignmentMap(new Map());
      return;
    }

    const processSelectedAssignment = () => {
      try {
        setLocationTypesLoading(true);
        const assignmentLocationTypes = selectedAssignment.LocationTypes || [];
        const locationTypeAssignmentMap = new Map<string, string>();
        assignmentLocationTypes.forEach((locationType: LocationType) => {
          locationTypeAssignmentMap.set(
            locationType.Id.toString(),
            String(selectedAssignment.Id)
          );
        });



        setLocationTypes(assignmentLocationTypes);
        setLocationTypeToAssignmentMap(locationTypeAssignmentMap);
      } catch (err) {
        console.error('Error processing selected assignment:', err);
        setError(t('errors.failedToProcessAssignment'));
      } finally {
        setLocationTypesLoading(false);
      }
    };

    processSelectedAssignment();
  }, [selectedAssignment]);

  useEffect(() => {
    if (!userAccountId || !selectedAssignment) {
      setLocationHierarchy(null);
      setLoading(false);
      return;
    }

    const fetchLocationData = async () => {
      try {
        setLoading(true);
        const allLocationTypes = selectedAssignment.LocationTypes.map((lt) =>
          lt.Id.toString()
        );
        const locationTypesParam = allLocationTypes.join(',');
        const data = await getLocationHierarchy(
          `/locationNodes/ByLocationType?accountId=${userAccountId}&locationTypes=${locationTypesParam}&assignmentId=${String(
            selectedAssignment.Id
          )}`
        );
        setLocationHierarchy(data);
        setError(null);

      } catch (err) {
        setError(t('errors.failedToLoadLocationData'));
        console.error('Error fetching location data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocationData();
  }, [userAccountId, selectedAssignment]);

  useEffect(() => {
    if (!locationHierarchy) {
      setSelectedLevels({
        campus: false,
        building: false,
        floor: false,
        area: false,
        room: false,
      });
      return;
    }

    const totalCounts = getTotalCounts(locationHierarchy);
    const selectedCounts = selectedItems.reduce((acc, item) => {
      acc[item.level.toLowerCase()] = (acc[item.level.toLowerCase()] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    setSelectedLevels({
      campus: totalCounts.campus
        ? selectedCounts.campus === totalCounts.campus
        : false,
      building: totalCounts.building
        ? selectedCounts.building === totalCounts.building
        : false,
      floor: totalCounts.floor
        ? selectedCounts.floor === totalCounts.floor
        : false,
      area: totalCounts.area ? selectedCounts.area === totalCounts.area : false,
      room: totalCounts.room ? selectedCounts.room === totalCounts.room : false,
    });
  }, [selectedItems, locationHierarchy]);

  const handleSelectionChange = (
    items: SelectedLocation[],
    isSelected: boolean
  ) => {
    if (isSelected) {
      setSelectedItems((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const newItems = items.filter((item) => !existingIds.has(item.id));
        return [...prev, ...newItems];
      });
    } else {
      const itemIds = new Set(items.map((item) => item.id));
      setSelectedItems((prev) =>
        prev.filter((selected) => !itemIds.has(selected.id))
      );
    }
  };

  const collectNodesByLevel = (
    nodes: LocationNode[],
    targetLevel: string,
    parentHierarchy: Partial<LocationHierarchy>,
    result: SelectedLocation[] = [],
    userAccountId: string,
    selectedLocationTypes: string[],
    locationTypeToAssignmentMap: Map<string, string>
  ) => {
    nodes.forEach((node) => {
      const currentHierarchy: LocationHierarchy = {
        accountId: userAccountId,
        assignmentId: locationTypeToAssignmentMap.get(selectedLocationTypes[0]),
        ...parentHierarchy,
      };

      switch (node.level.toLowerCase()) {
        case 'campus':
          currentHierarchy.campusId = node.value.toString();
          currentHierarchy.campusName = node.text;
          break;
        case 'building':
          currentHierarchy.buildingId = node.value.toString();
          currentHierarchy.buildingName = node.text;
          break;
        case 'floor':
          currentHierarchy.floorId = node.value.toString();
          currentHierarchy.floorName = node.text;
          break;
        case 'area':
          currentHierarchy.areaId = node.value.toString();
          currentHierarchy.areaName = node.text;
          break;
        case 'room':
          currentHierarchy.roomId = node.value.toString();
          currentHierarchy.roomName = node.text;
          break;
      }

      if (node.level.toLowerCase() === targetLevel.toLowerCase()) {
        result.push({
          id: `${node.level}-${node.value}`,
          name: node.text,
          level: node.level,
          hierarchy: currentHierarchy,
        });
      }

      if (node.children && node.children.length > 0) {
        collectNodesByLevel(
          node.children,
          targetLevel,
          currentHierarchy,
          result,
          userAccountId,
          selectedLocationTypes,
          locationTypeToAssignmentMap
        );
      }
    });
    return result;
  };

  const handleToggleSelectAll = (level: string) => {
    if (!locationHierarchy || !userAccountId || !selectedAssignment) return;
    const selectedLocationTypes = selectedAssignment.LocationTypes.map((lt) =>
      lt.Id.toString()
    );

    if (selectedLevels[level.toLowerCase()]) {
      // Deselect all nodes of this level
      const nodesToDeselect = collectNodesByLevel(
        locationHierarchy,
        level,
        {},
        [],
        userAccountId,
        selectedLocationTypes,
        locationTypeToAssignmentMap
      );
      handleSelectionChange(nodesToDeselect, false);
    } else {
      // Select all nodes of this level
      const nodesToSelect = collectNodesByLevel(
        locationHierarchy,
        level,
        {},
        [],
        userAccountId,
        selectedLocationTypes,
        locationTypeToAssignmentMap
      );
      handleSelectionChange(nodesToSelect, true);
    }
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
  };

  const handleBulkDownload = () => {
    if (selectedItems.length > 0) {
      setShowBulkDownload(true);
    }
  };

  const handleRefresh = () => {
    if (selectedAssignment) {
      const allLocationTypes = selectedAssignment.LocationTypes.map((lt) =>
        lt.Id.toString()
      );
      const locationTypesParam = allLocationTypes.join(',');
      const fetchLocationData = async () => {
        try {
          setLoading(true);
          const data = await getLocationHierarchy(
            `/locationNodes/ByLocationType?accountId=${userAccountId}&locationTypes=${locationTypesParam}&assignmentId=${String(
              selectedAssignment.Id
            )}`
          );
          setLocationHierarchy(data);
          setError(null);
        } catch (err) {
          setError(t('errors.failedToLoadLocationData'));
          console.error('Error fetching location data:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchLocationData();
    }
  };

  if (accountLoading || locationTypesLoading) {
    return (

      <LocationManagementSkeleton />
    );
  }

  if (accountError || (!locationTypesLoading && locationTypes.length === 0)) {
    return (
      <Container size="xl" py="xl">
        <Card withBorder shadow="sm" p="xl">
          <Group justify="center">
            <Icon
              icon="mdi:alert-circle"
              style={{ fontSize: 48, color: 'var(--mantine-color-error-6)' }}
            />
            <Stack gap="xs" align="center">
              <Title order={3} c="error">
                {t('messages.noLocationTypesTitle')}
              </Title>
              <Text c="dimmed">
                {accountError || t('messages.noLocationTypesDescription')}
              </Text>
            </Stack>
          </Group>
        </Card>
      </Container>
    );
  }

  const getTotalCounts = (nodes: LocationNode[]): { [key: string]: number } => {
    const counts: { [key: string]: number } = {};
    const countNodes = (nodeList: LocationNode[]) => {
      nodeList.forEach((node) => {
        const level = node.level.toLowerCase(); // Normalize to lowercase
        counts[level] = (counts[level] || 0) + 1;
        if (node.children && node.children.length > 0) {
          countNodes(node.children);
        }
      });
    };
    countNodes(nodes);
    return counts;
  };
  const totalCounts = locationHierarchy
    ? getTotalCounts(locationHierarchy)
    : {};

  return (
    <div>
      <Stack gap="xl">
        <Group
          justify="space-between"
          align="flex-start"
          className="sticky !top-[-10px] z-[100] backdrop-blur-md bg-white/80 py-4 px-4 mb-3"
        >
          <Stack gap="xs">
            <Title order={1}>{t('title')}</Title>
            <Group align="center">
              <Text c="dimmed" size="lg">{t('subtitle')}</Text>
              <Button
                component={Link}
                href="https://junoprod-walshqa.azurewebsites.net/locations/location-structure"
                leftSection={<Icon icon="majesticons:plus" />}
                variant="outline"
                
              >
                {t('actions.createLocation')}
              </Button>
              <Button
                component={Link}
                href="https://junoprod-walshqa.azurewebsites.net/assignments"
                leftSection={<Icon icon="majesticons:plus" />}
                variant="light"
               
              >
                {t('actions.createAssignment')}
              </Button>
            </Group>
          </Stack>

          <Group>
            <ActionIcon
              variant="light"
              size="lg"
              color="primary"
              onClick={handleRefresh}
              disabled={loading || !selectedAssignment}
            >
              <Icon icon="mdi:refresh" style={{ fontSize: 20 }} />
            </ActionIcon>
            <Button
              leftSection={<Icon icon="mdi:qrcode-scan" />}
              onClick={() => setIsQRTemplateModalOpen(true)}
            >
              {t('actions.editQrTemplate')}
            </Button>
          </Group>
        </Group>

        <Card withBorder m={{ base: 15, md: 25 }} p={0}>
          <Grid>
            <Grid.Col span={{ base: 12, md: 7 }} p={0}>
              <Box
                className="border-r-1 border-gray-200 border-b-1 xl:border-b-0 "
                h="100%"
              >
                <Box p="md">
                  <Stack gap="md">
                    <Group justify="space-between" align="center">
                      <Group>
                        <Icon icon="mdi:assignment" style={{ fontSize: 24 }} />
                        <Title order={4}>{t('labels.selectAssignment')}</Title>
                      </Group>
                      {assignmentsLoading && <Loader size="sm" />}
                      <Select
                        placeholder={t('filters.selectAssignmentPlaceholder')}
                        data={assignments.map((assignment) => ({
                          value: String(assignment.Id),
                          label: assignment.Name,
                        }))}
                        value={
                          selectedAssignment
                            ? String(selectedAssignment.Id)
                            : null
                        }
                        onChange={(value) => {
                          const assignment = assignments.find(
                            (a) => String(a.Id) === value
                          );
                          setSelectedAssignment(assignment || null);
                        }}
                        searchable
                        clearable={false}
                        disabled={
                          assignmentsLoading || assignments.length === 0
                        }
                        leftSection={
                          <Icon
                            icon="mdi:assignment"
                            style={{ fontSize: 16 }}
                          />
                        }
                      />
                    </Group>
                  </Stack>
                </Box>

                <Divider />

                {selectedAssignment &&
                  selectedAssignment.LocationTypes &&
                  selectedAssignment.LocationTypes.length > 0 && (
                    <Box p="xl">
                      <Stack gap="sm">
                        <Group justify="space-between" align="center">
                          <Group>
                            <Icon
                              icon="mdi:tag-multiple"
                              style={{ fontSize: 24 }}
                            />
                            <Title order={4}>
                      {t('labels.locationTypesFor', { name: selectedAssignment.Name })}
                    </Title>
                          </Group>
                          <Badge variant="light" size="lg">
                            {selectedAssignment.LocationTypes.length}{' '}
                            {selectedAssignment.LocationTypes.length === 1
                                ? t('labels.locationModal')
                                : t('labels.locationModals')}
                          </Badge>
                        </Group>

                        <Group gap="md">
                          {selectedAssignment.LocationTypes.map(
                            (locationType) => (
                              <Badge
                                c="#E2FFEF"
                                radius="lg"
                                key={locationType.Id}
                                variant="filled"
                                size="md"
                                leftSection={
                                  <Icon
                                    icon="icon-park-outline:dot"
                                    style={{ fontSize: 12 }}
                                    color="#339D88"
                                  />
                                }
                              >
                                {locationType.Name} (ID: {locationType.Id})
                              </Badge>
                            )
                          )}
                        </Group>

                        <Text size="sm" c="dimmed">
                          All location types above are automatically included in
                          the location hierarchy display.
                        </Text>
                      </Stack>
                    </Box>
                  )}

                {selectedAssignment && Object.keys(totalCounts).length > 0 && (
                  <Stack p="xl">
                    <Group grow wrap="wrap" p={15}>
                      {Object.entries(totalCounts).map(([level, count]) => (
                        <Card
                          key={level}
                          withBorder
                          shadow="sm"
                          p="md"
                          miw={130}
                          radius="xl"
                        >
                          <Stack justify="end" gap={25}>
                            <Icon
                              icon={
                                level.toLowerCase() === 'campus'
                                  ? 'mdi:domain'
                                  : level.toLowerCase() === 'building'
                                  ? 'mdi:office-building'
                                  : level.toLowerCase() === 'floor'
                                  ? 'mdi:layers'
                                  : level.toLowerCase() === 'area'
                                  ? 'mdi:vector-square'
                                  : 'mdi:door'
                              }
                              style={{ fontSize: 26 }}
                            />
                            <Stack gap={2}>
                              <Text
                                size="sm"
                                c="dimmed"
                                tt="uppercase"
                                fw={600}
                              >
                                {level}s
                              </Text>
                              <Text size="xl" fw={700}>
                                {count}
                              </Text>
                            </Stack>
                          </Stack>
                        </Card>
                      ))}
                    </Group>
                    <SimpleGrid cols={{ base: 1, md: 3 }} p={10}>
                      {/* <Group p={10}> */}
                      {['campus', 'building', 'floor', 'area', 'room'].map(
                        (level) => (
                          <Button
                            color={getColor(level)}
                            key={level}
                            variant={
                              selectedLevels[level] ? 'outline' : 'default'
                            }
                            leftSection={
                              <Icon
                                icon={
                                  level === 'campus'
                                    ? 'mdi:domain'
                                    : level === 'building'
                                    ? 'mdi:office-building'
                                    : level === 'floor'
                                    ? 'mdi:layers'
                                    : level === 'area'
                                    ? 'mdi:vector-square'
                                    : 'mdi:door'
                                }
                              />
                            }
                            onClick={() => handleToggleSelectAll(level)}
                          >
                            {selectedLevels[level]
                              ? t('actions.deselectAllLevel', { level: level.charAt(0).toUpperCase() + level.slice(1) })
                              : t('actions.selectAllLevel', { level: level.charAt(0).toUpperCase() + level.slice(1) })}
                          </Button>
                        )
                      )}
                      {/* </Group> */}
                    </SimpleGrid>
                  </Stack>
                )}
              </Box>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 5 }} p={0}>
              <Box>
                <>
                  {selectedAssignment && (
                    <>
                      {loading ? (
                        <LocationHierarchySkeleton />
                      ) : error ? (
                        <Card withBorder shadow="sm" p="xl">
                          <Group justify="center">
                            <Icon
                              icon="mdi:alert-circle"
                              style={{
                                fontSize: 48,
                                color: 'var(--mantine-color-error-6)',
                              }}
                            />
                            <Stack gap="xs" align="center">
                              <Title order={3} c="error">{t('errors.loadingDataTitle')}</Title>
                              <Text c="dimmed">{error}</Text>
                              <Button
                                variant="light"
                                onClick={handleRefresh}
                                leftSection={<Icon icon="mdi:refresh" />}
                              >
                                {t('actions.tryAgain')}
                              </Button>
                            </Stack>
                          </Group>
                        </Card>
                      ) : !locationHierarchy ||
                        !Array.isArray(locationHierarchy) ||
                        locationHierarchy.length === 0 ? (
                        <Card withBorder shadow="sm" p="md">
                          <Group justify="center">
                            <Icon
                              icon="mdi:information-outline"
                              style={{
                                fontSize: 48,
                                color: 'var(--mantine-color-blue-6)',
                              }}
                            />
                            <Stack gap="xs" align="center">
                              <Title order={3}>{t('messages.noLocationDataTitle')}</Title>
                              <Text c="dimmed">{t('messages.noLocationDataDescription')}</Text>
                            </Stack>
                          </Group>
                        </Card>
                      ) : (
                        <Box>
                          <Group justify="space-between" p="md">
                            <Group>
                              <Icon
                                icon="mdi:file-tree"
                                style={{ fontSize: 24 }}
                              />
                              <Title order={2}>{t('labels.locationHierarchy')}</Title>
                            </Group>
                            <Group>
                              {selectedItems.length > 0 && (
                                <>
                                  <Badge variant="light" size="lg" color="blue">
                      {t('labels.selectedCount', { count: selectedItems.length })}
                    </Badge>
                                  <Button
                                    variant="light"
                                    size="sm"
                                    leftSection={
                                      <Icon icon="mdi:download-multiple" />
                                    }
                                    onClick={handleBulkDownload}
                                  >
                                    {t('actions.downloadInBulk')}
                                  </Button>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={handleClearSelection}
                                  >
                                    {t('actions.clearSelection')}
                                  </Button>
                                </>
                              )}
                              <Badge variant="light" size="lg">
                                {locationHierarchy.length}{' '}
                                {locationHierarchy.length === 1
                                  ? t('labels.location')
                                  : t('labels.locations')}
                              </Badge>
                            </Group>
                          </Group>
                          <Divider />
                          <ScrollArea h={800} p="md">
                            <Stack gap="xs">
                              {locationHierarchy.map((location) => (
                                <LocationTreeNode
                                  qrTemplate={qrTemplate}
                                  key={location.value}
                                  node={location}
                                  selectedItems={selectedItems}
                                  onSelectionChange={handleSelectionChange}
                                  userAccountId={userAccountId || undefined}
                                  selectedLocationTypes={
                                    selectedAssignment?.LocationTypes.map(
                                      (lt) => lt.Id.toString()
                                    ) || []
                                  }
                                  locationTypeToAssignmentMap={
                                    locationTypeToAssignmentMap
                                  }
                                />
                              ))}
                            </Stack>
                          </ScrollArea>
                        </Box>
                      )}
                    </>
                  )}
                </>
              </Box>
            </Grid.Col>
          </Grid>
          {/* <SimpleGrid cols={{ base: 1, lg: 2 }} spacing={0} bg="red">
            

            
          </SimpleGrid> */}
        </Card>
      </Stack>

      {showBulkDownload && (
        <BulkQRDownload
          qrTemplate={qrTemplate}
          selectedItems={selectedItems}
          onClose={() => setShowBulkDownload(false)}
        />
      )}

      <Modal
        opened={isQRTemplateModalOpen}
        onClose={() => setIsQRTemplateModalOpen(false)}
        size="xxl"
        centered
        closeOnClickOutside={true}
        withCloseButton={false}
        padding={0}
      >
        <QRCodeTemplate2
          isEdit={true}
          defaultValues={qrTemplate}
          qrCodeUrl="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=sample"
          locationName="Sample Location"
          level="Campus"
          allowEditTitle={true}
          showControls={true}
          onDownload={() => {
            setIsQRTemplateModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}

export default LocationManagementContent;
