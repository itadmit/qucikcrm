import type { Metadata } from 'next'
import HomePageContent from '@/components/marketing/HomePageContent'
import {
  MARKETING_HERO_IMAGE,
  MARKETING_HERO_IMAGE_ALT,
  MARKETING_HERO_IMAGE_HEIGHT,
  MARKETING_HERO_IMAGE_WIDTH,
} from '@/lib/marketing-hero-image'
import { getSiteUrl } from '@/lib/site-url'

const site = getSiteUrl()

const title =
  'Quick CRM — מערכת CRM בעברית לעסקים קטנים | מ־₪99 לחודש'

const description =
  'Quick CRM היא מערכת CRM בעברית לעסקים קטנים בישראל (עד 10 עובדים): ניהול לקוחות ולידים, ניהול פרויקטים ומשימות, יצירת הצעות מחיר וחשבוניות, תשלומים וסליקה. בלי מינימום משתמשים, מתחילים מ־₪99 לחודש. 14 יום חינם.'

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title,
  description,
  keywords: [
    'CRM לעסקים קטנים',
    'מערכת CRM בעברית',
    'CRM לעצמאים',
    'CRM לפרילנסרים',
    'ניהול לקוחות',
    'ניהול פרויקטים',
    'יצירת הצעות מחיר',
    'הצעות מחיר בעברית',
    'ניהול לידים',
    'תוכנת CRM בישראל',
    'CRM זול',
    'מערכת ניהול עסק',
    'Quick CRM',
    'אפליקציית CRM לאייפון',
    'אפליקציית CRM לאנדרואיד',
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
    images: [
      {
        url: MARKETING_HERO_IMAGE,
        width: MARKETING_HERO_IMAGE_WIDTH,
        height: MARKETING_HERO_IMAGE_HEIGHT,
        alt: MARKETING_HERO_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [MARKETING_HERO_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function HomePage() {
  const softwareLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Quick CRM',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'CRM',
    operatingSystem: 'Web, iOS (coming soon), Android (coming soon)',
    inLanguage: 'he-IL',
    description,
    url: site,
    audience: {
      '@type': 'BusinessAudience',
      audienceType: 'עסקים קטנים עד 10 עובדים, עצמאים, פרילנסרים',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'ILS',
      lowPrice: 99,
      highPrice: 750,
      offerCount: 3,
      availability: 'https://schema.org/InStock',
    },
    featureList: [
      'ניהול לקוחות ולידים בעברית',
      'ניהול פרויקטים ומשימות',
      'יצירת הצעות מחיר וחשבוניות',
      'סליקת אשראי ותשלומים',
      'אוטומציות ותהליכי עבודה',
      'אינטגרציה לחשבשבת',
      'דשבורד וקנבן',
      'תמיכה טלפונית בעברית',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '127',
      bestRating: '5',
      worstRating: '1',
    },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'האם Quick CRM מתאים לעסק של עובד אחד או שניים?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'בהחלט. חבילת סולו מתחילה ב־99 ש״ח לחודש ומיועדת לעצמאים, פרילנסרים ועסקים זעירים, בלי מינימום 3 משתמשים כמו במערכות אחרות.',
        },
      },
      {
        '@type': 'Question',
        name: 'כמה עולה CRM בעברית בישראל?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'המחיר הממוצע בישראל הוא 120 עד 250 ש״ח למשתמש, עם מינימום של 3 עד 10 משתמשים במערכות הפופולריות. ב־Quick CRM: עצמאי משלם 99 ש״ח, עסק של 5 עובדים 375 ש״ח, ו-10 עובדים רק 750 ש״ח לחודש — חיסכון של עד 60% לעומת ממוצע שוק ה־CRM בישראל.',
        },
      },
      {
        '@type': 'Question',
        name: 'האם אפשר ליצור הצעות מחיר וחשבוניות ממערכת אחת?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'כן. Quick CRM מייצרת הצעות מחיר בעיצוב מקצועי, ממירה אותן להזמנה ומפיקה חשבוניות וקבלות מוכרות מס — הכול בממשק אחד בעברית.',
        },
      },
      {
        '@type': 'Question',
        name: 'כמה זמן לוקח להטמיע את המערכת?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'רוב הלקוחות מתחילים לעבוד תוך פחות משעה. הממשק בעברית, יש תבניות מוכנות, ותמיכה טלפונית מקומית שמלווה אותך בכל שלב.',
        },
      },
      {
        '@type': 'Question',
        name: 'האם הנתונים שלי מאובטחים?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'כן. כל המידע מוצפן בתעבורה (TLS) ובאחסון (AES-256), הגיבויים יומיים, והמערכת מאוחסנת בשרתים בישראל ובאירופה בתאימות GDPR.',
        },
      },
      {
        '@type': 'Question',
        name: 'אפשר לבטל בכל רגע?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'בטח. אין חוזה ארוך טווח, אין דמי ביטול, ואפשר לייצא את כל הנתונים בקובץ Excel בלחיצה אחת.',
        },
      },
      {
        '@type': 'Question',
        name: 'יש אפליקציה לנייד?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'אפליקציה ל־iPhone ול־Android בדרך. בינתיים המערכת מותאמת לחלוטין למובייל דרך הדפדפן ואפשר להוסיף אותה למסך הבית.',
        },
      },
    ],
  }

  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Quick CRM',
    url: site,
    logo: `${site}/branding/icon.svg`,
    sameAs: [] as string[],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IL',
      addressLocality: 'תל אביב',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
      />
      <HomePageContent />
    </>
  )
}
