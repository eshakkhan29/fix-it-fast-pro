'use client';

import { Badge } from '@mantine/core';
import { Icon } from '@iconify/react';
import React from 'react';

export function getTimeAgoBadge(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();

  const diffInMs = now.getTime() - date.getTime();
  const isPast = diffInMs > 0;
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const diff = Math.abs(diffInMs);

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  const remainingDays = days % 30;
  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;

  const parts: string[] = [];

  if (years) parts.push(`${years} year${years > 1 ? 's' : ''}`);
  if (months && years < 1)
    parts.push(`${months} month${months > 1 ? 's' : ''}`);
  if (remainingDays && years < 1 && months < 1)
    parts.push(`${remainingDays} day${remainingDays > 1 ? 's' : ''}`);
  if (remainingHours && years < 1 && months < 1 && days < 1)
    parts.push(`${remainingHours} hr${remainingHours > 1 ? 's' : ''}`);
  if (remainingMinutes && years < 1 && months < 1 && days < 1 && hours < 1)
    parts.push(`${remainingMinutes} min${remainingMinutes > 1 ? 's' : ''}`);
  if (!years && !months && !days && !hours && !minutes)
    parts.push(`${remainingSeconds} sec${remainingSeconds > 1 ? 's' : ''}`);

  const timeText = parts.slice(0, 2).join(' ');
  const label = isPast ? `${timeText} ago` : `in ${timeText}`;

  // 🎨 Choose color
  let color = 'green.6'; // future
  if (isToday) color = 'yellow.6'; // today
  if (isPast && !isToday) color = 'red.6'; // past

  return (
    <Badge
      color={color}
      variant="outline"
      radius="xl"
      leftSection={<Icon icon="oui:dot" />}
    >
      {label}
    </Badge>
  );
}
