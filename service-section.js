// service-section.js
class ServiceSection {
    constructor(options = {}) {
        this.categoryTitle = options.categoryTitle || "Skills & Services";
        this.sectionTitle = options.sectionTitle || "All the things you need under one roof";
        this.services = options.services || [
            // Default services - 3 columns
            [
                "Memes", "Infographics", "AI Image Generation", 
                "AI Videos", "Graphic Design", "Branding"
            ],
            [
                "Logos", "NFT Art", "Email Newsletters", "Landing Pages", 
                "UI/UX Design", "Slide Decks", "Web Design"
            ],
            [
                "NFT Art", "Display Ads", "Animations", 
                "Merch Design", "Website Development", "+ More"
            ]
        ];
    }

    render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Create columns of services
        const columnsHTML = this.services.map(column => {
            const servicesHTML = column.map(service => `
                <div class="service">
                <div class="service-title">${service}</div>
                </div>
                <div class="breakline">
                </div>
            `).join('');

            return `
                <div class="container-skills">
                    ${servicesHTML}
                </div>
            `;
        }).join('');

        // Create the complete services section HTML
        container.innerHTML = `
            <div class="services-section">
                <div class="sectiontitle-light">
                    <div class="category-title-light">${this.categoryTitle}</div>
                    <div class="section-title-light">${this.sectionTitle}</div>
                </div>
                <div class="skills-grid">
                    ${columnsHTML}
                </div>
            </div>
        `;
    }
}

// Export for use in other files
window.ServiceSection = ServiceSection;