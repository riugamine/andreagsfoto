import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-09',
  useCdn: true,
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN_2
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

interface BulkImageUpload {
  file: File
  alt: string
  title: string
  category?: string
}

export async function bulkUploadImages(images: BulkImageUpload[]) {
  try {
    const transactions = await Promise.all(images.map(async (img) => {
      const formData = new FormData()
      formData.append('file', img.file)
      formData.append('upload_preset', 'andreagsfoto')

      // Subir a Cloudinary con verificación
      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      ).then(res => res.json())

      if (!cloudinaryRes.public_id) {
        console.error('Cloudinary upload failed:', cloudinaryRes)
        throw new Error(`Cloudinary upload failed: ${cloudinaryRes.error?.message || 'Unknown error'}`)
      }


      // Subir a Sanity
      const asset = await client.assets.upload('image', img.file)
      
      return {
        _type: 'photo',
        title: img.title,
        alt: img.alt,
        category: img.category,
        public_id: cloudinaryRes.public_id,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: asset._id
          }
        }
      }
    }))
    
    const transaction = client.transaction()
    transactions.forEach(doc => {
      transaction.create(doc)
    })
    
    return await transaction.commit()
  } catch (error) {
    console.error('Bulk upload error:', error)
    throw error
  }
}