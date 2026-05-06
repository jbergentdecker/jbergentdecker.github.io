/* ════════════════════════════════════════════════════
   TOURS PAGE — tours.js
   Loads tours from JSON, renders cards, handles filters
   and re-renders on language change.
   ════════════════════════════════════════════════════ */

let allTours = [];
let currentFilter = 'all';   // tracks the active filter button


// ── Load tours from JSON ───────────────────────────────
async function loadTours() {
    const response = await fetch('../tours/data/tours.json');
    allTours = await response.json();
    renderTours(allTours);
}


// ── Render cards ───────────────────────────────────────
function renderTours(tours) {
    const grid = document.getElementById('tours-grid');
    grid.innerHTML = '';

    if (tours.length === 0) {
        grid.innerHTML = `<p class="no-results">${window.i18n?.t('tours:no_results') ?? 'No tours found.'}</p>`;
        return;
    }

    tours.forEach(tour => {
        // Translate activity and difficulty labels via i18n, fallback to helpers
        const actLabel = window.i18n?.t(`tours:filters.${tour.activity}`) ?? formatActivity(tour.activity);
        const diffLabel = window.i18n?.t(`tours:difficulty.${tour.difficulty}`) ?? capitalize(tour.difficulty);

        const card = document.createElement('a');
        card.classList.add('tour-card');
        card.href = localize(tour.page);

        card.innerHTML = `
            <img
                class="tour-card-image"
                src="${tour.cover_image}"
                alt="${localize(tour.title)}"
                onerror="this.src='../assets/images/placeholder.jpg'"
            />
            <div class="tour-card-body">
                <div class="tour-card-title">${localize(tour.title)}</div>
                <div class="tour-card-location">📍 ${localize(tour.location)}</div>
                <div class="tour-card-badges">
                    <span class="badge badge-activity">${actLabel}</span>
                    <span class="badge badge-${tour.difficulty}">${diffLabel}</span>
                </div>
                <div class="tour-card-stats">
                    <span class="stat-distance">📏 ${tour.distance} km</span>
                    <span class="stat-elevation">⬆️ ${tour.elevation_gain} m</span>
                    <span class="stat-duration">⏱️ ${tour.duration}</span>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}


// ── Filter logic ───────────────────────────────────────
function setupFilters() {
    const buttons = document.querySelectorAll('.filter-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button style
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Store and apply filter
            currentFilter = btn.dataset.filter;
            const filtered = currentFilter === 'all'
                ? allTours
                : allTours.filter(t => t.activity === currentFilter);

            renderTours(filtered);
        });
    });
}


// ── Re-render on language switch ───────────────────────
document.addEventListener('langChanged', () => {
    const filtered = currentFilter === 'all'
        ? allTours
        : allTours.filter(t => t.activity === currentFilter);
    renderTours(filtered);
});


// ── Helpers ────────────────────────────────────────────

// Returns the correct language string from a { en, de } field, or the string as-is
function localize(field) {
    if (typeof field === 'object') {
        const lang = window.i18n?.currentLang ?? localStorage.getItem('lang') ?? 'en';
        return field[lang] ?? field['en'];
    }
    return field;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Fallback label map if i18n is not available
function formatActivity(activity) {
    const labels = {
        hiking: 'Hiking',
        mountaineering: 'Mountaineering',
        climbing: 'Climbing',
        skitouring: 'Ski Touring',
        snowshoeing: 'Snowshoeing',
        trailrunning: 'Trail Running',
        cycling: 'Cycling'
    };
    return labels[activity] ?? capitalize(activity);
}


// ── Init ───────────────────────────────────────────────
document.addEventListener('i18nReady', () => {
    loadTours();
    setupFilters();
});

