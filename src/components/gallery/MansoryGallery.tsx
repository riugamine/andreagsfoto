import Image from 'next/image'
import Masonry from 'react-masonry-css'

interface Photo {
  id: string
  url: string
  alt: string
  width: number
  height: number
}

interface MasonryGalleryProps {
  photos: Photo[]
}

export default function MasonryGallery({ photos }: MasonryGalleryProps) {
  const breakpointColumns = {
    default: 4,
    1536: 4,
    1280: 3,
    1024: 3,
    768: 2,
    640: 1
  }

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex w-auto -ml-4"
      columnClassName="pl-4 bg-clip-padding"
    >
      {photos.map((photo) => (
        <div 
          key={photo.id} 
          className="mb-4 relative overflow-hidden group"
        >
          <Image
            src={photo.url}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      ))}
    </Masonry>
  )
}