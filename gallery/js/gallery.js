/* ════════════════════════════════════════════════════
   GALLERY PAGE  —  gallery.js
   Loads photos from photos.json, renders the masonry
   grid, handles combined filters and the lightbox.
   ════════════════════════════════════════════════════ */

// ─── CONFIG ───────────────────────────────────────────
const JSON_PATH = "./data/photos.json";
const IMG_BASE = "../assets/images/gallery/";

// ─── STATE ────────────────────────────────────────────
let photos = [];   // full dataset from JSON
let filtered = [];   // currently visible subset
let currentIndex = 0;    // active photo in lightbox
let activeActivity = "all";
let activeSeason = "all";


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

    items.forEach((photo, index) => {

        // Wrapper div
        const item = document.createElement("div");
        item.classList.add("gallery-item");

        // Thumbnail
        const img = document.createElement("img");
        img.src = IMG_BASE + photo.thumb;
        img.alt = photo.alt;
        img.loading = "lazy";

        // Hover caption (uses alt text; swap for photo.title if you add that field)
        const caption = document.createElement("span");
        caption.classList.add("gallery-item__caption");
        caption.textContent = photo.alt;

        item.appendChild(img);
        item.appendChild(caption);
        item.addEventListener("click", () => openLightbox(index));
        grid.appendChild(item);
    });
}


/* ════════════════════════════════════════════════════
   FILTERS
   ════════════════════════════════════════════════════ */

function applyFilters() {
    filtered = photos.filter(p => {
        const matchActivity = activeActivity === "all" || p.activity === activeActivity;
        const matchSeason = activeSeason === "all" || p.season === activeSeason;
        return matchActivity && matchSeason;
    });
    renderGrid(filtered);
}

// One listener handles all filter buttons
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const type = btn.dataset.type;

        // Deactivate siblings in the same group, activate clicked button
        document.querySelectorAll(`.filter-btn[data-type="${type}"]`)
            .forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        if (type === "activity") activeActivity = btn.dataset.filter;
        if (type === "season") activeSeason = btn.dataset.filter;

        applyFilters();
    });
});


/* ════════════════════════════════════════════════════
   LIGHTBOX
   ════════════════════════════════════════════════════ */

function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    document.getElementById("lightbox").classList.remove("hidden");
}

function closeLightbox() {
    document.getElementById("lightbox").classList.add("hidden");
}

function navigate(direction) {
    currentIndex = (currentIndex + direction + filtered.length) % filtered.length;
    updateLightbox();
}

function updateLightbox() {
    const photo = filtered[currentIndex];
    document.getElementById("lb-img").src = IMG_BASE + photo.src;
    document.getElementById("lb-img").alt = photo.alt;
    document.getElementById("lb-title").textContent = photo.alt;
    document.getElementById("lb-description").textContent = photo.description;
}

// Button listeners
document.getElementById("lb-close").addEventListener("click", closeLightbox);
document.getElementById("lb-prev").addEventListener("click", () => navigate(-1));
document.getElementById("lb-next").addEventListener("click", () => navigate(+1));

// Click on dark backdrop → close
document.getElementById("lightbox").addEventListener("click", e => {
    if (e.target === document.getElementById("lightbox")) closeLightbox();
});

// Keyboard navigation
document.addEventListener("keydown", e => {
    if (document.getElementById("lightbox").classList.contains("hidden")) return;
    const actions = { ArrowRight: () => navigate(+1), ArrowLeft: () => navigate(-1), Escape: closeLightbox };
    actions[e.key]?.();
});


/* ════════════════════════════════════════════════════
   INIT
   ════════════════════════════════════════════════════ */

loadPhotos();
