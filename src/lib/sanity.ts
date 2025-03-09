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
    const transactions = images.map(async (img) => {
      const asset = await client.assets.upload('image', img.file)
      
      return {
        _type: 'photo',
        title: img.title,
        alt: img.alt,
        category: img.category,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: asset._id
          }
        }
      }
    })

    const documents = await Promise.all(transactions)
    
    // Crear una transacción para múltiples documentos
    const transaction = client.transaction()
    documents.forEach(doc => {
      transaction.create(doc)
    })
    
    return await transaction.commit()
  } catch (error) {
    console.error('Bulk upload error:', error)
    throw error
  }
}