import Image from 'next/image';
import { CldImage } from 'next-cloudinary';
import Masonry from 'react-masonry-css'
import Modal from '@/components/ui/Modal'
import { useState, useEffect } from 'react';
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
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const breakpointColumns = {
    default: 4,
    1536: 4,
    1280: 3,
    1024: 3,
    768: 2,
    640: 2  // Cambiado de 1 a 2 columnas para móvil
  }

  const getImageUrl = (photo: Photo) => {
    if (photo.public_id) return photo.public_id
    if (photo.image?.asset.url) return photo.image.asset.url
    return photo.url
  }

  useEffect(() => {
    // Simular tiempo de carga para el skeleton
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [photos]);

  if (isLoading) {
    return (
      <Masonry
        breakpointCols={{
          default: 4,
          1536: 4,
          1280: 3,
          1024: 3,
          768: 2,
          640: 2  // Aseguramos que el skeleton también use 2 columnas en móvil
        }}
        className="flex w-auto -ml-1"
        columnClassName="pl-1 bg-clip-padding"
      >
        {[...Array(8)].map((_, index) => (
          <div key={index} className="mb-1 relative">
            <div className="w-full aspect-[3/4] bg-gray-200 dark:bg-gray-700 animate-pulse rounded-sm"></div>
          </div>
        ))}
      </Masonry>
    );
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
                onLoadingComplete={() => setIsLoading(false)}
              />
            ) : (
              <Image
                src={photo.url}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onLoadingComplete={() => setIsLoading(false)}
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