// portfolio-section.js (updated with randomization for All category and lightbox functionality)
class PortfolioSection {
    constructor(options = {}) {
        this.categories = options.categories || ["All", "Web Design", "Logo Design", "UI/UX", "Brand Identity", "Motion"];
        this.activeCategory = options.activeCategory || "All";
        this.portfolioItems = options.portfolioItems || [];
        
        // Bunny Storage configuration
        this.bunnyStorageOptions = options.bunnyStorageOptions || {
            baseUrl: "https://your-bunny-storage-url.b-cdn.net",
            enabled: false,
            categoryMapping: {}
        };
        
        // Store the original order of items for non-All categories
        this.originalItems = [...this.portfolioItems];
        
        // Initialize with possibly randomized items if All is the active category
        if (this.activeCategory === "All") {
            this.randomizeAllCategory();
        }
    }
    
    // Method to randomize the All category
    randomizeAllCategory() {
        // Create a copy of the original items to avoid modifying the original
        const itemsToRandomize = [...this.originalItems];
        
        // Fisher-Yates shuffle algorithm
        for (let i = itemsToRandomize.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [itemsToRandomize[i], itemsToRandomize[j]] = [itemsToRandomize[j], itemsToRandomize[i]];
        }
        
        this.portfolioItems = itemsToRandomize;
    }

    render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Create category tabs HTML
        const categoryTabsHTML = this.categories.map(category => {
            const isActive = category === this.activeCategory;
            return `
                <div class="category-link${isActive ? '-active' : ''}" data-category="${category}">
                    <div class="category-label">${category}</div>
                </div>
            `;
        }).join('');
        
        // Create category dropdown HTML for mobile
        const categoryDropdownHTML = `
            <div class="category-dropdown">
                <select class="category-select">
                    ${this.categories.map(category => 
                        `<option value="${category}" ${category === this.activeCategory ? 'selected' : ''}>${category}</option>`
                    ).join('')}
                </select>
            </div>
        `;

        // Create initial portfolio grid HTML
        this.renderPortfolioItems(container, categoryTabsHTML, categoryDropdownHTML, this.activeCategory);

        // Add event listeners for category filtering after rendering
        this.addCategoryListeners(container);
        
