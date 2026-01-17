const path = window.location.pathname;
const isFr = path.includes('/fr/');
const currentLang = isFr ? 'fr' : 'en';
const lang = path.includes('/fr/') ? 'fr' : 'en';
const isGalleryPage = document.getElementById('gallery-grid') !== null;
const otherLang = isFr ? 'en' : 'fr';
const targetUrl = path.replace(`/${currentLang}/`, `/${otherLang}/`);

document.addEventListener('DOMContentLoaded', async () => {
    //navigation setup
    const navElement = document.getElementById('main-nav');
        if (navElement) {
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

    if (isGalleryPage) {
        try {
            const response = await fetch('../assets/photos.json');
            const data = await response.json();
            
            setupFilters(data.photos, lang);
            renderGallery(data.photos, 'all', lang);
        } catch (err) {
            console.error("Error loading photos:", err);
        }
    }
});

function setupFilters(photos, lang) {
    const filterContainer = document.getElementById('theme-filters');
    if (!filterContainer) return;
    
    filterContainer.innerHTML = '';

    const allBtn = document.createElement('button');
    allBtn.textContent = lang === 'fr' ? 'Tous' : 'All';
    allBtn.className = 'filter-btn active';
    allBtn.onclick = () => filterGallery('all', photos, lang, allBtn);
    filterContainer.appendChild(allBtn);

    const allThemes = [];
    photos.forEach(p => {
        const themes = (p.theme || "").split(',').map(t => t.trim());
        themes.forEach(t => {
            if (t) allThemes.push(t);
        });
    });

    // 3. Get unique themes and sort them alphabetically
    const uniqueThemes = [...new Set(allThemes)].sort();

    const themeLabels = {
        "nature": { en: "Nature", fr: "Nature" },
        "urban": { en: "Street", fr: "Photo de rue" },
        "52frames": { en: "52Frames", fr: "52Frames" }
    };

    uniqueThemes.forEach(id => {
        const btn = document.createElement('button');
        const label = themeLabels[id] ? themeLabels[id][lang] : id.charAt(0).toUpperCase() + id.slice(1);
        
        btn.textContent = label;
        btn.className = 'filter-btn';
        btn.onclick = () => filterGallery(id, photos, lang, btn);
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
        : photos.filter(p => {
            const themeList = p.theme.split(',').map(t => t.trim());
            return themeList.includes(themeId);
        });

    filtered.forEach(photo => {
        const item = document.createElement('div');
        item.className = 'grid-item';
        
        const thumbPath = `../images/${photo.thumb}`;
        const fullPath = `../images/${photo.src}`;

        item.innerHTML = `
            <img src="${thumbPath}" alt="${isFr ? photo.title_fr : photo.title_en}" loading="lazy">
            <div class="photo-info">
                <span class="photo-title">${isFr ? photo.title_fr : photo.title_en}</span>
            </div>
        `;
        
        item.addEventListener('click', () => {
            openLightbox(fullPath, photo.title_en);
        });

        grid.appendChild(item);
    });

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

    document.body.style.overflow = "hidden";
}

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