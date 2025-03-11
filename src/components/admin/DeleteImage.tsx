'use client'
import { useEffect, useState } from 'react'
import { CldImage } from "next-cloudinary"
import { toast, Toaster } from 'react-hot-toast'
import Modal from "@/components/ui/Modal"
import { useRouter } from 'next/navigation'

interface Photo {
  _id: string;
  title: string;
  public_id: string;
  width: number;
  height: number;
}
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
  }

export default function DeleteImage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadPhotos = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/cloudinary/list')
        const data = await response.json()
        setPhotos(data || [])
      } catch (error) {
        console.error('Error loading photos:', error)
        toast.error('Error loading photos')
        setPhotos([])
      } finally {
        setIsLoading(false)
      }
    }
    
    loadPhotos()
  }, [])

  const handleDelete = async (photo: Photo) => {
    setSelectedPhoto(photo)
    setIsModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedPhoto) return

    setIsDeleting(true)
    try {
      const response = await fetch("/api/cloudinary/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: selectedPhoto.public_id }),
      })

      if (!response.ok) throw new Error('Failed to delete image')

      setPhotos(photos.filter(p => p._id !== selectedPhoto._id))
      toast.success('Image deleted successfully!')
      router.refresh()
    } catch (error) {
      toast.error('Error deleting image')
      console.error(error)
    } finally {
      setIsDeleting(false)
      setIsModalOpen(false)
      setSelectedPhoto(null)
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Delete Images</h2>
      <Toaster position="top-right" />

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No images found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo._id} className="relative group">
              {photo.public_id && (
                <CldImage
                  src={photo.public_id}
                  width={500}
                  height={300}
                  alt={photo.title || 'Image'}
                  className="w-full h-[300px] object-cover rounded-lg"
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => handleDelete(photo)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  disabled={isDeleting}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmación */}
      {selectedPhoto && isModalOpen && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          type="confirm"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Confirm Deletion
            </h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Are you sure you want to delete this image?
            </p>
            {selectedPhoto.public_id && (
              <div className="mb-4">
                <CldImage
                  src={selectedPhoto.public_id}
                  width={300}
                  height={200}
                  alt={selectedPhoto.title || 'Selected image'}
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 
                         dark:bg-gray-600 dark:hover:bg-gray-700 
                         transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 
                         dark:bg-red-600 dark:hover:bg-red-700 
                         transition-colors"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}