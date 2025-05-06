// recentwork-section.js
class RecentWorkSection {
    constructor(options = {}) {
        this.buttonText = options.buttonText || "See Recent Work";
        this.backgroundImage = options.backgroundImage || "assets/video.png"; // Fallback image
        this.backgroundVideo = options.backgroundVideo || null; // New option for video
        this.buttonLink = options.buttonLink || "#";
    }

    render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Determine if we're using a video or image background
        let backgroundContent;
        
        if (this.backgroundVideo) {
            // Use video background
            backgroundContent = `
                <video class="background-video" autoplay loop muted playsinline>
                    <source src="${this.backgroundVideo}" type="video/mp4">
                    <!-- Fallback to image if video fails -->
                    <div style="background-image: url('${this.backgroundImage}')"></div>
                </video>
            `;
        } else {
            // Use image background (no additional content needed as it's in the style)
            backgroundContent = '';
        }

        // Set background style based on whether we're using video or image
        const backgroundStyle = this.backgroundVideo ? '' : `background-image: url('${this.backgroundImage}')`;
        
        // Create recent work section HTML
        container.innerHTML = `
            <div class="recent-work-section">
                <div class="video-container">
                    <div class="video" style="${backgroundStyle}">
                        ${backgroundContent}
                        <a href="${this.buttonLink}" class="button">
                            <div class="button-title">${this.buttonText}</div>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }
}

// Export for use in other files
window.RecentWorkSection = RecentWorkSection;