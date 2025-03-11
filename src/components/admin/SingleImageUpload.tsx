'use client'
import { useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import imageCompression from 'browser-image-compression'
import Image from 'next/image';

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const compressionOptions = {
  maxSizeMB: 10,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
}

export default function SingleImageUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const validateFile = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error(`File type ${file.type} is not supported`)
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File is too large. Max size is 10MB`)
    }
  }

  const compressImage = async (file: File) => {
    try {
      if (file.size <= MAX_FILE_SIZE) return file
      const compressedFile = await imageCompression(file, compressionOptions)
      return new File([compressedFile], file.name, { type: compressedFile.type })
    } catch (error) {
      throw new Error(`Error compressing image`)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const selectedFile = e.target.files[0]
        validateFile(selectedFile)
        setFile(selectedFile)
        // Create preview
        setPreview(URL.createObjectURL(selectedFile))
        // Set default title from filename
        setTitle(selectedFile.name.split('.')[0])
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Invalid file selected')
      }
    }
  }

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      toast.error('Please select an image and provide a title')
      return
    }

    setUploading(true)
    try {
      const compressedFile = await compressImage(file)
      const formData = new FormData()
      formData.append('file', compressedFile)
      formData.append('upload_preset', 'andreagsfoto')
      formData.append('public_id', title.trim())

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!response.ok) throw new Error('Upload failed')
      
      toast.success('Image uploaded successfully!')
      setFile(null)
      setTitle('')
      setPreview(null)
    } catch (error) {
      toast.error('Error uploading image')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Single Image Upload</h2>
      <Toaster position="top-right" />
      
      {/* Preview */}
      {preview && (
        <div className="mb-4">
          <Image
            src={preview}
            alt="Preview"
            width={200}
            height={200}
            className="mt-4 rounded-lg"
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}

      {/* Title Input */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Image title"
        className="w-full p-2 mb-4 border rounded"
        disabled={uploading}
      />

      {/* File Input */}
      <input
        type="file"
        accept={ALLOWED_TYPES.join(',')}
        onChange={handleFileChange}
        className="mb-4 w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 
                 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 
                 hover:file:bg-blue-100"
        disabled={uploading}
      />

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading || !title.trim()}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 
                 hover:bg-blue-600 transition-colors"
      >
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>
    </div>
  )
}