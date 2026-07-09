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

//==========================================
// INTEGRASI SANITY (KHUSUS HALAMAN PRODUCTS)
//==========================================
const PROJECT_ID = "6mzyi14g"; 
const DATASET = "production";

const QUERY = encodeURIComponent(`*[_type == "product"]{
  name,
  description,
  technicalSpec,
  "slug": slug.current,
  "category": category->slug.current,
  "imageUrl": mainImage.asset->url
}`);

const SANITY_URL = `https://${PROJECT_ID}.apicdn.sanity.io/v2022-03-07/data/query/${DATASET}?query=${QUERY}`;

async function fetchSanityProducts() {
    // KUNCI UTAMA: Cari ID khusus milik halaman products.html
    const gridContainer = document.getElementById("productGrid");
    
    // JIKA TIDAK KETEMU, BERARTI INI HALAMAN INDEX.HTML. STOP SCRIPT DAN JANGAN MERUSAK APAPAUN!
    if (!gridContainer) {
        console.log("Menjalankan mode halaman index.html (Data Sanity diabaikan).");
        return; 
    }

    try {
        const response = await fetch(SANITY_URL);
        const result = await response.json();
        const products = result.result;

        if (!products || products.length === 0) {
            gridContainer.innerHTML = "<p style='text-align:center; width:100%;'>Belum ada produk di Sanity.</p>";
            return;
        }

        // Jalankan render produk HANYA di halaman yang punya id="productGrid" (products.html)
        gridContainer.innerHTML = products.map(product => {
            const name = product.name || "Produk Tanpa Nama";
            const imageSrc = product.imageUrl || 'images/placeholder.webp';
            const kategoriSlug = product.category ? product.category.trim().toLowerCase() : 'tidak-ada';
            
            const deskripsi = product.description || "Tidak ada deskripsi.";
            const spesifikasi = product.technicalSpec || "Tidak ada spesifikasi teknis.";
            
            return `
                <div class="product-card active" data-category="${kategoriSlug}">
                    <img src="${imageSrc}" alt="${name}">
                    <h3>${name}</h3>
                    <p class="product-desc" style="font-size: 14px; color: #666; margin-top: 5px; line-height: 1.4;">${deskripsi}</p>
                    <div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed #eee; text-align: left;">
                        <strong style="font-size: 12px; color: #333; display: block;">Spesifikasi Teknis:</strong>
                        <span style="font-size: 12px; color: #555; font-style: italic;">${spesifikasi}</span>
                    </div>
                </div>
            `;
        }).join("");

        // ====================================================
        // SISTEM AUTO-FILTER KATEGORI DARI URL PARAMS
        // ====================================================
        const urlParams = new URLSearchParams(window.location.search);
        const autoFilter = urlParams.get('category');
        
        if (autoFilter) {
            // 1. Jalankan filter produk secara langsung berdasarkan data-category
            filterProducts(autoFilter);
            
            // 2. Cari tombol filter yang cocok di products.html untuk diberi class 'active'
            try {
                const buttons = document.querySelectorAll(".filter-buttons button");
                buttons.forEach(btn => {
                    const txt = btn.textContent || btn.innerText || "";
                    const onclickAttr = btn.getAttribute("onclick") || "";
                    
                    if (
                        txt.toLowerCase().includes(autoFilter.replace(/-/g, " ")) || 
                        onclickAttr.toLowerCase().includes(autoFilter.toLowerCase())
                    ) {
                        buttons.forEach(b => b.classList.remove("active"));
                        btn.classList.add("active");
                    }
                });
            } catch (btnErr) {
                console.log("Sinkronisasi tombol filter dilewati:", btnErr);
            }
        }
        // ====================================================

    } catch (error) {
        console.error("Gagal memuat data dari Sanity:", error);
    }
}

document.addEventListener("DOMContentLoaded", fetchSanityProducts);

//==========================================
// FUNGSI FILTER PRODUK (VERSI PASTI JALAN)
//==========================================
function filterProducts(category, el) {
    console.log("Tombol diklik untuk kategori:", category); // Log ini harus muncul di Console F12
    
    const products = document.querySelectorAll("#productGrid .product-card");
    const buttons = document.querySelectorAll(".filter-buttons button");

    // Jika tombol diklik, kasih warna aktif
    if (el) {
        buttons.forEach(btn => btn.classList.remove("active"));
        el.classList.add("active");
    }

    products.forEach(product => {
        const productType = product.getAttribute("data-category") || "";
        const filterType = category ? category.trim().toLowerCase() : "";

        // Logika tampilkan
        if (filterType === "all" || productType === filterType) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
}