"use client";
import Image from "next/image";
import { CldImage } from "next-cloudinary";
import Masonry from "react-masonry-css";
import Modal from "@/components/ui/Modal";
import { useState, useCallback } from "react";

interface Photo {
  _id: string;
  title: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  public_id?: string;
  uploadDate?: string;
  image?: {
    asset: {
      url: string;
    };
  };
}

interface MasonryGalleryProps {
  photos: Photo[];
}

export default function MasonryGallery({
  photos: initialPhotos,
}: MasonryGalleryProps) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [photos, setPhotos] = useState(
    [...initialPhotos].sort((a, b) => a.title.localeCompare(b.title))
  );
  const [sortType, setSortType] = useState("title");
  
  const breakpointColumns = {
    default: 4,
    1536: 4,
    1280: 3,
    1024: 3,
    768: 2,
    640: 2,
  };
  const handleSort = useCallback(
    (type: string) => {
      setSortType(type);
      const sortedPhotos = [...photos].sort((a, b) => {
        switch (type) {
          case "title":
            return a.title.localeCompare(b.title);
          case "newest":
            return b.public_id?.localeCompare(a.public_id || "") || 0;
          case "oldest":
            return a.public_id?.localeCompare(b.public_id || "") || 0;
          default:
            return 0;
        }
      });
      setPhotos(sortedPhotos);
    },
    [photos]
  );
  const handleImageLoad = useCallback((id: string) => {
    setLoadedImages((prev) => new Set(prev).add(id));
  }, []);

  return (
    <>
      <div>
        <div className="mb-4 flex justify-end relative">
          <select
            onChange={(e) => handleSort(e.target.value)}
            className="appearance-none px-6 py-2.5 pr-10 border border-gray-200 rounded-lg bg-white 
    dark:bg-gray-800 dark:border-gray-700 dark:text-white
    text-sm font-medium text-gray-700 dark:text-gray-200
    shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700
    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
    transition-all duration-200 ease-in-out
    cursor-pointer"
          >
            <option value="title" className="py-2">
              Por título
            </option>
            <option value="newest" className="py-2">
              Más recientes
            </option>
            <option value="oldest" className="py-2">
              Más antiguas
            </option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
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
                <CldImage
                  src={photo.public_id}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  priority={index < 4} // Añadir prioridad a las primeras 4 imágenes
                  className={`w-full h-auto transition-transform duration-300 group-hover:scale-105 ${
                    loadedImages.has(photo._id) ? "opacity-100" : "opacity-0"
                  }`}
                  loading={index < 4 ? "eager" : "lazy"} // Carga inmediata para las primeras 4 imágenes
                  onLoadingComplete={() => handleImageLoad(photo._id)}
                />
              ) : (
                <Image
                  src={photo.url}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  priority={index < 4} // Añadir prioridad a las primeras 4 imágenes
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
      </div>
      {selectedPhoto && (
        <Modal
          isOpen={!!selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          photo={selectedPhoto}
          photos={photos}
          // type="gallery" no es necesario especificarlo ya que es el valor por defecto
        />
      )}
    </>
  );
}
