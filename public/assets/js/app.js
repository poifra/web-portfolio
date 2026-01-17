const lang = window.location.pathname.includes('/fr/') ? 'fr' : 'en';

// 2. Inject Header
const navContent = {
  en: `<nav><a href="/en/">Home</a><a href="/en/about">About</a><a href="/fr/">FR</a></nav>`,
  fr: `<nav><a href="/fr/">Accueil</a><a href="/fr/a-propos">À Propos</a><a href="/en/">EN</a></nav>`
};
document.getElementById('main-nav').innerHTML = navContent[lang];

// 3. Load & Filter Photos
async function loadGallery() {
  const response = await fetch('/assets/photos.json');
  const data = await response.json();
  
  const container = document.getElementById('gallery-grid');
  
  // Example: simple filter or list all
  data.photos.forEach(photo => {
    const img = document.createElement('img');
    img.src = `/images/${photo.theme}/${photo.src}`;
    img.alt = lang === 'fr' ? photo.alt_fr : photo.alt_en;
    img.loading = "lazy"; 
    container.appendChild(img);
  });
}
loadGallery();