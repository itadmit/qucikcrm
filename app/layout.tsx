import type { Metadata } from 'next'
import { Noto_Sans_Hebrew, Pacifico } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { BRAND_ICON_SRC } from '@/lib/brand-icon'
import { getSiteUrl } from '@/lib/site-url'

const notoSansHebrew = Noto_Sans_Hebrew({
  subsets: ['hebrew'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-noto-sans-hebrew',
  display: 'swap',
})

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pacifico',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'Quick CRM — מערכת CRM בעברית | מ־₪99 לחודש',
    template: '%s | Quick CRM',
  },
  description:
    'מערכת CRM בעברית לניהול לקוחות ולידים, פרויקטים, משימות, יצירת הצעות מחיר, חשבוניות ותשלומים. בלי מינימום משתמשים — מתחילים מ־₪99 לחודש.',
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    siteName: 'Quick CRM',
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: BRAND_ICON_SRC, type: 'image/svg+xml', sizes: 'any' }],
    shortcut: BRAND_ICON_SRC,
    apple: [{ url: '/apple-icon', sizes: '180x180', type: 'image/png' }],
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafaf7' },
    { media: '(prefers-color-scheme: dark)', color: '#18181b' },
  ],
  appleWebApp: {
    capable: true,
    title: 'Quick CRM',
    statusBarStyle: 'default',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${notoSansHebrew.variable} ${pacifico.variable}`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}

