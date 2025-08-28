import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { NavigationBar } from '@/components/navbar/navigationBar'

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'Jayob',
  description: 'AI Powered Job Applications',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider signInUrl="/auth/sign-in" signUpUrl="/auth/sign-up">
      <html lang="en">
        <head>
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        </head>

        <body className={`${roboto.variable} antialiased`}>
          <NavigationBar />

          <main className="flex flex-col items-center">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  )
}
