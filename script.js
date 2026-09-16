/**
 * Portofolio Pribadi: Widi Sefty Galih Khpfifah (Galih)
 * Siswa SMK Negeri Tembarak - RPL
 * Logika Interaktivitas: Navigasi, Mobile Drawer, Scroll Spy, Scroll Reveal, & Modal Resep
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. STICKY HEADER & SHADOW ON SCROLL ---
  const header = document.getElementById('site-header');

  const handleHeaderScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // --- 2. MOBILE MENU TOGGLE & ACCESSIBILITY ---
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileMenu = () => {
    const isOpen = mobileToggleBtn.classList.toggle('open');
    mobileNavDrawer.classList.toggle('open');
    mobileToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  };

  const closeMobileMenu = () => {
    mobileToggleBtn.classList.remove('open');
    mobileNavDrawer.classList.remove('open');
    mobileToggleBtn.setAttribute('aria-expanded', 'false');
  };

  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', toggleMobileMenu);
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Close mobile menu if clicked outside
  document.addEventListener('click', (e) => {
    if (
      mobileNavDrawer &&
      mobileNavDrawer.classList.contains('open') &&
      !mobileNavDrawer.contains(e.target) &&
      !mobileToggleBtn.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });

  // --- 3. ACTIVE NAV LINK & SCROLL SPY ---
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');

  const updateActiveNavLink = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        let targetHref = `#${sectionId}`;
        if (sectionId === 'kepribadian') {
          targetHref = '#keahlian';
        }

        const hasMatch = Array.from(desktopNavLinks).some(link => link.getAttribute('href') === targetHref);
        if (hasMatch) {
          desktopNavLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === targetHref);
          });

          mobileNavLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === targetHref);
          });
        }
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // --- 4. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER) ---
  const revealElements = document.querySelectorAll('.reveal-fade-up');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // --- 5. INTERACTIVE PROJECT MODAL: GALIH'S RECIPE ---
  const projectModal = document.getElementById('project-modal');
  const btnOpenModal = document.getElementById('btn-open-project-modal');
  const btnCloseModal = document.getElementById('modal-close-btn');
  const btnCloseFooterModal = document.getElementById('modal-close-footer-btn');
  const recipeSearchInput = document.getElementById('recipe-search-input');
  const categoryPills = document.querySelectorAll('.cat-pill');
  const recipeCards = document.querySelectorAll('.mock-recipe-card');

  const openModal = () => {
    if (!projectModal) return;
    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (recipeSearchInput) {
      setTimeout(() => recipeSearchInput.focus(), 200);
    }
  };

  const closeModal = () => {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (btnOpenModal) {
    btnOpenModal.addEventListener('click', openModal);
  }

  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', closeModal);
  }

  if (btnCloseFooterModal) {
    btnCloseFooterModal.addEventListener('click', closeModal);
  }

  // Close modal when clicking outside of modal card
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeModal();
      }
    });
  }

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('active')) {
      closeModal();
    }
  });

  // --- 6. RECIPE SEARCH & CATEGORY FILTERING INSIDE MODAL ---
  let currentCategory = 'all';
  let currentSearchQuery = '';

  const filterRecipes = () => {
    recipeCards.forEach(card => {
      const cardCategory = card.getAttribute('data-cat') || '';
      const cardTitle = card.querySelector('.mock-recipe-title')?.textContent.toLowerCase() || '';
      const cardText = card.textContent.toLowerCase();

      const matchesCategory = currentCategory === 'all' || cardCategory === currentCategory;
      const matchesSearch = !currentSearchQuery || cardTitle.includes(currentSearchQuery) || cardText.includes(currentSearchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  };

  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-category') || 'all';
      filterRecipes();
    });
  });

  if (recipeSearchInput) {
    recipeSearchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.trim().toLowerCase();
      filterRecipes();
    });
  }
});
