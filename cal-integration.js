/**
 * Cal.com Integration
 * This script integrates Cal.com booking functionality throughout the website.
 * It adds popup calendar functionality to all booking buttons and initializes 
 * the inline calendar in the contact section.
 */

// Load Cal.com script and initialize it
function initializeCalPopup() {
    console.log('Initializing Cal.com integration...');
    
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

// Initialize the inline calendar in the contact section if it exists
function initializeInlineCalendar() {
    const inlineCalContainer = document.getElementById('my-cal-inline');
    if (inlineCalContainer) {
        console.log('Initializing inline calendar...');
        
        // Wait for Cal to be available
        const checkCalAvailability = setInterval(() => {
            if (window.Cal && window.Cal.ns && window.Cal.ns["15min"]) {
                clearInterval(checkCalAvailability);
                
                // Initialize inline embed
                Cal.ns["15min"]("inline", {
                    elementOrSelector: "#my-cal-inline",
                    config: {"layout":"month_view"},
                    calLink: "request-digital/15min",
                });
                
                console.log('Inline calendar initialized');
            }
        }, 100);
    }
}

// Main initialization function
function initializeCalIntegration() {
    // First, load the Cal.com script
    initializeCalPopup();
    
    // Wait for DOM to be fully loaded before updating buttons
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM loaded, initializing Cal integration...');
        
        // Initialize inline calendar in contact section if it exists
        initializeInlineCalendar();
    });
}

// Start the integration
initializeCalIntegration();