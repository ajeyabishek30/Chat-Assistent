import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Chat Assistant',
  description: 'A simple web-based chat assistant with conversational UI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

