async function loadArticle() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        showError('No article specified.');
        return;
    }

    let meta;
    try {
        const res = await fetch('../data/articles.json');
        const data = await res.json();
        meta = data.articles.find(a => a.id === id);
    } catch {
        showError('Could not load article index.');
        return;
    }

    if (!meta) {
        showError(`Article "${id}" not found.`);
        return;
    }

    const lang = localStorage.getItem('lang') || document.documentElement.lang || 'en';
    document.documentElement.lang = lang;

    const mdPath = meta.content?.[lang] ?? meta.content?.['en'];
    if (!mdPath) {
        showError('Content not available.');
        return;
    }

    let markdown;
    try {
        const res = await fetch(mdPath);
        if (!res.ok) throw new Error();
        markdown = await res.text();
    } catch {
        showError('Could not load article content.');
        return;
    }

    // Title
    document.getElementById('page-title').textContent = meta.title?.[lang] ?? meta.title?.en ?? 'Article';
    document.getElementById('article-title').textContent = meta.title?.[lang] ?? meta.title?.en ?? '';

    // Date
    const dateEl = document.getElementById('article-date');
    if (meta.date) {
        dateEl.textContent = new Date(meta.date).toLocaleDateString(
            lang === 'de' ? 'de-AT' : 'en-GB',
            { day: 'numeric', month: 'long', year: 'numeric' }
        );
    }

    // Cover image
    if (meta.cover) {
        document.getElementById('article-hero').innerHTML =
            `<img src="${meta.cover}" alt="${meta.title?.[lang] ?? ''}" class="article-hero-img">`;
    }

    // Tags
    const tagsEl = document.getElementById('article-tags');
    if (meta.tags?.length) {
        tagsEl.innerHTML = meta.tags.map(t => {
            const translated = window.i18n?.t(`articles:tags.${t}`) || t;
            return `<span class="article-tag">${translated}</span>`;
        }).join('');
    }

    // Render Markdown
    document.getElementById('article-body').innerHTML = marked.parse(markdown);

    // Reading time
    const words = markdown.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));
    const readingTimeText = window.i18n?.t
        ? window.i18n.t('articles:reading_time', { minutes })
        : (lang === 'de' ? `${minutes} Min. Lesezeit` : `${minutes} min read`);

    document.getElementById('reading-time').textContent = readingTimeText;
}

function showError(msg) {
    const el = document.getElementById('article-loading');
    if (el) el.textContent = msg;
}

loadArticle();
document.addEventListener('langChanged', loadArticle);
document.addEventListener('i18nReady', loadArticle);
