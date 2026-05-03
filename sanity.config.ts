import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import * as kingfisherSchemas from './sanity/schemas/kingfisher'

export default defineConfig({
  basePath: '/kingfisher-sanity/studio',
  name: 'kingfisher',
  title: 'Kingfisher Mortgages',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  plugins: [
    structureTool(),
    visionTool(),
  ],
  schema: {
    types: Object.values(kingfisherSchemas),
  },
})
