/* ════════════════════════════════════════════════════
   main.js  —  Scroll reveal only.
   Navbar/hamburger logic lives in navbar.js
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
