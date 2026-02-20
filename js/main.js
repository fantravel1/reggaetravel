/* ============================================================
   REGGAETRAVEL.COM — Main JavaScript
   Navigation, scroll animations, FAQ accordion, lazy loading
   ============================================================ */

(function () {
  'use strict';

  /* ---------- DOM Ready ---------- */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initNavigation();
    initScrollReveal();
    initFaqAccordion();
    initLazyVideos();
    initSmoothScroll();
    initActiveNav();
    initTabs();
    initBackToTop();
  }

  /* ---------- 1. Navigation ---------- */
  function initNavigation() {
    const nav = document.querySelector('.nav');
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    if (!nav) return;

    // Scroll state
    let lastScroll = 0;
    window.addEventListener('scroll', function () {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    }, { passive: true });

    // Mobile toggle
    if (toggle && menu && overlay) {
      toggle.addEventListener('click', function () {
        const isOpen = menu.classList.contains('active');
        toggleMenu(!isOpen);
      });

      overlay.addEventListener('click', function () {
        toggleMenu(false);
      });

      mobileLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          toggleMenu(false);
        });
      });

      // Close on Escape
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
          toggleMenu(false);
        }
      });
    }

    function toggleMenu(open) {
      toggle.classList.toggle('active', open);
      menu.classList.toggle('active', open);
      overlay.classList.toggle('active', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }
  }

  /* ---------- 2. Scroll Reveal ---------- */
  function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger');

    if (!reveals.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      reveals.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // Fallback: just show everything
      reveals.forEach(function (el) {
        el.classList.add('visible');
      });
    }
  }

  /* ---------- 3. FAQ Accordion ---------- */
  function initFaqAccordion() {
    var questions = document.querySelectorAll('.faq-question');

    questions.forEach(function (question) {
      question.addEventListener('click', function () {
        var item = this.closest('.faq-item');
        var isActive = item.classList.contains('active');

        // Close all other items
        document.querySelectorAll('.faq-item.active').forEach(function (openItem) {
          if (openItem !== item) {
            openItem.classList.remove('active');
          }
        });

        // Toggle this item
        item.classList.toggle('active', !isActive);
      });
    });
  }

  /* ---------- 4. Lazy Load Videos ---------- */
  function initLazyVideos() {
    var videoPlaceholders = document.querySelectorAll('.video-lazy');

    if (!videoPlaceholders.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var placeholder = entry.target;
            var iframe = document.createElement('iframe');
            iframe.src = placeholder.dataset.src;
            iframe.title = placeholder.dataset.title || 'YouTube video';
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('loading', 'lazy');
            placeholder.parentNode.replaceChild(iframe, placeholder);
            observer.unobserve(placeholder);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '200px 0px'
      });

      videoPlaceholders.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // Fallback: load all videos immediately
      videoPlaceholders.forEach(function (placeholder) {
        var iframe = document.createElement('iframe');
        iframe.src = placeholder.dataset.src;
        iframe.title = placeholder.dataset.title || 'YouTube video';
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');
        placeholder.parentNode.replaceChild(iframe, placeholder);
      });
    }
  }

  /* ---------- 5. Smooth Scroll ---------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  /* ---------- 6. Active Nav Link ---------- */
  function initActiveNav() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-links a');

    if (!sections.length || !navLinks.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute('id');
            navLinks.forEach(function (link) {
              link.classList.remove('active');
              if (link.getAttribute('href') === '#' + id) {
                link.classList.add('active');
              }
            });
          }
        });
      }, {
        threshold: 0.2,
        rootMargin: '-70px 0px -50% 0px'
      });

      sections.forEach(function (section) {
        observer.observe(section);
      });
    }
  }

  /* ---------- 7. Tabs ---------- */
  function initTabs() {
    var tabButtons = document.querySelectorAll('.tab-btn');
    var tabContents = document.querySelectorAll('.tab-content');

    if (!tabButtons.length) return;

    tabButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var tabName = this.getAttribute('data-tab');

        // Remove active from all buttons
        tabButtons.forEach(function (btn) {
          btn.classList.remove('active');
        });

        // Remove active from all contents
        tabContents.forEach(function (content) {
          content.classList.remove('active');
        });

        // Add active to clicked button
        this.classList.add('active');

        // Add active to corresponding content
        var content = document.getElementById(tabName);
        if (content) {
          content.classList.add('active');
        }
      });
    });
  }

  /* ---------- 8. Back to Top Button ---------- */
  function initBackToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      if (window.pageYOffset > 600) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
