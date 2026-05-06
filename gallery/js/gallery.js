// ===========================
// CONFIG
// ===========================
const JSON_PATH = "./data/photos.json";
const IMG_BASE = "../assets/images/gallery/";

// ===========================
// STATE
// ===========================
let photos = [];
let filtered = [];
let currentIndex = 0;
let activeActivity = "all";
let activeSeason = "all";

// ===========================
// FETCH PHOTOS
// ===========================
async function loadPhotos() {
    try {
        const res = await fetch(JSON_PATH);
        const data = await res.json();
        photos = data;
        filtered = data;
        renderGrid(filtered);
    } catch (err) {
        console.error("Failed to load photos.json:", err);
    }
}

// ===========================
// RENDER GRID
// ===========================
function renderGrid(items) {
    const grid = document.getElementById("gallery-grid");
    grid.innerHTML = "";

    items.forEach((photo, index) => {
        const div = document.createElement("div");
        div.classList.add("gallery-item");
        div.dataset.index = index;

        const img = document.createElement("img");
        img.src = IMG_BASE + photo.thumb;
        img.alt = photo.alt;
        img.loading = "lazy";

        div.appendChild(img);
        div.addEventListener("click", () => openLightbox(index));
        grid.appendChild(div);
    });
}

// ===========================
// FILTERS
// ===========================
function applyFilters() {
    filtered = photos.filter(p => {
        const matchActivity = activeActivity === "all" || p.activity === activeActivity;
        const matchSeason = activeSeason === "all" || p.season === activeSeason;
        return matchActivity && matchSeason;
    });
    renderGrid(filtered);
}

document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const type = btn.dataset.type;

        // Update active class only within the same group
        document.querySelectorAll(`.filter-btn[data-type="${type}"]`)
            .forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        if (type === "activity") activeActivity = btn.dataset.filter;
        if (type === "season") activeSeason = btn.dataset.filter;

        applyFilters();
    });
});

// ===========================
// LIGHTBOX
// ===========================
function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    document.getElementById("lightbox").classList.remove("hidden");
}

function closeLightbox() {
    document.getElementById("lightbox").classList.add("hidden");
}

function updateLightbox() {
    const photo = filtered[currentIndex];
    document.getElementById("lb-img").src = IMG_BASE + photo.src;
    document.getElementById("lb-img").alt = photo.alt;
    document.getElementById("lb-description").textContent = photo.description;
}

document.getElementById("lb-close")
    .addEventListener("click", closeLightbox);

document.getElementById("lb-prev").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + filtered.length) % filtered.length;
    updateLightbox();
});

document.getElementById("lb-next").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % filtered.length;
    updateLightbox();
});

// Close on backdrop click
document.getElementById("lightbox").addEventListener("click", (e) => {
    if (e.target === document.getElementById("lightbox")) closeLightbox();
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
    if (document.getElementById("lightbox").classList.contains("hidden")) return;
    if (e.key === "ArrowRight") {
        currentIndex = (currentIndex + 1) % filtered.length;
        updateLightbox();
    } else if (e.key === "ArrowLeft") {
        currentIndex = (currentIndex - 1 + filtered.length) % filtered.length;
        updateLightbox();
    } else if (e.key === "Escape") {
        closeLightbox();
    }
});

// ===========================
// INIT
// ===========================
loadPhotos();
