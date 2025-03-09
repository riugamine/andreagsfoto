'use client'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import Link from 'next/link'
import { useState } from 'react'
import './globals.css'

const Mont = Montserrat({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Andrea GS Foto',
  description: 'Photography Portfolio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <html lang="en">
      <body className={Mont.className}>
        <header className="py-6 px-4">
          <nav className="container mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-bold text-center tracking-[0.3em]">
              ANDREAGSFOTO
            </h1>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="tracking-[0.2em] hover:text-gray-600 transition-colors">
                HOME
              </Link>
              <Link href="/about" className="tracking-[0.2em] hover:text-gray-600 transition-colors">
                ABOUT
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </nav>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-20 left-0 right-0 bg-black shadow-lg z-50">
              <div className="flex flex-col space-y-4 p-4">
                <Link 
                  href="/" 
                  className="tracking-[0.2em] hover:text-gray-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  HOME
                </Link>
                <Link 
                  href="/about" 
                  className="tracking-[0.2em] hover:text-gray-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ABOUT
                </Link>
              </div>
            </div>
          )}
        </header>
        <main className="container mx-auto px-4">
          {children}
        </main>
        <footer className="py-6 text-center text-white-600">
          <p>© {new Date().getFullYear()} Andrea GS Foto</p>
        </footer>
      </body>
    </html>
  )
}