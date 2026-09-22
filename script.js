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

  /* 8 perguntas, dificuldade crescente, misturando bandeira e texto */
  var perguntas = [
    {
      nivel: 'Fácil', tipo: 'flag',
      texto: 'Qual bandeira representa o idioma inglês?',
      opcoes: [
        { rotulo: 'Estados Unidos', flag: 'assets/bandeira-eua.png', correta: true },
        { rotulo: 'Espanha', flag: 'assets/bandeira-espanha.png' },
        { rotulo: 'Alemanha', flag: 'assets/bandeira-alemanha.png' },
        { rotulo: 'Itália', flag: 'assets/bandeira-italia.png' }
      ]
    },
    {
      nivel: 'Fácil', tipo: 'texto',
      texto: 'Como se diz "obrigado" em inglês?',
      opcoes: [
        { rotulo: 'Thank you', correta: true },
        { rotulo: 'Danke' },
        { rotulo: 'Grazie' },
        { rotulo: 'Gracias' }
      ]
    },
    {
      nivel: 'Fácil', tipo: 'flag',
      texto: 'Essa bandeira representa qual idioma?',
      flagPergunta: 'assets/bandeira-italia.png',
      opcoes: [
        { rotulo: 'Italiano', correta: true },
        { rotulo: 'Espanhol' },
        { rotulo: 'Alemão' },
        { rotulo: 'Inglês' }
      ]
    },
    {
      nivel: 'Médio', tipo: 'texto',
      texto: 'O que significa "Buongiorno" em italiano?',
      opcoes: [
        { rotulo: 'Bom dia', correta: true },
        { rotulo: 'Boa noite' },
        { rotulo: 'Obrigado' },
        { rotulo: 'Por favor' }
      ]
    },
    {
      nivel: 'Médio', tipo: 'texto',
      texto: 'Complete em alemão: "Ich ___ Student."',
      opcoes: [
        { rotulo: 'bin', correta: true },
        { rotulo: 'bist' },
        { rotulo: 'ist' },
        { rotulo: 'sind' }
      ]
    },
    {
      nivel: 'Médio', tipo: 'texto',
      texto: 'Qual é o plural de "child" em inglês?',
      opcoes: [
        { rotulo: 'children', correta: true },
        { rotulo: 'childs' },
        { rotulo: 'childes' },
        { rotulo: 'childrens' }
      ]
    },
    {
      nivel: 'Difícil', tipo: 'texto',
      texto: 'Qual é a tradução correta pro espanhol de "Eu gostaria de uma xícara de café"?',
      opcoes: [
        { rotulo: 'Me gustaría una taza de café', correta: true },
        { rotulo: 'Me gustaría una copa de café' },
        { rotulo: 'Yo quiero un café taza' },
        { rotulo: 'Quisiera una taza para café' }
      ]
    },
    {
      nivel: 'Difícil', tipo: 'texto',
      texto: 'Qual frase está gramaticalmente correta em alemão?',
      opcoes: [
        { rotulo: 'Ich habe einen Hund', correta: true },
        { rotulo: 'Ich habe ein Hund' },
        { rotulo: 'Ich hat einen Hund' },
        { rotulo: 'Ich haben einen Hund' }
      ]
    }
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

  }

  /* =====================================================
     LIGHTBOX DE VÍDEO — delegado no document, então funciona
     pra qualquer ".video-slide__frame[data-video-src]" na
     página (carrossel de vídeos E o vídeo de depoimento),
     não só o que estiver dentro do carrossel.
     ===================================================== */
  function initVideoLightbox() {
    var lightbox = document.getElementById('video-lightbox');
    var lightboxVideo = document.getElementById('lightbox-video');
    var lightboxSource = document.getElementById('lightbox-video-source');
    if (!lightbox || !lightboxVideo || !lightboxSource) return;

    var pauseAllVideos = function () {
      document.querySelectorAll('.video-slide__frame').forEach(function (frame) {
        var video = frame.querySelector('.video-slide__video');
        frame.classList.remove('is-playing');
        if (video) video.pause();
      });
    };

    var openLightbox = function (src) {
      pauseAllVideos();
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

    document.addEventListener('click', function (e) {
      var hit = e.target.closest('.video-slide__hit');
      if (!hit) return;
      var frame = hit.closest('[data-video-src]');
      if (frame) openLightbox(frame.getAttribute('data-video-src'));
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
    /* só reage ao scroll quando o carrossel está perto da tela —
       sem isso, rolar a página longe da Equipe ainda girava o
       anel, porque o listener de scroll não checava visibilidade. */
    var isNearViewport = false;
    var lastScrollY = window.scrollY;
    var scrollTimer = null;
    var rafId = null;

    if ('IntersectionObserver' in window) {
      var visibilityObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            isNearViewport = entry.isIntersecting;
            if (isNearViewport) lastScrollY = window.scrollY;
          });
        },
        { rootMargin: '35% 0px 35% 0px' }
      );
      visibilityObserver.observe(carousel);
    } else {
      isNearViewport = true;
    }

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
      return Math.max(280, Math.min(560, w * 0.42));
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

    /* ---- scroll: atualiza rotação pelo delta, só quando perto da tela ---- */
    var onScroll = function () {
      var y = window.scrollY;
      if (!ringMQ.matches || !isNearViewport) {
        lastScrollY = y;
        return;
      }
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
      if (ringMQ.matches && isNearViewport && !isScrolling && !isHovering && !hasOpenCard && !reduceMotion) {
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
     JOGO — desafio de idiomas, 8 perguntas, dificuldade
     crescente; termina com CTA piscando pro WhatsApp
     ===================================================== */
  function initJogo() {
    var card = document.getElementById('jogo-card');
    if (!card || !perguntas.length) return;

    var index = 0;
    var score = 0;
    var answered = false;

    var escapeHtml = function (str) {
      return String(str).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    };

    var renderIntro = function () {
      card.innerHTML =
        '<div class="jogo-intro">' +
          '<span class="jogo-intro__icon">' +
            '<svg viewBox="0 0 24 24" fill="none"><path d="M12 21c4.97 0 9-3.58 9-8s-4.03-8-9-8-9 3.58-9 8c0 1.85.68 3.55 1.83 4.93L4 21l4.5-1.31A10 10 0 0 0 12 21Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
          '</span>' +
          '<h3 class="jogo-intro__title">Pronto pra jogar?</h3>' +
          '<p class="jogo-intro__text">8 perguntas sobre inglês, espanhol, alemão e italiano — começa fácil e vai ficando mais difícil. Não vale colar.</p>' +
          '<button type="button" class="btn btn--solid" id="jogo-start">Começar desafio</button>' +
        '</div>';
      var startBtn = document.getElementById('jogo-start');
      if (startBtn) startBtn.addEventListener('click', function () { index = 0; score = 0; renderQuestion(); });
    };

    var renderQuestion = function () {
      answered = false;
      var q = perguntas[index];
      var pct = Math.round((index / perguntas.length) * 100);

      var optionsHtml = q.opcoes.map(function (opt, i) {
        if (q.tipo === 'flag' && opt.flag) {
          return (
            '<button type="button" class="jogo-option jogo-option--flag" data-i="' + i + '">' +
              '<span class="jogo-option__flag"><img src="' + opt.flag + '" alt="" loading="lazy"></span>' +
              '<span>' + escapeHtml(opt.rotulo) + '</span>' +
            '</button>'
          );
        }
        return '<button type="button" class="jogo-option" data-i="' + i + '">' + escapeHtml(opt.rotulo) + '</button>';
      }).join('');

      var flagPerguntaHtml = q.flagPergunta
        ? '<div class="jogo-option__flag" style="width:72px;height:72px;margin-bottom:1rem;"><img src="' + q.flagPergunta + '" alt="" loading="lazy"></div>'
        : '';

      card.innerHTML =
        '<div class="jogo-progress">' +
          '<span class="jogo-progress__count">' + (index + 1) + ' / ' + perguntas.length + '</span>' +
          '<span class="jogo-progress__track"><span class="jogo-progress__fill" style="width:' + pct + '%"></span></span>' +
          '<span class="jogo-progress__difficulty">' + escapeHtml(q.nivel) + '</span>' +
        '</div>' +
        '<div class="jogo-question">' +
          flagPerguntaHtml +
          '<p class="jogo-question__text">' + escapeHtml(q.texto) + '</p>' +
          '<div class="jogo-options">' + optionsHtml + '</div>' +
        '</div>';

      card.querySelectorAll('.jogo-option').forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (answered) return;
          answered = true;
          var i = Number(btn.getAttribute('data-i'));
          var correct = q.opcoes[i].correta === true;
          if (correct) score++;

          card.querySelectorAll('.jogo-option').forEach(function (b, bi) {
            b.setAttribute('disabled', 'true');
            if (q.opcoes[bi].correta) b.classList.add('is-correct');
            else if (bi === i) b.classList.add('is-wrong');
          });

          window.setTimeout(function () {
            index++;
            if (index < perguntas.length) renderQuestion();
            else renderResult();
          }, reduceMotion ? 250 : 900);
        });
      });
    };

    var renderResult = function () {
      var total = perguntas.length;
      var msg;
      if (score >= 7) msg = 'Mandou muito bem! Bora colocar isso pra funcionar de verdade numa conversa?';
      else if (score >= 4) msg = 'Você já tem base — falta destravar a fala. É exatamente aí que a gente entra.';
      else msg = 'Todo mundo começa de algum lugar. Bora montar um plano pra você sair do zero de verdade?';

      var waText = encodeURIComponent('Olá! Fiz o desafio de idiomas no site e tirei ' + score + '/' + total + ' — quero saber mais sobre as aulas.');

      card.innerHTML =
        '<div class="jogo-result">' +
          '<span class="jogo-result__score">' + score + '/' + total + '</span>' +
          '<h3 class="jogo-result__title">Resultado</h3>' +
          '<p class="jogo-result__msg">' + msg + '</p>' +
          '<a class="btn btn--solid btn--whatsapp jogo-result__cta" target="_blank" rel="noopener" href="https://api.whatsapp.com/send?phone=5549984100055&text=' + waText + '">' +
            '<svg class="btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
              '<path fill="currentColor" d="M17.47 14.38c-.29-.15-1.71-.85-1.98-.94-.27-.1-.46-.15-.66.15-.2.29-.76.94-.93 1.13-.17.2-.34.22-.63.07-.29-.15-1.22-.45-2.32-1.43-.86-.76-1.44-1.71-1.6-2-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.66-1.59-.9-2.18-.24-.57-.48-.5-.66-.5h-.56c-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.43 0 1.43 1.04 2.82 1.19 3.01.15.2 2.05 3.13 4.96 4.39.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.11.55-.08 1.71-.7 1.96-1.37.24-.68.24-1.26.17-1.38-.07-.13-.27-.2-.56-.35z"/>' +
              '<path fill="currentColor" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.5 3.62 1.42 5.13L2 22l5.13-1.51a9.9 9.9 0 0 0 4.91 1.3h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.02h-.01a8.1 8.1 0 0 1-4.12-1.13l-.3-.18-3.05.9.91-2.98-.19-.31a8.08 8.08 0 0 1-1.25-4.4c0-4.46 3.63-8.09 8.1-8.09 2.16 0 4.19.85 5.72 2.38a8.05 8.05 0 0 1 2.37 5.72c0 4.46-3.63 8.09-8.18 8.09z"/>' +
            '</svg>' +
            'Falar no WhatsApp' +
          '</a>' +
          '<button type="button" class="jogo-result__retry" id="jogo-retry">Jogar de novo</button>' +
        '</div>';

      var retryBtn = document.getElementById('jogo-retry');
      if (retryBtn) retryBtn.addEventListener('click', renderIntro);
    };

    renderIntro();
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

    /* sem IntersectionObserver ou com prefers-reduced-motion, nem
       tenta esconder — o conteúdo já está visível por padrão (CSS),
       então basta não mexer em nada. */
    if (!('IntersectionObserver' in window) || reduceMotion) return;

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.remove('is-hidden');
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    /* só esconde um item depois que o observer já está pronto pra
       vigiá-lo — nunca existe um momento em que algo fica
       escondido sem alguém garantindo que vai revelar de novo. */
    items.forEach(function (el) {
      el.classList.add('is-hidden');
      observer.observe(el);
    });

    /* rede de segurança: em qualquer navegador/condição estranha
       onde o observer não dispare pra algum item (viewport
       atípico, elemento com altura zero no momento da observação
       etc.), força tudo visível depois de um tempo — nada fica
       escondido pra sempre. */
    window.setTimeout(function () {
      document.querySelectorAll('.reveal.is-hidden').forEach(function (el) {
        el.classList.remove('is-hidden');
        el.classList.add('is-visible');
      });
    }, 4000);
  }

  /* =====================================================
     RODAPÉ — ano corrente
     ===================================================== */
  function initFooterYear() {
    var el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* cada init roda isolado: um erro em um módulo (seletor que não
     bate, dado inesperado etc.) não pode travar a cadeia e impedir
     os próximos de rodar — em especial initReveal(), que é quem
     faz o conteúdo aparecer. */
  function safeInit(name, fn) {
    try {
      fn();
    } catch (err) {
      if (window.console && console.error) console.error('[' + name + ']', err);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    safeInit('initIntro', initIntro);
    safeInit('initHeroVideo', initHeroVideo);
    safeInit('initVideoCarousel', initVideoCarousel);
    safeInit('initVideoLightbox', initVideoLightbox);
    safeInit('initTeamCarousel', initTeamCarousel);
    safeInit('initJogo', initJogo);
    safeInit('initHeader', initHeader);
    safeInit('initMobileNav', initMobileNav);
    safeInit('initScrollSpy', initScrollSpy);
    safeInit('initReveal', initReveal);
    safeInit('initFooterYear', initFooterYear);
  });
})();
