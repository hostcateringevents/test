document.addEventListener('DOMContentLoaded', () => {
    // --- Smooth Scrolling (Lenis) ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
        smooth: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // --- Mobile Navigation Logic ---
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    const navOverlay = document.getElementById('nav-overlay');

    function toggleMenu() {
        menuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        navOverlay.classList.toggle('active');
    }

    menuBtn.addEventListener('click', toggleMenu);

    // Click outside to close
    navOverlay.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Smooth scrolling for anchor links using Lenis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                lenis.scrollTo(targetElement, {
                    offset: -80, // Adjust for navbar height
                    duration: 1.2
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    toggleMenu();
                }
            }
        });
    });

    // Canvas animation removed for a simpler fade-in style

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, {
        threshold: 0.15, // Trigger when 15% visible
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Form Validation Logic ---
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            
            // Validate Phone
            const phoneInput = document.getElementById('reg-phone');
            const phonePattern = /^[0-9]{10,14}$/;
            const phoneGroup = phoneInput.closest('.form-group');
            
            if (!phonePattern.test(phoneInput.value)) {
                phoneGroup.classList.add('error');
                isValid = false;
            } else {
                phoneGroup.classList.remove('error');
            }
            
            // Validate basic required fields
            const requiredInputs = registerForm.querySelectorAll('input[required]');
            requiredInputs.forEach(input => {
                const group = input.closest('.form-group');
                if (!input.value.trim() && input.type !== 'file') {
                    // Optional visual tweak for empty required fields
                }
            });

            if (isValid) {
                const submitBtn = registerForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;

                const formData = new FormData(registerForm);

                fetch('https://ab01.vercel.app/api/submit', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert("Application submitted successfully!");
                        registerForm.reset();
                    } else {
                        alert("Something went wrong. Please try again.");
                    }
                })
                .catch(error => {
                    console.error("Error submitting form:", error);
                    alert("Network error. Please try again later.");
                })
                .finally(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                });
            }
        });
    }

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            
            // Validate Email
            const emailInput = document.getElementById('email');
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const emailGroup = emailInput.closest('.form-group');
            
            if (!emailPattern.test(emailInput.value)) {
                emailGroup.classList.add('error');
                isValid = false;
            } else {
                emailGroup.classList.remove('error');
            }
            
            if (isValid) {
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;

                const formData = new FormData(contactForm);

                fetch('https://ab01.vercel.app/api/submit', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert("Inquiry sent successfully!");
                        contactForm.reset();
                    } else {
                        alert("Something went wrong. Please try again.");
                    }
                })
                .catch(error => {
                    console.error("Error submitting form:", error);
                    alert("Network error. Please try again later.");
                })
                .finally(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                });
            }
        });
    }

    // --- Back to Top Logic ---
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

});
