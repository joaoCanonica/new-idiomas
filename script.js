(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =====================================================
     TELA DE ENTRADA — exibida uma vez por sessão
     ===================================================== */
  function initIntro() {
    var intro = document.getElementById('intro-screen');
    if (!intro) return;

    if (root.classList.contains('no-intro')) {
      intro.remove();
      return;
    }

    var HOLD_MS = reduceMotion ? 0 : 1300;
    var FADE_MS = reduceMotion ? 0 : 800;

    window.setTimeout(function () {
      intro.classList.add('intro-hide');

      var finish = function () {
        try { sessionStorage.setItem('niIntroSeen', '1'); } catch (e) {}
        root.classList.remove('intro-lock');
        intro.remove();
      };

      if (reduceMotion) {
        finish();
      } else {
        var done = false;
        intro.addEventListener('transitionend', function handler() {
          if (done) return;
          done = true;
          intro.removeEventListener('transitionend', handler);
          finish();
        });
        // fallback caso transitionend não dispare
        window.setTimeout(function () { if (!done) { done = true; finish(); } }, FADE_MS + 300);
      }
    }, HOLD_MS);
  }

  /* =====================================================
     HERO VIDEO — só carrega em telas maiores; mobile fica
     no still (economia de dados)
     ===================================================== */
  function initHeroVideo() {
    var video = document.getElementById('hero-video');
    if (!video) return;

    var source = video.querySelector('source');
    var saveData = !!(navigator.connection && navigator.connection.saveData);
    var mq = window.matchMedia('(min-width: 860px)');

    var shouldPlay = function () {
      return mq.matches && !reduceMotion && !saveData;
    };

    var apply = function () {
      if (shouldPlay()) {
        if (!video.dataset.loaded) {
          source.src = source.dataset.src;
          video.load();
          video.dataset.loaded = '1';
        }
        video.play().catch(function () {});
      } else if (video.dataset.loaded) {
        video.pause();
      }
    };

    apply();
    if (mq.addEventListener) mq.addEventListener('change', apply);
    else mq.addListener(apply);
  }

  /* =====================================================
     CARROSSEL DE VÍDEOS — scroll-snap nativo
     ===================================================== */
  function initVideoCarousel() {
    var carousel = document.getElementById('video-carousel');
    var track = document.getElementById('video-track');
    if (!carousel || !track) return;

    var frames = Array.prototype.slice.call(track.querySelectorAll('.video-slide__frame'));
    var prevBtn = carousel.querySelector('[data-carousel-prev]');
    var nextBtn = carousel.querySelector('[data-carousel-next]');
    var lightbox = document.getElementById('video-lightbox');
    var lightboxVideo = document.getElementById('lightbox-video');

    /* ---- play/pause conforme visibilidade real na tela ----
       debounced pra não reagir a flickers de entrada/saída durante
       o assentamento do layout (scroll programático, fontes). */
    var playTimers = new WeakMap();
    var setPlaying = function (frame, playing) {
      window.clearTimeout(playTimers.get(frame));
      var timer = window.setTimeout(function () {
        var video = frame.querySelector('.video-slide__video');
        var source = video && video.querySelector('source');
        frame.classList.toggle('is-playing', playing);
        if (!video || !source) return;
        if (playing && !reduceMotion) {
          if (!video.dataset.loaded || video.error) {
            source.src = source.dataset.src;
            video.load();
            video.dataset.loaded = '1';
          }
          video.play().catch(function () {});
        } else if (video.dataset.loaded) {
          video.pause();
        }
      }, 120);
      playTimers.set(frame, timer);
    };

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            setPlaying(entry.target, entry.isIntersecting);
          });
        },
        { threshold: 0.6 }
      );
      frames.forEach(function (frame) { observer.observe(frame); });
    }

    /* ---- destaque de profundidade do slide central (independente do play) ---- */
    var updateCenterSlide = function () {
      var trackRect = track.getBoundingClientRect();
      var trackCenter = trackRect.left + trackRect.width / 2;
      var closest = null;
      var closestDist = Infinity;

      frames.forEach(function (frame) {
        var rect = frame.getBoundingClientRect();
        var dist = Math.abs((rect.left + rect.width / 2) - trackCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closest = frame;
        }
      });

      frames.forEach(function (frame) { frame.classList.toggle('is-center', frame === closest); });
    };

    var centerTicking = false;
    var requestCenterUpdate = function () {
      if (centerTicking) return;
      centerTicking = true;
      window.requestAnimationFrame(function () {
        updateCenterSlide();
        centerTicking = false;
      });
    };

    track.addEventListener('scroll', requestCenterUpdate, { passive: true });
    window.addEventListener('resize', requestCenterUpdate);
    requestCenterUpdate();

    /* ---- setas de navegação ---- */
    var slideStep = function () {
      var slide = track.querySelector('.video-slide');
      if (!slide) return 260;
      var style = getComputedStyle(track);
      return slide.getBoundingClientRect().width + parseFloat(style.columnGap || style.gap || 0);
    };

    var updateArrows = function () {
      var max = track.scrollWidth - track.clientWidth - 1;
      if (prevBtn) prevBtn.classList.toggle('is-disabled', track.scrollLeft <= 1);
      if (nextBtn) nextBtn.classList.toggle('is-disabled', track.scrollLeft >= max);
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        track.scrollBy({ left: -slideStep(), behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        track.scrollBy({ left: slideStep(), behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    }

    var scrollTicking = false;
    track.addEventListener('scroll', function () {
      if (scrollTicking) return;
      scrollTicking = true;
      window.requestAnimationFrame(function () {
        updateArrows();
        scrollTicking = false;
      });
    }, { passive: true });
    updateArrows();
    window.addEventListener('resize', updateArrows);

    /* ---- lightbox com áudio ---- */
    if (!lightbox || !lightboxVideo) return;

    var pauseAllSlides = function () {
      frames.forEach(function (frame) {
        var video = frame.querySelector('.video-slide__video');
        frame.classList.remove('is-playing');
        if (video) video.pause();
      });
    };

    var lightboxSource = document.getElementById('lightbox-video-source');

    var openLightbox = function (src) {
      pauseAllSlides();
      lightboxSource.src = src;
      lightboxVideo.load();
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      root.classList.add('intro-lock');
      lightboxVideo.play().catch(function () {});
    };

    var closeLightbox = function () {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      root.classList.remove('intro-lock');
      lightboxVideo.pause();
      lightboxSource.removeAttribute('src');
      lightboxVideo.load();
    };

    frames.forEach(function (frame) {
      var hit = frame.querySelector('.video-slide__hit');
      if (!hit) return;
      hit.addEventListener('click', function () {
        openLightbox(frame.getAttribute('data-video-src'));
      });
    });

    lightbox.querySelectorAll('[data-lightbox-dismiss]').forEach(function (el) {
      el.addEventListener('click', closeLightbox);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
    });
  }

  /* =====================================================
     HEADER — estado sólido ao rolar
     ===================================================== */
  function initHeader() {
    var header = document.getElementById('site-header');
    if (!header) return;

    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* =====================================================
     MENU MOBILE
     ===================================================== */
  function initMobileNav() {
    var toggle = document.getElementById('nav-toggle');
    var nav = document.getElementById('main-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* =====================================================
     SCROLL-SPY — destaca o link da seção visível
     ===================================================== */
  function initScrollSpy() {
    var links = document.querySelectorAll('.main-nav__list a');
    if (!links.length || !('IntersectionObserver' in window)) return;

    var map = {};
    links.forEach(function (link) {
      var id = link.getAttribute('href').replace('#', '');
      map[id] = link;
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = map[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('is-active'); });
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    Object.keys(map).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  /* =====================================================
     REVEAL ON SCROLL
     ===================================================== */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window) || reduceMotion) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* =====================================================
     RODAPÉ — ano corrente
     ===================================================== */
  function initFooterYear() {
    var el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initIntro();
    initHeroVideo();
    initVideoCarousel();
    initHeader();
    initMobileNav();
    initScrollSpy();
    initReveal();
    initFooterYear();
  });
})();
