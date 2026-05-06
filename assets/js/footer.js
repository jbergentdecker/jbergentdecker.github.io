/* ════════════════════════════════════════════════════
   footer.js — Builds the shared footer
   ════════════════════════════════════════════════════ */

function loadFooter() {
  const placeholder = document.getElementById("footer-placeholder");
  if (!placeholder) return;

  placeholder.innerHTML = `
        <footer class="footer">
            <div class="container">
                <p>© 2026 <span>JBergentdecker</span>
                — <span data-i18n="footer.rights">All rights reserved</span></p>
            </div>
        </footer>
    `;

  // Translate footer elements
  if (typeof applyTranslations === "function") applyTranslations(currentLang);
}

loadFooter();
