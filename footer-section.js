// footer-section.js
class FooterSection {
    constructor(options = {}) {
        this.companyName = options.companyName || "Your Company";
        this.year = options.year || new Date().getFullYear();
        this.links = options.links || [
            { text: "Home", url: "/" },
            { text: "Portfolio", url: "/portfolio.html" },
            { text: "Terms", url: "/terms.html" },
            { text: "Privacy", url: "/privacy.html" }
        ];
        this.socialLinks = options.socialLinks || [
            { icon: "assets/instagram-icon.svg", url: "https://instagram.com/" },
            { icon: "assets/twitter-icon.svg", url: "https://twitter.com/" },
            { icon: "assets/linkedin-icon.svg", url: "https://linkedin.com/" }
        ];
    }

    render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Create footer links HTML
        const linksHTML = this.links.map(link => {
            return `<a href="${link.url}" class="footer-link">${link.text}</a>`;
        }).join('');

        // Create social links HTML
        const socialLinksHTML = this.socialLinks.map(link => {
            return `<a href="${link.url}" class="social-link" target="_blank" rel="noopener noreferrer">
                <img src="${link.icon}" alt="Social media" class="social-icon">
            </a>`;
        }).join('');

        // Create the complete footer HTML
        container.innerHTML = `
            <div class="footer-section">
                <div class="footer-content">
                    <div class="footer-left">
                        <div class="copyright">© ${this.year} ${this.companyName}</div>
                    </div>
                    <div class="footer-links">
                        ${linksHTML}
                    </div>
                    <div class="footer-right">
                        <div class="social-links">
                            ${socialLinksHTML}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Export for use in other files
window.FooterSection = FooterSection;