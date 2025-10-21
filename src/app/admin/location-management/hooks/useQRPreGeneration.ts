'use client';

import { useEffect, useCallback } from 'react';
import QRCode from 'qrcode';

interface LocationHierarchy {
  accountId: string;
  campusId?: string;
  buildingId?: string;
  floorId?: string;
  areaId?: string;
  roomId?: string;
}

interface SelectedLocation {
  id: string;
  name: string;
  level: string;
  hierarchy: LocationHierarchy;
}

const qrCodeCache = new Map<string, string>();

export const getQRCodeCache = () => qrCodeCache;

export function useQRPreGeneration(selectedItems: SelectedLocation[], baseUrl?: string) {
  const generateQRUrl = useCallback((hierarchy: LocationHierarchy) => {
    const params = new URLSearchParams();
    
    if (hierarchy.accountId) params.append('accountId', hierarchy.accountId);
    if (hierarchy.campusId) params.append('campusId', hierarchy.campusId);
    if (hierarchy.buildingId) params.append('buildingId', hierarchy.buildingId);
    if (hierarchy.floorId) params.append('floorId', hierarchy.floorId);
    if (hierarchy.areaId) params.append('areaId', hierarchy.areaId);
    if (hierarchy.roomId) params.append('roomId', hierarchy.roomId);

    const currentBaseUrl = baseUrl || (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : '');
    return `${currentBaseUrl}?${params.toString()}`;
  }, [baseUrl]);

  const preGenerateQRCode = useCallback(async (item: SelectedLocation) => {
    const qrUrl = generateQRUrl(item.hierarchy);
    const cacheKey = `${qrUrl}-${item.level}-${item.name}`;
    
    if (qrCodeCache.has(cacheKey)) {
      return qrCodeCache.get(cacheKey);
    }

    try {
      const dataUrl = await QRCode.toDataURL(qrUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });
      
      qrCodeCache.set(cacheKey, dataUrl);
      return dataUrl;
    } catch (error) {
      console.error(`Error pre-generating QR code for ${item.name}:`, error);
      return null;
    }
  }, [generateQRUrl]);

  const preGenerateAllQRCodes = useCallback(async () => {
    if (selectedItems.length === 0) return;

    const batchSize = 3;
    for (let i = 0; i < selectedItems.length; i += batchSize) {
      const batch = selectedItems.slice(i, i + batchSize);
      await Promise.all(batch.map(item => preGenerateQRCode(item)));
    }
  }, [selectedItems, preGenerateQRCode]);

  useEffect(() => {
    if (selectedItems.length > 0) {
      preGenerateAllQRCodes();
    }
  }, [selectedItems, preGenerateAllQRCodes]);

  return {
    preGenerateQRCode,
    preGenerateAllQRCodes,
    qrCodeCache
  };
}