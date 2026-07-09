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

async function renderProduk(kategoriDipilih = 'all') {
    const grid = document.getElementById('productGrid');
    if (!grid) return; // Keluar jika bukan di halaman products.html
    
    // 1. Tarik semua data dari Sanity
    const data = await client.fetch(`*[_type == "product"]{
        name, shortDescription, specifications, application,
        "slug": slug.current,
        "imageUrl": mainImage.asset->url,
        "category": category->slug.current
    }`);

    // 2. Filter data (kumpulkan yang cocok saja)
    const dataTampil = kategoriDipilih === 'all' 
        ? data 
        : data.filter(p => p.category === kategoriDipilih);

    // 3. Hapus apa yang ada di layar, lalu ganti dengan data yang cocok
    grid.innerHTML = dataTampil.map(p => `
        <a href="product-detail.html?slug=${p.slug}" style="text-decoration:none; color:inherit; display:block;">
            <div class="product-card">
                ${p.imageUrl ? `<img src="${p.imageUrl}" style="width:100%;">` : ''}
                <h3>${p.name}</h3>
                <p>${p.shortDescription || '-'}</p>
            </div>
        </a>
    `).join('');
}

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