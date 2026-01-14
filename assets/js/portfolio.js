// Portfolio Navigation Script
document.addEventListener('DOMContentLoaded', function() {
    // ===== Hamburger Menu Toggle =====
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerLines = document.querySelectorAll('.hamburger-line');
    
    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            mobileMenu.classList.toggle('hidden');
            
            // Animate hamburger lines
            if (mobileMenu.classList.contains('hidden')) {
                hamburgerLines[0].style.transform = 'translateY(0) rotate(0)';
                hamburgerLines[1].style.opacity = '1';
                hamburgerLines[2].style.transform = 'translateY(0) rotate(0)';
            } else {
                hamburgerLines[0].style.transform = 'translateY(6px) rotate(45deg)';
                hamburgerLines[1].style.opacity = '0';
                hamburgerLines[2].style.transform = 'translateY(-6px) rotate(-45deg)';
            }
        });
        
        // Close menu when a link is clicked
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                hamburgerLines[0].style.transform = 'translateY(0) rotate(0)';
                hamburgerLines[1].style.opacity = '1';
                hamburgerLines[2].style.transform = 'translateY(0) rotate(0)';
            });
        });
    }

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

});
