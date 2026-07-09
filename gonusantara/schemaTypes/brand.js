export default {
  name: 'brand',
  title: 'Brand / Merek',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nama Brand',
      type: 'string',
    },
    {
      name: 'logo',
      title: 'Logo Brand',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'website',
      title: 'Website Brand',
      type: 'url',
      description: 'Masukkan link lengkap web brand jika ada (contoh: https://www.smcworld.com)',
    },
    {
      name: 'description',
      title: 'Deskripsi Brand',
      type: 'text',
    },
  ],
}