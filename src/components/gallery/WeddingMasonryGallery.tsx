"use client";
import Image from "next/image";
import { CldImage } from "next-cloudinary";
import Masonry from "react-masonry-css";
import Modal from "@/components/ui/Modal";
import { useState, useCallback, useEffect } from "react";

interface Photo {
  _id: string;
  title: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  public_id: string;
  uploadDate: string;
}

export default function WeddingMasonryGallery() {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch wedding photos from Cloudinary
  useEffect(() => {
    const fetchWeddingPhotos = async () => {
      try {
        const response = await fetch('/api/cloudinary/wedding-list');
        const data = await response.json();
        
        // Ordenar por fecha de carga (uploadDate)
        const sortedPhotos = [...data].sort((a, b) => {
          // Ordenar de más antiguo a más reciente
          return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
        });
        
        setPhotos(sortedPhotos);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching wedding photos:', error);
        setIsLoading(false);
      }
    };

    fetchWeddingPhotos();
  }, []);

  const breakpointColumns = {
    default: 4,
    1536: 4,
    1280: 3,
    1024: 3,
    768: 2,
    640: 2,
  };
  
  const handleImageLoad = useCallback((id: string) => {
    setLoadedImages((prev) => new Set(prev).add(id));
  }, []);

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex w-auto -ml-1"
        columnClassName="pl-1 bg-clip-padding"
      >
        {photos.map((photo, index) => (
          <div
            key={photo._id}
            className="mb-1 relative overflow-hidden group cursor-pointer"
            onClick={() => setSelectedPhoto(photo)}
          >
            {!loadedImages.has(photo._id) && (
              <div className="w-full aspect-[3/4] bg-gray-200 dark:bg-gray-700 animate-pulse rounded-sm" />
            )}
            {photo.public_id ? (
              <>
                <CldImage
                  src={photo.public_id}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  priority={index < 4}
                  className={`w-full h-auto transition-transform duration-300 group-hover:scale-105 ${
                    loadedImages.has(photo._id) ? "opacity-100" : "opacity-0"
                  }`}
                  loading={index < 4 ? "eager" : "lazy"}
                  onLoadingComplete={() => handleImageLoad(photo._id)}
                />
              </>
            ) : (
              <Image
                src={photo.url}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                priority={index < 4}
                className={`w-full h-auto transition-transform duration-300 group-hover:scale-105 ${
                  loadedImages.has(photo._id) ? "opacity-100" : "opacity-0"
                }`}
                loading={index < 4 ? "eager" : "lazy"}
                onLoadingComplete={() => handleImageLoad(photo._id)}
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
  );
}