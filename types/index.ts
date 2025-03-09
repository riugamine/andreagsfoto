export interface SanityImage {
    _type: 'image'
    asset: {
      _ref: string
      _type: 'reference'
    }
  }
  
  export interface Photo {
    _id: string
    title: string
    image: SanityImage
    alt: string
    description?: string
    category?: string
  }