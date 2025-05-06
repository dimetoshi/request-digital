/**
 * Cal.com Popup Integration
 * This script adds Cal.com popup calendar functionality to all booking buttons.
 */

// Initialize Cal.com popup functionality
function initCalPopup() {
    console.log('Initializing Cal.com popup integration...');
    
    // Add Cal.com script to head
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
    
    console.log('Cal.com script loaded');
}

// Find and update all booking buttons with Cal.com attributes
function updateBookingButtons() {
    console.log('Finding and updating booking buttons...');
    
    // Array of button selectors to match various booking buttons throughout the site
    const buttonSelectors = [
        // Button text content selectors (for jQuery-like :contains)
        'a, button',
        
        // Common booking button classes
        '.book-call-button',
        '.booking-button',
        '.call-button',
        '.schedule-button',
        
        // Specific buttons from the site sections
        '.hero-section .cta-button',
        '.faq-section .call-button',
        '.pricing-section .book-button',
        
        // Call buttons from each section's initialization
        '[href="#contact"]',
        '[href="#booking"]',
    ];
    
    // Get all potential buttons
    const allPotentialButtons = [];
    
    buttonSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => allPotentialButtons.push(el));
    });
    
    // Filter for booking-related buttons by checking their text content
    const bookingKeywords = [
        'book a call',
        'book call',
        'schedule a call',
        'book a meeting',
        'schedule meeting',
        'book an intro',
        'book intro call',
        'book a consultation',
        'schedule a consultation',
        'book a demo',
        'schedule a demo',
        'book a chat',
        'speak with us',
        'talk to us',
        'contact us'
    ];
    
    // Filter buttons by text content
    const bookingButtons = allPotentialButtons.filter(button => {
        if (!button.textContent) return false;
        
        const buttonText = button.textContent.toLowerCase().trim();
        return bookingKeywords.some(keyword => buttonText.includes(keyword));
    });
    
    // Make array unique (remove duplicates)
    const uniqueButtons = [...new Set(bookingButtons)];
    
    console.log(`Found ${uniqueButtons.length} booking buttons to update`);
    
    // Update each button with Cal.com attributes
    uniqueButtons.forEach(button => {
        // Add Cal.com attributes
        button.setAttribute('data-cal-link', 'request-digital/15min');
        button.setAttribute('data-cal-namespace', '15min');
        button.setAttribute('data-cal-config', '{"layout":"month_view"}');
        
        // Store original href for anchor tags
        if (button.tagName.toLowerCase() === 'a') {
            const originalHref = button.getAttribute('href');
            if (originalHref) {
                button.setAttribute('data-original-href', originalHref);
            }
            button.setAttribute('href', 'javascript:void(0);');
        }
        
        console.log(`Updated button: ${button.textContent.trim()}`);
    });
}

// Main initialization function that runs when the page loads
function initialize() {
    // First, load the Cal.com script
    initCalPopup();
    
    // After DOM is loaded, update all booking buttons
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateBookingButtons);
    } else {
        // If DOM is already loaded, update buttons immediately
        updateBookingButtons();
    }
}

// Start the integration
initialize();