/* ════════════════════════════════════════════════════
   navbar.js — Builds and initialises the shared navbar
   ════════════════════════════════════════════════════ */

function loadNavbar() {
    const placeholder = document.getElementById("navbar-placeholder");
    if (!placeholder) return;

    placeholder.innerHTML = `
        <nav class="navbar" id="navbar">
            <div class="navbar__inner">
                <a href="/index.html" class="navbar__logo">
                    J<span>Bergentdecker</span>
                </a>
                <ul class="navbar__links" id="navLinks">
                    <li><a href="/index.html"           data-i18n="nav.home">Home</a></li>
                    <li><a href="/gallery/gallery.html"  data-i18n="nav.gallery">Gallery</a></li>
                    <li><a href="/tours/tours.html"      data-i18n="nav.tours">Tours</a></li>
                    <li><a href="/articles/articles.html" data-i18n="nav.articles">Articles</a></li>
                    <li><a href="/pages/about.html"      data-i18n="nav.about">About</a></li>
                </ul>
                <div class="navbar__right">
                    <div class="lang-switcher">
                        <button data-lang="en" onclick="setLang('en')">EN</button>
                        <span class="separator">|</span>
                        <button data-lang="de" onclick="setLang('de')">DE</button>
                    </div>
                    <button class="hamburger" id="hamburger"
                            aria-label="Toggle menu" aria-expanded="false">
                        <span></span><span></span><span></span>
                    </button>
                </div>
            </div>
        </nav>
    `;

    // ── Active nav link ────────────────────────────────
    placeholder.querySelectorAll(".navbar__links a").forEach(link => {
        if (link.href === window.location.href) link.classList.add("active");
    });

    // ── Translate navbar elements ──────────────────────
    if (typeof applyTranslations === "function") applyTranslations(currentLang);

    // ── Hamburger ──────────────────────────────────────
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");
    const navbar = document.getElementById("navbar");

    hamburger.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        hamburger.classList.toggle("open", isOpen);
        hamburger.setAttribute("aria-expanded", isOpen);
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            hamburger.classList.remove("open");
            hamburger.setAttribute("aria-expanded", false);
        });
    });

    document.addEventListener("click", e => {
        if (!navbar.contains(e.target)) {
            navLinks.classList.remove("open");
            hamburger.classList.remove("open");
        }
    });

    // ── Signal that the navbar is ready ───────────────
    // i18n.js listens for this on tour pages
    document.dispatchEvent(new Event("navbarReady"));
}

// ── Scroll effect ──────────────────────────────────────
window.addEventListener("scroll", () => {
    const navbar = document.getElementById("navbar");
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 10);
});

window.dispatchEvent(new Event("scroll"));
loadNavbar();
