document.addEventListener('DOMContentLoaded', function () {

    // --- theme management ---
    const toggleButton = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');
    // const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; // Removed as per instruction

    function setTheme(themeName) {
        document.body.classList.remove('light-mode', 'dark-mode');
        document.documentElement.setAttribute('data-theme', themeName);
        localStorage.setItem('theme', themeName);

        // Update Icon
        const icon = toggleButton.querySelector('i');
        if (themeName === 'light') {
            document.body.classList.add('light-mode');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            document.body.classList.add('dark-mode');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // Initialize Theme
    setTheme(savedTheme || 'dark');

    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            setTheme(currentTheme === 'light' ? 'dark' : 'light');
        });
    }


    // --- scroll animations ---
    // Header Scroll Effect
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Constellation Animation ---
    const canvas = document.getElementById('neural-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        // Configuration
        const particleCount = 60; // Minimalist count
        const connectionDistance = 150;
        const mouseDistance = 200;

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

        // Resize
        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initParticles();
        }

        window.addEventListener('resize', resize);

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
                ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-primary').trim();
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
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouseDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--accent-primary').trim();
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
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        // Use accent color for connections
                        ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--text-tertiary').trim();
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

        resize();
        animate();
    }


    // Intersection Observer for Timeline
    const observerOptions = {
        threshold: 0.2,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        observer.observe(item);
    });

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

        const totalYears = calculateYears(itStartDate);
        const dsYears = calculateYears(dsStartDate);

        const totalExpEl = document.getElementById('total-exp');
        const dsExpEl = document.getElementById('ds-exp');
        const bentoTotalExpEl = document.getElementById('bento-total-exp');
        const bentoDsExpEl = document.getElementById('bento-ds-exp');

        if (totalExpEl) totalExpEl.innerText = `${totalYears}+ Years`;
        if (dsExpEl) dsExpEl.innerText = `${dsYears}+ Years`;
        if (bentoTotalExpEl) bentoTotalExpEl.innerText = `${totalYears}+ Years`;
        if (bentoDsExpEl) bentoDsExpEl.innerText = `${dsYears}+ Years`;
    }

    updateExperience();

});
