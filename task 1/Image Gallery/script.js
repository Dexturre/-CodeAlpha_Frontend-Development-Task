class ImageGallery {
  constructor() {
    this.galleryItems = document.querySelectorAll('.gallery-item');
    this.filterButtons = document.querySelectorAll('.filter-buttons button');
    this.lightbox = document.getElementById('lightbox');
    this.lightboxImg = document.querySelector('.lightbox-img');
    this.closeBtn = document.querySelector('.close');
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');
    
    this.currentIndex = 0;
    this.filteredItems = [];
    
    this.init();
  }

  init() {
    // Initialize filtered items with all gallery items
    this.filteredItems = Array.from(this.galleryItems);
    
    // Set up event listeners
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Filter buttons
    this.filterButtons.forEach(button => {
      button.addEventListener('click', (e) => this.handleFilter(e));
    });

    // Gallery item clicks
    this.galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => this.openLightbox(index));
    });

    // Lightbox controls
    this.closeBtn.addEventListener('click', () => this.closeLightbox());
    this.prevBtn.addEventListener('click', () => this.navigate(-1));
    this.nextBtn.addEventListener('click', () => this.navigate(1));

    // Close lightbox on outside click
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) {
        this.closeLightbox();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  handleFilter(e) {
    const filter = e.target.dataset.filter;
    
    // Update active button
    this.filterButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    // Filter items
    if (filter === 'all') {
      this.filteredItems = Array.from(this.galleryItems);
    } else {
      this.filteredItems = Array.from(this.galleryItems).filter(item => 
        item.dataset.category === filter
      );
    }

    // Show/hide items with animation
    this.galleryItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.style.display = 'block';
        item.style.animation = 'fadeIn 0.5s ease';
      } else {
        item.style.display = 'none';
      }
    });
  }

  openLightbox(index) {
    // Get the filtered items array based on current filter
    const currentFilter = document.querySelector('.filter-buttons button.active').dataset.filter;
    if (currentFilter === 'all') {
      this.filteredItems = Array.from(this.galleryItems);
    } else {
      this.filteredItems = Array.from(this.galleryItems).filter(item => 
        item.dataset.category === currentFilter
      );
    }

    this.currentIndex = index;
    this.updateLightbox();
    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }

  closeLightbox() {
    this.lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scrolling
  }

  navigate(direction) {
    this.currentIndex += direction;
    
    // Handle wrap-around
    if (this.currentIndex < 0) {
      this.currentIndex = this.filteredItems.length - 1;
    } else if (this.currentIndex >= this.filteredItems.length) {
      this.currentIndex = 0;
    }

    this.updateLightbox();
  }

  updateLightbox() {
    if (this.filteredItems.length === 0) return;
    
    const currentItem = this.filteredItems[this.currentIndex];
    const imgSrc = currentItem.querySelector('img').src;
    const imgAlt = currentItem.querySelector('img').alt;
    
    this.lightboxImg.src = imgSrc;
    this.lightboxImg.alt = imgAlt;
  }

  handleKeyboard(e) {
    if (!this.lightbox.classList.contains('active')) return;

    switch(e.key) {
      case 'Escape':
        this.closeLightbox();
        break;
      case 'ArrowLeft':
        this.navigate(-1);
        break;
      case 'ArrowRight':
        this.navigate(1);
        break;
    }
  }
}

// Initialize the gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ImageGallery();
});

// Add touch support for mobile devices
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, false);

function handleSwipe() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox.classList.contains('active')) return;

  const gallery = window.imageGallery;
  if (!gallery) return;

  const swipeThreshold = 50;
  
  if (touchEndX < touchStartX - swipeThreshold) {
    gallery.navigate(1); // Swipe left - next
  }
  
  if (touchEndX > touchStartX + swipeThreshold) {
    gallery.navigate(-1); // Swipe right - previous
  }
}

// Make gallery instance globally accessible for swipe handling
window.imageGallery = null;
document.addEventListener('DOMContentLoaded', () => {
  window.imageGallery = new ImageGallery();
});

// Preload images for better performance
function preloadImages() {
  const images = document.querySelectorAll('.gallery-item img');
  images.forEach(img => {
    const preloadImg = new Image();
    preloadImg.src = img.src;
  });
}

// Start preloading when DOM is ready
document.addEventListener('DOMContentLoaded', preloadImages);
