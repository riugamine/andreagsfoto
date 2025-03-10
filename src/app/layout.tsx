'use client'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import Link from 'next/link'
import { useState } from 'react'
import { ThemeProvider } from '@/components/providers/ThemeProviders'
import ThemeToggle from '@/components/ui/ThemeToogle'
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${Mont.className} `}>
        <ThemeProvider>
        <div className="min-h-screen transition-colors duration-300">
          <header className="py-6 px-4">
            <nav className="container mx-auto flex justify-between items-center">
              <h1 className="text-xl md:text-3xl font-light text-center tracking-[0.3em]">
                ANDREAGSFOTO
              </h1>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/" className="tracking-[0.2em] hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  HOME
                </Link>
                <Link href="/about" className="tracking-[0.2em] hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  ABOUT
                </Link>
                <ThemeToggle />
              </div>

              {/* Mobile Menu Button and Theme Toggle */}
              <div className="md:hidden flex items-center space-x-4">
                <ThemeToggle />
                <button 
                  className="p-2"
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
              </div>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="md:hidden absolute top-20 left-0 right-0 bg-black dark:bg-gray-900 text-white shadow-lg z-50">
                <div className="flex flex-col space-y-4 p-4">
                  <Link 
                    href="/" 
                    className="tracking-[0.2em] hover:text-gray-300 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    HOME
                  </Link>
                  <Link 
                    href="/about" 
                    className="tracking-[0.2em] hover:text-gray-300 transition-colors"
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
          <footer className="py-6 text-center text-gray-600 dark:text-gray-400">
            <p>© {new Date().getFullYear()} ANDREAGSFOTO</p>
          </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}