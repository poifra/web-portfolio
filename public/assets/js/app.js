document.addEventListener('DOMContentLoaded', async () => {
    const path = window.location.pathname;
    const lang = path.includes('/fr/') ? 'fr' : 'en';
    const isGalleryPage = document.getElementById('gallery-grid') !== null;

    // 1. Inject Navigation
    const navElement = document.getElementById('main-nav');
    if (navElement) {
        navElement.innerHTML = `
            <nav style="display:flex; gap:30px; font-weight:500;">
                <a href="/" style="text-decoration:none; color:inherit;">${lang === 'fr' ? 'Accueil' : 'Home'}</a>
                <a href="/${lang}/" style="text-decoration:none; color:inherit; border-bottom: 2px solid #000;">${lang === 'fr' ? 'Galerie' : 'Gallery'}</a>
                <a href="/${lang}/about.html" style="text-decoration:none; color:inherit;">${lang === 'fr' ? 'À Propos' : 'About'}</a>
            </nav>
        `;
    }

    // 2. Load Gallery Data
    if (isGalleryPage) {
        try {
            const response = await fetch('../assets/photos.json');
            const data = await response.json();
            
            setupFilters(data, lang);
            renderGallery(data.photos, 'all', lang);
        } catch (err) {
            console.error("Error loading photos:", err);
        }
    }
});

function setupFilters(data, lang) {
    const filterContainer = document.getElementById('theme-filters');
    if (!filterContainer) return;

    // Create "All" button
    const allBtn = document.createElement('button');
    allBtn.textContent = lang === 'fr' ? 'Tous' : 'All';
    allBtn.className = 'filter-btn active';
    allBtn.onclick = () => filterGallery('all', data.photos, lang, allBtn);
    filterContainer.appendChild(allBtn);

    // Create dynamic theme buttons
    data.themes.forEach(theme => {
        const btn = document.createElement('button');
        btn.textContent = theme[lang];
        btn.className = 'filter-btn';
        btn.onclick = () => filterGallery(theme.id, data.photos, lang, btn);
        filterContainer.appendChild(btn);
    });
}

function filterGallery(themeId, photos, lang, clickedBtn) {
    // Update active button UI
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');

    renderGallery(photos, themeId, lang);
}

function renderGallery(photos, themeId, lang) {
    const grid = document.getElementById('gallery-grid');
    grid.innerHTML = '';

    const filtered = themeId === 'all' 
        ? photos 
        : photos.filter(p => p.theme === themeId);

    filtered.forEach(photo => {
        const item = document.createElement('div');
        item.className = 'grid-item';
        // Note: Paths are relative to the /en/ or /fr/ folders
        item.innerHTML = `<img src="../images/${photo.src}" alt="${photo['alt_' + lang]}" loading="lazy">`;
        grid.appendChild(item);
    });
}