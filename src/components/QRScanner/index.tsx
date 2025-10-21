'use client';
import { Alert, Button, Text } from '@mantine/core';
import { IconAlertCircle, IconX } from '@tabler/icons-react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

interface QRScannerProps {
  baseUrl: string;
  onClose?: () => void;
}

export function QRScanner({ baseUrl, onClose }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const router = useRouter();

  const stopScanning = useCallback(() => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }
    setScanning(false);
  }, []);

  const validateAndProcessQRCode = useCallback(
    (scannedText: string) => {
      try {
        // Check if the scanned text starts with the base URL
        if (!scannedText.startsWith(baseUrl)) {
          setError(`Invalid QR code. The code must start with: ${baseUrl}`);
          return;
        }

        // If valid, stop scanning and navigate to the scanned URL
        stopScanning();
        setIsVisible(false);

        // Navigate to the scanned URL
        router.push(scannedText);
      } catch (err) {
        console.error('Error processing QR code:', err);
        setError('Error processing QR code. Please try again.');
      }
    },
    [baseUrl, router, stopScanning]
  );

  const initializeScanner = useCallback(async () => {
    try {
      setError(null);
      setScanning(true);

      if (!codeReaderRef.current) {
        codeReaderRef.current = new BrowserMultiFormatReader();
      }

      if (videoRef.current) {
        await codeReaderRef.current.decodeFromVideoDevice(
          null,
          videoRef.current,
          (result, error) => {
            if (result) {
              const scannedText = result.getText();
              validateAndProcessQRCode(scannedText);
            }
            if (error && error.name !== 'NotFoundException') {
              console.error('QR Code scanning error:', error);
            }
          }
        );
      }
    } catch (err) {
      console.error('Failed to initialize scanner:', err);
      setError(
        'Failed to access camera. Please check your camera permissions.'
      );
      setScanning(false);
    }
  }, [validateAndProcessQRCode]);

  useEffect(() => {
    if (isVisible) {
      initializeScanner();
    } else {
      stopScanning();
    }

    return () => {
      stopScanning();
    };
  }, [isVisible, initializeScanner, stopScanning]);

  const handleClose = () => {
    stopScanning();
    setError(null);
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  const retryScanning = () => {
    setError(null);
    initializeScanner();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'black',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 1001,
        }}
      >
        <Button
          variant="filled"
          color="red"
          size="sm"
          onClick={handleClose}
          leftSection={<IconX size={16} />}
        >
          Close
        </Button>
      </div>

      {error && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Scanning Error"
          color="red"
          variant="light"
          style={{ margin: '20px' }}
        >
          <Text size="sm">{error}</Text>
          <Button
            size="xs"
            variant="light"
            color="red"
            mt="sm"
            onClick={retryScanning}
          >
            Try Again
          </Button>
        </Alert>
      )}

      <div
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <video
          ref={videoRef}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          autoPlay
          playsInline
          muted
        />
        {scanning && !error && (
          <div
            style={{
              position: 'absolute',
              width: '250px',
              height: '250px',
              border: '3px solid #4c6ef5',
              borderRadius: '8px',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: '10px 20px',
          borderRadius: '8px',
        }}
      >
        <Text size="sm" c="white">
          Position the QR code within the frame to scan
        </Text>
        <Text size="xs" c="dimmed">
          Code must start with: {baseUrl}
        </Text>
      </div>
    </div>
  );
}
