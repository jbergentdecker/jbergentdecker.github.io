/* ════════════════════════════════════════════════════
   HOMEPAGE — featured-tours.js
   Picks 3 random tours from tours.json and renders
   them as cards in #featured-tours-grid
   ════════════════════════════════════════════════════ */

const FEATURED_COUNT = 3;

async function loadFeaturedTours() {
    const lang = window.i18n?.currentLang ?? localStorage.getItem('lang') ?? 'en';

    const localize = (field) =>
        typeof field === 'object' ? (field[lang] ?? field['en']) : field;

    try {
        const response = await fetch('tours/data/tours.json');
        const tours = await response.json();

        // Pick 3 random tours
        const shuffled = tours.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, FEATURED_COUNT);

        const grid = document.getElementById('featured-tours-grid');
        grid.innerHTML = '';

        selected.forEach(tour => {
            const actLabel = window.i18n?.t(`tours:filters.${tour.activity}`) ?? tour.activity;
            const diffLabel = window.i18n?.t(`tours:difficulty.${tour.difficulty}`) ?? tour.difficulty;

            const card = document.createElement('a');
            card.classList.add('tour-card');
            card.href = localize(tour.page);
            card.innerHTML = `
                <img
                    class="tour-card-image"
                    src="${tour.cover_image}"
                    alt="${localize(tour.title)}"
                    onerror="this.src='/assets/images/gallery/ameringkogel-unter-alm.jpg'"
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

    } catch (err) {
        console.error('Featured tours failed to load:', err);
    }
}

document.addEventListener('i18nReady', loadFeaturedTours);
document.addEventListener('langChanged', loadFeaturedTours);