//========================
// MOBILE MENU
//========================
const menuToggle = document.querySelector(".menu-toggle");
const navbar = document.querySelector(".navbar");

if (menuToggle && navbar) {
    menuToggle.addEventListener("click", () => {
        navbar.classList.toggle("active");
    });
}

// ===========================
// STICKY HEADER
// ===========================
window.addEventListener("scroll", function () {
    const header = document.querySelector(".header");
    if (window.scrollY > 50) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }
});
// ===========================
// SMOOTH SCROLL
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});
// ===========================
// BACK TO TOP
// ===========================
const topBtn = document.getElementById("topBtn");

if (topBtn) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            topBtn.style.display = "block";
        } else {
            topBtn.style.display = "none";
        }
    });

    topBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}
//========================
// CLOSE MENU
//========================
document.querySelectorAll(".navbar a").forEach(link=>{
link.addEventListener("click",()=>{
navbar.classList.remove("active");
});
});
const reveals = document.querySelectorAll(".reveal");
function revealOnScroll() {
    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 100;

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}
window.addEventListener('scroll', revealOnScroll);
revealOnScroll();
function filterProducts(category, el) {
    const products = document.querySelectorAll(".product-card");
    const buttons = document.querySelectorAll(".filter-buttons button");

    // hapus active di semua tombol
    buttons.forEach(btn => btn.classList.remove("active"));

    // aktifkan tombol yang diklik
    el.classList.add("active");

    // filter produk
    products.forEach(product => {
        const type = product.getAttribute("data-category");

        if (category === "all" || type === category) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
}
