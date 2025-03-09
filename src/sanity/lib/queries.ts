import { client } from './client'

export async function getPhotos() {
  return await client.fetch(`
    *[_type == "photo"] {
      _id,
      title,
      "url": image.asset->url,
      alt,
      "width": image.asset->metadata.dimensions.width,
      "height": image.asset->metadata.dimensions.height,
      description,
      category
    }
  `)
}