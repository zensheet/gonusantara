//==========================================
// NAVIGATION, HEADER, & UI LOGIC
//==========================================
const menuToggle = document.querySelector(".menu-toggle");
const navbar = document.querySelector(".navbar");

if (menuToggle && navbar) {
    menuToggle.addEventListener("click", () => {
        navbar.classList.toggle("active");
    });
}

window.addEventListener("scroll", function () {
    const header = document.querySelector(".header");
    if (header && window.scrollY > 50) {
        header.classList.add("sticky");
    } else if (header) {
        header.classList.remove("sticky");
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        const hrefValue = this.getAttribute("href");
        if (hrefValue === "#" || hrefValue === "") return;

        e.preventDefault();
        const target = document.querySelector(hrefValue);
        if (target) {
            target.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});

import { createClient } from 'https://esm.sh/@sanity/client';

const client = createClient({
  projectId: '6mzyi14g',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2026-07-09'
});

// Simpan semua data produk di memori supaya filter tidak perlu fetch ulang
let semuaProduk = [];

async function renderProduk(kategoriAwal = 'all') {
    const grid = document.getElementById('productGrid');
    const filterBar = document.getElementById('filterBar');
    if (!grid) return; // Keluar jika bukan di halaman products.html

    // 1. Fetch kategori dari Sanity → buat tombol filter secara otomatis
    if (filterBar) {
        const categories = await client.fetch(
            `*[_type == "category"] | order(sortOrder asc) { title, "slug": slug.current }`
        );

        // Tambahkan tombol per kategori dari Sanity
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.textContent = cat.title;
            btn.setAttribute('data-slug', cat.slug);
            btn.onclick = function() { filterByCategory(cat.slug, this); };
            filterBar.appendChild(btn);
        });

        // Tandai tombol aktif sesuai URL
        filterBar.querySelectorAll('button').forEach(btn => {
            const s = btn.getAttribute('data-slug') || 'all';
            if (s === kategoriAwal) btn.classList.add('active');
            else btn.classList.remove('active');
        });

        // Isi juga footer category list jika ada
        const footerList = document.getElementById('footerCatList');
        if (footerList) {
            categories.forEach(cat => {
                const li = document.createElement('li');
                li.innerHTML = `<a href="products.html?category=${cat.slug}">${cat.title}</a>`;
                footerList.appendChild(li);
            });
        }
    }

    // 2. Fetch semua produk SEKALI
    semuaProduk = await client.fetch(`*[_type == "product"] | order(sortOrder asc) {
        name, shortDescription,
        "slug": slug.current,
        "imageUrl": mainImage.asset->url,
        "category": category->slug.current
    }`);

    // 3. Tampilkan produk sesuai kategori awal
    tampilkanProduk(kategoriAwal, grid);
}

// Fungsi tampilkan produk di grid (tanpa fetch ulang)
function tampilkanProduk(kategoriDipilih, grid) {
    if (!grid) grid = document.getElementById('productGrid');
    if (!grid) return;

    const dataTampil = kategoriDipilih === 'all'
        ? semuaProduk
        : semuaProduk.filter(p => p.category === kategoriDipilih);

    if (dataTampil.length === 0) {
        grid.innerHTML = `<p style="text-align:center; color:#999; padding:40px; grid-column:1/-1;">Belum ada produk di kategori ini.</p>`;
        return;
    }

    grid.innerHTML = dataTampil.map(p => `
        <a href="product-detail.html?slug=${p.slug}">
            <div class="product-card">
                ${p.imageUrl ? `<img src="${p.imageUrl}" style="width:100%; height:200px; object-fit:cover; border-radius:8px;">` : ''}
                <h3 style="margin-top:12px; color:#0B3D91; font-size:16px;">${p.name}</h3>
                <p style="font-size:14px; color:#666; margin-top:6px;">${p.shortDescription || ''}</p>
            </div>
        </a>
    `).join('');
}

// Fungsi filter yang dipanggil tombol (global supaya inline onclick bisa pakai)
function filterByCategory(slug, el) {
    // Update class active
    document.querySelectorAll('#filterBar button').forEach(b => b.classList.remove('active'));
    if (el) el.classList.add('active');
    tampilkanProduk(slug);
}
window.filterByCategory = filterByCategory;


