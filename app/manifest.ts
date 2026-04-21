import type { MetadataRoute } from 'next'
import { BRAND_ICON_SRC } from '@/lib/brand-icon'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Quick CRM',
    short_name: 'Quick CRM',
    description:
      'מערכת CRM בעברית לעסקים קטנים בישראל (עד 10 עובדים): ניהול לקוחות ולידים, פרויקטים, משימות, הצעות מחיר ותשלומים.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#fafaf7',
    theme_color: '#7c3aed',
    lang: 'he',
    dir: 'rtl',
    icons: [
      {
        src: BRAND_ICON_SRC,
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  }
}
