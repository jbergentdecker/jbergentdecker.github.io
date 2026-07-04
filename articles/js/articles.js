let allArticles = [];
let activeFilters = new Set(); // empty = "all"

async function loadArticles() {
    const lang = localStorage.getItem('lang') || 'en';
    const readMore = window.i18n?.t('articles:read_more') || 'Read more →';

    if (allArticles.length === 0) {
        const res = await fetch('data/articles.json');
        const data = await res.json();
        allArticles = data.articles;
    }

    const filtered = activeFilters.size === 0
        ? allArticles
        : allArticles.filter(a => a.tags?.some(tag => activeFilters.has(tag)));

    const grid = document.getElementById('articles-grid');
    grid.innerHTML = '';

    filtered
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .forEach(article => {
            const title = article.title[lang] || article.title['en'];
            const excerpt = article.excerpt[lang] || article.excerpt['en'];
            const page = `pages/article.html?id=${article.id}`;
            const date = new Date(article.date).toLocaleDateString(
                lang === 'de' ? 'de-AT' : 'en-GB',
                { year: 'numeric', month: 'long', day: 'numeric' }
            );

            const tagsHTML = (article.tags || []).map(tag => {
                const translated = window.i18n?.t(`articles:tags.${tag}`) || tag;
                return `<span class="article-tag">${translated}</span>`;
            }).join('');

            const card = document.createElement('article');
            card.classList.add('article-card');
            card.innerHTML = `
                <a href="${page}">
                    <img src="${article.cover}" alt="${title}" class="article-cover">
                </a>
                <div class="article-card-body">
                    <div class="article-tags">${tagsHTML}</div>
                    <h2 class="article-card-title">
                        <a href="${page}">${title}</a>
                    </h2>
                    <p class="article-date">${date}</p>
                    <p class="article-excerpt">${excerpt}</p>
                    <a href="${page}" class="article-read-more">${readMore}</a>
                </div>
            `;

            grid.appendChild(card);
        });
}

function updateFilterLabels() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        const filterKey = btn.dataset.filter;
        if (filterKey !== 'all') {
            const translated = window.i18n?.t(`articles:tags.${filterKey}`) || filterKey;
            btn.textContent = translated;
        }
    });
}

function initFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            if (filter === 'all') {
                activeFilters.clear();
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            } else {
                document.querySelector('.filter-btn[data-filter="all"]')?.classList.remove('active');

                if (activeFilters.has(filter)) {
                    activeFilters.delete(filter);
                    btn.classList.remove('active');
                } else {
                    activeFilters.add(filter);
                    btn.classList.add('active');
                }

                if (activeFilters.size === 0) {
                    document.querySelector('.filter-btn[data-filter="all"]')?.classList.add('active');
                }
            }

            loadArticles();
        });
    });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initFilterButtons();
        updateFilterLabels();
        loadArticles();
    });
} else {
    initFilterButtons();
    updateFilterLabels();
    loadArticles();
}

document.addEventListener('i18nReady', () => {
    updateFilterLabels();
    loadArticles();
});

document.addEventListener('langChanged', () => {
    updateFilterLabels();
    loadArticles();
});
