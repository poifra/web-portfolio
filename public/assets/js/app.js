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
                <a href="/${lang}/gear.html" style="text-decoration:none; color:inherit;">${lang === 'fr' ? 'Équipement' : 'Gear'}</a>
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
        
        const imgPath = `../images/theme-${photo.theme}/${photo.src}`;
        const caption = photo['alt_' + lang];

        item.innerHTML = `<img src="${imgPath}" alt="${caption}" loading="lazy">`;
        
        item.addEventListener('click', () => {
            openLightbox(imgPath, caption);
        });

        grid.appendChild(item);
    });

    //  Masonry layout initialization
    imagesLoaded(grid, function() {
        const msnry = new Masonry(grid, {
            itemSelector: '.grid-item',
            columnWidth: '.grid-item',
            percentPosition: true,
            gutter: 20 // Ensure this matches your CSS gap
        });
        msnry.layout();
    });
}

function openLightbox(src, caption) {
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    const lbCap = document.getElementById('lightbox-caption');

    lightbox.style.display = "block";
    lbImg.src = src;
    lbCap.textContent = caption;

    // Prevent body from scrolling while lightbox is open
    document.body.style.overflow = "hidden";
}

// Close logic
document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.querySelector('.close-lightbox');

    if (lightbox) {
        closeBtn.onclick = () => closeLightbox();
        
        lightbox.onclick = (e) => {
            if (e.target !== document.getElementById('lightbox-img')) {
                closeLightbox();
            }
        };

        document.addEventListener('keydown', (e) => {
            if (e.key === "Escape") closeLightbox();
        });
    }
});

function closeLightbox() {
    document.getElementById('lightbox').style.display = "none";
    document.body.style.overflow = "auto";
}