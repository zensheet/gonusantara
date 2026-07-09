export default {
  name: 'product',
  title: 'Produk',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nama Produk',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug (URL Otomatis)',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    },
    {
      name: 'category',
      title: 'Kategori',
      type: 'reference',
      to: [{ type: 'category' }],
    },
    {
      name: 'brand',
      title: 'Brand / Merek',
      type: 'reference',
      to: [{ type: 'brand' }],
    },
    {
      name: 'mainImage',
      title: 'Foto Utama',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'gallery',
      title: 'Galeri Foto',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    },
    {
      name: 'shortDescription',
      title: 'Deskripsi Singkat',
      type: 'text',
    },
    {
      name: 'body',
      title: 'Deskripsi Lengkap',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'specifications',
      title: 'Spesifikasi Teknik',
      type: 'text',
    },
    {
      name: 'application',
      title: 'Aplikasi Penggunaan',
      type: 'text',
    },
    {
      name: 'isFeatured',
      title: 'Featured (Produk Unggulan)',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'sortOrder',
      title: 'Urutan Tampil',
      type: 'number',
    },
  ],
}