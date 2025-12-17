// ============================================
// CAROUSEL FUNCTIONALITY
// ============================================

class Carousel {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.slides = this.container.querySelectorAll('.carousel-slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.getElementById('carouselPrev');
        this.nextBtn = document.getElementById('carouselNext');
        this.currentSlide = 0;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 seconds

        this.init();
    }

    init() {
        if (this.slides.length === 0) return;

        // Event listeners
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Indicator clicks
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Auto-play
        this.startAutoPlay();

        // Pause on hover
        this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());

        // Touch/swipe support
        this.initTouchEvents();
    }

    showSlide(index) {
        // Remove active class from all slides
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.indicators.forEach(indicator => indicator.classList.remove('active'));

        // Add active class to current slide
        if (this.slides[index]) {
            this.slides[index].classList.add('active');
        }
        if (this.indicators[index]) {
            this.indicators[index].classList.add('active');
        }

        this.currentSlide = index;
    }

    nextSlide() {
        const next = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(next);
        this.resetAutoPlay();
    }

    prevSlide() {
        const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prev);
        this.resetAutoPlay();
    }

    goToSlide(index) {
        if (index >= 0 && index < this.slides.length) {
            this.showSlide(index);
            this.resetAutoPlay();
        }
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }

    initTouchEvents() {
        let touchStartX = 0;
        let touchEndX = 0;

        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });

        // Mouse drag support
        let isDragging = false;
        let dragStartX = 0;

        this.container.addEventListener('mousedown', (e) => {
            isDragging = true;
            dragStartX = e.clientX;
            this.stopAutoPlay();
        });

        this.container.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });

        this.container.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            const dragEndX = e.clientX;
            const diff = dragStartX - dragEndX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            this.startAutoPlay();
        });

        this.container.addEventListener('mouseleave', () => {
            isDragging = false;
            this.startAutoPlay();
        });
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
}

// ============================================
// MOBILE MENU FUNCTIONALITY
// ============================================

class MobileMenu {
    constructor() {
        this.toggleBtn = document.getElementById('mobileMenuToggle');
        this.nav = document.getElementById('nav');
        this.contactInfo = document.querySelector('.contact-info');
        this.header = document.getElementById('header');

        if (!this.toggleBtn || !this.nav) return;

        this.init();
    }

    init() {
        this.toggleBtn.addEventListener('click', () => this.toggleMenu());

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.nav.contains(e.target) && 
                !this.toggleBtn.contains(e.target) && 
                this.nav.classList.contains('active')) {
                this.closeMenu();
            }
        });

        // Close menu when clicking on a link
        const navLinks = this.nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.closeMenu();
                }
            });
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.toggleBtn.classList.toggle('active');
        this.nav.classList.toggle('active');
        
        if (this.contactInfo) {
            this.contactInfo.classList.toggle('active');
        }

        // Prevent body scroll when menu is open
        if (this.nav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    closeMenu() {
        this.toggleBtn.classList.remove('active');
        this.nav.classList.remove('active');
        
        if (this.contactInfo) {
            this.contactInfo.classList.remove('active');
        }

        document.body.style.overflow = '';
    }
}

// ============================================
// STICKY HEADER ON SCROLL
// ============================================

class StickyHeader {
    constructor() {
        this.header = document.getElementById('header');
        if (!this.header) return;

        this.init();
    }

    init() {
        let lastScroll = 0;
        const scrollThreshold = 100;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > scrollThreshold) {
                this.header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
            } else {
                this.header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
            }

            lastScroll = currentScroll;
        });
    }
}

// ============================================
// LOGIN FORM HANDLING
// ============================================

class LoginForm {
    constructor() {
        this.form = document.getElementById('loginForm');
        if (!this.form) return;

        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Here you would typically send the data to a server
        // For now, we'll just show a simple feedback
        if (username && password) {
            // Simulate login process
            const loginBtn = this.form.querySelector('.login-btn');
            const originalHTML = loginBtn.innerHTML;
            
            loginBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            `;
            loginBtn.style.backgroundColor = '#10B981';

            setTimeout(() => {
                loginBtn.innerHTML = originalHTML;
                loginBtn.style.backgroundColor = '';
                // In a real application, you would redirect or show success message
                console.log('Login attempt:', { username, password });
            }, 1500);
        }
    }
}

// ============================================
// NEWSLETTER FORM HANDLING
// ============================================

class NewsletterForm {
    constructor() {
        this.form = document.getElementById('newsletterForm');
        if (!this.form) return;

        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    handleSubmit() {
        const email = this.form.querySelector('.newsletter-input').value;
        const submitBtn = this.form.querySelector('.newsletter-btn');
        const originalText = submitBtn.textContent;

        if (email) {
            submitBtn.textContent = 'Odesílám...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                submitBtn.textContent = 'Odesláno ✓';
                submitBtn.style.backgroundColor = '#10B981';
                this.form.querySelector('.newsletter-input').value = '';

                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.disabled = false;
                }, 2000);
            }, 1000);
        }
    }
}

// ============================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ============================================

class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                // Skip empty hash or just #
                if (href === '#' || href === '') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerHeight = document.getElementById('header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================

class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements that should animate
        const animateElements = document.querySelectorAll('.usp-item, .news-card, .process-step');
        animateElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(el);
        });
    }
}

// ============================================
// LANGUAGE SELECTOR (Placeholder)
// ============================================

class LanguageSelector {
    constructor() {
        this.langBtn = document.getElementById('langBtn');
        if (!this.langBtn) return;

        // For now, just a placeholder - dropdown functionality can be added later
        this.langBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Language dropdown would open here
            console.log('Language selector clicked');
        });
    }
}

// ============================================
// INITIALIZE ALL FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize carousel
    new Carousel('carousel');

    // Initialize mobile menu
    new MobileMenu();

    // Initialize sticky header
    new StickyHeader();

    // Initialize login form
    new LoginForm();

    // Initialize newsletter form
    new NewsletterForm();

    // Initialize smooth scrolling
    new SmoothScroll();

    // Initialize scroll animations
    new ScrollAnimations();

    // Initialize language selector
    new LanguageSelector();

    // Add loading class removal
    document.body.classList.add('loaded');
});

// ============================================
// UTILITY: DEBOUNCE FUNCTION
// ============================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// HANDLE WINDOW RESIZE
// ============================================

window.addEventListener('resize', debounce(() => {
    // Any resize-specific logic can go here
    // For example, recalculating carousel dimensions if needed
}, 250));