        // Add lightbox HTML if it doesn't exist yet
        this.setupLightbox();
    }

    renderPortfolioItems(container, categoryTabsHTML, categoryDropdownHTML, activeCategory) {
        // If switching to All, randomize the items
        if (activeCategory === "All") {
            this.randomizeAllCategory();
        } else {
            // For specific categories, restore original order but filter for this category
            this.portfolioItems = [...this.originalItems];
        }
        
        // Filter items based on active category
        const filteredItems = activeCategory === "All" 
            ? this.portfolioItems 
            : this.portfolioItems.filter(item => item.category === activeCategory);

        // Create portfolio grid HTML - chunk items into rows of exactly 3
        let portfolioGridHTML = '';

        if (filteredItems.length > 0) {
            // Create rows with exactly 3 cards each
            const rows = [];
            const itemsPerRow = 3;
            
            for (let i = 0; i < filteredItems.length; i += itemsPerRow) {
                rows.push(filteredItems.slice(i, i + itemsPerRow));
            }
            
            // Build HTML for each row
            portfolioGridHTML = rows.map((row, rowIndex) => {
                const cardsHTML = row.map((item, cardIndex) => {
                    // Calculate a unique delay for each card based on position
                    const animationDelay = (rowIndex * itemsPerRow + cardIndex) * 0.1;
                    
                    // Process the image URL (if using Bunny Storage)
                    let imageUrl = item.image;
                    if (this.bunnyStorageOptions.enabled && !item.image.startsWith('http')) {
                        // If it's not already a full URL, process it using Bunny Storage
                        const folderName = this.bunnyStorageOptions.categoryMapping[item.category] || 
                                          item.category.toLowerCase().replace(/\s+/g, '-');
                        imageUrl = `${this.bunnyStorageOptions.baseUrl}/${folderName}/${item.image}`;
                    }
                    
                    return `
                        <div class="work-card animate-card" data-category="${item.category}" data-title="${item.title}" data-desc="${item.description}" data-image="${imageUrl}" style="animation-delay: ${animationDelay}s">
                            <div class="work-img" style="${imageUrl ? `background-image: url('${imageUrl}'); background-size: cover; background-position: center;` : ''}">
                            </div>
                            <div class="work-details">
                                <div class="work-cat">${item.category}</div>
                                <div class="work-title">${item.title}</div>
                                <div class="work-description">${item.description}</div>
                            </div>
                        </div>
                    `;
                }).join('');
                
                return `
                    <div class="portfolio-row">
                        ${cardsHTML}
                    </div>
                `;
            }).join('');

            portfolioGridHTML = `
                <div class="portfolio-grid">
                    ${portfolioGridHTML}
                </div>
            `;
        } else {
            // No items found for this category
            portfolioGridHTML = `
                <div class="portfolio-grid">
                    <div class="no-results">No items found in this category</div>
                </div>
            `;
        }

        // Combine everything into the complete portfolio section HTML
        container.innerHTML = `
            <div class="portfolio-section">
                ${categoryDropdownHTML}
                <div class="category-tabs">
                    ${categoryTabsHTML}
                </div>
                ${portfolioGridHTML}
            </div>
        `;
        
        // Add lightbox click handlers to newly rendered cards
        this.addLightboxHandlers();
    }

    addCategoryListeners(container) {
        // Add category tab filtering functionality
        const categoryLinks = container.querySelectorAll('.category-link, .category-link-active');
        
        categoryLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.updateActiveCategory(container, link.getAttribute('data-category'));
            });
        });
        
        // Add dropdown change listener for mobile
        const categorySelect = container.querySelector('.category-select');
        if (categorySelect) {
            categorySelect.addEventListener('change', (e) => {
                this.updateActiveCategory(container, e.target.value);
            });
        }
    }
    
    updateActiveCategory(container, category) {
        // Update active category
        this.activeCategory = category;
        
        // Update active class on tabs
        const categoryLinks = container.querySelectorAll('.category-link, .category-link-active');
        categoryLinks.forEach(cl => {
            if (cl.getAttribute('data-category') === category) {
                cl.className = 'category-link-active';
            } else {
                cl.className = 'category-link';
            }
        });
        
        // Update select value
        const categorySelect = container.querySelector('.category-select');
        if (categorySelect) {
            categorySelect.value = category;
        }
        
        // Re-render the grid with the new active category
        const categoryTabsHTML = Array.from(categoryLinks).map(l => {
            const cat = l.getAttribute('data-category');
            const isActive = cat === category;
            return `
                <div class="category-link${isActive ? '-active' : ''}" data-category="${cat}">
                    <div class="category-label">${cat}</div>
                </div>
            `;
        }).join('');
        
        // Recreate dropdown HTML
        const categoryDropdownHTML = `
            <div class="category-dropdown">
                <select class="category-select">
                    ${this.categories.map(cat => 
                        `<option value="${cat}" ${cat === category ? 'selected' : ''}>${cat}</option>`
                    ).join('')}
                </select>
            </div>
        `;
        
        this.renderPortfolioItems(container, categoryTabsHTML, categoryDropdownHTML, category);
        this.addCategoryListeners(container);
    }
    
    // LIGHTBOX FUNCTIONALITY
    
    setupLightbox() {
        // Check if lightbox already exists
        if (document.getElementById('portfolio-lightbox')) return;
        
        // Create lightbox HTML - simpler version with fullscreen display and no text
        const lightboxHTML = `
            <div id="portfolio-lightbox" class="portfolio-lightbox">
                <div class="lightbox-overlay"></div>
                <div class="lightbox-container">
                    <button class="lightbox-close">&times;</button>
                    <div class="lightbox-content">
                        <div class="lightbox-image-container">
                            <img src="" alt="" class="lightbox-image">
                        </div>
                    </div>
                    <div class="lightbox-navigation">
                        <button class="lightbox-prev">&lsaquo;</button>
                        <button class="lightbox-next">&rsaquo;</button>
                    </div>
                </div>
            </div>
        `;
        
        // Create style element for lightbox CSS
        const lightboxCSS = `
            .portfolio-lightbox {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 9999;
                font-family: Figtree, sans-serif;
            }
            
            .lightbox-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.95);
            }
            
            .lightbox-container {
                position: relative;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: flex;
                flex-direction: column;
            }
            
            .lightbox-close {
                position: absolute;
                top: 20px;
                right: 20px;
                background: none;
                border: none;
                color: #fff;
                font-size: 36px;
                cursor: pointer;
                z-index: 10001;
                outline: none;
                transition: color 0.2s;
            }
            
            .lightbox-close:hover {
                color: #ddd;
            }
            
            .lightbox-content {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 100%;
                width: 100%;
                overflow: hidden;
            }
            
            .lightbox-image-container {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                width: 100%;
            }
            
            .lightbox-image {
                max-width: 95%;
                max-height: 95vh;
                object-fit: contain;
                transition: transform 0.3s ease-out;
            }
            
            .lightbox-navigation {
                position: absolute;
                top: 50%;
                left: 0;
                right: 0;
                transform: translateY(-50%);
                display: flex;
                justify-content: space-between;
                padding: 0 20px;
                pointer-events: none;
            }
            
            .lightbox-prev, .lightbox-next {
                background: rgba(0, 0, 0, 0.3);
                border: none;
                border-radius: 50%;
                width: 60px;
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
                font-size: 40px;
                cursor: pointer;
                outline: none;
                transition: background-color 0.2s;
                pointer-events: auto;
            }
            
            .lightbox-prev:hover, .lightbox-next:hover {
                background-color: rgba(0, 0, 0, 0.7);
            }
            
            /* Make work cards show a pointer cursor to indicate they're clickable */
            .work-card {
                cursor: pointer;
            }
            
            /* Image container styling and hover effects */
            .work-img {
                position: relative;
                overflow: hidden;
            }
            
            /* Create the overlay effect */
            .work-img::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.25); /* 25% black overlay */
                opacity: 0;
                transition: opacity 0.3s ease;
                z-index: 1;
            }
            
            /* Create the magnify icon with text */
            .work-img::after {
                content: 'click to enlarge';
                position: absolute;
                top: 15px;
                right: 15px;
                color: white;
                font-size: 14px;
                font-weight: 400;
                opacity: 0;
                transition: opacity 0.3s ease;
                z-index: 2;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'%3E%3C/line%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right center;
                background-size: 14px 14px;
                padding-right: 20px;
                display: flex;
                align-items: center;
                font-family: Figtree, sans-serif;
            }
            
            /* Show overlay and icon on hover */
            .work-card:hover .work-img::before,
            .work-card:hover .work-img::after {
                opacity: 1;
            }
            
            /* Mobile styles */
            @media screen and (max-width: 768px) {
                .lightbox-prev, .lightbox-next {
                    width: 45px;
                    height: 45px;
                    font-size: 30px;
                }
                
                .lightbox-close {
                    font-size: 30px;
                    top: 15px;
                    right: 15px;
                }
            }
            
            /* Show .work-details elements in this version */
            .work-details {
                display: block;
                padding: 12px 8px;
            }
        `;
        
        // Add lightbox HTML to the document
        const lightboxDiv = document.createElement('div');
        lightboxDiv.innerHTML = lightboxHTML;
        document.body.appendChild(lightboxDiv.firstElementChild);
        
        // Add lightbox CSS to the document
        const styleElement = document.createElement('style');
        styleElement.textContent = lightboxCSS;
        document.head.appendChild(styleElement);
        
        // Initialize lightbox functionality
        this.initLightbox();
    }
    
    initLightbox() {
        this.lightbox = document.getElementById('portfolio-lightbox');
        this.lightboxImage = this.lightbox.querySelector('.lightbox-image');
        this.lightboxClose = this.lightbox.querySelector('.lightbox-close');
        this.lightboxPrev = this.lightbox.querySelector('.lightbox-prev');
        this.lightboxNext = this.lightbox.querySelector('.lightbox-next');
        this.lightboxOverlay = this.lightbox.querySelector('.lightbox-overlay');
        
        // Current image index
        this.currentIndex = 0;
        
        // Gallery items array (will be populated when opening lightbox)
        this.galleryItems = [];
        
        // Set up event handlers
        this.lightboxClose.addEventListener('click', this.closeLightbox.bind(this));
        this.lightboxOverlay.addEventListener('click', this.closeLightbox.bind(this));
        this.lightboxPrev.addEventListener('click', this.showPrevImage.bind(this));
        this.lightboxNext.addEventListener('click', this.showNextImage.bind(this));
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.lightbox.style.display === 'block') {
                if (e.key === 'Escape') {
                    this.closeLightbox();
                } else if (e.key === 'ArrowLeft') {
                    this.showPrevImage();
                } else if (e.key === 'ArrowRight') {
                    this.showNextImage();
                }
            }
        });
        
        // Add lightbox click handlers to work cards
        this.addLightboxHandlers();
    }
    
    addLightboxHandlers() {
        const workCards = document.querySelectorAll('.work-card');
        
        workCards.forEach(card => {
            card.addEventListener('click', () => {
                // Collect all visible cards based on current category
                this.collectGalleryItems();
                
                // Get current card details
                const imageUrl = card.getAttribute('data-image');
                const title = card.getAttribute('data-title');
                const description = card.getAttribute('data-desc');
                const category = card.getAttribute('data-category');
                
                // Find index of clicked card in gallery items
                const index = this.galleryItems.findIndex(item => item.imageUrl === imageUrl);
                
                if (index !== -1) {
                    this.openLightbox(index);
                }
            });
        });
    }
    
    collectGalleryItems() {
        this.galleryItems = [];
        const workCards = document.querySelectorAll('.work-card');
        
        workCards.forEach(card => {
            // Check if card is visible (matches current category filter)
            if (card.offsetParent !== null) {
                this.galleryItems.push({
                    imageUrl: card.getAttribute('data-image'),
                    title: card.getAttribute('data-title'),
                    description: card.getAttribute('data-desc'),
                    category: card.getAttribute('data-category')
                });
            }
        });
    }
    
    openLightbox(index) {
        this.currentIndex = index;
        const item = this.galleryItems[index];
        
        // Set lightbox content - only set image now
        this.lightboxImage.src = item.imageUrl;
        
        // Show lightbox
        this.lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Update navigation visibility
        this.updateNavigation();
    }
    
    closeLightbox() {
        this.lightbox.style.display = 'none';
        document.body.style.overflow = ''; // Re-enable scrolling
    }
    
    showPrevImage() {
        if (this.currentIndex > 0) {
            this.openLightbox(this.currentIndex - 1);
        }
    }
    
    showNextImage() {
        if (this.currentIndex < this.galleryItems.length - 1) {
            this.openLightbox(this.currentIndex + 1);
        }
    }
    
    updateNavigation() {
        // Hide prev button if at first image
        this.lightboxPrev.style.display = this.currentIndex === 0 ? 'none' : 'flex';
        
        // Hide next button if at last image
        this.lightboxNext.style.display = this.currentIndex === this.galleryItems.length - 1 ? 'none' : 'flex';
    }
}

// Export for use in other files
window.PortfolioSection = PortfolioSection;