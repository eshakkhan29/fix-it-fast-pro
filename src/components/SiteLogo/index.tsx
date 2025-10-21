import { SITE_LOGO } from '@/constants';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

// --- TYPE TRICK: disallow strings starting with "/"
type NoLeadingSlash<T extends string> = T extends `/${string}`
  ? never // ❌ type error
  : T;

interface SiteLogoProps<T extends string = string> {
  width?: number;
  height?: number;
  className?: string;
  src?: string;
  /**
   * Route without leading slash.
   * Example: "dashboard" ✅
   * "/dashboard" ❌ (type error)
   */
  redirectTo?: NoLeadingSlash<T>;
}

function SiteLogo<T extends string = string>({
  width = 50,
  height = 50,
  className = '',
  src = SITE_LOGO,
  redirectTo,
}: SiteLogoProps<T>) {
  const router = useRouter();
  const logo = '/logo/logo.png';

  return (
    <Image
      onClick={() => router.push(redirectTo ? `/${redirectTo}` : '/')}
      className={cn('object-contain cursor-pointer', className)}
      src={src || logo}
      alt="logo"
      width={width}
      height={height}
    />
  );
}

export default SiteLogo;
