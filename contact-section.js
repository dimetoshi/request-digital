class ContactSection {
    constructor(options = {}) {
        this.categoryTitle = options.categoryTitle || "Contact";
        this.sectionTitle = options.sectionTitle || "Book a meeting to see if Request Digital is the right fit for you";
    }

    createContactCard() {
        const contactCard = document.createElement('div');
        contactCard.className = 'contact-section';

        contactCard.innerHTML = `
            <div class="contact-container">
                <!-- Category Title -->
                <div class="category-title">
                    <p>${this.categoryTitle}</p>
                </div>

                <!-- Two Column Layout -->
                <div class="contact-content">
                    <!-- Column 1: Text Content -->
                    <div class="contact-text">
                        <h2 class="section-title">${this.sectionTitle}</h2>
                        <div class="contact-buttons">
                            <button class="primary-button book-call-button" 
                                    data-cal-link="request-digital/15min" 
                                    data-cal-namespace="15min" 
                                    data-cal-config='{"layout":"month_view"}'>
                                Book a Call
                            </button>
                        </div>
                    </div>
                    
                    <!-- Column 2: Cal Embed -->
                    <div class="cal-container">
                        <div style="width:100%;height:100%;overflow:scroll" id="my-cal-inline"></div>
                    </div>
                </div>
            </div>
        `;

        return contactCard;
    }

    initCalEmbed() {
        // Create and append the Cal.com script for the inline embed
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
            Cal.ns["15min"]("inline", {
                elementOrSelector:"#my-cal-inline",
                config: {"layout":"month_view"},
                calLink: "request-digital/15min",
            });
            Cal.ns["15min"]("ui", {"hideEventTypeDetails":true,"layout":"month_view"});
        `;
        document.head.appendChild(script);
    }

    render(containerId) {
        const container = document.getElementById(containerId);
        const contactCard = this.createContactCard();
        container.appendChild(contactCard);
        
        // Initialize Cal.com embed
        this.initCalEmbed();
    }
}