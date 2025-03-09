'use client'
import { useState } from 'react'
import { bulkUploadImages } from '@/lib/sanity'

export default function BulkImageUpload() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleUpload = async () => {
    if (!files.length) return

    setUploading(true)
    try {
      const images = files.map(file => ({
        file,
        title: file.name.split('.')[0],
        alt: file.name.split('.')[0],
        category: 'uncategorized'
      }))

      await bulkUploadImages(images)
      setFiles([])
      alert('Images uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      alert('Error uploading images')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-4">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
        disabled={uploading}
      />
      <button
        onClick={handleUpload}
        disabled={!files.length || uploading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
      >
        {uploading ? 'Uploading...' : `Upload ${files.length} images`}
      </button>
    </div>
  )
}