// Portfolio Navigation Script
document.addEventListener('DOMContentLoaded', function() {
    // Smooth navigation for nav links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just a hash
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                // Add padding for fixed nav
                const offsetTop = target.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active nav
                updateActiveNav();
            }
        });
    });
    
    // Update active nav on scroll
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 100 && 
                window.scrollY < sectionTop + sectionHeight - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }
    
    // Listen to scroll events
    window.addEventListener('scroll', function() {
        updateActiveNav();
    });
    
    // Initialize on page load
    updateActiveNav();
    
    // Form submission feedback
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            const button = this.querySelector('button[type="submit"]');
            const originalText = button.textContent;
            
            button.textContent = 'Pesan Terkirim! ✓';
            button.disabled = true;
            
            // Reset after 3 seconds
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 3000);
        });
    }

    // ===== Robot 3D Viewer Section =====
    const robotSection = document.getElementById('robot');
    if (robotSection) {
        const robotViewer = document.querySelector('.robot-viewer');
        const robotVideo = document.querySelector('#robot video');
        const robotPlayButton = document.querySelector('.robot-play-button');

        if (robotVideo && robotViewer) {
            // Intersection Observer for scroll animation
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        robotSection.style.opacity = '1';
                        robotSection.style.transform = 'translateY(0)';
                        robotSection.style.transition = 'all 0.8s ease-out';
                    }
                });
            }, observerOptions);

            observer.observe(robotSection);

            // Set initial state
            robotSection.style.opacity = '0';
            robotSection.style.transform = 'translateY(20px)';

            // Initialize video with loading state
            robotViewer.classList.add('video-loading');

            // Play button click handler
            if (robotPlayButton) {
                robotPlayButton.addEventListener('click', function() {
                    robotVideo.play().catch(err => {
                        console.log('Video playback error:', err);
                    });
                });
            }

            // Ensure video plays on user interaction for mobile
            document.addEventListener('click', function initVideoPlay() {
                if (robotVideo && robotVideo.paused) {
                    robotVideo.play().catch(err => {
                        console.log('Video autoplay initiated on user interaction');
                    });
                }
            }, { once: true });

            // Handle video loading states
            robotVideo.addEventListener('loadstart', function() {
                robotViewer.classList.add('video-loading');
            });

            robotVideo.addEventListener('loadeddata', function() {
                setTimeout(() => {
                    robotViewer.classList.remove('video-loading');
                }, 300);
            });

            robotVideo.addEventListener('canplay', function() {
                robotViewer.classList.remove('video-loading');
            });

            robotVideo.addEventListener('error', function() {
                console.log('Primary video source failed, trying fallback');
                robotViewer.classList.remove('video-loading');
            });

            // Handle video play to hide play button
            robotVideo.addEventListener('play', function() {
                if (robotPlayButton) {
                    robotPlayButton.style.opacity = '0';
                    robotPlayButton.style.pointerEvents = 'none';
                }
            });

            // Show play button when paused
            robotVideo.addEventListener('pause', function() {
                if (robotPlayButton) {
                    robotPlayButton.style.opacity = '1';
                    robotPlayButton.style.pointerEvents = 'auto';
                }
            });
        }

        // Add smooth scroll for robot section navigation
        const robotNavLinks = document.querySelectorAll('a[href="#robot"]');
        robotNavLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.getElementById('robot');
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
});
