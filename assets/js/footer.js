// assets/js/footer.js

function loadFooter() {
    const footer = document.getElementById('footer-placeholder');
    if (!footer) return;

    footer.innerHTML = `
    <footer class="footer">
      <div class="container">
        <p>© 2026 <span>JBergentdecker</span> — <span data-i18n="footer.rights">All rights reserved</span></p>
      </div>
    </footer>
  `;
}

loadFooter();