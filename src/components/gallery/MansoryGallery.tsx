import Image from 'next/image';
import { CldImage } from 'next-cloudinary';
import Masonry from 'react-masonry-css'

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
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex w-auto -ml-4"
      columnClassName="pl-4 bg-clip-padding"
    >
      {photos.map((photo) => (
        <div 
          key={photo._id } 
          className="mb-4 relative overflow-hidden group"
        >
          {photo.public_id ? (
            <CldImage
              src={photo.public_id}
              alt={photo.alt || photo.title}
              width={photo.width}
              height={photo.height}
              className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <Image
              src={getImageUrl(photo)}
              alt={photo.alt || photo.title}
              width={photo.width}
              height={photo.height}
              className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          )}
        </div>
      ))}
    </Masonry>
  )
}