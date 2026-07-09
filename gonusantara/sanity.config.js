import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes' // <--- Memastikan jalurnya ke folder schemaTypes yang benar

export default defineConfig({
  name: 'default',
  title: 'Go Nusantara',

  projectId: '6mzyi14g', // ID proyek Anda sesuai log console tadi
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})