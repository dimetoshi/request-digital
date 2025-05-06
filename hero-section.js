class HeroSection {
    constructor(options = {}) {
        this.title = options.title || "Design subscriptions for everyone";
        this.subtitle = options.subtitle || "Pause or cancel anytime.";
        this.cardTitle = options.cardTitle || "Join Today";
        this.cardDescription = options.cardDescription || "Subscribe to a plan & request as many designs as you'd like.";
        this.splineUrl = options.splineUrl || null; // New option for Spline URL
        this.backgroundImage = options.backgroundImage || "assets/booking-card.png"; // Fallback image
        this.calLink = options.calLink || "request-digital/15min"; // Cal.com link
    }

    render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Determine background content based on whether we have a Spline URL
        const backgroundStyle = this.splineUrl ? '' : `background-image: url('${this.backgroundImage}')`;
        const splineContent = this.splineUrl ? 
            `<div class="spline-container">
                <iframe 
                    src='${this.splineUrl}' 
                    frameborder='0' 
                    width='100%' 
                    height='100%'
                    title="3D Animation"
                    loading="lazy"
                ></iframe>
             </div>` : '';

        container.innerHTML = `
            <div class="hero-section">
                <div class="hero-container">
                    <div class="hero-navtitle">
                        <div class="hero-nav">
                            <div class="hero-nav1">
                                <div class="main-logo">
                                    <img class="main-logo-group" alt="" src="assets/main-logo.svg">
                                </div>
                                <div class="button-parent">
                                    <div class="button">
                                        <div class="button-label">See Work</div>
                                    </div>
                                    <div class="button cal-enabled-button" 
                                         data-cal-link="${this.calLink}" 
                                         data-cal-namespace="15min" 
                                         data-cal-config='{"layout":"month_view"}'>
                                        <div class="button-container">
                                            <img class="phone-icon" alt="" src="assets/phone-icon.svg">
                                            <div class="button-label">Book a call</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="herotitle-container">
                            <div class="hero-title">${this.title}</div>
                            <div class="herodescription">${this.subtitle}</div>
                        </div>
                    </div>
                    <div class="booking-card" style="${backgroundStyle}">
                        ${splineContent}
                        <div class="button">
                            <div class="button-label">See Pricing</div>
                        </div>
                        <div class="maincard-info">
                            <div class="maincard-title">
                                <div class="card-title">${this.cardTitle}</div>
                                <div class="card-description">${this.cardDescription}</div>
                            </div>
                            <div class="button-fullwidth cal-enabled-button" 
                                 data-cal-link="${this.calLink}" 
                                 data-cal-namespace="15min" 
                                 data-cal-config='{"layout":"month_view"}'>
                                <div class="see-work">Book a 15 Minute Intro Call</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // After rendering, ensure Cal.com functionality is initialized
        this.ensureCalInitialized();
    }

    ensureCalInitialized() {
        // Check if Cal is already initialized
        if (window.Cal) return;

        // If not, add Cal.com script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.innerHTML = `
            (function (C, A, L) { 
                let p = function (a, ar) { a.q.push(ar); }; 
                let d = C.document; 
                C.Cal = C.Cal || function () { 
                    let cal = C.Cal; 
                    let ar = arguments; 
                    if (!cal.loaded) { 
                        cal.ns = {}; 
                        cal.q = cal.q || []; 
                        d.head.appendChild(d.createElement("script")).src = A; 
                        cal.loaded = true; 
                    } 
                    if (ar[0] === L) { 
                        const api = function () { p(api, arguments); }; 
                        const namespace = ar[1]; 
                        api.q = api.q || []; 
                        if(typeof namespace === "string"){
                            cal.ns[namespace] = cal.ns[namespace] || api;
                            p(cal.ns[namespace], ar);
                            p(cal, ["initNamespace", namespace]);
                        } else p(cal, ar); 
                        return;
                    } 
                    p(cal, ar); 
                }; 
            })(window, "https://app.cal.com/embed/embed.js", "init");
            
            Cal("init", "15min", {origin:"https://cal.com"});
            Cal.ns["15min"]("ui", {"hideEventTypeDetails":true,"layout":"month_view"});
        `;
        document.head.appendChild(script);
    }
}

// Export for use in other files
window.HeroSection = HeroSection;