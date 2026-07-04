/* ════════════════════════════════════════════════════
   i18n.js — Translation engine

   TWO MODES:
   ─ Standard pages  → swap [data-i18n] text from JSON
   ─ Tour pages      → navigate to the alternate HTML
     file declared via <meta name="lang-XX">

   HOW TO USE ON A STANDARD PAGE:
   ─ Tag elements:        data-i18n="section.key"
   ─ Declare namespaces:  <meta name="i18n-namespaces" content="ui,home">
   ─ Declare locale path: <meta name="locales-path" content="assets/locales">

   HOW TO USE ON A TOUR PAGE:
   ─ Write content directly in HTML, no data-i18n needed
   ─ Add: <meta name="lang-de" content="/tours/mytour_de.html">
          <meta name="lang-en" content="/tours/mytour_en.html">
   ─ The switcher navigates to the right file automatically
   ─ The navbar is still translated via the "ui" namespace
   ════════════════════════════════════════════════════ */

const DEFAULT_LANG = "en";
let currentLang = localStorage.getItem("lang") || DEFAULT_LANG;
const translations = {};

// ── Meta helpers ───────────────────────────────────────
const localesBase =
    document.querySelector('meta[name="locales-path"]')?.content ?? "assets/locales";

const namespaces =
    document.querySelector('meta[name="i18n-namespaces"]')?.content
        .split(",").map(s => s.trim()) ?? ["ui"];


// ── Tour page detection ────────────────────────────────
const isTourPage = () => !!document.querySelector('meta[name^="lang-"]');
const getTourAlternate = lang =>
    document.querySelector(`meta[name="lang-${lang}"]`)?.content ?? null;


// ── JSON loading ───────────────────────────────────────
async function loadNamespace(lang, ns) {
    const key = `${lang}/${ns}`;
    if (translations[key]) return;
    try {
        const res = await fetch(`${localesBase}/${lang}/${ns}.json`);
        if (!res.ok) throw new Error(res.status);
        translations[key] = await res.json();
    } catch (e) {
        console.warn(`i18n: could not load ${lang}/${ns}.json`, e);
        translations[key] = {};
    }
}

async function loadAllNamespaces(lang) {
    await Promise.all(namespaces.map(ns => loadNamespace(lang, ns)));
}


// ── Key resolution ─────────────────────────────────────
// Supports both "section.key" and "namespace:section.key"
function getKey(lang, keyPath) {
    let ns = null;
    let path = keyPath;

    // If key uses "namespace:key.path" syntax, extract the namespace
    if (keyPath.includes(':')) {
        [ns, path] = keyPath.split(':');
    }

    if (ns) {
        // Look in specific namespace only
        const val = path.split('.').reduce((o, k) => o?.[k], translations[`${lang}/${ns}`]);
        if (val !== undefined) return val;
    } else {
        // Search all loaded namespaces
        for (const n of namespaces) {
            const val = path.split('.').reduce((o, k) => o?.[k], translations[`${lang}/${n}`]);
            if (val !== undefined) return val;
        }
    }
    return null;
}


// ── DOM update ─────────────────────────────────────────
function applyTranslations(lang) {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const text = getKey(lang, el.dataset.i18n);
        if (text) el.textContent = text;
    });
    document.querySelectorAll(".lang-switcher button[data-lang]").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.lang === lang);
    });
    document.documentElement.lang = lang;
}


// ── Language switch ────────────────────────────────────
async function setLang(lang) {
    localStorage.setItem("lang", lang);
    currentLang = lang;
    window.i18n.ready = false;

    if (isTourPage()) {
        const target = getTourAlternate(lang);
        if (target) { window.location.href = target; return; }
    }

    await loadAllNamespaces(lang);
    applyTranslations(lang);

    window.i18n.ready = true;
    document.dispatchEvent(new CustomEvent('langChanged'));
}


// ── Public API ─────────────────────────────────────────
window.i18n = {
    t: (keyPath, vars = {}) => {
        let text = getKey(currentLang, keyPath);
        if (text == null) return null;
        Object.keys(vars).forEach(k => {
            text = text.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'g'), vars[k]);
        });
        return text;
    },
    get currentLang() { return currentLang; },
    ready: false
};




// ── Init ───────────────────────────────────────────────
(async () => {
    if (!isTourPage()) {
        await loadAllNamespaces(currentLang);
        applyTranslations(currentLang);

        window.i18n.ready = true;
        document.dispatchEvent(new CustomEvent('i18nReady'));

    } else {
        // Redirect if current page lang doesn't match stored lang
        const alternate = getTourAlternate(currentLang);
        if (alternate) {
            const currentPath = window.location.pathname;
            const targetPath = new URL(alternate, location.origin).pathname;
            if (currentPath !== targetPath) {
                window.location.replace(alternate);
                return;
            }
        }

        // Load ui namespace then apply once navbar is in the DOM
        await loadNamespace(currentLang, "ui");

        const navbar = document.getElementById("navbar");
        if (navbar) {
            applyTranslations(currentLang);
        } else {
            document.addEventListener("navbarReady", () => applyTranslations(currentLang));
        }
    }
})();
