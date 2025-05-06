// faq-section.js
class FaqSection {
    constructor(options = {}) {
        this.categoryTitle = options.categoryTitle || "FAQ";
        this.sectionTitle = options.sectionTitle || "Frequently Asked Questions";
        this.faqs = options.faqs || [
            {
                question: "How fast will I receive my designs?",
                answer: "Most designs are delivered within 48 hours. More complex projects may take longer."
            },
            {
                question: "How many design requests can I make?",
                answer: "You can make unlimited requests, but we work on them one at a time in order of submission."
            },
            {
                question: "What if I'm not happy with the designs?",
                answer: "We offer unlimited revisions until you're 100% satisfied with the results."
            },
            {
                question: "What design software do you use?",
                answer: "We primarily use industry-standard tools like Adobe Creative Suite, Figma, and Sketch."
            },
            {
                question: "Can I cancel my subscription anytime?",
                answer: "Yes, you can cancel or pause your subscription at any time with no questions asked."
            },
            {
                question: "What file formats will I receive?",
                answer: "You'll receive your designs in all industry-standard formats needed for your specific project."
            }
        ];
        this.cardTitle = options.cardTitle || "Join Today";
        this.cardDescription = options.cardDescription || "Subscribe to a plan & request as many designs as you'd like.";
        this.buttonText = options.buttonText || "See Pricing";
        this.callButtonText = options.callButtonText || "Book a 15 Minute Intro Call";
        this.buttonLink = options.buttonLink || "#pricing";
        this.callButtonLink = options.callButtonLink || "#contact";
        this.backgroundImage = options.backgroundImage || "assets/booking-card.png";
        this.splineUrl = options.splineUrl || null; // New option for Spline URL
    }

    render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Create FAQ items HTML
        const faqItemsHTML = this.faqs.map(faq => `
            <div class="question">
                <div class="question-title">${faq.question}</div>
                <img class="arrow-down-icon" alt="" src="assets/arrow-down.svg">
            </div>
            <div class="answer" style="display: none;">
                <div class="answer-text">${faq.answer}</div>
            </div>
        `).join('');

        // Determine background content based on whether we have a Spline URL
        const backgroundStyle = this.splineUrl ? '' : `background-image: url('${this.backgroundImage}')`;
        const splineContent = this.splineUrl ? 
            `<div class="spline-container">
                <iframe 
                    src='${this.splineUrl}' 
                    frameborder='0' 
                    width='120%' 
                    height='120%'
                    title="3D Animation"
                    loading="lazy"
                    class="spline-iframe"
                ></iframe>
             </div>` : '';

        // Create the complete FAQ section HTML
        container.innerHTML = `
            <div class="faq-section">
                <div class="sectiontitle">
                    <div class="category-title">${this.categoryTitle}</div>
                    <div class="section-title">${this.sectionTitle}</div>
                </div>
                <div class="faq-book">
                    <div class="faqs-container">
                        ${faqItemsHTML}
                    </div>
                    <div class="booking-card" style="${backgroundStyle}">
                        ${splineContent}
                        <div class="button">
                            <div class="button-label">${this.buttonText}</div>
                        </div>
                        <div class="maincard-info">
                            <div class="maincard-title">
                                <div class="card-title">${this.cardTitle}</div>
                                <div class="card-description">${this.cardDescription}</div>
                            </div>
                            <div class="button-fullwidth">
                                <div class="see-work">${this.callButtonText}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add styling after rendering
        const splineIframe = container.querySelector('.spline-iframe');
        if (splineIframe) {
            // Apply additional positioning via JavaScript
            splineIframe.style.position = 'absolute';
            splineIframe.style.top = '50%';
            splineIframe.style.left = '50%';
            splineIframe.style.transform = 'translate(-50%, -50%)';
        }

        // Add toggle functionality to FAQ questions
        const questions = container.querySelectorAll('.question');
        questions.forEach((question, index) => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const arrow = question.querySelector('.arrow-down-icon');
                
                // Toggle answer visibility
                if (answer.style.display === 'none' || !answer.style.display) {
                    answer.style.display = 'block';
                    arrow.style.transform = 'rotate(180deg)';
                } else {
                    answer.style.display = 'none';
                    arrow.style.transform = 'rotate(0deg)';
                }
            });
        });
    }
}

// Export for use in other files
window.FaqSection = FaqSection;