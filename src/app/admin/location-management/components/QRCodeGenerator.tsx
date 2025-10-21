+'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import QRCode from 'qrcode';
import { Button, Modal, Stack, Text, ActionIcon, Paper } from '@mantine/core';
import { Icon } from '@iconify/react';

import QRCodeTemplate from './QRCodeTemplate';
import { getQRCodeCache } from '../hooks/useQRPreGeneration';
import { QRCodeTemplateItem } from './QRTemplateCard';

const spinAnimation = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = spinAnimation;
  document.head.appendChild(style);
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

interface QRCodeGeneratorProps {
  qrTemplate?: QRCodeTemplateItem;
  hierarchy: LocationHierarchy;
  locationName: string;
  level: string;
  baseUrl?: string;
  autoGenerate?: boolean;
}

export function QRCodeGenerator({
  qrTemplate,
  hierarchy,
  locationName,
  level,
  baseUrl,
  autoGenerate = false,
}: QRCodeGeneratorProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [dynamicBaseUrl, setDynamicBaseUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  

  const [customLocationName, setCustomLocationName] = useState(locationName);
 
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url =
        baseUrl || `${window.location.protocol}//${window.location.host}`;
      setDynamicBaseUrl(url);
    }
  }, [baseUrl]);

  const qrUrl = useMemo(() => {
    if (!dynamicBaseUrl) return '';

    const params = new URLSearchParams();

    if (hierarchy.accountId) params.append('accountId', hierarchy.accountId);
    if (hierarchy.assignmentId)
      params.append('assignmentId', hierarchy.assignmentId);

    const levelLower = level.toLowerCase();

    if (
      hierarchy.campusId &&
      ['campus', 'building', 'floor', 'area', 'room'].includes(levelLower) &&
      hierarchy.campusName
    ) {
      params.append('campusId', hierarchy.campusId);
      params.append('campusName', hierarchy.campusName);
    }

    if (
      hierarchy.buildingId &&
      ['building', 'floor', 'area', 'room'].includes(levelLower) &&
      hierarchy.buildingName
    ) {
      params.append('buildingId', hierarchy.buildingId);
      params.append('buildingName', hierarchy.buildingName);
    }

    if (
      hierarchy.floorId &&
      ['floor', 'area', 'room'].includes(levelLower) &&
      hierarchy.floorName
    ) {
      params.append('floorId', hierarchy.floorId);
      params.append('floorName', hierarchy.floorName);
    }

    if (
      hierarchy.areaId &&
      ['area', 'room'].includes(levelLower) &&
      hierarchy.areaName
    ) {
      params.append('areaId', hierarchy.areaId);
      params.append('areaName', hierarchy.areaName);
    }

    if (hierarchy.roomId && levelLower === 'room' && hierarchy.roomName) {
      params.append('roomId', hierarchy.roomId);
      params.append('roomName', hierarchy.roomName);
    }

    const finalUrl = `${dynamicBaseUrl}/create-incident?${params.toString()}`;

    return finalUrl;
  }, [dynamicBaseUrl, hierarchy, level]);

  const cacheKey = useMemo(() => {
    return `${qrUrl}-${level}-${locationName}`;
  }, [qrUrl, level, locationName]);

  const generateQRCode = useCallback(async () => {
    if (!qrUrl) {
      return;
    }

    const cache = getQRCodeCache();

    const cachedQR = cache.get(cacheKey);
    if (cachedQR) {
      setQrCodeUrl(cachedQR);
      return;
    }

    setIsGenerating(true);

    try {
      const dataUrl = await QRCode.toDataURL(qrUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      });

      setQrCodeUrl(dataUrl);
      cache.set(cacheKey, dataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [qrUrl, cacheKey]);

  const downloadQRCode = useCallback(async () => {
    const templateElement = document.querySelector('[data-template-container]');
    if (!templateElement) {
      console.error('Template container not found');
      return;
    }

    if (typeof window !== 'undefined') {
      try {
        const html2canvas = (await import('html2canvas'))
          .default as unknown as (
            el: HTMLElement,
            options?: any
          ) => Promise<HTMLCanvasElement>;
        const canvas = await html2canvas(templateElement as HTMLElement, {
          backgroundColor: '#ffffff',
          scale: 2,
        });
        const link = document.createElement('a');
        link.download = `template-${level}-${locationName.replace(
          /[^a-zA-Z0-9]/g,
          '_'
        )}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (err) {
        console.error('html2canvas failed', err);
        if (qrCodeUrl) {
          const link = document.createElement('a');
          link.download = `qr-${level}-${locationName.replace(
            /[^a-zA-Z0-9]/g,
            '_'
          )}.png`;
          link.href = qrCodeUrl;
          link.click();
        }
      }
    }
  }, [qrCodeUrl, level, locationName]);

  useEffect(() => {
    if (qrUrl && (autoGenerate || showModal) && !qrCodeUrl && !isGenerating) {
      generateQRCode();
    }
  }, [showModal, qrUrl, qrCodeUrl, autoGenerate, generateQRCode, isGenerating]);

  return (
    <>
      <ActionIcon
        variant="light"
        color="blue"
        size="sm"
        onClick={() => setShowModal(true)}
        title={`Generate QR Code for ${locationName}`}
      >
        <Icon icon="mdi:qrcode" style={{ fontSize: 16 }} />
      </ActionIcon>

      <Modal
        bg="red"
        opened={showModal}
        onClose={() => setShowModal(false)}
        size="70%"
        centered
        withCloseButton={false}
        padding={0}
      >
        <Stack>
          {!qrCodeUrl && (
            <Paper
              withBorder
              style={{
                textAlign: 'center',
                minHeight: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isGenerating ? (
                <Stack align="center" gap="sm">
                  <Icon
                    icon="mdi:loading"
                    style={{
                      fontSize: 32,
                      animation: 'spin 1s linear infinite',
                      color: 'var(--mantine-color-blue-6)',
                    }}
                  />
                  <Text size="sm" c="dimmed">
                    Generating QR Code...
                  </Text>
                </Stack>
              ) : (
                <Stack align="center" gap="sm">
                  <Icon
                    icon="mdi:qrcode-scan"
                    style={{
                      fontSize: 48,
                      color: 'var(--mantine-color-gray-4)',
                    }}
                  />
                  <Text size="sm" c="dimmed">
                    Ready to generate QR Code
                  </Text>
                  <Button
                    leftSection={<Icon icon="mdi:qrcode" />}
                    onClick={generateQRCode}
                    disabled={!qrUrl}
                  >
                    Generate QR Code
                  </Button>
                </Stack>
              )}
            </Paper>
          )}

          {qrCodeUrl && (
            <QRCodeTemplate
              qrTemplate={qrTemplate}
              qrCodeUrl={qrCodeUrl}
              locationName={customLocationName}
              level={level}
              onLocationNameChange={setCustomLocationName}
              onDownload={downloadQRCode}
            />
          )}
        </Stack>
      </Modal>
    </>
  );
}

export default QRCodeGenerator;
