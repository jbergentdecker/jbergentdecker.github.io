// ============================================
// i18n.js — Language switching
// ============================================

const translations = {};
let currentLang = localStorage.getItem('lang') || 'en';

async function loadTranslations(lang) {
    if (translations[lang]) return; // already loaded
    try {
        const res = await fetch(`/assets/locales/${lang}.json`);
        translations[lang] = await res.json();
    } catch (e) {
        console.warn(`Could not load translations for: ${lang}`);
    }
}

function applyTranslations(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const text = getNestedKey(translations[lang], key);
        if (text) el.textContent = text;
    });

    // Update active button state
    document.querySelectorAll('.lang-switcher button').forEach(btn => {
        btn.classList.toggle('active', btn.id === `lang-${lang}`);
    });

    document.documentElement.lang = lang;
}

function getNestedKey(obj, keyPath) {
    return keyPath.split('.').reduce((acc, key) => acc?.[key], obj);
}

async function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    await loadTranslations(lang);
    applyTranslations(lang);
}

// Init on page load
(async () => {
    await loadTranslations(currentLang);
    applyTranslations(currentLang);
})();
