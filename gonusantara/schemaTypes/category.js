export default {
  name: 'category',
  title: 'Kategori Produk',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Nama Kategori',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug (URL Otomatis)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'image',
      title: 'Gambar Kategori',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'description',
      title: 'Deskripsi Singkat',
      type: 'text',
    },
    {
      name: 'sortOrder',
      title: 'Urutan Tampil',
      type: 'number',
      description: 'Angka lebih kecil akan muncul lebih awal (contoh: 1, 2, 3)',
    },
  ],
}