// Check location for language
const path = window.location.pathname;
const isRoot = path === '/' || path === '/index.html';
const lang = path.includes('/fr/') ? 'fr' : 'en';

// Define navigation
const navMarkup = {
    en: `<nav>
            <a href="/en/">Gallery</a>
            <a href="/en/about.html">About</a>
            <a href="/fr/">FR</a>
         </nav>`,
    fr: `<nav>
            <a href="/fr/">Galerie</a>
            <a href="/fr/a-propos.html">À Propos</a>
            <a href="/en/">EN</a>
         </nav>`
};

// If we are at the root, we can show a combined nav or default to EN
if (isRoot) {
    document.getElementById('main-nav').innerHTML = `
        <nav style="gap: 40px; display: flex;">
            <a href="/fr/" style="text-decoration:none; color:black; font-weight:bold;">FRANÇAIS</a>
            <a href="/en/" style="text-decoration:none; color:black; font-weight:bold;">ENGLISH</a>
        </nav>
    `;
} else {
    document.getElementById('main-nav').innerHTML = navMarkup[lang];
}