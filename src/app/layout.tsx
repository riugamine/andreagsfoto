import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Andrea GS Foto',
  description: 'Photography Portfolio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="py-6">
          <h1 className="text-3xl font-bold text-center">Andrea GS Foto</h1>
        </header>
        <main className="container mx-auto px-4">
          {children}
        </main>
        <footer className="py-6 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Andrea GS Foto</p>
        </footer>
      </body>
    </html>
  )
}