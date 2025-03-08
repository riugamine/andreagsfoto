'use client'
import MasonryGallery from '@/components/gallery/MansoryGallery'

export default function Home() {
  // Temporary mock data - will be replaced with Sanity data
  const photos = [
    {
      id: '1',
      url: '/placeholder.jpg',
      alt: 'Sample photo',
      width: 800,
      height: 600
    },
    {
      id: '2',
      url: '/placeholder-2.jpg',
      alt: 'Sample photo 2',
      width: 600,
      height: 800
    },
    {
      id: '3',
      url: '/placeholder-3.jpg',
      alt: 'Sample photo 3',
      width: 800,
      height: 800
    }
  ]

  return (
    <section className="min-h-screen py-8">
      <MasonryGallery photos={photos} />
    </section>
  )
}