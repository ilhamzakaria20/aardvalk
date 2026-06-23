/**
 * ECOGUARD PEST CONTROL - CLIENT SIDE SCRIPT
 * Handles Sticky Navbar, Active Navigation Scrollspy, Form Submissions, and Scroll Animations
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // --- STICKY NAVBAR ON SCROLL ---
    const navbar = document.getElementById('mainNavbar');
    const handleNavbarScroll = () => {
        if (window.scrollY > 80) {
            navbar.classList.add('sticky-nav');
        } else {
            navbar.classList.remove('sticky-nav');
        }
    };
    // Run once on load and attach to scroll
    handleNavbarScroll();
    window.addEventListener('scroll', handleNavbarScroll);


    // --- MOBILE MENU HAMBURGER ICON ANIMATION & AUTO-CLOSE ---
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.getElementById('navbarSupportedContent');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    if (navbarToggler) {
        navbarToggler.addEventListener('click', function() {
            navbarToggler.classList.toggle('active');
        });
    }

    // Auto-close mobile menu when clicking a link (excluding dropdowns)
    navLinks.forEach(link => {
        if (!link.classList.contains('dropdown-toggle')) {
            link.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show')) {
                    // Trigger Bootstrap collapse toggle
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) {
                        bsCollapse.hide();
                    }
                    navbarToggler.classList.remove('active');
                }
            });
        }
    });

    // Handle dropdown clicks on mobile (toggle display)
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    if (dropdownToggle) {
        dropdownToggle.addEventListener('click', function(e) {
            if (window.innerWidth < 1200) {
                e.preventDefault();
                e.stopPropagation();
                const nextEl = this.nextElementSibling;
                if (nextEl) {
                    nextEl.classList.toggle('show');
                }
            }
        });
    }


    // --- SCROLLSPY (ACTIVE LINK ON SCROLL) ---
    const sections = document.querySelectorAll('section[id]');
    const handleActiveNavLink = () => {
        const scrollPosition = window.scrollY + 120; // offset matching navbar height + breathing room

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.navbar-nav .nav-link').forEach(navLink => {
                    navLink.classList.remove('active');
                    if (navLink.getAttribute('href') === `#${sectionId}`) {
                        navLink.classList.add('active');
                    }
                });
            }
        });

        // Special case for home when scrolled back to top
        if (window.scrollY < 100) {
            document.querySelectorAll('.navbar-nav .nav-link').forEach(navLink => {
                navLink.classList.remove('active');
            });
            const homeLink = document.querySelector('.navbar-nav .nav-link[href="#home"]');
            if (homeLink) homeLink.classList.add('active');
        }
    };
    window.addEventListener('scroll', handleActiveNavLink);
    handleActiveNavLink(); // run on initial load


    // --- INTERSECTION OBSERVER FOR FADE-UP ANIMATIONS ---
    const animateElements = document.querySelectorAll('.animate-fade-up, .pest-card, .feature-card, .method-card, .post-card');
    
    // Add default transition class dynamically if not set
    animateElements.forEach(el => {
        if (!el.classList.contains('animate-fade-up')) {
            el.classList.add('animate-fade-up');
        }
    });

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // stop observing once animated
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // animate slightly before entering full view
    });

    animateElements.forEach(element => {
        animationObserver.observe(element);
    });


    // --- FORM SUBMISSIONS WITH SUCCESS TOAST ---
    const successToastEl = document.getElementById('formSuccessToast');
    const successToast = successToastEl ? bootstrap.Toast.getOrCreateInstance(successToastEl) : null;

    const handleFormSubmit = (formId) => {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Collect values (for demonstration or logs)
                const formData = new FormData(form);
                console.log(`Form ${formId} submitted with data:`, Object.fromEntries(formData));

                // Simulate processing delay
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Mengirim...';

                setTimeout(() => {
                    // Reset Button & Form
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                    form.reset();

                    // Show success alert/toast
                    if (successToast) {
                        successToast.show();
                    } else {
                        alert('Permohonan survey berhasil dikirim! Tim EcoGuard akan segera menghubungi Anda.');
                    }
                }, 1200);
            });
        }
    };

    handleFormSubmit('heroContactForm');
    handleFormSubmit('mainContactForm');


    // --- DYNAMIC PRE-FILLED WHATSAPP MESSAGE (Optional Feature) ---
    // Updates the WhatsApp links with tailored messages if users click specific service items
    const whatsappLinks = document.querySelectorAll('a[href^="https://wa.me/"]');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Optional analytics tracking could be placed here
            console.log('User clicking WhatsApp link to chat.');
        });
    });
});
