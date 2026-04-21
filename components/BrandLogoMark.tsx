import Image from 'next/image'
import { BRAND_ICON_ALT, BRAND_ICON_SRC } from '@/lib/brand-icon'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
  /** מימדים בפיקסלים (ברירת מחדל 32) */
  size?: number
  priority?: boolean
}

export function BrandLogoMark({ className, size = 32, priority }: Props) {
  return (
    <Image
      src={BRAND_ICON_SRC}
      alt={BRAND_ICON_ALT}
      width={size}
      height={size}
      className={cn('shrink-0 block', className)}
      unoptimized
      priority={priority}
    />
  )
}
