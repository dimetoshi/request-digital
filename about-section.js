// about-section.js
class AboutSection {
    constructor(options = {}) {
        this.description = options.description || "";
        this.socialLinks = options.socialLinks || [];
    }

    render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Create social links HTML
        const socialLinksHTML = this.socialLinks.length > 0
            ? `
            <div class="about-social-links">
                ${this.socialLinks.map(link => 
                    `<a href="${link.url}" class="social-link" target="_blank" rel="noopener noreferrer">
                        <img src="${link.icon}" alt="Social media" class="social-icon">
                    </a>`
                ).join('')}
            </div>
            `
            : '';

        // Create the complete about section HTML
        container.innerHTML = `
            <div class="about-section">
                <div class="about-content">
                    <div class="about-description">
                        ${this.description}
                    </div>
                    ${socialLinksHTML}
                </div>
            </div>
        `;
    }
}

// Export for use in other files
window.AboutSection = AboutSection;