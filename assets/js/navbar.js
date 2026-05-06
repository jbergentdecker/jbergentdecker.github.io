// assets/js/navbar.js

function loadNavbar() {
    const navbar = document.getElementById('navbar-placeholder');
    if (!navbar) return;

    navbar.innerHTML = `
    <nav class="navbar" id="navbar">
        <div class="navbar__inner">
            <a href="/index.html" class="navbar__logo">
                J<span>Bergentdecker</span>
            </a>
            <ul class="navbar__links" id="navLinks">
                <li><a href="/index.html" data-i18n="nav.home">Home</a></li>
                <li><a href="/gallery/gallery.html" data-i18n="nav.gallery">Gallery</a></li>
                <li><a href="/tours/tours.html" data-i18n="nav.tours">Tours</a></li>
                <li><a href="/pages/about.html" data-i18n="nav.about">About me</a></li>
            </ul>
            <div class="navbar__right">
                <div class="lang-switcher">
                    <button id="lang-en" onclick="setLang('en')">EN</button>
                    <span class="separator">|</span>
                    <button id="lang-de" onclick="setLang('de')">DE</button>
                </div>
                <button class="hamburger" id="hamburger" aria-label="Toggle menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </div>
    </nav>
  `;

    // Mark active link
    const links = navbar.querySelectorAll('.navbar__links a');
    links.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add('active');
        }
    });
}

loadNavbar();

// Scroll effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 10);
});

// Trigger once on load in case page is already scrolled
window.dispatchEvent(new Event('scroll'));

