function calculateReadingTime() {
    const lang = localStorage.getItem('lang') || 'en';
    const body = document.getElementById('article-body');
    if (!body) return;

    const text = body.innerText || body.textContent || '';
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);

    const el = document.getElementById('reading-time');
    if (!el) return;

    // Use i18n if available, fallback to hardcoded
    if (window.i18n && window.i18n.t) {
        el.textContent = window.i18n.t('articles:reading_time', { minutes });
    } else {
        el.textContent = lang === 'de'
            ? `${minutes} Min. Lesezeit`
            : `${minutes} min read`;
    }
}

calculateReadingTime();
document.addEventListener('langChanged', calculateReadingTime);
document.addEventListener('i18nReady', calculateReadingTime);

// --- New: reusable helper for article cards on the listing page ---
async function getReadingTimeMinutes(articleUrl) {
    try {
        const res = await fetch(articleUrl);
        if (!res.ok) throw new Error(res.status);
        const html = await res.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const body = doc.getElementById('article-body'); // matches your real id
        if (!body) return null;

        const text = body.innerText || body.textContent || '';
        const words = text.trim().split(/\s+/).filter(Boolean).length;
        return Math.ceil(words / 200); // same rounding as calculateReadingTime()
    } catch (e) {
        console.warn('reading-time: could not fetch', articleUrl, e);
        return null;
    }
}
