// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initCarousels();
    initLightbox();
    initMap();
    initSmoothScroll();
});

// Carousel functionality
function initCarousels() {
    const carousels = document.querySelectorAll('.carousel');
    
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.querySelector('.carousel-btn--prev');
        const nextBtn = carousel.querySelector('.carousel-btn--next');
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        
        // Hide navigation buttons if only one slide
        if (totalSlides <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            return;
        }
        
        function updateCarousel() {
            const slideWidth = slides[0].offsetWidth;
            track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        }
        
        function prevSlide() {
            currentSlide = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
            updateCarousel();
        }
        
        // Event listeners
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
        
        // Auto-play carousel
        setInterval(nextSlide, 5000);
        
        // Handle window resize
        window.addEventListener('resize', updateCarousel);
    });
}

// Lightbox functionality
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const carouselImages = document.querySelectorAll('.carousel-image');
    
    // Open lightbox when clicking on carousel images
    carouselImages.forEach(image => {
        image.addEventListener('click', function() {
            lightboxImage.src = this.src;
            lightboxImage.alt = this.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    lightboxClose.addEventListener('click', closeLightbox);
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

// Map functionality
function initMap() {
    const mapContainer = document.getElementById('map');
    
    if (!mapContainer) return;
    
    // Coordinates for Pracze 19, gmina Milicz
    const lat = 51.476389;
    const lng = 17.207778;
    
    // Initialize map
    const map = L.map('map').setView([lat, lng], 15);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Custom marker icon
    const customIcon = L.divIcon({
        html: `
            <div style="
                background-color: #2d5940;
                width: 30px;
                height: 30px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                border: 3px solid #fff;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            ">
                <div style="
                    transform: rotate(45deg);
                    color: white;
                    text-align: center;
                    line-height: 24px;
                    font-size: 14px;
                    font-weight: bold;
                ">⛺</div>
            </div>
        `,
        className: 'custom-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });
    
    // Add marker
    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
    
    // Add popup
    marker.bindPopup(`
        <div style="text-align: center; padding: 10px;">
            <strong>Pole namiotowe Za zakrętem</strong><br>
            Pracze 19, gmina Milicz<br>
            <a href="https://maps.google.com/?q=${lng},${lat}" target="_blank" style="color: #2d5940; text-decoration: none;">
                🗺️ Zobacz w Google Maps
            </a>
        </div>
    `).openPopup();
}

// Smooth scroll for navigation links
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Intersection Observer for navbar highlighting
function initNavbarHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-100px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current section link
                const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Initialize navbar highlighting
document.addEventListener('DOMContentLoaded', function() {
    initNavbarHighlight();
});

// Handle image loading errors
function handleImageErrors() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            
            // Create placeholder
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
                width: 100%;
                height: 300px;
                background: linear-gradient(135deg, #e0e0e0, #f0f0f0);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #666;
                font-size: 16px;
                border-radius: 12px;
            `;
            placeholder.textContent = 'Zdjęcie niedostępne';
            
            this.parentNode.insertBefore(placeholder, this);
        });
    });
}

// Initialize image error handling
document.addEventListener('DOMContentLoaded', handleImageErrors);

// Lazy loading for better performance
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if needed
document.addEventListener('DOMContentLoaded', initLazyLoading);

// Contact form handling (if form is added later)
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        if (!data.name || !data.email || !data.message) {
            alert('Proszę wypełnić wszystkie pola.');
            return;
        }
        
        // Simulate form submission
        alert('Dziękujemy za wiadomość! Odpowiemy najszybciej jak to możliwe.');
        this.reset();
    });
}

// Performance optimization: Debounce resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced resize handler
const debouncedResize = debounce(function() {
    // Re-initialize carousels on resize
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = carousel.querySelectorAll('.carousel-slide');
        if (slides.length > 0) {
            const slideWidth = slides[0].offsetWidth;
            const currentTransform = track.style.transform;
            const currentSlide = currentTransform ? 
                parseInt(currentTransform.match(/-?\d+/)[0]) / slideWidth : 0;
            track.style.transform = `translateX(-${Math.abs(currentSlide) * slideWidth}px)`;
        }
    });
}, 250);

window.addEventListener('resize', debouncedResize);