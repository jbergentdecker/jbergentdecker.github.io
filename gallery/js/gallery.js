/* ════════════════════════════════════════════════════
   GALLERY PAGE  —  gallery.js
   ════════════════════════════════════════════════════ */

// ─── CONFIG ───────────────────────────────────────────
const JSON_PATH = "./data/photos.json";
const IMG_BASE = "../assets/images/gallery/";

// ─── STATE ────────────────────────────────────────────
let photos = [];
let filtered = [];
let activeActivity = "all";
let activeSeason = "all";
let lightbox = null;   // GLightbox instance


/* ════════════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════════════ */

async function loadPhotos() {
    try {
        const res = await fetch(JSON_PATH);
        photos = await res.json();
        filtered = photos;
        renderGrid(filtered);
    } catch (err) {
        console.error("Failed to load photos.json:", err);
    }
}


/* ════════════════════════════════════════════════════
   GRID
   ════════════════════════════════════════════════════ */

function renderGrid(items) {
    const grid = document.getElementById("gallery-grid");
    grid.innerHTML = "";

    items.forEach((photo) => {
        // ── Outer div (keeps the original layout) ──
        const item = document.createElement("div");
        item.classList.add("gallery-item");

        // ── GLightbox anchor wraps the content ──
        const link = document.createElement("a");
        link.href = IMG_BASE + photo.src;
        link.classList.add("glightbox");
        link.dataset.gallery = "gallery-page";
        link.dataset.title = photo.alt;
        link.dataset.description = photo.description;

        // ── Thumbnail image ──
        const img = document.createElement("img");
        img.src = IMG_BASE + photo.thumb;
        img.alt = photo.alt;
        img.loading = "lazy";

        // ── Hover caption ──
        const caption = document.createElement("span");
        caption.classList.add("gallery-item__caption");
        caption.textContent = photo.alt;

        link.appendChild(img);
        link.appendChild(caption);
        item.appendChild(link);
        grid.appendChild(item);
    });

    // ── Reinitialise GLightbox after each render ──
    if (lightbox) lightbox.destroy();
    lightbox = GLightbox({
        selector: ".glightbox",
        descPosition: "bottom",
        touchNavigation: true,
        keyboardNavigation: true,
        loop: true,
    });

    // ─── GLIGHTBOX — show controls only on image hover ───
    document.addEventListener('mouseover', e => {
        const slide = e.target.closest('.gslide-media');
        if (!slide) return;

        const container = document.querySelector('.glightbox-container');
        if (!container) return;

        container.querySelectorAll('.gnext, .gprev, .gslide-description')
            .forEach(el => el.style.opacity = '1');

        slide.addEventListener('mouseleave', () => {
            container.querySelectorAll('.gnext, .gprev, .gslide-description')
                .forEach(el => el.style.opacity = '0');
        }, { once: true });
    });

}


/* ════════════════════════════════════════════════════
   FILTERS
   ════════════════════════════════════════════════════ */

function applyFilters() {
    filtered = photos.filter(p =>
        (activeActivity === "all" || p.activity === activeActivity) &&
        (activeSeason === "all" || p.season === activeSeason)
    );
    renderGrid(filtered);
}

// Toggle active class and update state on click
document.getElementById("filters").addEventListener("click", e => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;

    const type = btn.dataset.type;

    // Deactivate siblings in the same group, activate clicked
    btn.closest(".filter-group")
        .querySelectorAll(".filter-btn")
        .forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    if (type === "activity") activeActivity = btn.dataset.filter;
    if (type === "season") activeSeason = btn.dataset.filter;

    applyFilters();
});


/* ════════════════════════════════════════════════════
   INIT
   ════════════════════════════════════════════════════ */

document.addEventListener('i18nReady', () => {
    loadPhotos();
});

document.addEventListener('langChanged', () => {
    renderGrid(filtered);
});
