// Script to update all booking-related buttons with Cal.com attributes
document.addEventListener('DOMContentLoaded', function() {
    // Find and update all booking buttons in the site
    updateBookingButtons();
    
    // Function to update booking buttons with Cal.com attributes
    function updateBookingButtons() {
        // Array of button selectors to match various booking buttons throughout the site
        const buttonSelectors = [
            // Button text content selectors
            'button:contains("Book a Call")',
            'button:contains("Book Call")',
            'button:contains("Schedule a Call")',
            'button:contains("Book a Meeting")',
            'button:contains("Book an Intro Call")',
            'a:contains("Book a Call")',
            'a:contains("Book Call")',
            'a:contains("Schedule a Call")',
            'a:contains("Book a Meeting")',
            'a:contains("Book an Intro Call")',
            
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
        
        // Join all selectors for a single query
        const combinedSelector = buttonSelectors.join(', ');
        
        // Query all matching elements
        const buttons = document.querySelectorAll(combinedSelector);
        
        console.log(`Found ${buttons.length} booking buttons to update`);
        
        // Update each button with Cal.com attributes
        buttons.forEach(button => {
            // Add Cal.com attributes
            button.setAttribute('data-cal-link', 'request-digital/15min');
            button.setAttribute('data-cal-namespace', '15min');
            button.setAttribute('data-cal-config', '{"layout":"month_view"}');
            
            // Remove existing href if the button is an anchor
            if (button.tagName.toLowerCase() === 'a') {
                // Store original href for reference
                const originalHref = button.getAttribute('href');
                button.setAttribute('data-original-href', originalHref);
                button.setAttribute('href', 'javascript:void(0);');
            }
            
            console.log(`Updated button: ${button.textContent.trim()}`);
        });
    }
});