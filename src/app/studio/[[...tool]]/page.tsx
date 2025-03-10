'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

// Eliminamos metadata y viewport que causan el error
export default function StudioPage() {
  return <NextStudio config={config} />
}
