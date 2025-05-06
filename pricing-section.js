// pricing-section.js
class PricingSection {
    constructor(options = {}) {
        this.categoryTitle = options.categoryTitle || "Pricing";
        this.sectionTitle = options.sectionTitle || "All the things you need under one roof";
        this.pricingCards = options.pricingCards || [
            {
                title: "Monthly Club",
                popular: true,
                price: "$4,995",
                period: "per month"
            },
            {
                title: "Monthly Club",
                popular: true,
                price: "$4,995",
                period: "per month"
            },
            {
                title: "Monthly Club",
                popular: true,
                price: "$4,995",
                period: "per month"
            }
        ];
        this.features = options.features || [
            "One request at a time",
            "Avg. 48 hour delivery",
            "Unlimited Brands & Projects",
            "Up to 2 users",
            "Pause or cancel anytime"
        ];
        this.specialFeatures = options.specialFeatures || [
            {
                title: "Pause or cancel anytime",
                description: "Temporarily pause your subscription anytime, no sweat."
            },
            {
                title: "Try it for a week",
                description: "Not loving it after a week? Get 75% back, no questions asked."
            }
        ];
    }

    render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Create pricing cards HTML
        const pricingCardsHTML = this.pricingCards.map(card => `
            <div class="pricing-card">
                <div class="pricingcard-container">
                    <div class="pricing-details">
                        <div class="pricing-header">
                            <div class="card-no">${card.title}</div>
                            ${card.popular ? 
                                `<div class="popular-tag">
                                    <div class="card-no">Popular</div>
                                </div>` : ''
                            }
                        </div>
                        <div class="price-details">
                            <div class="price-title">${card.price}</div>
                            <div class="price-sub">${card.period}</div>
                        </div>
                    </div>
                    <div class="button-getstarted">
                        <div class="button-title">Get Started</div>
                    </div>
                </div>
            </div>
        `).join('');

        // Create features HTML
        const featuresGroupSize = Math.ceil(this.features.length / 2);
        const firstFeatureGroup = this.features.slice(0, featuresGroupSize);
        const secondFeatureGroup = this.features.slice(featuresGroupSize);
        
        const firstFeatureGroupHTML = firstFeatureGroup.map(feature => `
            <div class="button-link-parent">
                <img class="button-link-icon" alt="" src="assets/button-link.svg">
                <div class="one-request-at">${feature}</div>
            </div>
        `).join('');
        
        const secondFeatureGroupHTML = secondFeatureGroup.map(feature => `
            <div class="button-link-parent">
                <img class="button-link-icon" alt="" src="assets/button-link.svg">
                <div class="one-request-at">${feature}</div>
            </div>
        `).join('');

        // Create special features HTML
        const specialFeaturesHTML = this.specialFeatures.map(feature => `
            <div class="feature-container">
                <div class="feature-details">
                    <div class="feature-header">
                        <img class="button-link-icon" alt="" src="assets/button-link.svg">
                        <div class="try-it-for">${feature.title}</div>
                    </div>
                    <div class="feature-description">${feature.description}</div>
                </div>
            </div>
        `).join('');

        // Combine everything into the full pricing section HTML
        container.innerHTML = `
            <div class="pricing-section">
                <div class="sectiontitle-light">
                    <div class="category-title-light">${this.categoryTitle}</div>
                    <div class="section-title-light">${this.sectionTitle}</div>
                </div>
                <div class="pricingcard-details">
                    <div class="pricing-table">
                        <div class="pricing-row">
                            ${pricingCardsHTML}
                        </div>
                        <div class="inclusions-table">
                            <div class="inclusions-container">
                                <div class="inclusions-container1">
                                    <div class="frame-parent">
                                        ${firstFeatureGroupHTML}
                                    </div>
                                    <div class="frame-parent">
                                        ${secondFeatureGroupHTML}
                                    </div>
                                </div>
                                <div class="inclusions-features">
                                    ${specialFeaturesHTML}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Export for use in other files
window.PricingSection = PricingSection;