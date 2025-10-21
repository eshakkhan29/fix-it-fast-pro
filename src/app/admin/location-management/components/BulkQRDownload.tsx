"use client";

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Button, Group, Modal, Stack, Text, Progress, Alert, Select, TextInput, Textarea, Checkbox, SimpleGrid, Box, Grid, ScrollArea, ActionIcon } from '@mantine/core';
import { Icon } from '@iconify/react';
import JSZip from 'jszip';
import BulkLocationCard from './BulkLocationCard';

interface LocationHierarchy {
  accountId: string;
  assignmentId?: string;
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

interface QRCodeTemplateItem {
  Id: number;
  AssignmentId: number;
  AccountId: number;
  HeaderText: string;
  FooterText: string;
  HeaderBody: string;
  FooterBody: string;
  HeaderPosition: string;
  FooterPosition: string;
  HeaderAlignment: string;
  FooterAlignment: string;
  LocationNamePosition: string;
  Format: string;
  PaperSize: string;
  Rows: number;
  Columns: number;
  CreatedBy: string;
  CreatedOn: string;
}

interface BulkQRDownloadProps {
  selectedItems: SelectedLocation[];
  baseUrl?: string;
  onClose: () => void;
  qrTemplate?: QRCodeTemplateItem | null;
}

const QRCodeTemplate = ({
  qrCodeUrl,
  locationName,
  level,
  fitToCell,
  initialHeaderText,
  initialFooterText,
  initialHeaderBody,
  initialFooterBody,
  initialHeaderAlignment = 'center',
  initialFooterAlignment = 'center',
  initialHeaderPosition = 'top',
  initialFooterPosition = 'bottom',
  initialLocationNamePosition = 'bottom',
  rows = 2,
  cols = 3
}: any) => {
  
  // Calculate scale factor based on grid density
  const getScaleFactor = () => {
    const totalCells = rows * cols;
    if (totalCells <= 4) return 1; // 2x2 or less - full size
    if (totalCells <= 6) return 0.95; // 2x3 or 3x2
    if (totalCells <= 9) return 0.85; // 3x3
    if (totalCells <= 12) return 0.75; // 3x4 or 4x3
    if (totalCells <= 16) return 0.65; // 4x4
    return 0.55; // 5x5 or more
  };

  const scale = getScaleFactor();
  
  // Scaled dimensions - BIGGER QR codes, SMALLER padding
  const qrSize = fitToCell ? 200 * scale : 240 * scale;  // Increased from 160/200
  const headerTitleSize = 16 * scale;  // Slightly smaller text
  const headerBodySize = 13 * scale;
  const locationNameSize = 15 * scale;
  const footerTitleSize = 13 * scale;
  const footerBodySize = 11 * scale;
  const padding = 2 * scale;  // Reduced from 4
  const qrPadding = 8 * scale;  // Reduced from 16
  const gap = 8 * scale;  // Reduced from 12

  const renderHeader = () => (
    <div style={{ width: '100%', padding: `${padding}px` }}>
      <h3 style={{
        margin: 0,
        fontSize: `${headerTitleSize}px`,
        fontWeight: 700,
        color: '#1f2937',
        lineHeight: 1.2,
        textAlign: initialHeaderAlignment,
        width: '100%',
        wordBreak: 'break-word'
      }}>
        {initialHeaderText || level}
      </h3>
      {initialHeaderBody && (
        <p style={{
          margin: `${padding}px 0 0 0`,
          fontSize: `${headerBodySize}px`,
          color: '#4b5563',
          lineHeight: 1.3,
          textAlign: initialHeaderAlignment,
          width: '100%',
          wordBreak: 'break-word'
        }}>
          {initialHeaderBody}
        </p>
      )}
    </div>
  );

  const renderFooter = () => (
    <div style={{ width: '100%', padding: `${padding}px` }}>
      <p style={{
        margin: 0,
        fontSize: `${footerTitleSize}px`,
        fontWeight: 600,
        color: '#374151',
        lineHeight: 1.3,
        textAlign: initialFooterAlignment,
        width: '100%',
        wordBreak: 'break-word'
      }}>
        {initialFooterText}
      </p>
      {initialFooterBody && (
        <p style={{
          margin: `${padding}px 0 0 0`,
          fontSize: `${footerBodySize}px`,
          color: '#6b7280',
          lineHeight: 1.3,
          textAlign: initialFooterAlignment,
          width: '100%',
          wordBreak: 'break-word'
        }}>
          {initialFooterBody}
        </p>
      )}
    </div>
  );

  const renderQRSection = () => (
    <div style={{ textAlign: 'center', padding: `${qrPadding}px`}}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: `${gap}px` }}>
        {initialLocationNamePosition === 'top' && (
          <p style={{
            margin: 0,
            fontSize: `${locationNameSize}px`,
            fontWeight: 500,
            color: '#1f2937',
            wordBreak: 'break-word',
            lineHeight: 1.2
          }}>
            {locationName}
          </p>
        )}

