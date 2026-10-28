document.addEventListener('DOMContentLoaded', function () {

    // --- theme management ---
    const toggleButton = document.getElementById('theme-toggle');
    // Theme already applied pre-paint via inline script in <head>; sync body class + icon here.
    const savedTheme = document.documentElement.dataset.theme || 'dark';

    function setTheme(themeName) {
        document.body.classList.remove('light-mode', 'dark-mode');
        document.documentElement.dataset.theme = themeName;
        localStorage.setItem('theme', themeName);

        // Icon visibility handled by CSS via [data-theme] on <html>
        if (themeName === 'light') {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.add('dark-mode');
        }
    }

    // Initialize Theme
    setTheme(savedTheme || 'dark');

    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            const currentTheme = document.documentElement.dataset.theme;
            setTheme(currentTheme === 'light' ? 'dark' : 'light');
            document.dispatchEvent(new CustomEvent('themechange'));
        });
    }


    // --- scroll animations ---
    // --- Header Scroll Effect ---
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });

    // --- Constellation Animation ---
    const canvas = document.getElementById('neural-canvas');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (canvas && !prefersReducedMotion) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        // Configuration
        const particleCount = 85; // Denser constellation
        const connectionDistance = 150;
        const mouseDistance = 200;

        // Cached theme colors (avoid getComputedStyle per particle per frame)
        let colors = { textPrimary: '#fff', accentPrimary: '#4fc3f7', textTertiary: '#888' };

        function refreshColors() {
            const style = getComputedStyle(document.body);
            colors.textPrimary = style.getPropertyValue('--text-primary').trim();
            colors.accentPrimary = style.getPropertyValue('--accent-primary').trim();
            colors.textTertiary = style.getPropertyValue('--text-tertiary').trim();
        }

        // Mouse State
        let mouse = { x: null, y: null };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Resize (debounced)
        let resizeTimer;
        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initParticles();
        }

        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resize, 200);
        });

        // Re-read colors when theme changes
        document.addEventListener('themechange', refreshColors);

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5; // Slow movement
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.fillStyle = colors.textPrimary;
                ctx.globalAlpha = 0.2; // Very subtle
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            // Update and Draw Particles
            particles.forEach((p, index) => {
                p.update();
                p.draw();

                // Connect to Mouse
                if (mouse.x != null) {
                    let dx = mouse.x - p.x;
                    let dy = mouse.y - p.y;
                    let distance = Math.hypot(dx, dy);
                    if (distance < mouseDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = colors.accentPrimary;
                        ctx.globalAlpha = 1 - (distance / mouseDistance);
                        ctx.lineWidth = 1;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }

                // Connect to other particles
                for (let j = index; j < particles.length; j++) {
                    let p2 = particles[j];
                    let dx = p.x - p2.x;
                    let dy = p.y - p2.y;
                    let distance = Math.hypot(dx, dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = colors.textTertiary;
                        ctx.globalAlpha = (1 - (distance / connectionDistance)) * 0.15; // Very subtle
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(animate);
        }

        refreshColors();
        resize();
        animate();
    }


    // Intersection Observer for Timeline
    const observerOptions = {
        threshold: 0.05,
        rootMargin: "0px 0px -40px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Reveal when entering viewport OR already scrolled past (fast scroll / anchor jump)
            if (entry.isIntersecting || entry.boundingClientRect.bottom < 60) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        observer.observe(item);
    });

    // Scroll-reveal for section blocks (skills, education, awards, personal)
    const revealTargets = document.querySelectorAll(
        '.skills-category, .bento-grid-2 > div > .job-card, .personal-interests-container'
    );
    revealTargets.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
        // Safety: reveal anything already scrolled past (above viewport) on load
        if (el.getBoundingClientRect().bottom < 0) {
            el.classList.add('visible');
            observer.unobserve(el);
        }
    });

    // --- Scroll Indicator ---
    const scrollIndicator = document.getElementById('scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            document.getElementById('experience').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- Dynamic Experience Calculation ---
    function updateExperience() {
        // Start Dates
        const itStartDate = new Date('2013-11-15');
        const dsStartDate = new Date('2016-01-01');
        const now = new Date();

        const calculateYears = (startDate) => {
            const diffInMs = now - startDate;
            const diffInYears = diffInMs / (1000 * 60 * 60 * 24 * 365.25);
            return Math.floor(diffInYears);
        };

        const totalYears = Math.round((now - itStartDate) / (1000 * 60 * 60 * 24 * 365.25));
        const dsYears = calculateYears(dsStartDate);

        const totalExpEl = document.getElementById('total-exp');
        const dsExpEl = document.getElementById('ds-exp');
        const bentoTotalExpEl = document.getElementById('bento-total-exp');
        const bentoDsExpEl = document.getElementById('bento-ds-exp');

        if (totalExpEl) totalExpEl.innerText = `${totalYears} Years`;
        if (dsExpEl) dsExpEl.innerText = `${dsYears}+ Years`;
        if (bentoTotalExpEl) bentoTotalExpEl.innerText = `${totalYears} Years`;
        if (bentoDsExpEl) bentoDsExpEl.innerText = `${dsYears}+ Years`;
    }

    updateExperience();

});
