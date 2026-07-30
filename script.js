/* ==========================================================================
   EL PAPAGAYO PETIT CAFÉ & VERMOUTH BAR
   Landing Page JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* -------------------------------------------------------------------------
       HEADER - Scroll Behavior
       ------------------------------------------------------------------------- */
    const header = document.getElementById('header');
    let lastScroll = 0;
    let ticking = false;

    const handleHeaderScroll = () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(handleHeaderScroll);
            ticking = true;
        }
    }, { passive: true });

    /* -------------------------------------------------------------------------
       MOBILE MENU
       ------------------------------------------------------------------------- */
    const menuBtn = document.getElementById('menuBtn');
    const mainNav = document.getElementById('mainNav');
    let menuOpen = false;

    const toggleMenu = () => {
        menuOpen = !menuOpen;
        mainNav.classList.toggle('active', menuOpen);
        menuBtn.classList.toggle('active', menuOpen);
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        
        // Animate hamburger to X
        const spans = menuBtn.querySelectorAll('span');
        if (menuOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    };

    menuBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking a link
    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (menuOpen) toggleMenu();
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOpen) {
            toggleMenu();
        }
    });

    /* -------------------------------------------------------------------------
       MENU TABS
       ------------------------------------------------------------------------- */
    const menuTabs = document.querySelectorAll('.menu__tab');
    const menuCategories = document.querySelectorAll('.menu__category');

    const switchTab = (tab) => {
        const targetTab = tab.getAttribute('data-tab');
        
        // Update active tab
        menuTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update active category with animation
        menuCategories.forEach(cat => {
            cat.classList.remove('active');
            if (cat.getAttribute('data-category') === targetTab) {
                cat.classList.add('active');
                // Re-trigger fade-up animations for new category items
                cat.querySelectorAll('.fade-up').forEach(el => {
                    el.classList.remove('visible');
                    setTimeout(() => {
                        observeElement(el);
                    }, 50);
                });
            }
        });
    };

    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab));
    });

    /* -------------------------------------------------------------------------
       INTERSECTION OBSERVER - Scroll Animations
       ------------------------------------------------------------------------- */
    const observeElement = (el) => {
        if (!el) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        observer.observe(el);
    };

    // Observe all fade-up elements
    const fadeUpElements = document.querySelectorAll('.fade-up');
    fadeUpElements.forEach(el => observeElement(el));

    /* -------------------------------------------------------------------------
       SMOOTH SCROLL for anchor links
       ------------------------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* -------------------------------------------------------------------------
       HERO PARALLAX (subtle)
       ------------------------------------------------------------------------- */
    const heroImg = document.querySelector('.hero__bg-img');
    
    if (heroImg && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = document.querySelector('.hero').offsetHeight;
            
            if (scrolled < heroHeight) {
                const parallaxValue = scrolled * 0.3;
                heroImg.style.transform = `scale(1.05) translateY(${parallaxValue}px)`;
            }
        }, { passive: true });
    }

    /* -------------------------------------------------------------------------
       GALLERY - Lightbox Effect (simple hover state)
       ------------------------------------------------------------------------- */
    const galleryItems = document.querySelectorAll('.gallery__item');
    
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });

    /* -------------------------------------------------------------------------
       TESTIMONIALS - Auto-rotate (optional enhancement)
       ------------------------------------------------------------------------- */
    // Subtle hover interaction already handled in CSS

    /* -------------------------------------------------------------------------
       WHATSAPP - Dynamic message based on section
       ------------------------------------------------------------------------- */
    const whatsappFloat = document.querySelector('.whatsapp-float');
    
    if (whatsappFloat) {
        // Add entrance animation
        setTimeout(() => {
            whatsappFloat.style.opacity = '1';
            whatsappFloat.style.transform = 'scale(1)';
        }, 1000);
    }

    /* -------------------------------------------------------------------------
       FEATURE CARDS - Hover enhancement
       ------------------------------------------------------------------------- */
    const features = document.querySelectorAll('.feature');
    
    features.forEach(feature => {
        feature.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.feature__icon');
            if (icon) {
                icon.style.backgroundColor = 'var(--color-sage)';
                icon.style.color = 'var(--color-white)';
                icon.style.transform = 'scale(1.05)';
            }
        });
        
        feature.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.feature__icon');
            if (icon) {
                icon.style.backgroundColor = 'var(--color-gray-50)';
                icon.style.color = 'var(--color-sage)';
                icon.style.transform = 'scale(1)';
            }
        });
    });

    /* -------------------------------------------------------------------------
       PERFORMANCE - Lazy load images with native support
       ------------------------------------------------------------------------- */
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Fallback for browsers without native lazy loading
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    lazyObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            lazyObserver.observe(img);
        });
    }

    /* -------------------------------------------------------------------------
       ACCESSIBILITY - Focus management for mobile menu
       ------------------------------------------------------------------------- */
    const focusableElements = 'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
    
    mainNav.addEventListener('keydown', (e) => {
        if (!menuOpen) return;
        
        const focusable = mainNav.querySelectorAll(focusableElements);
        const firstFocusable = focusable[0];
        const lastFocusable = focusable[focusable.length - 1];
        
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
    });

    /* -------------------------------------------------------------------------
       INITIAL STATE
       ------------------------------------------------------------------------- */
    // Trigger initial scroll check
    handleHeaderScroll();
    
    // Trigger initial fade-up for elements already in viewport
    setTimeout(() => {
        fadeUpElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('visible');
            }
        });
    }, 100);

    /* -------------------------------------------------------------------------
       Console branding
       ------------------------------------------------------------------------- */
    console.log(
        '%c🐦 El Papagayo Petit Café & Vermouth Bar',
        'font-size: 16px; font-weight: bold; color: #8FAE8B;'
    );
    console.log(
        '%cDesarrollado con ☕ por tuweben3días.com',
        'font-size: 12px; color: #757575;'
    );

});
