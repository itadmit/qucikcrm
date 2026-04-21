import type { Metadata } from 'next'
import { Noto_Sans_Hebrew, Pacifico } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { getSiteUrl } from '@/lib/site-url'

const notoSansHebrew = Noto_Sans_Hebrew({
  subsets: ['hebrew'],
  weight: ['300', '400', '500', '600', '700'],
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
    default: 'Quick CRM — מערכת CRM בעברית לעסקים',
    template: '%s | Quick CRM',
  },
  description:
    'מערכת CRM בעברית: ניהול לקוחות ולידים, ניהול פרויקטים, משימות, יצירת הצעות מחיר ותשלומים — בממשק אחד מהיר ומותאם לישראל.',
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    siteName: 'Quick CRM',
  },
  robots: { index: true, follow: true },
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

