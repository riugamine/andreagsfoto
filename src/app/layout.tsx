// Remove 'use client' as metadata needs to be handled server-side
import { Montserrat } from 'next/font/google'
import { Metadata } from 'next'
import Navigation from '@/components/navigation/Navigation'
import { ThemeProvider } from '@/components/providers/ThemeProviders'
import './globals.css'

const Mont = Montserrat({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://andreagsfoto.com'),
  title: {
    default: 'Andreagsfoto | Fotografía Profesional',
    template: '%s | Andreagsfoto'
  },
  description: 'Fotógrafa profesional especializada en bodas, eventos especiales y retratos en Venezuela. Capturando momentos únicos y memorables con un estilo elegante y natural.',
  keywords: ['fotografía', 'fotografía de bodas', 'fotógrafa profesional', 'fotógrafa Venezuela', 'Andreagsfoto', 'bodas Venezuela', 'fotografía eventos Venezuela'],
  creator: 'Andreagsfoto',
  openGraph: {
    title: 'Andreagsfoto | Fotografía Profesional',
    description: 'Fotógrafa profesional especializada en bodas, eventos especiales y retratos en Venezuela. Capturando momentos únicos y memorables con un estilo elegante y natural.',
    url: 'https://andreagsfoto.com',
    siteName: 'Andreagsfoto',
    images: [
      {
        url: 'https://res.cloudinary.com/da95ksabl/image/upload/v1741961209/ag_logo_yk9ono.png',
        width: 1080,
        height: 1080,
        alt: 'Andreagsfoto - Fotografía Profesional',
        type: 'image/png',
      },
      {
        // Instagram optimized version (1:1 square)
        url: 'https://res.cloudinary.com/da95ksabl/image/upload/c_fill,g_center,h_1080,w_1080/v1741961209/ag_logo_yk9ono.png',
        width: 1080,
        height: 1080,
        alt: 'Andreagsfoto - Fotografía Profesional Instagram',
        type: 'image/png',
      }
    ],
    locale: 'es_VE',
    type: 'website',
  },
  // Add Instagram-specific metadata
  other: {
    'instagram:card': 'summary_large_image',
    'instagram:title': 'Andreagsfoto | Fotografía de Bodas y Eventos',
    'instagram:description': 'Capturando momentos únicos en Venezuela 📸✨',
    'instagram:image': 'https://res.cloudinary.com/da95ksabl/image/upload/c_fill,g_center,h_1080,w_1080/v1741961209/ag_logo_yk9ono.png',
    'instagram:image:alt': 'Andreagsfoto - Fotografía Profesional',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: 'Andrea GS Foto - Fotografía Profesional en Venezuela',
    card: 'summary_large_image',
    description: 'Fotógrafa profesional especializada en bodas, eventos especiales y retratos en Venezuela.',
    images: ['https://res.cloudinary.com/da95ksabl/image/upload/v1741961209/ag_logo_yk9ono.png'],
  },
  // Removido el campo verification ya que usas verificación DNS
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={Mont.className}>
        <ThemeProvider>
          <div className="min-h-screen transition-colors duration-300">
            <Navigation />
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