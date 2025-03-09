'use client'
import MasonryGallery from '@/components/gallery/MansoryGallery'
import { getPhotos } from '@/sanity/lib/queries'
export default async function Home() {
  // Temporary mock data - will be replaced with Sanity data
  // const photos = [
  //   {
  //     id: '1',
  //     url: '/images/1.jpg',
  //     alt: 'Sample photo',
  //     width: 800,
  //     height: 600
  //   },
  //   {
  //     id: '2',
  //     url: '/images/2.jpeg',
  //     alt: 'Sample photo 2',
  //     width: 600,
  //     height: 800
  //   },
  //   {
  //     id: '3',
  //     url: '/images/3.jpg',
  //     alt: 'Sample photo 3',
  //     width: 800,
  //     height: 800
  //   }
  // ]
  const photos = await getPhotos()
  return (
    <section className="min-h-screen py-8">
      <MasonryGallery photos={photos} />
    </section>
  )
}