// Fungsi render detail khusus untuk product-detail.html
async function renderDetailProduk() {
    const detailContainer = document.getElementById('productDetail');
    if (!detailContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    if (!slug) {
        detailContainer.innerHTML = "<p>Produk tidak ditemukan.</p>";
        return;
    }

    try {
        const product = await client.fetch(`*[_type == "product" && slug.current == $slug][0]{
            name, 
            shortDescription, 
            specifications, 
            application,
            isFeatured,
            body,
            "imageUrl": mainImage.asset->url,
            "galleryUrls": gallery[].asset->url,
            "category": category->title,
            "categorySlug": category->slug.current,
            "brand": brand->name
        }`, { slug });

        if (!product) {
            detailContainer.innerHTML = "<p>Produk tidak ditemukan.</p>";
            return;
        }

        // Import PortableTextToHTML secara dinamis dari ESM
        const { toHTML } = await import('https://esm.sh/@portabletext/to-html');
        const bodyHTML = product.body ? toHTML(product.body) : '';

        // Gallery images HTML
        const galleryHTML = (product.galleryUrls && product.galleryUrls.length > 0) ? `
            <div class="detail-section">
                <h3>Galeri Foto</h3>
                <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap:12px; margin-top:10px;">
                    ${product.galleryUrls.map(url => `<img src="${url}" style="width:100%; border-radius:8px; object-fit:cover; height:110px;">`).join('')}
                </div>
            </div>
        ` : '';

        detailContainer.innerHTML = `
            <a href="products.html${product.categorySlug ? '?category=' + product.categorySlug : ''}" class="detail-back-link">
                <i class="fa-solid fa-arrow-left"></i> Kembali ke Katalog
            </a>
            <div class="product-detail-layout">
                <div class="product-detail-image">
                    ${product.imageUrl ? `<img src="${product.imageUrl}" alt="${product.name}">` : ''}
                    ${galleryHTML}
                </div>
                <div class="product-detail-info">
                    <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
                        <span class="detail-category">${product.category || 'Uncategorized'}</span>
                        ${product.isFeatured ? `<span style="background:#FFF3CD; color:#b45309; font-size:12px; font-weight:700; padding:5px 12px; border-radius:20px; letter-spacing:1px;">⭐ FEATURED</span>` : ''}
                    </div>
                    <h1>${product.name}</h1>
                    ${product.brand ? `<p style="color:#888; font-size:14px; margin:0;">Brand: <strong style="color:#0B3D91;">${product.brand}</strong></p>` : ''}
                    <p class="detail-short-desc">${product.shortDescription || ''}</p>
                    
                    ${bodyHTML ? `
                    <div class="detail-section">
                        <h3>Deskripsi Produk</h3>
                        <div class="portable-text">${bodyHTML}</div>
                    </div>` : ''}
                    
                    ${product.specifications ? `
                    <div class="detail-section">
                        <h3>Spesifikasi Teknis</h3>
                        <p>${product.specifications}</p>
                    </div>` : ''}
                    
                    ${product.application ? `
                    <div class="detail-section">
                        <h3>Aplikasi Penggunaan</h3>
                        <p>${product.application}</p>
                    </div>` : ''}
                    
                    <a href="https://wa.me/6282123968029?text=Halo%20saya%20tertarik%20dengan%20produk%20${encodeURIComponent(product.name)}" class="btn" target="_blank">
                        <i class="fa-brands fa-whatsapp"></i> Request Quotation
                    </a>
                </div>
            </div>
        `;
    } catch (e) {
        console.error(e);
        detailContainer.innerHTML = "<p>Gagal memuat produk.</p>";
    }
}

// Pasang fungsi ke window supaya tombol HTML bisa memanggilnya
window.renderProduk = renderProduk;
window.renderDetailProduk = renderDetailProduk;

// Jalankan saat pertama kali buka
const urlParams = new URLSearchParams(window.location.search);
const autoFilter = urlParams.get('category');
renderProduk(autoFilter || 'all');
renderDetailProduk();