'use client'
import { useState } from 'react'
import { bulkUploadImages } from '@/lib/sanity'
import { toast, Toaster } from 'react-hot-toast'
import imageCompression from 'browser-image-compression'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const compressionOptions = {
  maxSizeMB: 4,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
}

export default function BulkImageUpload() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)

  const validateFile = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error(`File type ${file.type} is not supported`)
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File ${file.name} is too large. Max size is 5MB`)
    }
  }

  const compressImage = async (file: File) => {
    try {
      if (file.size <= MAX_FILE_SIZE) {
        return file
      }

      const compressedFile = await imageCompression(file, compressionOptions)
      
      // Crear un nuevo File con el mismo nombre
      return new File([compressedFile], file.name, {
        type: compressedFile.type,
      })
    } catch (error) {
      throw new Error(`Error compressing ${file.name}`)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      try {
        const selectedFiles = Array.from(e.target.files)
        selectedFiles.forEach(validateFile)
        setFiles(selectedFiles)
        setProgress(0)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Invalid file selected', { duration: 2000 })
      }
    }
  }

  const handleUpload = async () => {
    if (!files.length) return

    setUploading(true)
    setProgress(0)
    setUploadComplete(false)

    try {
      const totalFiles = files.length
      const compressedFiles = await Promise.all(
        files.map(async (file) => {
          const compressed = await compressImage(file)
          return {
            file: compressed,
            title: file.name.split('.')[0],
            alt: file.name.split('.')[0],
            category: 'fotografia'
          }
        })
      )

      for (let i = 0; i < compressedFiles.length; i++) {
        await bulkUploadImages([compressedFiles[i]])
        setProgress(((i + 1) / totalFiles) * 100)
      }

      setFiles([])
      setUploadComplete(true)
      toast.success('Images uploaded successfully!', { duration: 2000 })
      setTimeout(() => setUploadComplete(false), 2000)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : 'Error uploading images', { duration: 2000 })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-4">
      <Toaster position="top-right" />
      <input
        type="file"
        multiple
        accept={ALLOWED_TYPES.join(',')}
        onChange={handleFileChange}
        className="mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        disabled={uploading}
      />
      <div className="text-sm text-gray-500 mb-2">
        Supported formats: JPG, PNG, WebP (max 5MB)
      </div>
      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {uploadComplete && (
        <div className="flex items-center gap-2 text-green-600 mb-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Upload completed successfully!</span>
        </div>
      )}
      <button
        onClick={handleUpload}
        disabled={!files.length || uploading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600 transition-colors"
      >
        {uploading ? `Uploading... ${Math.round(progress)}%` : `Upload ${files.length} images`}
      </button>
    </div>
  )
}