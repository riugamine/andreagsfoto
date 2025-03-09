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
    url: string
    alt: string
    width: number
    height: number
    public_id?: string
    image?: {
      asset: {
        url: string
      }
    }
  }