// GSoC 2026 Preparation Course - Interactive JavaScript
// Modern, performance-optimized code with smooth animations

document.addEventListener('DOMContentLoaded', function() {
    // Initialize essential interactive features only (production)
    initNavigation();
    initScrollAnimations();
    initFAQAccordion();
    initSeatCounter();
    initSmoothScrolling();
    initProgressBars();
    initPerformanceOptimizations();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
    
    // Navbar scroll effect
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Active nav link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavLink() {
        let scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current section's nav link
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavLink);
    highlightNavLink(); // Run once on load
}

// Scroll Animations - Intersection Observer for performance
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stagger animations for multiple elements
                if (entry.target.dataset.delay) {
                    entry.target.style.animationDelay = entry.target.dataset.delay + 'ms';
                }
            }
        });
    }, observerOptions);
    
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll(`
        .testimonial-card,
        .timeline-card,
        .pricing-card,
        .trust-point,
        .faq-item,
        .section-header
    `);
    
    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.dataset.delay = index * 100; // Stagger by 100ms
        observer.observe(el);
    });
}

// (Removed scroll-based parallax updates for production)

// FAQ Accordion with smooth animations
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    otherAnswer.style.maxHeight = '0';
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                answer.style.maxHeight = '0';
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

// Dynamic Seat Counter with realistic progression
function initSeatCounter() {
    const seatsFilled = document.getElementById('seats-filled');
    const progressFill = document.querySelector('.progress-fill');
    
    if (!seatsFilled || !progressFill) return;
    
    // Simulate realistic seat filling based on time
    function updateSeatCount() {
        const now = new Date();
        const startDate = new Date('2025-09-01'); // Course announcement date
        const daysSinceStart = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
        
        // Realistic progression: faster initial uptake, then slower
        let baseSeats = Math.min(13 + Math.floor(daysSinceStart * 0.3), 47);
        
        // Add some randomness but keep it realistic
        const randomFactor = Math.floor(Math.random() * 3);
        const currentSeats = Math.min(baseSeats + randomFactor, 47);
        
        // Animate counter
        animateCounter(seatsFilled, parseInt(seatsFilled.textContent), currentSeats);
        
        // Update progress bar
        const percentage = (currentSeats / 100) * 100;
        progressFill.style.width = percentage + '%';
        
        // Update urgency text
        const urgencyText = document.querySelector('.urgency-text');
        if (urgencyText) {
            const remaining = 100 - currentSeats;
            urgencyText.textContent = `Only ${remaining} seats remaining`;
        }
    }
    
    // Animate number counting
    function animateCounter(element, start, end) {
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        
        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (end - start) * easeOutQuart);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        }
        
        requestAnimationFrame(updateNumber);
    }
    
    // Initial update
    updateSeatCount();
    
    // Update every 5 minutes to show "live" changes
    setInterval(updateSeatCount, 5 * 60 * 1000);
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 90; // Account for fixed navbar (70px + 20px buffer)
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
}

// (Removed video modal placeholder for production)

// Progress bar animations when in view
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const targetWidth = progressBar.style.width || '13%';
                
                // Animate from 0 to target width
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.width = targetWidth;
                }, 100);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });
}

// Parallax effects for hero section
// (Removed parallax for production)

// Pricing plan selection with visual feedback and WhatsApp integration
function initPricingInteractions() {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        const button = card.querySelector('.btn');
        
        button.addEventListener('click', function(e) {
            // Don't prevent default since we want the WhatsApp link to work
            
            // Add selection animation
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
            
            // Show selection confirmation (brief)
            showPricingConfirmation(card);
        });
    });
}

function showPricingConfirmation(selectedCard) {
    const planName = selectedCard.querySelector('h3').textContent;
    const price = selectedCard.querySelector('.amount').textContent;
    
    // Create confirmation toast
    const toast = document.createElement('div');
    toast.className = 'pricing-toast';
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-icon">📱</div>
            <div class="toast-text">
                <strong>${planName} Selected!</strong>
                <p>Opening WhatsApp...</p>
            </div>
        </div>
    `;
    
    // Toast styles
    const toastStyles = `
        .pricing-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border: 2px solid #facc15;
            border-radius: 12px;
            padding: 1rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideInRight 0.5s ease;
        }
        
        .toast-content {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .toast-icon {
            font-size: 1.5rem;
        }
        
        .toast-text strong {
            color: #0a192f;
            display: block;
            margin-bottom: 0.25rem;
        }
        
        .toast-text p {
            color: #6b7280;
            margin: 0;
            font-size: 0.9rem;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    
    // Add toast styles
    if (!document.querySelector('#toast-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'toast-styles';
        styleSheet.textContent = toastStyles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(toast);
    
    // Remove toast after 2 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 500);
    }, 2000);
}

// Initialize pricing interactions
document.addEventListener('DOMContentLoaded', function() {
    initPricingInteractions();
});

// Performance optimizations
function initPerformanceOptimizations() {
    // Lazy load images
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Preload critical resources
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = 'style';
        document.head.appendChild(link);
    });
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', initPerformanceOptimizations);

// (Removed analytics logging for production)

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initScrollAnimations,
        initFAQAccordion,
        initSeatCounter,
        initSmoothScrolling
    };
}
