import MasonryGallery from '@/components/gallery/MansoryGallery'
import { getPhotos } from '@/sanity/lib/queries'
export default async function Home() {
  const photos = await getPhotos()
  return (
    <section className="min-h-screen py-8">
      <MasonryGallery photos={photos} />
    </section>
  )
}