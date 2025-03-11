// Actualizar la importación
import { createClient } from "next-sanity"
import { defineLiveQuery } from '@sanity/preview-kit'
import { client } from './client'

// Exportar directamente el cliente
export const sanityClient = client

export const { useLiveQuery } = defineLiveQuery({ 
  client: client.withConfig({ 
    // Live content is currently only available on the experimental API
    // https://www.sanity.io/docs/api-versioning
    apiVersion: 'vX' 
  }) 
});
