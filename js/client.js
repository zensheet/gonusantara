import {createClient} from '@sanity/client'

export const client = createClient({
  projectId: 'YOUR_PROJECT_ID', // Cek di sanity.json atau dashboard Sanity
  dataset: 'production',
  useCdn: true, // set ke true untuk akses lebih cepat
  apiVersion: '2026-07-09', // gunakan tanggal hari ini
})