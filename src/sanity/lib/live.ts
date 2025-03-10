import { createClient } from "next-sanity"
import { client } from './client'

export const sanityClient = client.withConfig({
  apiVersion: '2024-03-13',
  useCdn: false,
  perspective: 'published'
})