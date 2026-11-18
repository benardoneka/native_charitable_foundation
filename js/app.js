// js/app.js
document.addEventListener('DOMContentLoaded', () => {
  // 1. Refresh Managed Images & Gallery Handler
  const galleryItems = [
    { key: 'more-learners.jpeg', category: 'learners', categoryLabel: 'NCF Learners League', caption: 'NCF Learners League group with scholastic supplies' },
    { key: 'chating-with-learners.jpeg', category: 'learners', categoryLabel: 'NCF Learners League', caption: 'Mentoring and speaking with young learners' },
    { key: 'Mentor-with-learners.jpeg', category: 'learners', categoryLabel: 'NCF Learners League', caption: 'NCF Mentor standing with underprivileged learners' },
    { key: 'scholastic.jpeg', category: 'scholastic', categoryLabel: 'Scholastic Supplies', caption: 'Exercise books, Nataraj pencils, BIC pens & color pencils' },
    { key: 'learner1.jpeg', category: 'scholastic', categoryLabel: 'Scholastic Supplies', caption: 'Student holding exercise books, pencils & ruler' },
    { key: 'learner2.jpeg', category: 'scholastic', categoryLabel: 'Scholastic Supplies', caption: 'Young learner receiving donated school materials' },
    { key: 'learner3.jpeg', category: 'scholastic', categoryLabel: 'Scholastic Supplies', caption: 'Mariam Infant School pupil with scholastic pack' },
    { key: 'learner4.jpeg', category: 'scholastic', categoryLabel: 'Scholastic Supplies', caption: 'Primary school learner supported by NCF education program' },
    { key: 'learner5.jpeg', category: 'scholastic', categoryLabel: 'Scholastic Supplies', caption: 'Female student holding books, pens & erasers' },
    { key: 'learner6.jpeg', category: 'scholastic', categoryLabel: 'Scholastic Supplies', caption: 'TIK Junior School pupil with NCF scholastic supplies' },
  ];

  let activeGalleryFilter = 'all';
  const galleryGrid = document.getElementById('gallery-grid');
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');

  function renderGallery(filter = 'all') {
    if (!galleryGrid) return;
    activeGalleryFilter = filter;
    galleryGrid.innerHTML = '';
    const filtered = filter === 'all' ? galleryItems : galleryItems.filter((item) => item.category === filter);

    filtered.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'group bg-white rounded-2xl p-2 ncf-card cursor-pointer overflow-hidden flex flex-col';
      card.innerHTML = `
        <div class="relative rounded-xl overflow-hidden aspect-[4/3] bg-ncfPurple-light">
          <img
            data-photo-key="${item.key}"
            src="${window.NCF_PHOTOS?.[item.key] || ''}"
            alt="${item.caption}"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <span class="absolute top-2 left-2 bg-ncfPurple-deep/85 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md">
            ${item.categoryLabel}
          </span>
        </div>
        <div class="pt-2.5 px-1 pb-1">
          <p class="text-xs font-bold text-gray-800 line-clamp-2 group-hover:text-ncfPurple transition">${item.caption}</p>
        </div>
      `;
      card.addEventListener('click', () => openLightbox(item));
      galleryGrid.appendChild(card);
    });
  }

  function refreshAllManagedImages() {
    document.querySelectorAll('img[data-photo-key]').forEach((imgEl) => {
      const key = imgEl.dataset.photoKey;
      if (window.NCF_PHOTOS?.[key]) {
        imgEl.src = window.NCF_PHOTOS[key];
      }
    });
    renderGallery(activeGalleryFilter);
  }
  window.refreshAllManagedImages = refreshAllManagedImages;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('bg-ncfPurple', 'text-white', 'shadow', 'font-extrabold');
        b.classList.add('bg-white', 'text-gray-700', 'font-bold', 'border', 'border-gray-200');
      });
      btn.classList.add('bg-ncfPurple', 'text-white', 'shadow', 'font-extrabold');
      btn.classList.remove('bg-white', 'text-gray-700', 'font-bold', 'border', 'border-gray-200');
      renderGallery(btn.dataset.filter);
    });
  });

  const folderPicker = document.getElementById('local-folder-picker');
  if (folderPicker) {
    folderPicker.addEventListener('change', (e) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;

      files.forEach((file) => {
        const exactKey = Object.keys(window.NCF_PHOTOS || {}).find((k) => k.toLowerCase() === file.name.toLowerCase());
        const objUrl = URL.createObjectURL(file);
        if (exactKey) {
          window.NCF_PHOTOS[exactKey] = objUrl;
        } else {
          window.NCF_PHOTOS[file.name] = objUrl;
        }
      });

      refreshAllManagedImages();
      showToast(`Loaded ${files.length} local photo(s) across the site!`);
    });
  }

  const lightboxModal = document.getElementById('lightbox-modal');
  function openLightbox(item) {
    if (!lightboxModal) return;
    document.getElementById('lightbox-img').src = window.NCF_PHOTOS?.[item.key] || '';
    document.getElementById('lightbox-img').alt = item.caption;
    document.getElementById('lightbox-category').textContent = item.categoryLabel;
    document.getElementById('lightbox-caption').textContent = item.caption;
    document.getElementById('lightbox-filename').textContent = `images/${item.key}`;
    lightboxModal.classList.remove('hidden');
    lightboxModal.classList.add('flex');
  }
  window.closeLightbox = function () {
    if (lightboxModal) {
      lightboxModal.classList.add('hidden');
      lightboxModal.classList.remove('flex');
    }
  };
  const closeLightboxBtn = document.getElementById('close-lightbox-btn');
  if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', window.closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) window.closeLightbox();
    });
  }

  // 2. Rolling Picture Hero Carousel
  const heroSlidesData = [
    { key: 'more-learners.jpeg', caption: 'NCF Learners League • Supporting Underprivileged Schooling Children' },
    { key: 'chating-with-learners.jpeg', caption: 'Youth-Led Mentorship • Engaging Learners in Kampala Communities' },
    { key: 'Mentor-with-learners.jpeg', caption: 'Compassion In Action • Standing Beside Every Child' },
    { key: 'scholastic.jpeg', caption: 'Education Support • Exercise Books, Pens & Pencils for Learners' },
    { key: 'learner1.jpeg', caption: 'Equipping Students • Scholastic Materials Delivered Directly to Pupils' },
  ];

  let currentSlideIndex = 0;
  let heroAutoplayInterval = null;
  const slidesContainer = document.getElementById('hero-slides-container');
  const dotsContainer = document.getElementById('hero-dots');
  const captionPill = document.getElementById('hero-caption-pill');

  function initHeroCarousel() {
    if (!slidesContainer || !dotsContainer) return;
    slidesContainer.innerHTML = '';
    dotsContainer.innerHTML = '';

    heroSlidesData.forEach((slide, idx) => {
      const slideDiv = document.createElement('div');
      slideDiv.className = `hero-slide absolute inset-0 transition-opacity duration-1000 ease-in-out ${
        idx === 0 ? 'opacity-100 hero-slide-active' : 'opacity-0 pointer-events-none'
      }`;
      slideDiv.innerHTML = `<img data-photo-key="${slide.key}" src="${window.NCF_PHOTOS?.[slide.key] || ''}" alt="${slide.caption}" class="w-full h-full object-cover object-center" />`;
      slidesContainer.appendChild(slideDiv);

      const dotBtn = document.createElement('button');
      dotBtn.type = 'button';
      dotBtn.ariaLabel = `Go to slide ${idx + 1}`;
      dotBtn.className = `h-2.5 rounded-full transition-all duration-300 ${
        idx === 0 ? 'w-8 bg-ncfOrange-amber' : 'w-2.5 bg-white/50 hover:bg-white'
      }`;
      dotBtn.addEventListener('click', () => {
        goToSlide(idx);
        resetHeroAutoplay();
      });
      dotsContainer.appendChild(dotBtn);
    });
  }

  function goToSlide(index) {
    if (!slidesContainer || !dotsContainer) return;
    const slides = slidesContainer.querySelectorAll('.hero-slide');
    const dots = dotsContainer.querySelectorAll('button');
    currentSlideIndex = (index + heroSlidesData.length) % heroSlidesData.length;

    slides.forEach((s, i) => {
      if (i === currentSlideIndex) {
        s.classList.remove('opacity-0', 'pointer-events-none');
        s.classList.add('opacity-100', 'hero-slide-active');
      } else {
        s.classList.remove('opacity-100', 'hero-slide-active');
        s.classList.add('opacity-0', 'pointer-events-none');
      }
    });

    dots.forEach((d, i) => {
      if (i === currentSlideIndex) {
        d.className = 'h-2.5 w-8 rounded-full bg-ncfOrange-amber transition-all duration-300';
      } else {
        d.className = 'h-2.5 w-2.5 rounded-full bg-white/50 hover:bg-white transition-all duration-300';
      }
    });

    if (captionPill) captionPill.textContent = heroSlidesData[currentSlideIndex].caption;
  }

  function resetHeroAutoplay() {
    clearInterval(heroAutoplayInterval);
    heroAutoplayInterval = setInterval(() => goToSlide(currentSlideIndex + 1), 5000);
  }

  const heroPrevBtn = document.getElementById('hero-prev-btn');
  const heroNextBtn = document.getElementById('hero-next-btn');
  if (heroPrevBtn) {
    heroPrevBtn.addEventListener('click', () => {
      goToSlide(currentSlideIndex - 1);
      resetHeroAutoplay();
    });
  }
  if (heroNextBtn) {
    heroNextBtn.addEventListener('click', () => {
      goToSlide(currentSlideIndex + 1);
      resetHeroAutoplay();
    });
  }

  initHeroCarousel();
  resetHeroAutoplay();

  // 3. Mobile Navigation
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    document.querySelectorAll('.mobile-nav-link').forEach((link) => {
      link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
  }

  refreshAllManagedImages();
});