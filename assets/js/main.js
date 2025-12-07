// ==================== GLOBAL VARIABLES ====================
let currentImages = [];
let currentIndex = 0;
let currentTitle = '';

// ==================== MODAL FUNCTIONS ====================

// Fungsi untuk membuka modal dengan array gambar
function openModal(images, title) {
    const modal = document.getElementById('projectModal');
    
    currentImages = images;
    currentTitle = title;
    currentIndex = 0;
    
    showImage(currentIndex);
    
    modal.style.display = 'flex';
    
    // Tambahkan class untuk animasi
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Fungsi untuk menampilkan gambar berdasarkan index
function showImage(index) {
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const modalCounter = document.getElementById('modalCounter');
    
    if (currentImages && currentImages.length > 0) {
        modalImg.src = currentImages[index];
        modalCaption.textContent = currentTitle;
        modalCounter.textContent = `${index + 1} / ${currentImages.length}`;
        
        // Animasi fade
        modalImg.style.opacity = '0';
        setTimeout(() => {
            modalImg.style.opacity = '1';
        }, 50);
    }
}

// Fungsi untuk gambar berikutnya
function nextImage() {
    currentIndex = (currentIndex + 1) % currentImages.length;
    showImage(currentIndex);
}

// Fungsi untuk gambar sebelumnya
function prevImage() {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    showImage(currentIndex);
}

// Fungsi untuk menutup modal
function closeModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.remove('show');
    
    setTimeout(() => {
        modal.style.display = 'none';
        currentImages = [];
        currentIndex = 0;
        currentTitle = '';
    }, 300);
}

// ==================== EVENT LISTENERS ====================

// Jalankan setelah DOM selesai dimuat
document.addEventListener('DOMContentLoaded', function() {
    
    // Event listener untuk setiap project card
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Cek apakah yang di-click adalah link (GitHub atau Demo)
            if (e.target.closest('.project-link')) {
                return; // Jangan buka modal jika click pada link
            }
            
            const imagesData = this.getAttribute('data-images');
            const title = this.getAttribute('data-title');
            
            if (imagesData && title) {
                try {
                    const images = JSON.parse(imagesData);
                    openModal(images, title);
                } catch (error) {
                    console.error('Error parsing images data:', error);
                }
            }
        });
    });
    
    // Event listener untuk tombol close
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Event listener untuk tombol navigasi prev
    const prevBtn = document.querySelector('.modal-prev');
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            prevImage();
        });
    }
    
    // Event listener untuk tombol navigasi next
    const nextBtn = document.querySelector('.modal-next');
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            nextImage();
        });
    }
    
    // Event listener untuk click di luar gambar
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
    
    // Event listener untuk keyboard navigation
    document.addEventListener('keydown', function(e) {
        const modal = document.getElementById('projectModal');
        
        if (modal && modal.style.display === 'flex') {
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            }
        }
    });
    
});
// Form submission handler
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
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
        animation: slideIn 0.5s ease;
        font-size: 0.95em;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 500);
    }, 3000);
}

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
            animation: fadeIn 0.3s ease;
        `;
        field.parentElement.appendChild(errorDiv);
    }
    
    return isValid;
}

// Add error styling
const errorStyle = document.createElement('style');
errorStyle.textContent = `
    .form-group input.error,
    .form-group textarea.error {
        border-color: #ff6b6b !important;
        box-shadow: 0 0 10px rgba(255, 107, 107, 0.2) !important;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-5px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(errorStyle);

// Validate all fields before submit
document.getElementById('contactForm').addEventListener('submit', function(e) {
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        e.preventDefault();
        showNotification('Mohon perbaiki field yang bermasalah');
    }
});