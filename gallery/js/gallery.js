/* ════════════════════════════════════════════════════
   GALLERY PAGE  —  gallery.js
   ════════════════════════════════════════════════════ */

// ─── CONFIG ───────────────────────────────────────────
const JSON_PATH = "./data/gallery.json";
const IMG_BASE = "../assets/images/gallery/";

// ─── STATE ────────────────────────────────────────────
let photos = [];
let filtered = [];
let activeActivity = "all";
let activeSeason = "all";
let lightbox = null;


// ─── HELPER — multilang field ─────────────────────────
function t(field) {
    const lang = window.i18n?.currentLang ?? 'en';
    if (typeof field === 'object' && field !== null) {
        return field[lang] ?? field['en'] ?? Object.values(field)[0];
    }
    return field ?? '';
}


/* ════════════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════════════ */

async function loadPhotos() {
    try {
        const res = await fetch(JSON_PATH);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        photos = await res.json();
        filtered = photos;
        renderGrid(filtered);
    } catch (err) {
        console.error("Failed to load gallery.json:", err);
    }
}


/* ════════════════════════════════════════════════════
   GRID
   ════════════════════════════════════════════════════ */

function renderGrid(items) {
    const grid = document.getElementById("gallery-grid");
    if (!grid) { console.error("gallery-grid not found"); return; }
    grid.innerHTML = "";

    if (!items || items.length === 0) {
        grid.innerHTML = "<p>No photos found.</p>";
        return;
    }

    items.forEach((photo) => {
        // ── Outer div ──
        const item = document.createElement("div");
        item.classList.add("gallery-item");

        // ── GLightbox anchor ──
        const link = document.createElement("a");
        link.href = IMG_BASE + photo.src;
        link.classList.add("glightbox");
        link.dataset.gallery = "gallery-page";
        link.dataset.photoId = photo.id;
        link.dataset.title = t(photo.alt);
        link.dataset.description = t(photo.description);

        // ── Thumbnail image ──
        const img = document.createElement("img");
        img.src = IMG_BASE + photo.thumb;
        img.alt = t(photo.alt);
        img.loading = "lazy";

        // ── Hover caption ──
        const caption = document.createElement("span");
        caption.classList.add("gallery-item__caption");
        caption.textContent = t(photo.alt);

        link.appendChild(img);
        link.appendChild(caption);
        item.appendChild(link);
        grid.appendChild(item);
    });

    // ── Reinitialise GLightbox ──
    if (lightbox) {
        lightbox.destroy();
        lightbox = null;
    }

    lightbox = GLightbox({
        selector: ".glightbox",
        descPosition: "bottom",
        touchNavigation: true,
        keyboardNavigation: true,
        loop: true,
    });

    lightbox.on('open', () => {
        updateLightboxSlides();
    });

    lightbox.on('slide_changed', ({ current }) => {
        updateLightboxSlides();
    });

    // ─── Show controls only on image hover ───
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


// ─── Update lightbox slide data for current language ──
function updateLightboxSlides() {
    document.querySelectorAll('.glightbox').forEach(link => {
        const photoId = parseInt(link.dataset.photoId);
        const photo = filtered.find(p => p.id === photoId);
        if (!photo) return;
        link.dataset.title = t(photo.alt);
        link.dataset.description = t(photo.description);
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

document.getElementById("filters").addEventListener("click", e => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;

    const type = btn.dataset.type;

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
