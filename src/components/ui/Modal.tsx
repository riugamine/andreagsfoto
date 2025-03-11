"use client";
import { useEffect, useState, TouchEvent, useCallback } from "react";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import { Photo } from "../../../types";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  photo?: Photo;
  photos?: Photo[];
  type?: 'gallery' | 'confirm';
}

export default function Modal({ 
  isOpen, 
  onClose, 
  children, 
  photo, 
  photos = [], 
  type = children ? 'confirm' : 'gallery'  // Determinar tipo basado en si hay children
}: ModalProps) {
  if (!isOpen) return null;

  const [currentPhoto, setCurrentPhoto] = useState(photo);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Actualizar currentPhoto cuando cambia la prop photo
  useEffect(() => {
    setCurrentPhoto(photo);
  }, [photo]);

  const handleGalleryNavigation = useCallback(() => {
    if (!currentPhoto || !photos.length) return null;

    const currentIndex = photos.findIndex((p) => p._id === currentPhoto._id);

    const handlePrevious = () => {
      const newIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1;
      setCurrentPhoto(photos[newIndex]);
    };

    const handleNext = () => {
      const newIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0;
      setCurrentPhoto(photos[newIndex]);
    };

    return { handlePrevious, handleNext };
  }, [photos, currentPhoto]);

  // Manejo de gestos táctiles solo para galería
  const handleTouch = type === 'gallery' ? {
    onTouchStart: (e: TouchEvent) => setTouchStart(e.touches[0].clientX),
    onTouchMove: (e: TouchEvent) => setTouchEnd(e.touches[0].clientX),
    onTouchEnd: () => {
      const navigation = handleGalleryNavigation();
      if (!navigation || !touchStart || !touchEnd) return;

      const distance = touchStart - touchEnd;
      if (distance > 50) navigation.handleNext();
      if (distance < -50) navigation.handlePrevious();
      
      setTouchStart(0);
      setTouchEnd(0);
    }
  } : {};

  useEffect(() => {
    if (type !== 'gallery') return;

    const navigation = handleGalleryNavigation();
    if (!navigation) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") navigation.handlePrevious();
      if (e.key === "ArrowRight") navigation.handleNext();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [type, onClose, handleGalleryNavigation]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="relative max-w-7xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()} {...handleTouch}>
        {type === 'gallery' ? (
          // Contenido de galería
          <>
            {/* Botones de navegación */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full z-10 hidden md:block"
              onClick={() => handleGalleryNavigation()?.handlePrevious()}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Imagen */}
            <div className="relative overflow-hidden">
              {currentPhoto?.public_id ? (
                <CldImage
                  src={currentPhoto.public_id}
                  alt={currentPhoto.alt || currentPhoto.title}
                  width={currentPhoto.width}
                  height={currentPhoto.height}
                  className="object-contain max-h-[90vh] mx-auto"
                />
              ) : currentPhoto?.url && (
                <Image
                  src={currentPhoto.url}
                  alt={currentPhoto.alt || currentPhoto.title}
                  width={currentPhoto.width}
                  height={currentPhoto.height}
                  className="object-contain max-h-[90vh] mx-auto"
                />
              )}

              {/* Botones de redes sociales */}
              <div className="absolute bottom-4 right-4 flex gap-3">
                <a
                  href="https://wa.me/+584243091410"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/30 hover:bg-white/50 dark:bg-gray-800/30 dark:hover:bg-gray-800/50 transition-all"
                >
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/andreagsfoto/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/30 hover:bg-white/50 dark:bg-gray-800/30 dark:hover:bg-gray-800/50 transition-all"
                >
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full z-10 hidden md:block"
              onClick={() => handleGalleryNavigation()?.handleNext()}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        ) : (
          // Contenido de confirmación
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
