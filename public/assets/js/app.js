document.addEventListener('DOMContentLoaded', async () => {
    const path = window.location.pathname;
    const isFr = path.includes('/fr/');
    const currentLang = isFr ? 'fr' : 'en';
    const lang = path.includes('/fr/') ? 'fr' : 'en';
    const isGalleryPage = document.getElementById('gallery-grid') !== null;
    const otherLang = isFr ? 'en' : 'fr';
    const targetUrl = path.replace(`/${currentLang}/`, `/${otherLang}/`);

    // 1. Inject Navigation
    const navElement = document.getElementById('main-nav');
        if (navElement) {
            // Get current filename for "active" class highlighting
            const currentFile = path.split('/').pop() || "index.html";

            navElement.innerHTML = `
                <nav class="nav-container">
                    <div class="nav-links">
                        <a href="/${currentLang}/index.html" class="${currentFile === 'index.html' ? 'active' : ''}">
                            ${isFr ? 'Galerie' : 'Gallery'}
                        </a>
                        <a href="/${currentLang}/about.html" class="${currentFile === 'about.html' ? 'active' : ''}">
                            ${isFr ? 'À Propos' : 'About'}
                        </a>
                        <a href="/${currentLang}/gear.html" class="${currentFile === 'gear.html' ? 'active' : ''}">
                            ${isFr ? 'Équipement' : 'Gear'}
                        </a>
                    </div>
                    
                    <div class="lang-switcher">
                        <a href="${targetUrl}" class="lang-link">
                            ${isFr ? 'ENGLISH' : 'FRANÇAIS'}
                        </a>
                    </div>
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

    const filtered = themeId === 'all' ? photos : photos.filter(p => p.theme === themeId);

    filtered.forEach(photo => {
        const item = document.createElement('div');
        item.className = 'grid-item';
        
        const imgPath = `../images/theme-${photo.theme}/${photo.src}`;
        const title = lang === 'fr' ? photo.title_fr : photo.title_en;
        const themeLabel = photo.theme;

        item.innerHTML = `
            <img src="${imgPath}" alt="${title}" loading="lazy">
            <div class="photo-info">
                <span class="photo-title">${title}</span>
                <span class="photo-theme">${themeLabel}</span>
            </div>
        `;
        
        item.addEventListener('click', () => openLightbox(imgPath, title));
        grid.appendChild(item);
    });

    // Re-trigger Masonry
    imagesLoaded(grid, () => {
        new Masonry(grid, { itemSelector: '.grid-item', gutter: 20 }).layout();
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