        <img
          src={qrCodeUrl}
          alt={locationName}
          style={{
            width: `${qrSize}px`,
            maxWidth: '100%',
            borderRadius: `${6 * scale}px`,
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
          }}
        />

        {initialLocationNamePosition === 'bottom' && (
          <p style={{
            margin: 0,
            fontSize: `${locationNameSize}px`,
            fontWeight: 500,
            color: '#1f2937',
            wordBreak: 'break-word',
            lineHeight: 1.2
          }}>
            {locationName}
          </p>
        )}
      </div>
    </div>
  );

  const sections = [];

  if (initialHeaderPosition === 'top') {
    sections.push(renderHeader());
  }

  sections.push(renderQRSection());

  if (initialFooterPosition === 'bottom') {
    sections.push(renderFooter());
  }

  if (initialHeaderPosition === 'bottom') {
    sections.push(renderHeader());
  }

  if (initialFooterPosition === 'top') {
    sections.push(renderFooter());
  }

  return (
    // add border here
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
        //  border:'1px solid black'
      }}
    >
      {sections.map((section, idx) => (
        <div key={idx} style={{ width: '100%', }}>
          {section}
        </div>
      ))}
    </div>
  );
};

export function BulkQRDownload({
  selectedItems,
  baseUrl,
  onClose,
  qrTemplate
}: BulkQRDownloadProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dynamicBaseUrl, setDynamicBaseUrl] = useState<string>('');
  const [useGlobalTemplate, setUseGlobalTemplate] = useState(true);
  const [format, setFormat] = useState<'png' | 'pdf' | 'jpg'>('pdf');
  const [paperSize, setPaperSize] = useState<'a4' | 'letter' | 'legal' | 'a3'>('a4');
  const [headerText, setHeaderText] = useState<string>('Location');
  const [headerBody, setHeaderBody] = useState<string>('');
  const [footerText, setFooterText] = useState<string>('Scan to access location');
  const [footerBody, setFooterBody] = useState<string>('');
  const [headerAlignment, setHeaderAlignment] = useState<'left' | 'center' | 'right'>('center');
  const [footerAlignment, setFooterAlignment] = useState<'left' | 'center' | 'right'>('center');
  const [headerPosition, setHeaderPosition] = useState<'top' | 'bottom'>('top');
  const [footerPosition, setFooterPosition] = useState<'top' | 'bottom'>('bottom');
  const [locationNamePosition, setLocationNamePosition] = useState<'top' | 'bottom'>('bottom');
  const [rows, setRows] = useState<number>(2);
  const [cols, setCols] = useState<number>(3);

  const [currentPageItems, setCurrentPageItems] = useState<Array<{ name: string; level: string; dataUrl: string }>>([]);
  const hiddenContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (qrTemplate) {
      const templateFormat = qrTemplate.Format.toLowerCase();
      if (templateFormat === 'pdf' || templateFormat === 'png' || templateFormat === 'jpg') {
        setFormat(templateFormat as 'png' | 'pdf' | 'jpg');
      }

      const templatePaperSize = qrTemplate.PaperSize.toLowerCase();
      if (templatePaperSize === 'a4' || templatePaperSize === 'letter' || templatePaperSize === 'legal' || templatePaperSize === 'a3') {
        setPaperSize(templatePaperSize as 'a4' | 'letter' | 'legal' | 'a3');
      }

      setHeaderText(qrTemplate.HeaderText);
      setHeaderBody(qrTemplate.HeaderBody);
      setFooterText(qrTemplate.FooterText);
      setFooterBody(qrTemplate.FooterBody);

      const templateHeaderAlignment = qrTemplate.HeaderAlignment.toLowerCase();
      if (templateHeaderAlignment === 'left' || templateHeaderAlignment === 'center' || templateHeaderAlignment === 'right') {
        setHeaderAlignment(templateHeaderAlignment as 'left' | 'center' | 'right');
      }

      const templateFooterAlignment = qrTemplate.FooterAlignment.toLowerCase();
      if (templateFooterAlignment === 'left' || templateHeaderAlignment === 'center' || templateHeaderAlignment === 'right') {
        setFooterAlignment(templateFooterAlignment as 'left' | 'center' | 'right');
      }

      const templateHeaderPosition = qrTemplate.HeaderPosition.toLowerCase();
      if (templateHeaderPosition === 'top' || templateHeaderPosition === 'bottom') {
        setHeaderPosition(templateHeaderPosition as 'top' | 'bottom');
      }

      const templateFooterPosition = qrTemplate.FooterPosition.toLowerCase();
      if (templateFooterPosition === 'top' || templateFooterPosition === 'bottom') {
        setFooterPosition(templateFooterPosition as 'top' | 'bottom');
      }

      const templateLocationNamePosition = qrTemplate.LocationNamePosition.toLowerCase();
      if (templateLocationNamePosition === 'top' || templateLocationNamePosition === 'bottom') {
        setLocationNamePosition(templateLocationNamePosition as 'top' | 'bottom');
      }

      setRows(Math.min(Math.max(qrTemplate.Rows, 1), 5));
      setCols(Math.min(Math.max(qrTemplate.Columns, 1), 5));
    }
  }, [qrTemplate]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = baseUrl || `${window.location.protocol}//${window.location.host}`;
      setDynamicBaseUrl(url);
    }
  }, [baseUrl]);

  const generateQRUrl = (hierarchy: LocationHierarchy) => {
    const params = new URLSearchParams();

    if (hierarchy.accountId) params.append('accountId', hierarchy.accountId);
    if (hierarchy.assignmentId) params.append('assignmentId', hierarchy.assignmentId);
    if (hierarchy.campusId) params.append('campusId', hierarchy.campusId);
    if (hierarchy.buildingId) params.append('buildingId', hierarchy.buildingId);
    if (hierarchy.floorId) params.append('floorId', hierarchy.floorId);
    if (hierarchy.areaId) params.append('areaId', hierarchy.areaId);
    if (hierarchy.roomId) params.append('roomId', hierarchy.roomId);
    const currentBaseUrl = dynamicBaseUrl || (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : '');
    const finalUrl = `${currentBaseUrl}/create-incident?${params.toString()}`;
    return finalUrl;
  };

  const generateQRCodeDataUrl = async (url: string): Promise<string> => {
    return QRCode.toDataURL(url, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
  };

  const sizeToPixels: Record<string, { width: number; height: number }> = {
    a4: { width: 794, height: 1123 },
    letter: { width: 816, height: 1056 },
    a3: { width: 1123, height: 1587 },
    legal: { width: 816, height: 1344 }
  };

  const downloadBulkQRCodes = async () => {
    if (selectedItems.length === 0) return;

    const invalidItems = selectedItems.filter(item => !item.hierarchy.accountId || item.hierarchy.accountId === '');
    if (invalidItems.length > 0) {
      setError('Some items have invalid account information. Please refresh the page and try again.');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setError(null);

    try {
      const zip = new JSZip();
      const total = selectedItems.length;
      const failedItems: string[] = [];
      const { width, height } = sizeToPixels[paperSize];
      const itemsPerPage = Math.max(1, rows * cols);

      let pdfDoc: any = null;
      if (format === 'pdf') {
        const { jsPDF } = await import('jspdf');
        pdfDoc = new jsPDF({ unit: 'px', format: [width, height] });
      }

      for (let pageStart = 0, pageIndex = 0; pageStart < total; pageStart += itemsPerPage, pageIndex++) {
        const pageItems = selectedItems.slice(pageStart, Math.min(pageStart + itemsPerPage, total));

        try {
          const pageDataUrls = await Promise.all(
            pageItems.map(async (item) => {
              const url = generateQRUrl(item.hierarchy);
              const dataUrl = await generateQRCodeDataUrl(url);
              return { name: item.name, level: item.level, dataUrl };
            })
          );

          setCurrentPageItems(pageDataUrls);
          await new Promise((r) => setTimeout(r, 50));

          const html2canvas = (await import('html2canvas')).default as unknown as (el: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;
          const gridEl = hiddenContainerRef.current?.querySelector('[data-grid-container]') as HTMLElement | null;
          if (!gridEl) throw new Error('Grid container not found');

          const canvas = await html2canvas(gridEl, {
            backgroundColor: '#ffffff',
            scale: 2,
            width,
            height,
            useCORS: true,
            allowTaint: true,
          });

          if (format === 'png' || format === 'jpg') {
            const imageType = format === 'png' ? 'image/png' : 'image/jpeg';
            const imageDataUrl = canvas.toDataURL(imageType);
            const fileName = `qr-page-${pageIndex + 1}.${format}`;
            zip.file(fileName, imageDataUrl.split(',')[1], { base64: true });
          } else if (pdfDoc) {
            if (pageIndex > 0) pdfDoc.addPage([width, height], 'portrait');
            pdfDoc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, width, height);
          }

          setProgress((Math.min(pageStart + itemsPerPage, total) / total) * 100);
        } catch (_pageErr) {
          failedItems.push(...pageItems.map((i) => i.name));
        }
      }

      if (format === 'pdf' && pdfDoc) {
        const pdfBlob = pdfDoc.output('blob');
        const pdfArrayBuffer = await pdfBlob.arrayBuffer();
        zip.file('qr-pages.pdf', pdfArrayBuffer);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `qr-codes-${new Date().toISOString().split('T')[0]}.zip`;
      link.click();
      URL.revokeObjectURL(link.href);

      if (failedItems.length > 0) {
        setError(`Some items failed: ${failedItems.join(', ')}`);
        setTimeout(() => setError(null), 5000);
      } else {
        onClose();
      }
    } catch (_err) {
      setError('Failed to generate QR codes. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Modal
      opened={selectedItems.length > 0}
      withCloseButton={false}
      onClose={onClose}
      size="xxl"
      centered
      closeOnClickOutside={!isGenerating}
      closeOnEscape={!isGenerating}
      className='!relative'
    >
      <ActionIcon variant="default" radius="xl" onClick={onClose} className='!absolute !top-1 !right-1'>
        <Icon icon="material-symbols:close-rounded" />
      </ActionIcon>

      <Grid>
        <Grid.Col span={{ base: 12, md: 6, lg: 7 }} p={0}>
          <Box p={15} className='!border-b-1 md:!border-r-1 !border-[#F6F6F6]'>
            <Text fw={500} fz={18}>Bulk QR Code Download</Text>
            <Text size="sm" c='dimmed'>
              Generate and download QR codes for {selectedItems.length} selected location{selectedItems.length !== 1 ? 's' : ''}:
            </Text>
          </Box>
          <Stack gap="md" className='md:!border-r-1 !border-[#F6F6F6]'>
            <Stack gap="sm" p={15}>
              <Box>
                <Checkbox
                  label="Use Global Template"
                  checked={useGlobalTemplate}
                  onChange={(e) => setUseGlobalTemplate(e.currentTarget.checked)}
                />
                
              </Box>
              <Group gap={5} >
                <Text fw={500}>Note:</Text>
                <Text size='sm' c="dimmed">You can make changes while downlaoding but changes will not be saved to global template</Text>
              </Group>
              <SimpleGrid
                cols={{ base: 2, md: 4 }}
                spacing="sm"
              >
                <Select
                  label="Format"
                  value={format}
                  onChange={(v) => setFormat((v as 'png' | 'pdf' | 'jpg') ?? 'pdf')}
                  data={[
                    { value: 'pdf', label: 'PDF' },
                    { value: 'png', label: 'PNG' },
                    { value: 'jpg', label: 'JPG' }
                  ]}
                  style={{ width: '100%' }}
                />
                <Select
                  label="Paper Size"
                  value={paperSize}
                  onChange={(v) => setPaperSize((v as 'a4' | 'letter' | 'legal' | 'a3') ?? 'a4')}
                  data={[
                    { value: 'a4', label: 'A4' },
                    { value: 'letter', label: 'Letter' },
                    { value: 'legal', label: 'Legal' },
                    { value: 'a3', label: 'A3' }
                  ]}
                  style={{ width: '100%' }}
                />
                <Select
                  label="Rows"
                  value={String(rows)}
                  onChange={(v) => setRows(Number(v ?? '2'))}
                  data={[
                    { value: '1', label: '1' },
                    { value: '2', label: '2' },
                    { value: '3', label: '3' },
                    { value: '4', label: '4' },
                    { value: '5', label: '5' }
                  ]}
                  style={{ width: '100%' }}
                />
                <Select
                  label="Columns"
                  value={String(cols)}
                  onChange={(v) => setCols(Number(v ?? '3'))}
                  data={[
                    { value: '1', label: '1' },
                    { value: '2', label: '2' },
                    { value: '3', label: '3' },
                    { value: '4', label: '4' },
                    { value: '5', label: '5' }
                  ]}
                  style={{ width: '100%' }}
                />
              </SimpleGrid>

              {useGlobalTemplate && (
                <Stack gap="xs">
                  <Group grow>
                    <TextInput label="Header Title" value={headerText} onChange={(e) => setHeaderText(e.target.value)} />
                    <Select
                      label="Header Alignment"
                      value={headerAlignment}
                      onChange={(v) => setHeaderAlignment((v as 'left' | 'center' | 'right') ?? 'center')}
                      data={[{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }]}
                    />
                  </Group>
                  <Textarea label="Header Body" value={headerBody} onChange={(e) => setHeaderBody(e.currentTarget.value)} autosize minRows={2} />

                  <Group grow>
                    <TextInput label="Footer Title" value={footerText} onChange={(e) => setFooterText(e.target.value)} />
                    <Select
                      label="Footer Alignment"
                      value={footerAlignment}
                      onChange={(v) => setFooterAlignment((v as 'left' | 'center' | 'right') ?? 'center')}
                      data={[{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }]}
                    />
                  </Group>
                  <Textarea label="Footer Body" value={footerBody} onChange={(e) => setFooterBody(e.currentTarget.value)} autosize minRows={2} />

                  <Group grow>
                    <Select
                      label="Title Position"
                      value={locationNamePosition}
                      onChange={(v) => setLocationNamePosition((v as 'top' | 'bottom') ?? 'bottom')}
                      data={[{ value: 'top', label: 'Above QR Code' }, { value: 'bottom', label: 'Below QR Code' }]}
                    />
                  </Group>
                </Stack>
              )}
            </Stack>

            {isGenerating && (
              <Stack gap="xs">
                <Text size="sm">Generating QR codes...</Text>
                <Progress value={progress} size="sm" />
                <Text size="xs" c="dimmed" ta="center">
                  {Math.round(progress)}% complete
                </Text>
              </Stack>
            )}

            {error && (
              <Alert icon={<Icon icon="mdi:alert-circle" />} color="red">
                {error}
              </Alert>
            )}

            <Group justify="flex-end" px={15}>
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isGenerating}
              >
                Cancel
              </Button>
              <Button
                leftSection={<Icon icon="mdi:download" />}
                onClick={downloadBulkQRCodes}
                loading={isGenerating}
                disabled={selectedItems.length === 0}
              >
                Download ZIP
              </Button>
            </Group>

            {/* Hidden render container for template capture (grid pages) */}
            <div style={{ position: 'absolute', left: -9999, top: -9999 }} ref={hiddenContainerRef}>
              {currentPageItems.length > 0 && (
                <div
                  data-grid-container
                  style={{
                    width: `${sizeToPixels[paperSize].width}px`,
                    height: `${sizeToPixels[paperSize].height}px`,
                    display: 'grid',
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    gridAutoRows: `${Math.floor((sizeToPixels[paperSize].height - 16 - 8 * (rows - 1)) / rows)}px`,
                    gap: '8px',
                    padding: '8px',
                    backgroundColor: '#ffffff',
                    boxSizing: 'border-box'
                  }}
                >
                  {currentPageItems.map((pi, idx) => (
                    <QRCodeTemplate
                      key={idx}
                      qrCodeUrl={pi.dataUrl}
                      locationName={pi.name}
                      level={pi.level}
                      fitToCell
                      initialHeaderText={useGlobalTemplate ? headerText : undefined}
                      initialFooterText={useGlobalTemplate ? footerText : undefined}
                      initialHeaderBody={useGlobalTemplate ? headerBody : undefined}
                      initialFooterBody={useGlobalTemplate ? footerBody : undefined}
                      initialHeaderAlignment={useGlobalTemplate ? headerAlignment : undefined}
                      initialFooterAlignment={useGlobalTemplate ? footerAlignment : undefined}
                      initialHeaderPosition={headerPosition}
                      initialFooterPosition={footerPosition}
                      initialLocationNamePosition={locationNamePosition}
                      rows={rows}
                      cols={cols}
                    />
                  ))}
                </div>
              )}
            </div>
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 5 }} p={0}>
          <Box p={15} className='!border-b-1 !border-[#F6F6F6]'>
            <Text fw={500} fz={18}>
              QR Code Preview
            </Text>
            <Text size="sm" c="dimmed">
              You can see the changes here
            </Text>
          </Box>

          <Stack gap="xs" p={15}>
            <ScrollArea h={480}>
              {selectedItems.map((item) => (
                <BulkLocationCard key={item.id} item={item} />
              ))}
            </ScrollArea>
          </Stack>
        </Grid.Col>
      </Grid>
    </Modal>
  );
}

export default BulkQRDownload;