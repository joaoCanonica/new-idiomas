(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var equipe = [
    { foto: 'assets/01-funcionarios.png', nome: 'Davy Cavani', cargo: 'CEO & Fundador', bio: 'Letras (Uniplac) · ESL na Harvard Extension School (Cambridge, MA) · 7 anos morando nos EUA' },
    { foto: 'assets/02-funcionarios.png', nome: 'Priscyla Souza', cargo: 'Coordenação comercial e gestão', bio: 'Educação Física (Unifacvest) · MBA em Gestão de Pessoas (FGV)' },
    { foto: 'assets/03-funcionarios.png', nome: 'Vinicius Pereira Ventura', cargo: 'Professor de Inglês', bio: 'Letras Português/Inglês (Uniplac), 29 anos' },
    { foto: 'assets/04-funcionarios.png', nome: 'Davi Branco Soares', cargo: 'Professor de Inglês', bio: 'Letras Português/Inglês (Uniplac)' },
    { foto: 'assets/05-funcionarios.png', nome: 'Bruno Nascimento', cargo: 'Professor de Inglês', bio: 'Engenheiro florestal, mestre e doutor em Produção Vegetal — ensina inglês por paixão' },
    { foto: 'assets/06-funcionarios.png', nome: 'Cassiane Fernandes', cargo: 'Professora de Inglês', bio: 'Bacharel em Letras (Uninter)' },
    { foto: 'assets/07-funcionarios.png', nome: 'Diogo Soares Dias', cargo: 'Professor', bio: 'Formado em Medicina na Universidad María Auxiliadora, Assunção (PY) · 7 anos no Paraguai' },
    { foto: 'assets/08-funcionarios.png', nome: 'Juliana Quintero', cargo: 'Professora de Espanhol e Inglês', bio: 'Mestrado em Educação (Universidad Simón Rodríguez, VE) · 30 anos de experiência, 25 como diretora de escola' },
    { foto: 'assets/09-funcionarios.png', nome: 'Marciele Ritter', cargo: 'Professora de Alemão', bio: 'Administração (Uniplac) · viveu na Áustria e na Alemanha estudando o idioma' },
    { foto: 'assets/10-funcionarios.png', nome: 'Suelen Medeiros', cargo: 'Gestora administrativa', bio: '20+ anos de experiência em atendimento e rotinas administrativas' }
  ];

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
     EQUIPE — carrossel 3D (perspective + rotateY/translateZ),
     atualizado por scroll e auto-rotate via rAF quando parado.
     Em telas <768px vira carrossel linear com scroll-snap.
     ===================================================== */
  function initTeamCarousel() {
    var carousel = document.getElementById('team-carousel');
    var stage = document.getElementById('team-stage');
    if (!carousel || !stage || !equipe.length) return;

    var AUTO_SPEED = 0.06;
    var SCROLL_SENSITIVITY = 0.35;
    var MIN_OPACITY = 0.3;

    var ringMQ = window.matchMedia('(min-width: 768px)');
    var angleStep = 360 / equipe.length;
    var rotation = 0;
    var radius = 260;
    var isScrolling = false;
    var isHovering = false;
    var hasOpenCard = false;
    var lastScrollY = window.scrollY;
    var scrollTimer = null;
    var rafId = null;

    var cards = equipe.map(function (person) {
      var card = document.createElement('div');
      card.className = 'team-card';
      card.setAttribute('role', 'listitem');
      card.setAttribute('tabindex', '0');

      card.innerHTML =
        '<div class="team-card__photo-wrap">' +
          '<img class="team-card__photo" src="' + person.foto + '" alt="' + person.nome + '" loading="lazy">' +
        '</div>' +
        '<div class="team-card__caption">' +
          '<h3 class="team-card__name">' + person.nome + '</h3>' +
          '<p class="team-card__role">' + person.cargo + '</p>' +
        '</div>' +
        '<div class="team-card__bio">' +
          '<h3 class="team-card__name">' + person.nome + '</h3>' +
          '<p class="team-card__role">' + person.cargo + '</p>' +
          '<p class="team-card__bio-text">' + person.bio + '</p>' +
        '</div>';

      stage.appendChild(card);
      return card;
    });

    var toggleCard = function (card) {
      var wasOpen = card.classList.contains('is-open');
      cards.forEach(function (c) { c.classList.remove('is-open'); });
      card.classList.toggle('is-open', !wasOpen);
      hasOpenCard = !wasOpen;
    };

    stage.addEventListener('click', function (e) {
      var card = e.target.closest('.team-card');
      if (card) toggleCard(card);
    });

    stage.addEventListener('keydown', function (e) {
      var card = e.target.closest('.team-card');
      if (!card) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCard(card);
      }
    });

    carousel.addEventListener('mouseenter', function () { isHovering = true; });
    carousel.addEventListener('mouseleave', function () { isHovering = false; });

    /* ---- posicionamento do anel 3D ---- */
    var computeRadius = function () {
      var w = carousel.clientWidth || 900;
      return Math.max(200, Math.min(420, w * 0.32));
    };

    var layoutRing = function () {
      radius = computeRadius();
      cards.forEach(function (card, i) {
        card.style.transform = 'rotateY(' + (i * angleStep) + 'deg) translateZ(' + radius + 'px)';
      });
    };

    var updateRingRotation = function () {
      stage.style.transform = 'rotateY(' + rotation + 'deg)';
      cards.forEach(function (card, i) {
        var itemAngle = i * angleStep;
        var relative = ((itemAngle + rotation) % 360 + 360) % 360;
        var normalized = relative > 180 ? 360 - relative : relative;
        var opacity = Math.max(MIN_OPACITY, 1 - normalized / 180);
        card.style.opacity = opacity;
        card.style.pointerEvents = opacity < 0.5 ? 'none' : '';
      });
    };

    var clearRingStyles = function () {
      cards.forEach(function (card) {
        card.style.transform = '';
        card.style.opacity = '';
        card.style.pointerEvents = '';
      });
      stage.style.transform = '';
    };

    /* ---- scroll: atualiza rotação pelo delta ---- */
    var onScroll = function () {
      if (!ringMQ.matches) return;
      var y = window.scrollY;
      var delta = y - lastScrollY;
      lastScrollY = y;
      rotation += delta * SCROLL_SENSITIVITY;
      updateRingRotation();

      isScrolling = true;
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(function () { isScrolling = false; }, 150);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ---- auto-rotate via requestAnimationFrame quando parado ---- */
    var tick = function () {
      if (ringMQ.matches && !isScrolling && !isHovering && !hasOpenCard && !reduceMotion) {
        rotation += AUTO_SPEED;
        updateRingRotation();
      }
      rafId = window.requestAnimationFrame(tick);
    };
    rafId = window.requestAnimationFrame(tick);

    /* ---- alterna modo anel 3D / linear conforme breakpoint ---- */
    var applyMode = function () {
      cards.forEach(function (c) { c.classList.remove('is-open'); });
      hasOpenCard = false;

      if (ringMQ.matches) {
        carousel.setAttribute('data-mode', 'ring');
        layoutRing();
        updateRingRotation();
      } else {
        carousel.setAttribute('data-mode', 'linear');
        clearRingStyles();
      }
    };

    applyMode();
    if (ringMQ.addEventListener) ringMQ.addEventListener('change', applyMode);
    else ringMQ.addListener(applyMode);

    var resizeTimer = null;
    window.addEventListener('resize', function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        if (ringMQ.matches) layoutRing();
      }, 150);
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
    initTeamCarousel();
    initHeader();
    initMobileNav();
    initScrollSpy();
    initReveal();
    initFooterYear();
  });
})();
