// process-section.js
class ProcessSection {
    constructor(options = {}) {
        this.categoryTitle = options.categoryTitle || "Process";
        this.sectionTitle = options.sectionTitle || "The way design should've been done in the first place";
        this.processCards = options.processCards || [
            {
                number: "01",
                title: "Subscribe",
                description: "Subscribe to a plan & request as many designs as you'd like.",
                backgroundImage: "assets/booking-card.png", // Consistent path without leading slash
                backgroundColor: "#ffffff",
                textColor: "#ffffff",
                gradient: "linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.9))"
            },
            {
                number: "02",
                title: "Request",
                description: "Submit design requests and we'll get to work immediately.",
                backgroundImage: "assets/request-card.png", // Consistent path without leading slash
                backgroundColor: "#ffffff",
                textColor: "#ffffff",
                gradient: "linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.9))"
            },
            {
                number: "03",
                title: "Review",
                description: "Review designs, request revisions, and approve final versions.",
                backgroundImage: "assets/receive-card.png", // Consistent path without leading slash
                backgroundColor: "#ffffff",
                textColor: "#ffffff",
                gradient: "linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.9))"
            }
        ];
        this.clientLogos = options.clientLogos || [
            "assets/clientLogo-1.svg",
            "assets/clientLogo-2.svg",
            "assets/clientLogo-3.svg",
            "assets/clientLogo-4.svg",
            "assets/clientLogo-5.svg"
        ];
    }

    render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Create process cards HTML with custom gradient support
        const processCardsHTML = this.processCards.map(card => {
            // Set background style based on provided image or color
            const backgroundStyle = card.backgroundImage 
                ? `background-image: url('${card.backgroundImage}')` 
                : `background-color: ${card.backgroundColor || '#333333'}`;

            // Set gradient style if provided, otherwise use default
            const gradientStyle = card.gradient || "linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.9))";
            
            return `
                <div class="processcard" style="${backgroundStyle}">
                    <div class="processcard-container" style="background: ${gradientStyle}">
                        <div class="processcard-details">
                            <div class="category-title">${card.number}</div>
                            <div class="processcard-title">${card.title}</div>
                            <div class="processcard-description">${card.description}</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Create client logos HTML
        const clientLogosHTML = this.clientLogos.map((logo, index) => `
            <img class="clientlogo-icon" alt="Client logo ${index + 1}" src="${logo}">
        `).join('');

        // Combine everything into the full section HTML
        container.innerHTML = `
            <div class="process-section">
                <div class="sectiontitle">
                    <div class="category-title">${this.categoryTitle}</div>
                    <div class="section-title">${this.sectionTitle}</div>
                </div>
                <div class="processcard-row">
                    ${processCardsHTML}
                </div>
                <div class="clientlogos">
                    ${clientLogosHTML}
                </div>
            </div>
        `;

        // Add a small script to verify the background images after rendering
        setTimeout(() => {
            this.processCards.forEach((card, index) => {
                const element = document.getElementById(`processcard-${index}`);
                if (element) {
                    console.log(`Card ${index} background:`, element.style.backgroundImage);
                    
                    // Force the background image if needed
                    if (!element.style.backgroundImage || element.style.backgroundImage === 'none') {
                        console.log(`Forcing background image for card ${index}`);
                        element.style.backgroundImage = `url('${card.backgroundImage}')`;
                    }
                }
            });
        }, 100);
    }
}

// Export for use in other files
window.ProcessSection = ProcessSection;