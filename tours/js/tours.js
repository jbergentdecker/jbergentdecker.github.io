let allTours = [];

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
        grid.innerHTML = '<p class="no-results">No tours found.</p>';
        return;
    }

    tours.forEach(tour => {
        const card = document.createElement('a');
        card.classList.add('tour-card');
        card.href = tour.page;

        card.innerHTML = `
      <img 
        class="tour-card-image" 
        src="${tour.cover_image}" 
        alt="${tour.title}"
        onerror="this.src='../assets/images/placeholder.jpg'"
      />
      <div class="tour-card-body">
        <div class="tour-card-title">${tour.title}</div>
        <div class="tour-card-location">📍 ${tour.location}</div>
        <div class="tour-card-badges">
          <span class="badge badge-activity">${formatActivity(tour.activity)}</span>
          <span class="badge badge-${tour.difficulty}">${capitalize(tour.difficulty)}</span>
        </div>
        <div class="tour-card-stats">
          <span class="stat-distance">${tour.distance} km</span>
          <span class="stat-elevation">${tour.elevation_gain} m</span>
          <span class="stat-duration">${tour.duration}</span>
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
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            const filtered = filter === 'all'
                ? allTours
                : allTours.filter(t => t.activity === filter);

            renderTours(filtered);
        });
    });
}

// ── Helpers ────────────────────────────────────────────
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatActivity(activity) {
    const labels = {
        hiking: "Hiking",
        mountaineering: "Mountaineering",
        climbing: "Climbing",
        skitouring: "Ski Touring",
        snowshoeing: "Snowshoeing",
        trailrunning: "Trail Running",
        cycling: "Cycling"
    };
    return labels[activity] || capitalize(activity);
}

// ── Init ───────────────────────────────────────────────
loadTours();
setupFilters();
