// ============================================
// FUNKCE KARUSELU
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
        this.autoPlayDelay = 5000; // 5 sekund

        this.init();
    }

    init() {
        if (this.slides.length === 0) return;

        // Event listenery
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Kliky na indikátory
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Automatické přehrávání
        this.startAutoPlay();

        // Pozastavení při najetí myší
        this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());

        // Podpora pro touch/swipe
        this.initTouchEvents();
    }

    showSlide(index) {
        // Odstranění aktivní třídy ze všech slidů
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.indicators.forEach(indicator => indicator.classList.remove('active'));

        // Přidání aktivní třídy k aktuálnímu slidu
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

        // Podpora pro myš drag
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
// FUNKCE MOBILNÍHO MENU
// ============================================

class MobileMenu {
    constructor() {
        this.hamburger = document.getElementById('hamburger');
        this.menu = document.getElementById('menu');
        this.closeBtn = document.getElementById('menuClose');

        if (!this.hamburger || !this.menu) {
            console.error('Prvky hamburger menu nebyly nalezeny!');
            return;
        }

        this.init();
    }

    init() {
        // Přepnutí menu hamburgerem
        this.hamburger.addEventListener('click', () => {
            this.menu.classList.toggle('open');
        });

        // Zavření menu křížkem
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => {
                this.menu.classList.remove('open');
            });
        }

        // Zavření menu při kliknutí na odkaz
        const menuLinks = this.menu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.menu.classList.remove('open');
            });
        });

        // Zavření menu klávesou Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.menu.classList.contains('open')) {
                this.menu.classList.remove('open');
            }
        });
    }
}

// ============================================
// PŘILEPENÁ HLAVIČKA PŘI SCROLLOVÁNÍ
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
// ZPRACOVÁNÍ PŘIHLAŠOVACÍHO FORMULÁŘE
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

        // Zde byste normálně odeslali data na server
        // Prozatím jen ukážeme jednoduchou zpětnou vazbu
        if (username && password) {
            // Simulace přihlašovacího procesu
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
                // V reálné aplikaci byste přesměrovali nebo zobrazili zprávu o úspěchu
                console.log('Login attempt:', { username, password });
            }, 1500);
        }
    }
}

// ============================================
// ZPRACOVÁNÍ NEWSLETTER FORMULÁŘE
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

            // Simulace API volání
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
// HLADKÉ SCROLLOVÁNÍ PRO KOTVY
// ============================================

class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                // Přeskočit prázdný hash nebo jen #
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
// INTERSECTION OBSERVER PRO ANIMACE
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

        // Sledování prvků které se mají animovat
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
// VÝBĚR JAZYKA (Zástupce)
// ============================================

class LanguageSelector {
    constructor() {
        this.langBtn = document.getElementById('langBtn');
        this.dropdown = document.getElementById('langDropdown');
        this.container = document.querySelector('.language-selector');

        if (!this.langBtn || !this.dropdown || !this.container) return;

        this.init();
    }

    init() {
        // Přepnutí dropdownu
        this.langBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const isOpen = this.container.classList.toggle('open');
            this.langBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Zavření při kliknutí venku
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target)) {
                this.close();
            }
        });

        // Zavření na Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });
    }

    close() {
        this.container.classList.remove('open');
        this.langBtn.setAttribute('aria-expanded', 'false');
    }
}

// ============================================
// ANIMACE SCROLLOVÁNÍ SEKCE PROCESU
// ============================================

class ProcessScrollAnimations {
    constructor() {
        this.processSteps = document.querySelectorAll('.process-step');
        this.timeline = document.querySelector('.process-timeline');
        this.init();
    }

    init() {
        if (!this.processSteps.length) return;

        // Vytvoření intersection observer pro animace spouštěné scrollem
        const observerOptions = {
            threshold: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
            rootMargin: '0px -50px 0px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const step = entry.target;
                const index = Array.from(this.processSteps).indexOf(step);
                
                if (entry.isIntersecting) {
                    // Výpočet progresu na základě viditelnosti prvku
                    const progress = Math.min(entry.intersectionRatio, 1.0);
                    
                    // Přidání viditelné třídy pro stylování
                    step.classList.add('visible');
                    
                    // Aktualizace indikátoru progresu pokud existuje
                    this.updateProgress(step, progress);
                } else {
                    step.classList.remove('visible');
                }
            });
        }, observerOptions);

        // Sledování každého kroku procesu
        this.processSteps.forEach(step => observer.observe(step));
    }

    updateProgress(step, progress) {
        // Můžete zde přidat progress bar nebo indikátor pokud potřebujete
        // Prozatím jen použijeme viditelnou třídu pro stylování
        const progressPercent = Math.round(progress * 100);
        step.style.setProperty('--progress', `${progressPercent}%`);
    }
}

// ============================================
// INICIALIZACE VŠECH FUNKCÍ
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Inicializace karuselu
    new Carousel('carousel');

    // Inicializace mobilního menu
    new MobileMenu();

    // Inicializace přilepené hlavičky
    new StickyHeader();

    // Inicializace přihlašovacího formuláře
    new LoginForm();

    // Inicializace newsletter formuláře
    new NewsletterForm();

    // Inicializace hladkého scrollování
    new SmoothScroll();

    // Inicializace animací při scrollování
    new ScrollAnimations();

    // Inicializace animací scrollování procesu
    new ProcessScrollAnimations();

    // Inicializace výběru jazyka
    new LanguageSelector();

    // Přidání odstranění loading třídy
    document.body.classList.add('loaded');
});

// ============================================
// POMOCNÁ FUNKCE: DEBOUNCE
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
// ZPRACOVÁNÍ ZMĚNY VELIKOSTI OKNA
// ============================================

window.addEventListener('resize', debounce(() => {
    // Jakákoliv logika pro změnu velikosti může být zde
    // Například přepočítání rozměrů karuselu pokud potřebujete
}, 250));

