/*
 * Pranav Kumar Agrawal - Premium Personal Brand Website Script
 * Canvas system, stats counter animations, real-time API integrations, and multi-page preloader.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // ==========================================================================
    // 1. Preloader Bar Progression
    // ==========================================================================
    const preloaderBar = document.querySelector('.preloader-progress-bar');
    if (preloaderBar) {
        // Animate loading bar to 100% on script execute
        setTimeout(() => {
            preloaderBar.style.width = '100%';
        }, 50);
    }

    // Fade out preloader on Window Load
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.classList.add('fade-out');
                
                // GSAP Entry Reveal on page load
                if (window.gsap) {
                    gsap.from('.hero-name, .section-tag', { opacity: 0, y: -20, delay: 0.1, duration: 0.8, ease: 'power3.out' });
                    gsap.from('.hero h1, .section-title', { opacity: 0, y: 30, duration: 1, delay: 0.2, ease: 'power3.out' });
                    gsap.from('.hero-statement, .section-desc', { opacity: 0, y: 15, duration: 0.8, delay: 0.4, ease: 'power3.out' });
                    gsap.from('.hero-intro, .about-text, .timeline-layout, .gallery-grid, .dashboard-grid', { opacity: 0, y: 20, duration: 0.8, delay: 0.5, ease: 'power3.out' });
                    gsap.from('.hero-visual, .about-features, .why-work-grid, .achievements-grid, .contact-grid', { opacity: 0, scale: 0.98, duration: 1.2, delay: 0.6, ease: 'power3.out' });
                }
            }, 600); // Small timeout to show completed bar
        }
    });

    // ==========================================================================
    // 2. Mobile Menu Toggle
    // ==========================================================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuBtn && navMenu) {
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
    }

    // ==========================================================================
    // 3. Active Navigation Highlighting
    // ==========================================================================
    const path = window.location.pathname;
    const pageName = path.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        // Handle home page aliases
        if (href === "index.html" || href === "#") {
            if (pageName === "index.html" || pageName === "") {
                link.classList.add('active');
            }
        } else if (href === pageName) {
            link.classList.add('active');
        }
    });

    // Sticky Navbar Background Blur
    window.addEventListener('scroll', () => {
        const header = document.getElementById('main-header');
        if (header) {
            if (window.scrollY > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // ==========================================================================
    // 4. Background Canvas Particle System
    // ==========================================================================
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
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
                this.alpha = Math.random() * 0.12 + 0.06;
            }

            draw() {
                ctx.fillStyle = `rgba(15, 23, 42, ${this.alpha})`;
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

            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let distance = Math.hypot(dx, dy);

                    if (distance < 120) {
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
    }

    // ==========================================================================
    // 5. Scroll Counters (Home Page Only)
    // ==========================================================================
    const statsContainer = document.getElementById('stats');
    const counters = document.querySelectorAll('.stat-count');
    let countersStarted = false;

    // Kick off fetching live stats for homepage counters immediately on script execution
    if (statsContainer) {
        const githubUser = 'Codewith-Pranavag';
        const leetCodeUser = 'Pranav_kumar_Agrawal';

        // 1. Fetch LeetCode solves
        fetch(`https://alfa-leetcode-api.onrender.com/${leetCodeUser}/solved`)
            .then(res => res.json())
            .then(data => {
                const totalSolved = data.solvedProblem || 396;
                const lcEl = document.getElementById('home-lc-solved');
                if (lcEl) lcEl.setAttribute('data-target', totalSolved);
            })
            .catch(err => console.warn('Home page LeetCode counter fetch failed:', err));

        // 2. Fetch GitHub repos
        fetch(`https://api.github.com/users/${githubUser}`)
            .then(res => res.json())
            .then(data => {
                const publicRepos = data.public_repos || 15;
                const reposEl = document.getElementById('home-git-repos');
                if (reposEl) reposEl.setAttribute('data-target', publicRepos);
            })
            .catch(err => console.warn('Home page GitHub repos counter fetch failed:', err));

        // 3. Fetch GitHub commits
        fetch(`https://github-contributions-api.deno.dev/${githubUser}.json?flat=true`)
            .then(res => res.json())
            .then(data => {
                const totalContributions = data.totalContributions || 161;
                const commitsEl = document.getElementById('home-git-commits');
                if (commitsEl) commitsEl.setAttribute('data-target', totalContributions);
            })
            .catch(err => console.warn('Home page GitHub commits counter fetch failed:', err));
    }

    function startCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target')) || 0;
            const duration = 1500;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const currentValue = Math.floor(easeProgress * target);
                
                const isLc = counter.id === 'home-lc-solved';
                if (target >= 10 && !isLc) {
                    counter.innerText = currentValue + "+";
                } else {
                    counter.innerText = currentValue;
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    if (target >= 10 && !isLc) {
                        counter.innerText = target + "+";
                    } else {
                        counter.innerText = target;
                    }
                }
            }
            requestAnimationFrame(updateCounter);
        });
    }

    if (statsContainer && counters.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersStarted) {
                    countersStarted = true;
                    startCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        statsObserver.observe(statsContainer);
    }

    // ==========================================================================
    // 6. Section Reveal Animations
    // ==========================================================================
    const revealTargets = document.querySelectorAll('.about-feature-card, .timeline-card, .why-card, .project-card, .dashboard-card, .achievement-card, .contact-info, .contact-form-container, .gallery-card');
    
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

    // ==========================================================================
    // 7. Coding Profiles Real-Time API Dashboard
    // ==========================================================================
    if (pageName === "coding-profiles.html" || document.getElementById('github-projects-container')) {
        const projectsContainer = document.getElementById('github-projects-container');
        const githubUser = 'Codewith-Pranavag';
        const leetCodeUser = 'Pranav_kumar_Agrawal';
        
        // Dynamic Repo rendering function
        function renderProjects(projects) {
            if (!projectsContainer) return;
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
                                    <img src="assets/github.png" alt="GitHub Logo" style="width:20px; height:20px;">
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

        // Fetch GitHub Repos and profile summary in Real-time
        async function fetchGitHubData() {
            try {
                // Fetch Repos
                const response = await fetch(`https://api.github.com/users/${githubUser}/repos?sort=updated&per_page=6`);
                if (!response.ok) throw new Error('GitHub API query failed');
                const repos = await response.json();
                
                // Enrich language arrays
                const enrichedRepos = await Promise.all(repos.map(async (repo) => {
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

                // Fetch Profile Summary metadata (followers, total repos)
                const userRes = await fetch(`https://api.github.com/users/${githubUser}`);
                if (userRes.ok) {
                    const profile = await userRes.json();
                    
                    // Repos
                    const reposRange = document.getElementById('git-repos-range');
                    const reposFill = document.querySelector('.github-repos-fill');
                    if (reposRange) reposRange.innerHTML = `<strong>${profile.public_repos}</strong><span>/50</span>`;
                    if (reposFill) reposFill.style.width = Math.min((profile.public_repos / 50) * 100, 100) + '%';
                    
                    // Followers
                    const followersRange = document.getElementById('git-followers-range');
                    const followersFill = document.querySelector('.github-followers-fill');
                    if (followersRange) followersRange.innerHTML = `<strong>${profile.followers}</strong><span>/100</span>`;
                    if (followersFill) followersFill.style.width = Math.min((profile.followers / 100) * 100, 100) + '%';

                    // Stars
                    const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
                    const starsRange = document.getElementById('git-stars-range');
                    const starsFill = document.querySelector('.github-stars-fill');
                    if (starsRange) starsRange.innerHTML = `<strong>${totalStars}</strong><span>/20</span>`;
                    if (starsFill) starsFill.style.width = Math.min((totalStars / 20) * 100, 100) + '%';
                }
            } catch (err) {
                console.warn('Real-time GitHub fetch failed. Using fallback portfolio repositories.', err);
                const fallbackProjects = [
                    { name: "OSINT X Project", description: "Advanced open-source intelligence gathering, network scanning, and footprint mapping scanner utility.", languages: ["Python", "OSINT", "Network Security"], html_url: "https://github.com/Codewith-Pranavag/OSINT-X" },
                    { name: "Academic LMS", description: "Learning Management System engineered to administer course databases, records, and grade audits.", languages: ["Java", "SQL", "OOPs"], html_url: "https://github.com/Codewith-Pranavag/academic-lms" },
                    { name: "Java Practice", description: "Data structures, OOPs paradigms, and algorithm problem-solving configurations in Java.", languages: ["Java", "DSA", "OOPs"], html_url: "https://github.com/Codewith-Pranavag/Java-practice" }
                ];
                renderProjects(fallbackProjects);
            }
        }
        fetchGitHubData();

        // Fetch LeetCode stats dynamically (Real-time CORS-safe Render wrapper)
        async function fetchLeetCodeData() {
            const circleVal = document.querySelector('.leetcode-circle-val');
            const lcTotalSolved = document.getElementById('lc-total-solved');
            const lcEasy = document.getElementById('lc-easy-solved');
            const lcMed = document.getElementById('lc-med-solved');
            const lcHard = document.getElementById('lc-hard-solved');

            const totalEasy = 780;
            const totalMedium = 1560;
            const totalHard = 810;
            const totalQuestions = totalEasy + totalMedium + totalHard;

            try {
                const response = await fetch(`https://alfa-leetcode-api.onrender.com/${leetCodeUser}/solved`);
                if (!response.ok) throw new Error('LeetCode stats API query failed');
                const data = await response.json();
                
                const totalSolved = data.solvedProblem || 396;
                const easySolved = data.easySolved || 306;
                const mediumSolved = data.mediumSolved || 86;
                const hardSolved = data.hardSolved || 4;

                // Update numeric counts
                if (lcTotalSolved) lcTotalSolved.innerText = totalSolved;
                if (lcEasy) lcEasy.innerText = easySolved;
                if (lcMed) lcMed.innerText = mediumSolved;
                if (lcHard) lcHard.innerText = hardSolved;

                // Update completion bar percentages
                const easyFill = document.querySelector('.lc-bar-fill.easy');
                const medFill = document.querySelector('.lc-bar-fill.medium');
                const hardFill = document.querySelector('.lc-bar-fill.hard');

                if (easyFill) easyFill.style.width = ((easySolved / totalEasy) * 100) + '%';
                if (medFill) medFill.style.width = ((mediumSolved / totalMedium) * 100) + '%';
                if (hardFill) hardFill.style.width = ((hardSolved / totalHard) * 100) + '%';

                // Update difficulty text fractions
                const easyRange = document.getElementById('easy-range');
                const medRange = document.getElementById('med-range');
                const hardRange = document.getElementById('hard-range');
                
                if (easyRange) easyRange.innerHTML = `<strong>${easySolved}</strong><span>/${totalEasy}</span>`;
                if (medRange) medRange.innerHTML = `<strong>${mediumSolved}</strong><span>/${totalMedium}</span>`;
                if (hardRange) hardRange.innerHTML = `<strong>${hardSolved}</strong><span>/${totalHard}</span>`;

                // Update circular progress SVG stroke offset
                if (circleVal) {
                    const offsetMax = 377;
                    const percentage = Math.min(totalSolved / totalQuestions, 1);
                    circleVal.style.strokeDashoffset = offsetMax - (offsetMax * percentage);
                }
            } catch (err) {
                console.warn('Real-time LeetCode fetch failed. Using fallback statistical indicators.', err);
                if (circleVal) circleVal.style.strokeDashoffset = 377 - (377 * (302 / 1100));
            }
        }
        fetchLeetCodeData();

        // Fetch LeetCode Submission Heatmap in Real-time
        async function fetchLeetCodeCalendar() {
            const heatmap = document.getElementById('leetcode-heatmap');
            if (!heatmap) return;

            try {
                const response = await fetch(`https://alfa-leetcode-api.onrender.com/${leetCodeUser}/calendar`);
                if (!response.ok) throw new Error('LeetCode calendar API query failed');
                const data = await response.json();

                const totalActiveDays = data.totalActiveDays || 137;
                const activeDaysEl = document.getElementById('lc-total-active-days');
                if (activeDaysEl) {
                    activeDaysEl.innerText = `${totalActiveDays} active days in total (streak: ${data.streak || 0})`;
                }

                // Parse calendar object: {"timestamp": count, ...}
                const calendarData = JSON.parse(data.submissionCalendar || '{}');

                heatmap.innerHTML = '';
                const totalWeeks = 38;
                heatmap.style.gridTemplateColumns = `repeat(${totalWeeks}, 10px)`;
                
                const totalCells = totalWeeks * 7;
                const cells = [];
                const now = new Date();
                
                for (let i = totalCells - 1; i >= 0; i--) {
                    const date = new Date(now);
                    date.setDate(now.getDate() - i);
                    date.setUTCHours(0, 0, 0, 0);
                    const timestampSeconds = Math.floor(date.getTime() / 1000).toString();
                    
                    const count = calendarData[timestampSeconds] || 0;
                    cells.push({
                        date: date.toISOString().split('T')[0],
                        count: count
                    });
                }

                cells.forEach(day => {
                    const cell = document.createElement('div');
                    cell.className = 'contrib-cell';
                    
                    if (day.count > 15) {
                        cell.classList.add('lc-lvl-4');
                    } else if (day.count > 8) {
                        cell.classList.add('lc-lvl-3');
                    } else if (day.count > 3) {
                        cell.classList.add('lc-lvl-2');
                    } else if (day.count > 0) {
                        cell.classList.add('lc-lvl-1');
                    }
                    
                    cell.title = `${day.count} solves on ${day.date}`;
                    heatmap.appendChild(cell);
                });
            } catch (err) {
                console.warn('Real-time LeetCode calendar fetch failed. Using fallback heatmap.', err);
                renderFallbackLeetCodeHeatmap();
            }
        }

        function renderFallbackLeetCodeHeatmap() {
            const heatmap = document.getElementById('leetcode-heatmap');
            if (!heatmap) return;
            heatmap.innerHTML = '';
            const totalWeeks = 38;
            heatmap.style.gridTemplateColumns = `repeat(${totalWeeks}, 10px)`;
            
            for (let col = 0; col < totalWeeks; col++) {
                for (let row = 0; row < 7; row++) {
                    const cell = document.createElement('div');
                    cell.className = 'contrib-cell';
                    
                    const rand = Math.random() * 100;
                    if (rand > 94) {
                        cell.classList.add('lc-lvl-4');
                    } else if (rand > 85) {
                        cell.classList.add('lc-lvl-3');
                    } else if (rand > 70) {
                        cell.classList.add('lc-lvl-2');
                    } else if (rand > 40) {
                        cell.classList.add('lc-lvl-1');
                    }
                    
                    heatmap.appendChild(cell);
                }
            }
        }
        fetchLeetCodeCalendar();

        // Fetch GitHub Contributions Heatmap in Real-time
        async function fetchGitHubContributions() {
            const heatmap = document.getElementById('contrib-heatmap');
            if (!heatmap) return;

            try {
                const response = await fetch(`https://github-contributions-api.deno.dev/${githubUser}.json?flat=true`);
                if (!response.ok) throw new Error('Contributions API query failed');
                const data = await response.json();

                const totalContributions = data.totalContributions || 161;
                
                // Update total commits and circular SVG
                const gitTotalCommits = document.getElementById('git-total-commits');
                const githubCircleVal = document.querySelector('.github-circle-val');
                if (gitTotalCommits) gitTotalCommits.innerText = totalContributions;
                if (githubCircleVal) {
                    const offsetMax = 377;
                    const percentage = Math.min(totalContributions / 500, 1);
                    githubCircleVal.style.strokeDashoffset = offsetMax - (offsetMax * percentage);
                }

                const commitEl = document.querySelector('.github-meta span');
                if (commitEl) {
                    commitEl.innerText = `${totalContributions} contributions in the last year`;
                }

                heatmap.innerHTML = '';
                const totalWeeks = 38;
                heatmap.style.gridTemplateColumns = `repeat(${totalWeeks}, 10px)`;
                
                const totalCells = totalWeeks * 7;
                const dailyContributions = data.contributions || [];
                const slicedContributions = dailyContributions.slice(-totalCells);

                slicedContributions.forEach(day => {
                    const cell = document.createElement('div');
                    cell.className = 'contrib-cell';
                    
                    if (day.contributionLevel === "FOURTH_QUARTILE") {
                        cell.classList.add('lvl-4');
                    } else if (day.contributionLevel === "THIRD_QUARTILE") {
                        cell.classList.add('lvl-3');
                    } else if (day.contributionLevel === "SECOND_QUARTILE") {
                        cell.classList.add('lvl-2');
                    } else if (day.contributionLevel === "FIRST_QUARTILE") {
                        cell.classList.add('lvl-1');
                    }
                    
                    cell.title = `${day.contributionCount} commits on ${day.date}`;
                    heatmap.appendChild(cell);
                });
            } catch (err) {
                console.warn('Real-time GitHub contributions fetch failed. Using fallback heatmap.', err);
                renderFallbackHeatmap();
            }
        }

        function renderFallbackHeatmap() {
            const heatmap = document.getElementById('contrib-heatmap');
            if (!heatmap) return;
            heatmap.innerHTML = '';
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
        fetchGitHubContributions();
    }

    // ==========================================================================
    // 8. Contact Page Connection Form
    // ==========================================================================
    const contactForm = document.getElementById('portfolio-contact-form');
    const formCallback = document.getElementById('form-callback');
    const subjectSelect = document.getElementById('client-subject-select');
    const customSubjectGroup = document.getElementById('custom-subject-group');
    const customSubjectInput = document.getElementById('client-subject');

    if (subjectSelect && customSubjectGroup) {
        subjectSelect.addEventListener('change', () => {
            if (subjectSelect.value === 'Other') {
                customSubjectGroup.style.display = 'block';
                if (customSubjectInput) {
                    customSubjectInput.required = true;
                    customSubjectInput.focus();
                }
            } else {
                customSubjectGroup.style.display = 'none';
                if (customSubjectInput) {
                    customSubjectInput.required = false;
                    customSubjectInput.value = '';
                }
            }
        });
    }

    if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector("button[type='submit']");
        const originalText = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = "Sending...";

        const data = new FormData(contactForm);

        try {
            const response = await fetch(contactForm.action, {
                method: "POST",
                body: data,
                headers: {
                    "Accept": "application/json"
                }
            });

            if (response.ok) {
                formCallback.innerHTML = "✅ Message sent successfully!";
                formCallback.className = "form-status success";
                contactForm.reset();
            } else {
                formCallback.innerHTML = "❌ Failed to send message.";
                formCallback.className = "form-status error";
            }
        } catch (error) {
            formCallback.innerHTML = "❌ Network error.";
            formCallback.className = "form-status error";
        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    });
}

    // ==========================================================================
    // 9. Gallery Multi-Image Album Lightbox (Gallery Page Only)
    // ==========================================================================
    if (document.querySelector('.gallery-grid')) {
        // Create slideshow lightbox overlay elements dynamically
        const lightbox = document.createElement('div');
        lightbox.className = 'gallery-lightbox';
        lightbox.innerHTML = `
            <span class="lightbox-close">&times;</span>
            <div class="lightbox-content-wrapper">
                <div class="lightbox-slide-container">
                    <button class="lightbox-prev" aria-label="Previous image">&lt;</button>
                    <img class="lightbox-img" src="" alt="" width="800" height="500">
                    <button class="lightbox-next" aria-label="Next image">&gt;</button>
                </div>
                <div class="lightbox-caption">
                    <span class="lightbox-counter">Image 1 of 3</span>
                    <h3 class="lightbox-title">Album Title</h3>
                    <p class="lightbox-desc">Album Description</p>
                    <div class="lightbox-dots"></div>
                </div>
            </div>
        `;
        document.body.appendChild(lightbox);

        const lightboxImg = lightbox.querySelector('.lightbox-img');
        const lightboxTitle = lightbox.querySelector('.lightbox-title');
        const lightboxDesc = lightbox.querySelector('.lightbox-desc');
        const lightboxCounter = lightbox.querySelector('.lightbox-counter');
        const lightboxDots = lightbox.querySelector('.lightbox-dots');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');

        let currentAlbumImages = [];
        let currentSlideIndex = 0;

        function showSlide(index) {
            if (currentAlbumImages.length === 0) return;
            
            // Handle index limits (circular loop)
            if (index < 0) {
                currentSlideIndex = currentAlbumImages.length - 1;
            } else if (index >= currentAlbumImages.length) {
                currentSlideIndex = 0;
            } else {
                currentSlideIndex = index;
            }

            // Update Image
            lightboxImg.src = currentAlbumImages[currentSlideIndex];
            
            // Update Backdrop Blur Image
            lightbox.style.setProperty('--bg-image', `url('${currentAlbumImages[currentSlideIndex]}')`);
            
            // Update Counter
            lightboxCounter.innerText = `Image ${currentSlideIndex + 1} of ${currentAlbumImages.length}`;

            // Update Dots
            const dots = lightboxDots.querySelectorAll('.lightbox-dot');
            dots.forEach((dot, idx) => {
                if (idx === currentSlideIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        // Add click listener to all gallery cards to open the album
        const cards = document.querySelectorAll('.gallery-card');
        cards.forEach(card => {
            const title = card.getAttribute('data-album-title');
            const desc = card.getAttribute('data-album-desc');
            const imagesStr = card.getAttribute('data-images');

            card.addEventListener('click', () => {
                currentAlbumImages = imagesStr ? imagesStr.split(',') : [];
                currentSlideIndex = 0;

                // Set Title and Description
                lightboxTitle.innerText = title || card.querySelector('h3').innerText;
                lightboxDesc.innerText = desc || card.querySelector('p').innerText;

                // Render Dot indicators
                lightboxDots.innerHTML = '';
                currentAlbumImages.forEach((_, idx) => {
                    const dot = document.createElement('div');
                    dot.className = 'lightbox-dot';
                    if (idx === 0) dot.classList.add('active');
                    dot.addEventListener('click', () => {
                        showSlide(idx);
                    });
                    lightboxDots.appendChild(dot);
                });

                // Load initial slide and show lightbox
                showSlide(0);
                lightbox.classList.add('active');
            });
        });

        // Previous and Next button click triggers
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showSlide(currentSlideIndex - 1);
        });

        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showSlide(currentSlideIndex + 1);
        });

        // Close lightbox controls
        closeBtn.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper') || e.target.classList.contains('lightbox-slide-container')) {
                lightbox.classList.remove('active');
            }
        });

        // Close when mouse moves onto the backdrop blur overlay
        lightbox.addEventListener('mousemove', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });

        // Keyboard Arrow & Escape listeners
        window.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;

            if (e.key === 'ArrowLeft') {
                showSlide(currentSlideIndex - 1);
            } else if (e.key === 'ArrowRight') {
                showSlide(currentSlideIndex + 1);
            } else if (e.key === 'Escape') {
                lightbox.classList.remove('active');
            }
        });
    }
});
