"use client";
import Image from "next/image";
import { CldImage } from "next-cloudinary";
import Masonry from "react-masonry-css";
import Modal from "@/components/ui/Modal";
import { useState, useCallback, useEffect } from "react"; // Añadido useEffect

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

export default function MasonryGallery() { // Removida la prop photos
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [sortType, setSortType] = useState("title");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch photos from Cloudinary
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch('/api/cloudinary/list');
        const data = await response.json();
        setPhotos(data.sort((a: Photo, b: Photo) => a.title.localeCompare(b.title)));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching photos:', error);
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  
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
