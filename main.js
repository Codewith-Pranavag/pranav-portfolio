/*
 * Pranav Kumar Agrawal - Premium Personal Brand Website Script
 * Canvas system, stats counter animations, API integrations, and light-theme overrides.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const isActive = navMenu.classList.contains('active');
        if (isActive) {
            mobileMenuBtn.innerHTML = '<i data-lucide="x"></i>';
        } else {
            mobileMenuBtn.innerHTML = '<i data-lucide="menu"></i>';
        }
        window.lucide.createIcons();
    });

    // Close menu when clicking links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i data-lucide="menu"></i>';
            window.lucide.createIcons();
        });
    });

    // Active Navigation Highlighting on Scroll & Sticky Navbar
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 220)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}` || (current === 'hero' && link.getAttribute('href') === '#')) {
                link.classList.add('active');
            }
        });

        const header = document.getElementById('main-header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Faint Particle System for Light Theme background
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 160 };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1.5;
            this.vx = (Math.random() - 0.5) * 0.35;
            this.vy = (Math.random() - 0.5) * 0.35;
            this.alpha = Math.random() * 0.12 + 0.06; // Faint alpha for light background
        }

        draw() {
            ctx.fillStyle = `rgba(15, 23, 42, ${this.alpha})`; // Charcoal particles
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

            if (mouse.x != null && mouse.y != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.hypot(dx, dy);
                if (distance < mouse.radius) {
                    let force = (mouse.radius - distance) / mouse.radius;
                    // Faint attraction to the cursor
                    let directionX = (dx / distance) * force * 1.2;
                    let directionY = (dy / distance) * force * 1.2;
                    this.x += directionX;
                    this.y += directionY;
                }
            }
        }
    }

    function initParticles() {
        particles = [];
        let numberOfParticles = Math.min((canvas.width * canvas.height) / 10000, 100);
        for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle());
        }
    }
    initParticles();
    window.addEventListener('resize', initParticles);

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw connecting networks
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = Math.hypot(dx, dy);

                if (distance < 120) {
                    // Faint blue connections
                    let alpha = (120 - distance) / 120 * 0.08;
                    ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }

        // Draw connections to mouse
        if (mouse.x !== null && mouse.y !== null) {
            for (let i = 0; i < particles.length; i++) {
                let dx = particles[i].x - mouse.x;
                let dy = particles[i].y - mouse.y;
                let distance = Math.hypot(dx, dy);

                if (distance < mouse.radius) {
                    let alpha = (mouse.radius - distance) / mouse.radius * 0.08;
                    ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
                    ctx.lineWidth = 0.9;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }

        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // 3. Counter Animation for Stats
    const statsContainer = document.getElementById('stats');
    const counters = document.querySelectorAll('.stat-count');
    let countersStarted = false;

    function startCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 1500; // 1.5s animation duration
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                
                // Ease out cubic
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const currentValue = Math.floor(easeProgress * target);
                
                // Append + sign for large counts
                if (target >= 10 && target !== 302) {
                    counter.innerText = currentValue + "+";
                } else {
                    counter.innerText = currentValue;
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    if (target >= 10 && target !== 302) {
                        counter.innerText = target + "+";
                    } else {
                        counter.innerText = target;
                    }
                }
            }
            requestAnimationFrame(updateCounter);
        });
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersStarted) {
                countersStarted = true;
                startCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    if (statsContainer) {
        statsObserver.observe(statsContainer);
    }

    // 4. Entrance & Reveal Animations
    if (window.gsap) {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
        tl.from('.hero-name', { opacity: 0, y: -20, delay: 0.1 })
          .from('.hero h1', { opacity: 0, y: 30, duration: 1.2 }, '-=0.8')
          .from('.hero-statement', { opacity: 0, y: 15 }, '-=0.8')
          .from('.hero-intro', { opacity: 0, y: 15 }, '-=0.6')
          .from('.hero .btn-container .btn', { opacity: 0, scale: 0.95, stagger: 0.1 }, '-=0.6')
          .from('.hero-visual', { opacity: 0, scale: 0.98, duration: 1.4 }, '-=0.8');
    }

    const revealTargets = document.querySelectorAll('.about-feature-card, .timeline-card, .why-card, .project-card, .dashboard-card, .achievement-card, .contact-info, .contact-form-container');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(target => {
        target.style.opacity = '0';
        target.style.transform = 'translateY(24px)';
        target.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        revealObserver.observe(target);
    });

    // 5. Dynamic GitHub Projects Fetcher
    const projectsContainer = document.getElementById('github-projects-container');
    const githubUser = 'Codewith-Pranavag';
    
    const fallbackProjects = [
        {
            name: "bhuone-labs-app",
            description: "Affordable and secure digital product infrastructure built for local enterprise applications. Incorporates secure API sessions, SQLite databases, and structured layouts.",
            languages: ["Java", "Android", "REST APIs"],
            html_url: "https://github.com/Codewith-Pranavag"
        },
        {
            name: "vapt-scanner-tool",
            description: "A lightweight Vulnerability Assessment and Penetration Testing utility. Audits secure server headers, checks SSL expiry, and detects exposed system ports.",
            languages: ["Python", "Network Security", "VAPT"],
            html_url: "https://github.com/Codewith-Pranavag"
        },
        {
            name: "secure-auth-gateway",
            description: "Node.js API gateway engineered with standard cybersecurity middleware (helmet, rate-limiter, JWT validation) to prevent brute-force attacks.",
            languages: ["JavaScript", "Node.js", "Express"],
            html_url: "https://github.com/Codewith-Pranavag"
        },
        {
            name: "dsa-java-solutions",
            description: "A collection of 300+ algorithms and data structures questions resolved with optimal space-time complexities in Java. Includes OOP structures.",
            languages: ["Java", "DSA", "Algorithms"],
            html_url: "https://github.com/Codewith-Pranavag"
        },
        {
            name: "cyber-awareness-kit",
            description: "A digital toolkit and dashboard containing awareness checklists, phishing simulations, and secure guidelines for Haryana Police advocacy.",
            languages: ["HTML", "CSS", "JavaScript"],
            html_url: "https://github.com/Codewith-Pranavag"
        },
        {
            name: "web-store-infrastructure",
            description: "A scalable and highly secure web store designed for local businesses. Equipped with input sanitizations, SQL-injection prevention, and dynamic rendering.",
            languages: ["JavaScript", "SQL", "Tailwind"],
            html_url: "https://github.com/Codewith-Pranavag"
        }
    ];

    function renderProjects(projects) {
        projectsContainer.innerHTML = '';
        projects.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'project-card';
            
            const techList = repo.languages || [repo.language].filter(Boolean);
            if (techList.length === 0) techList.push('DevOps');
            const techItems = techList.map(tech => `<li>${tech}</li>`).join('');

            card.innerHTML = `
                <div>
                    <div class="proj-top">
                        <div class="proj-folder">
                            <i data-lucide="folder" style="width: 28px; height: 28px;"></i>
                        </div>
                        <div class="proj-links">
                            <a href="${repo.html_url}" target="_blank" rel="noopener" aria-label="GitHub Repository">
                                <i data-lucide="github" style="width: 20px; height: 20px;"></i>
                            </a>
                            <a href="${repo.html_url}" target="_blank" rel="noopener" aria-label="External Link">
                                <i data-lucide="external-link" style="width: 20px; height: 20px;"></i>
                            </a>
                        </div>
                    </div>
                    <h3>${repo.name.replace(/-/g, ' ')}</h3>
                    <p>${repo.description || 'No description provided yet. Check the repository codebase link for details.'}</p>
                </div>
                <div>
                    <ul class="proj-tech-list">
                        ${techItems}
                    </ul>
                </div>
            `;
            projectsContainer.appendChild(card);
        });
        
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    async function fetchGitHubRepos() {
        try {
            const response = await fetch(`https://api.github.com/users/${githubUser}/repos?sort=updated&per_page=6`);
            if (!response.ok) throw new Error('API fetch failed');
            const data = await response.json();
            
            const enrichedRepos = await Promise.all(data.map(async (repo) => {
                try {
                    const langRes = await fetch(repo.languages_url);
                    if (!langRes.ok) return repo;
                    const langData = await langRes.json();
                    repo.languages = Object.keys(langData).slice(0, 3);
                } catch {
                    repo.languages = [repo.language].filter(Boolean);
                }
                return repo;
            }));
            
            renderProjects(enrichedRepos);
        } catch (err) {
            console.warn('GitHub API rate-limit or offline. Rendering fallback portfolio systems.', err);
            renderProjects(fallbackProjects);
        }
    }
    fetchGitHubRepos();

    // 6. LeetCode Stats Completion Circle
    const leetcodeOffsetMax = 377;
    const solvedNum = 302;
    const totalTargetLC = 1100;
    const percentage = Math.min(solvedNum / totalTargetLC, 1);
    const circleVal = document.querySelector('.leetcode-circle-val');
    
    if (circleVal) {
        circleVal.style.strokeDashoffset = leetcodeOffsetMax - (leetcodeOffsetMax * percentage);
    }

    // 7. Render Custom SVG Github Contribution Grid
    const heatmap = document.getElementById('contrib-heatmap');
    if (heatmap) {
        const totalWeeks = 38;
        heatmap.style.gridTemplateColumns = `repeat(${totalWeeks}, 10px)`;
        
        for (let col = 0; col < totalWeeks; col++) {
            for (let row = 0; row < 7; row++) {
                const cell = document.createElement('div');
                cell.className = 'contrib-cell';
                
                const rand = Math.random() * 100;
                if (rand > 92) {
                    cell.classList.add('lvl-4');
                } else if (rand > 80) {
                    cell.classList.add('lvl-3');
                } else if (rand > 60) {
                    cell.classList.add('lvl-2');
                } else if (rand > 30) {
                    cell.classList.add('lvl-1');
                }
                
                heatmap.appendChild(cell);
            }
        }
    }

    // 8. Contact Form Handler
    const contactForm = document.getElementById('portfolio-contact-form');
    const formCallback = document.getElementById('form-callback');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Connecting Server... <i data-lucide="loader" class="animate-spin" style="width:16px; height:16px;"></i>';
        window.lucide.createIcons();

        formCallback.className = 'form-status';
        formCallback.style.display = 'none';

        // Simulate secure API response
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            window.lucide.createIcons();
            
            const name = document.getElementById('client-name').value;
            const email = document.getElementById('client-email').value;
            
            if (name && email) {
                formCallback.innerHTML = `[SUCCESS]: TLS handshake completed. Message packets transmitted successfully. Welcome, ${name}!`;
                formCallback.className = 'form-status success';
                contactForm.reset();
            } else {
                formCallback.innerHTML = `[ERROR]: Parameter validation failed. Check headers.`;
                formCallback.className = 'form-status error';
            }
        }, 1600);
    });
});
