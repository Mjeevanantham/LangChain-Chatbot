import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LangChain Chatbot',
  description: 'A chatbot built with LangChain and OpenAI',
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


