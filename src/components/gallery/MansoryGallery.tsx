import Image from 'next/image';
import { CldImage } from 'next-cloudinary';
import Masonry from 'react-masonry-css'
import Modal from '@/components/ui/Modal'
import { useState } from 'react';
interface Photo {
  _id: string
  title: string
  url: string
  alt: string
  width: number
  height: number
  public_id?: string
  image?: {
    asset: {
      url: string
    }
  }
}

interface MasonryGalleryProps {
  photos: Photo[]
}

export default function MasonryGallery({ photos }: MasonryGalleryProps) {
  const [selectedPhoto, setSelectedPhoto]= useState<Photo | null>(null)
  const breakpointColumns = {
    default: 4,
    1536: 4,
    1280: 3,
    1024: 3,
    768: 2,
    640: 1
  }

  const getImageUrl = (photo: Photo) => {
    if (photo.public_id) return photo.public_id
    if (photo.image?.asset.url) return photo.image.asset.url
    return photo.url
  }

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex w-auto -ml-1"
        columnClassName="pl-1 bg-clip-padding"
      >
        {photos.map((photo) => (
          <div 
            key={photo._id} 
            className="mb-1 relative overflow-hidden group cursor-pointer"
            onClick={() => setSelectedPhoto(photo)}
          >
            {photo.public_id ? (
              <CldImage
                src={photo.public_id}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <Image
                src={photo.url}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            )}
          </div>
        ))}
      </Masonry>

      {selectedPhoto && (
        <Modal
          isOpen={!!selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          photo={selectedPhoto}
          photos={photos}
        />
      )}
    </>
  )
}