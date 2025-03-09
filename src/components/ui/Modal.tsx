'use client'
import { useEffect, useState, TouchEvent } from 'react'
import { CldImage } from 'next-cloudinary'
import Image from 'next/image'
import { Photo } from '../../../types'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  photo: Photo
  photos: Photo[]
}

export default function Modal({ isOpen, onClose, photo, photos }: ModalProps) {
  const [currentPhoto, setCurrentPhoto] = useState(photo)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const currentIndex = photos.findIndex(p => p._id === currentPhoto._id)

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1
    setCurrentPhoto(photos[newIndex])
  }

  const handleNext = () => {
    const newIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0
    setCurrentPhoto(photos[newIndex])
  }

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      handleNext()
    }
    if (isRightSwipe) {
      handlePrevious()
    }
    setTouchStart(0)
    setTouchEnd(0)
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') handlePrevious()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentIndex])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        className="relative max-w-7xl max-h-[90vh] w-full"
        onClick={e => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Navigation Buttons */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full z-10 hidden md:block"
          onClick={handlePrevious}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full z-10 hidden md:block"
          onClick={handleNext}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Image */}
        <div className="relative overflow-hidden">
          {currentPhoto.public_id ? (
            <CldImage
              src={currentPhoto.public_id}
              alt={currentPhoto.alt || currentPhoto.title}
              width={currentPhoto.width}
              height={currentPhoto.height}
              className="object-contain max-h-[90vh] mx-auto"
            />
          ) : (
            <Image
              src={currentPhoto.url}
              alt={currentPhoto.alt || currentPhoto.title}
              width={currentPhoto.width}
              height={currentPhoto.height}
              className="object-contain max-h-[90vh] mx-auto"
            />
          )}
        </div>
      </div>
    </div>
  )
}