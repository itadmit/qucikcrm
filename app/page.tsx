import type { Metadata } from 'next'
import HomePageContent from '@/components/marketing/HomePageContent'
import { getSiteUrl } from '@/lib/site-url'

const site = getSiteUrl()

const title =
  'Quick CRM — מערכת CRM בעברית | ניהול לקוחות, פרויקטים והצעות מחיר'

const description =
  'מערכת CRM בעברית לעסקים בישראל: ניהול לקוחות ולידים, ניהול פרויקטים ומשימות, יצירת הצעות מחיר וחשבוניות, תשלומים ואינטגרציות. ממשק מהיר, RTL מלא, ותמיכה מקומית. בקרוב אפליקציה לאייפון ולאנדרואיד.'

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title,
  description,
  keywords: [
    'CRM בעברית',
    'מערכת CRM',
    'ניהול לקוחות',
    'ניהול פרויקטים',
    'הצעות מחיר',
    'יצירת הצעות מחיר',
    'ניהול לידים',
    'Quick CRM',
    'CRM לעסקים קטנים',
    'אפליקציה לאייפון CRM',
    'אפליקציה לאנדרואיד CRM',
  ],
  alternates: {
    canonical: '/',
    languages: { he: '/' },
  },
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    url: site,
    siteName: 'Quick CRM',
    title,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Quick CRM',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    inLanguage: 'he-IL',
    description,
    url: site,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'ILS',
      lowPrice: 89,
      highPrice: 1200,
      offerCount: 3,
      availability: 'https://schema.org/InStock',
    },
    featureList: [
      'ניהול לקוחות ולידים',
      'ניהול פרויקטים ומשימות',
      'יצירת הצעות מחיר וחשבוניות',
      'תשלומים ואינטגרציות',
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePageContent />
    </>
  )
}
