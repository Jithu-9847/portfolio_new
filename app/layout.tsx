import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Jithu Girish',
  description: 'Professional portfolio of Jithu Girish - A passionate developer specializing in modern web applications and Flutter mobile apps.',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.png',
  },
}

import { SmoothScroll } from '@/components/portfolio/smooth-scroll'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">
        <SmoothScroll>
          {children}
        </SmoothScroll>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
