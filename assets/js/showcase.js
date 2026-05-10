/* ════════════════════════════════════════════════════
   showcase.js — Randomly picks 5 photos from gallery.json
   and renders them into .showcase__grid on the homepage.
   ════════════════════════════════════════════════════ */

const GALLERY_JSON = "gallery/data/gallery.json";
const IMAGES_BASE = "assets/images/gallery/";
const PICK_COUNT = 5;

// ── Helpers ────────────────────────────────────────────
function pickRandom(arr, n) {
    return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

function t(field) {
    const lang = window.i18n?.currentLang ?? "en";
    if (typeof field === "object" && field !== null) {
        return field[lang] ?? field["en"] ?? Object.values(field)[0];
    }
    return field ?? "";
}

// ── Render ─────────────────────────────────────────────
function renderShowcase(photos) {
    const grid = document.querySelector(".showcase__grid");
    if (!grid) return;

    const picks = pickRandom(photos, PICK_COUNT);

    grid.innerHTML = picks.map((photo, index) => `
        <div class="showcase__item${index === 0 ? " showcase__item--large" : ""}">
            <img
                src="${IMAGES_BASE}${photo.src}"
                alt="${t(photo.alt)}"
                loading="lazy"
            />
            <div class="showcase__item-overlay">
                <span>${t(photo.alt)}</span>
            </div>
        </div>
    `).join("");
}

// ── Fetch + Init ───────────────────────────────────────
async function initShowcase() {
    try {
        const res = await fetch(GALLERY_JSON);
        if (!res.ok) throw new Error(res.status);
        const photos = await res.json();

        if (window.i18n?.ready) {
            renderShowcase(photos);
        } else {
            document.addEventListener("i18nReady", () => renderShowcase(photos), { once: true });
        }

        document.addEventListener("langChanged", () => renderShowcase(photos));

    } catch (e) {
        console.warn("showcase.js: could not load gallery.json", e);
    }
}

initShowcase();
