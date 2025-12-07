// ==================== GLOBAL VARIABLES ====================
let currentImages = [];
let currentIndex = 0;
let currentTitle = '';
let isModalOpen = false;

// ==================== MODAL FUNCTIONS ====================

// Fungsi untuk membuka modal dengan array gambar
function openModal(images, title) {
    const modal = document.getElementById('projectModal');
    
    if (!modal || isModalOpen) return;
    
    isModalOpen = true;
    currentImages = images;
    currentTitle = title;
    currentIndex = 0;
    
    // Prevent body scroll - simple method
    document.body.style.overflow = 'hidden';
    
    // Show modal immediately
    modal.style.display = 'flex';
    modal.style.opacity = '0';
    
    // Force reflow
    modal.offsetHeight;
    
    // Show image first
    showImage(currentIndex);
    
    // Then fade in modal
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
    }, 10);
}

// Fungsi untuk menampilkan gambar berdasarkan index
function showImage(index) {
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const modalCounter = document.getElementById('modalCounter');
    
    if (!modalImg || !currentImages || currentImages.length === 0) return;
    
    modalImg.src = currentImages[index];
    modalCaption.textContent = currentTitle;
    modalCounter.textContent = `${index + 1} / ${currentImages.length}`;
}

// Fungsi untuk gambar berikutnya
function nextImage(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    currentIndex = (currentIndex + 1) % currentImages.length;
    showImage(currentIndex);
}

// Fungsi untuk gambar sebelumnya
function prevImage(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    showImage(currentIndex);
}

// Fungsi untuk menutup modal
function closeModal(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    const modal = document.getElementById('projectModal');
    if (!modal || !isModalOpen) return;
    
    // Fade out
    modal.style.opacity = '0';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        currentImages = [];
        currentIndex = 0;
        currentTitle = '';
        isModalOpen = false;
    }, 300);
}

// ==================== EVENT LISTENERS ====================

// Jalankan setelah DOM selesai dimuat
document.addEventListener('DOMContentLoaded', function() {
    
    // Event listener untuk setiap project card
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        // Click event
        card.addEventListener('click', handleCardClick, false);
    });
    
    // Event listener untuk tombol close
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal, false);
    }
    
    // Event listener untuk tombol navigasi prev
    const prevBtn = document.querySelector('.modal-prev');
    if (prevBtn) {
        prevBtn.addEventListener('click', prevImage, false);
    }
    
    // Event listener untuk tombol navigasi next
    const nextBtn = document.querySelector('.modal-next');
    if (nextBtn) {
        nextBtn.addEventListener('click', nextImage, false);
    }
    
    // Event listener untuk click di luar gambar
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(e);
            }
        }, false);
    }
    
    // Event listener untuk keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!isModalOpen) return;
        
        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'ArrowLeft') {
            prevImage();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        }
    }, false);
    
    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (modal) {
        modal.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        modal.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            const swipeThreshold = 50;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextImage();
                } else {
                    prevImage();
                }
            }
        }, { passive: true });
    }
});

// Handle card click
function handleCardClick(e) {
    // Cek apakah yang di-click adalah link (GitHub atau Demo)
    if (e.target.closest('.project-link')) {
        return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    const imagesData = this.getAttribute('data-images');
    const title = this.getAttribute('data-title');
    
    if (imagesData && title) {
        try {
            const images = JSON.parse(imagesData);
            if (images && images.length > 0) {
                openModal(images, title);
            }
        } catch (error) {
            console.error('Error parsing images data:', error);
        }
    }
}

// ==================== CONTACT FORM (Only for contact page) ====================

// Check if we're on the contact page before attaching form listeners
window.addEventListener('load', function() {
    const contactForm = document.getElementById('contactForm');
    
    // Only run contact form code if the form exists
    if (!contactForm) return;
    
    // Form submission handler
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields before submit
        let isFormValid = true;
        const inputs = document.querySelectorAll('.form-group input, .form-group textarea');
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });
        
        if (!isFormValid) {
            showNotification('Mohon perbaiki field yang bermasalah');
            return;
        }
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Create mailto link with pre-filled data
        const mailtoLink = `mailto:angganaardhan@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
            `Nama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`
        )}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Optional: Show success message
        showNotification('Email client Anda akan terbuka. Terima kasih!');
        
        // Reset form after short delay
        setTimeout(() => {
            this.reset();
        }, 1000);
    });
    
    // Form validation with real-time feedback
    const inputs = document.querySelectorAll('.form-group input, .form-group textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
});

// Notification function
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        padding: 20px 30px;
        background: linear-gradient(135deg, rgba(255, 215, 0, 0.95), rgba(255, 237, 78, 0.95));
        color: #0a0a0a;
        font-weight: 600;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(255, 215, 0, 0.4);
        z-index: 10000;
        font-size: 0.95em;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    
    // Remove existing error message
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    field.classList.remove('error');
    
    // Validation rules
    let isValid = true;
    let errorMessage = '';
    
    if (field.required && !value) {
        isValid = false;
        errorMessage = 'Field ini wajib diisi';
    } else if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Format email tidak valid';
        }
    } else if (field.id === 'name' && value && value.length < 3) {
        isValid = false;
        errorMessage = 'Nama minimal 3 karakter';
    } else if (field.id === 'message' && value && value.length < 10) {
        isValid = false;
        errorMessage = 'Pesan minimal 10 karakter';
    }
    
    // Show error if invalid
    if (!isValid) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errorMessage;
        errorDiv.style.cssText = `
            color: #ff6b6b;
            font-size: 0.85em;
            margin-top: 5px;
        `;
        field.parentElement.appendChild(errorDiv);
    }
    
    return isValid;
}