/* ════════════════════════════════════════════════════
   main.js  —  UI behaviour (navbar, scroll, reveal)
   Runs on every page via the shared script tag.
   ════════════════════════════════════════════════════ */

/* ─── NAVBAR SCROLL EFFECT ────────────────────────────
   Adds .scrolled to the navbar after 60 px of scroll,
   which triggers a background + shadow in style.css.   */
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 60);
});


/* ─── HAMBURGER MENU ──────────────────────────────────
   Toggles the mobile nav open/closed.                  */
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen);
});

// Close when any nav link is clicked (mobile UX)
navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", false);
    });
});

// Close when clicking outside the navbar
document.addEventListener("click", e => {
    if (!navbar.contains(e.target)) {
        navLinks.classList.remove("open");
        hamburger.classList.remove("open");
    }
});


/* ════════════════════════════════════════════════════
   main.js — Scroll reveal
   Navbar and hamburger logic live in navbar.js
   ════════════════════════════════════════════════════ */

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll(".section").forEach(el => {
    el.classList.add("reveal");
    revealObserver.observe(el);
});

