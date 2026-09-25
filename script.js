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

  /* Desafio: a pessoa escolhe o idioma pela bandeira, depois encara
     8 perguntas daquele idioma, ficando mais difícil a cada rodada. */
  var idiomasQuiz = {
    ingles: {
      nome: 'Inglês', bandeira: 'assets/bandeira-eua.png', cor: '#2E4374',
      perguntas: [
        { nivel: 'Fácil', texto: 'Como se diz "obrigado" em inglês?', opcoes: [{ rotulo: 'Thank you', correta: true }, { rotulo: 'Danke' }, { rotulo: 'Grazie' }, { rotulo: 'Gracias' }] },
        { nivel: 'Fácil', texto: 'Qual é o plural de "cat"?', opcoes: [{ rotulo: 'cats', correta: true }, { rotulo: 'cates' }, { rotulo: "cat's" }, { rotulo: 'caties' }] },
        { nivel: 'Fácil', texto: 'Como se diz "bom dia" em inglês?', opcoes: [{ rotulo: 'Good morning', correta: true }, { rotulo: 'Good night' }, { rotulo: 'Goodbye' }, { rotulo: 'Good evening' }] },
        { nivel: 'Médio', texto: 'Qual é o plural de "child"?', opcoes: [{ rotulo: 'children', correta: true }, { rotulo: 'childs' }, { rotulo: 'childes' }, { rotulo: 'childrens' }] },
        { nivel: 'Médio', texto: 'Complete: "She ___ to school every day."', opcoes: [{ rotulo: 'goes', correta: true }, { rotulo: 'go' }, { rotulo: 'going' }, { rotulo: 'gone' }] },
        { nivel: 'Médio', texto: 'Qual frase está correta?', opcoes: [{ rotulo: 'I have been living here for 10 years', correta: true }, { rotulo: 'I am living here since 10 years' }, { rotulo: 'I live here since 10 years' }, { rotulo: 'I have live here for 10 years' }] },
        { nivel: 'Difícil', texto: 'Qual phrasal verb significa "desistir"?', opcoes: [{ rotulo: 'give up', correta: true }, { rotulo: 'give away' }, { rotulo: 'give out' }, { rotulo: 'give off' }] },
        { nivel: 'Difícil', texto: 'Qual frase está gramaticalmente correta?', opcoes: [{ rotulo: 'If I had known, I would have gone', correta: true }, { rotulo: 'If I would have known, I had gone' }, { rotulo: 'If I have known, I would go' }, { rotulo: 'If I knew, I would have go' }] }
      ]
    },
    espanhol: {
      nome: 'Espanhol', bandeira: 'assets/bandeira-espanha.png', cor: '#AD1519',
      perguntas: [
        { nivel: 'Fácil', texto: 'Como se diz "obrigado" em espanhol?', opcoes: [{ rotulo: 'Gracias', correta: true }, { rotulo: 'Grazie' }, { rotulo: 'Danke' }, { rotulo: 'Thank you' }] },
        { nivel: 'Fácil', texto: 'Como se diz "bom dia" em espanhol?', opcoes: [{ rotulo: 'Buenos días', correta: true }, { rotulo: 'Buenas noches' }, { rotulo: 'Buenas tardes' }, { rotulo: 'Hasta luego' }] },
        { nivel: 'Fácil', texto: 'Qual é o plural de "papel"?', opcoes: [{ rotulo: 'papeles', correta: true }, { rotulo: 'papels' }, { rotulo: 'papeis' }, { rotulo: 'papes' }] },
        { nivel: 'Médio', texto: 'Complete: "Yo ___ estudiante."', opcoes: [{ rotulo: 'soy', correta: true }, { rotulo: 'estoy' }, { rotulo: 'eres' }, { rotulo: 'es' }] },
        { nivel: 'Médio', texto: 'Qual é a tradução correta de "Eu gostaria de uma xícara de café"?', opcoes: [{ rotulo: 'Me gustaría una taza de café', correta: true }, { rotulo: 'Me gustaría una copa de café' }, { rotulo: 'Yo quiero un café taza' }, { rotulo: 'Me gustaría un plato de café' }] },
        { nivel: 'Médio', texto: 'Qual é o diminutivo correto de "casa"?', opcoes: [{ rotulo: 'casita', correta: true }, { rotulo: 'casina' }, { rotulo: 'casilla' }, { rotulo: 'casuca' }] },
        { nivel: 'Difícil', texto: 'Qual frase usa corretamente o subjuntivo?', opcoes: [{ rotulo: 'Espero que tengas un buen día', correta: true }, { rotulo: 'Espero que tienes un buen día' }, { rotulo: 'Espero que tenías un buen día' }, { rotulo: 'Espero que tendrás un buen día' }] },
        { nivel: 'Difícil', texto: 'Qual é a tradução certa pra "Se eu tivesse tempo, viajaria mais"?', opcoes: [{ rotulo: 'Si tuviera tiempo, viajaría más', correta: true }, { rotulo: 'Si tengo tiempo, viajaría más' }, { rotulo: 'Si tuviese tiempo, viajo más' }, { rotulo: 'Si tendría tiempo, viajaría más' }] }
      ]
    },
    alemao: {
      nome: 'Alemão', bandeira: 'assets/bandeira-alemanha.png', cor: '#1A1A1A',
      perguntas: [
        { nivel: 'Fácil', texto: 'Como se diz "obrigado" em alemão?', opcoes: [{ rotulo: 'Danke', correta: true }, { rotulo: 'Gracias' }, { rotulo: 'Grazie' }, { rotulo: 'Thank you' }] },
        { nivel: 'Fácil', texto: 'Como se diz "bom dia" em alemão?', opcoes: [{ rotulo: 'Guten Morgen', correta: true }, { rotulo: 'Gute Nacht' }, { rotulo: 'Guten Abend' }, { rotulo: 'Auf Wiedersehen' }] },
        { nivel: 'Fácil', texto: 'Qual é o artigo definido correto para "Haus" (casa)?', opcoes: [{ rotulo: 'das', correta: true }, { rotulo: 'der' }, { rotulo: 'die' }, { rotulo: 'den' }] },
        { nivel: 'Médio', texto: 'Complete: "Ich ___ Student."', opcoes: [{ rotulo: 'bin', correta: true }, { rotulo: 'bist' }, { rotulo: 'ist' }, { rotulo: 'sind' }] },
        { nivel: 'Médio', texto: 'Qual é o plural de "Kind" (criança)?', opcoes: [{ rotulo: 'Kinder', correta: true }, { rotulo: 'Kinds' }, { rotulo: 'Kindes' }, { rotulo: 'Kinden' }] },
        { nivel: 'Médio', texto: 'Qual frase está gramaticalmente correta?', opcoes: [{ rotulo: 'Ich habe einen Hund', correta: true }, { rotulo: 'Ich habe ein Hund' }, { rotulo: 'Ich hat einen Hund' }, { rotulo: 'Ich haben einen Hund' }] },
        { nivel: 'Difícil', texto: 'Qual frase está no caso dativo correto?', opcoes: [{ rotulo: 'Ich gebe dem Mann das Buch', correta: true }, { rotulo: 'Ich gebe der Mann das Buch' }, { rotulo: 'Ich gebe den Mann das Buch' }, { rotulo: 'Ich gebe des Mannes das Buch' }] },
        { nivel: 'Difícil', texto: 'Qual é a ordem certa das palavras?', opcoes: [{ rotulo: 'Ich habe gestern das Buch gelesen', correta: true }, { rotulo: 'Ich gestern habe das Buch gelesen' }, { rotulo: 'Habe gestern ich das Buch gelesen' }, { rotulo: 'Gestern ich habe das Buch gelesen' }] }
      ]
    },
    italiano: {
      nome: 'Italiano', bandeira: 'assets/bandeira-italia.png', cor: '#1E7A3D',
      perguntas: [
        { nivel: 'Fácil', texto: 'Como se diz "obrigado" em italiano?', opcoes: [{ rotulo: 'Grazie', correta: true }, { rotulo: 'Danke' }, { rotulo: 'Gracias' }, { rotulo: 'Thank you' }] },
        { nivel: 'Fácil', texto: 'Como se diz "bom dia" em italiano?', opcoes: [{ rotulo: 'Buongiorno', correta: true }, { rotulo: 'Buonasera' }, { rotulo: 'Buonanotte' }, { rotulo: 'Arrivederci' }] },
        { nivel: 'Fácil', texto: 'Qual é o plural de "libro" (livro)?', opcoes: [{ rotulo: 'libri', correta: true }, { rotulo: 'libros' }, { rotulo: 'libris' }, { rotulo: 'libres' }] },
        { nivel: 'Médio', texto: 'Complete: "Io ___ italiano."', opcoes: [{ rotulo: 'sono', correta: true }, { rotulo: 'sei' }, { rotulo: 'è' }, { rotulo: 'siamo' }] },
        { nivel: 'Médio', texto: 'Qual é a forma verbal de "querer" no condicional (equivalente a "gostaria"), usada em "___ un caffè"?', opcoes: [{ rotulo: 'Vorrei', correta: true }, { rotulo: 'Voglio' }, { rotulo: 'Piace' }, { rotulo: 'Volevo' }] },
        { nivel: 'Médio', texto: 'Qual é o artigo definido correto para "amico" (amigo)?', opcoes: [{ rotulo: "l'amico", correta: true }, { rotulo: 'il amico' }, { rotulo: 'lo amico' }, { rotulo: 'la amico' }] },
        { nivel: 'Difícil', texto: 'Complete no passato prossimo: "Io ___ la pizza ieri."', opcoes: [{ rotulo: 'ho mangiato', correta: true }, { rotulo: 'ho mangiare' }, { rotulo: 'sono mangiato' }, { rotulo: 'avevo mangiato' }] },
        { nivel: 'Difícil', texto: 'Qual frase usa corretamente o congiuntivo?', opcoes: [{ rotulo: 'Penso che tu abbia ragione', correta: true }, { rotulo: 'Penso che tu hai ragione' }, { rotulo: 'Penso che tu avevi ragione' }, { rotulo: 'Penso che tu avrai ragione' }] }
      ]
    }
  };

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
     HERO VIDEO — roda em qualquer tamanho de tela; fica no
     still parado com quem pediu "reduzir movimento" ou está no
     modo Economia de Dados. Pausa fora da viewport, retoma ao
     voltar — nunca continua rodando fora de vista.
     ===================================================== */
  function initHeroVideo() {
    var video = document.getElementById('hero-video');
    if (!video) return;

    var source = video.querySelector('source');
    var saveData = !!(navigator.connection && navigator.connection.saveData);

    if (reduceMotion || saveData) return;

    var ensureLoaded = function () {
      if (!video.dataset.loaded) {
        source.src = source.dataset.src;
        video.load();
        video.dataset.loaded = '1';
      }
    };

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            ensureLoaded();
            video.play().catch(function () {});
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.2 });
      observer.observe(video);
    } else {
      ensureLoaded();
      video.play().catch(function () {});
    }
  }

  /* =====================================================
     PARALLAX DA MÍDIA DO HERO — leve deslocamento vertical
     ligado ao scroll, junto com o zoom contínuo (Ken Burns)
     que já vem do CSS. Só translada o cartão em si (nunca a
     página).
     ===================================================== */
  function initHeroParallax() {
    var media = document.querySelector('.hero-media');
    if (!media || reduceMotion) return;

    var RANGE = 26; // px de percurso total
    var ticking = false;

    var update = function () {
      var rect = media.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var center = rect.top + rect.height / 2;
      var progress = 1 - Math.min(1, Math.max(0, center / vh));
      var shift = (progress - 0.5) * RANGE;
      media.style.setProperty('--parallax-y', shift.toFixed(1) + 'px');
      ticking = false;
    };

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* =====================================================
     VÍDEOS — player principal + trilho de miniaturas. Só o
     vídeo selecionado carrega (preload="none" + load() sob
     demanda); os outros ficam só no poster. Pausa fora da
     viewport, retoma ao voltar.
     ===================================================== */
  function initVideosPlayer() {
    var mainVideo = document.getElementById('videos-main-video');
    var mainSource = document.getElementById('videos-main-source');
    var titleEl = document.getElementById('videos-info-title');
    var descEl = document.getElementById('videos-info-desc');
    var rail = document.getElementById('videos-rail');
    if (!mainVideo || !mainSource || !rail) return;

    var items = Array.prototype.slice.call(rail.querySelectorAll('.videos-rail__item'));
    if (!items.length) return;

    /* o <source> vem só com data-src (sem src) pra garantir zero
       rede antes do JS rodar; sem isso o <video> fica sem nenhuma
       fonte de fato e o botão nativo de play não faz nada no
       primeiro vídeo — só passava a funcionar depois de trocar
       pra outro vídeo e voltar, porque só loadVideo() seta o src.
       Aqui já deixamos o src pronto (preload="none" evita o download
       antecipado, só registra a fonte). */
    if (!mainSource.getAttribute('src')) {
      mainSource.src = mainSource.getAttribute('data-src');
      mainVideo.load();
    }

    /* trocar de vídeo no trilho só troca a fonte/poster — nunca
       chama play() sozinho. Tocar automaticamente ao selecionar
       (ou retomar via IntersectionObserver ao rolar) deixava o
       vídeo travado com preload="none" em conexões mais lentas.
       Igual ao vídeo de depoimento: só o clique da pessoa no
       próprio vídeo (botão nativo de play) inicia a reprodução. */
    var loadVideo = function (btn, moveFocus) {
      var src = btn.getAttribute('data-video-src');
      var poster = btn.getAttribute('data-video-poster');
      var title = btn.getAttribute('data-video-title');
      var desc = btn.getAttribute('data-video-desc');

      mainVideo.pause();
      mainSource.src = src;
      mainVideo.poster = poster;
      mainVideo.load();

      if (titleEl) titleEl.textContent = title;
      if (descEl) descEl.textContent = desc;

      items.forEach(function (it) {
        var active = it === btn;
        it.classList.toggle('is-active', active);
        it.setAttribute('aria-selected', active ? 'true' : 'false');
        it.setAttribute('tabindex', active ? '0' : '-1');
      });

      if (moveFocus) btn.focus();
    };

    items.forEach(function (btn) {
      btn.addEventListener('click', function () { loadVideo(btn, false); });
    });

    rail.addEventListener('keydown', function (e) {
      var current = e.target.closest('.videos-rail__item');
      if (!current) return;
      var i = items.indexOf(current);
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        loadVideo(items[(i + 1) % items.length], true);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        loadVideo(items[(i - 1 + items.length) % items.length], true);
      }
    });
  }

  /* =====================================================
     LIGHTBOX DE VÍDEO — delegado no document; usado hoje só
     pelo vídeo de depoimento (".video-slide__frame[data-video-src]").
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
      var mainVideo = document.getElementById('videos-main-video');
      if (mainVideo) mainVideo.pause();
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
     EQUIPE — "Mesa da equipe": painel do integrante ativo +
     índice acessível (tablist). Clique, teclado (Enter/Espaço/
     setas) e os botões Anterior/Próximo. Sem autoplay.
     ===================================================== */
  function initEquipeMesa() {
    var mesa = document.getElementById('equipe-mesa');
    var indice = document.getElementById('equipe-indice');
    var painel = document.getElementById('equipe-painel');
    if (!mesa || !indice || !painel || !equipe.length) return;

    var fotoImg = document.getElementById('equipe-painel-foto');
    var numEl = document.getElementById('equipe-painel-num');
    var nomeEl = document.getElementById('equipe-painel-nome');
    var cargoEl = document.getElementById('equipe-painel-cargo');
    var bioEl = document.getElementById('equipe-painel-bio');
    var prevBtn = document.getElementById('equipe-prev');
    var nextBtn = document.getElementById('equipe-next');

    var pad2 = function (n) { return n < 10 ? '0' + n : String(n); };
    var activeIndex = 0;
    var tabs = [];

    equipe.forEach(function (person, i) {
      var li = document.createElement('li');
      li.setAttribute('role', 'presentation');

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'equipe-indice__item';
      btn.setAttribute('role', 'tab');
      btn.id = 'equipe-tab-' + i;
      btn.setAttribute('aria-controls', 'equipe-painel');
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.setAttribute('tabindex', i === 0 ? '0' : '-1');
      btn.innerHTML =
        '<span class="equipe-indice__num">' + pad2(i + 1) + '</span>' +
        '<span class="equipe-indice__text">' +
          '<span class="equipe-indice__nome">' + person.nome + '</span>' +
          '<span class="equipe-indice__cargo">' + person.cargo + '</span>' +
        '</span>';
      btn.addEventListener('click', function () { setActive(i, false); });

      li.appendChild(btn);
      indice.appendChild(li);
      tabs.push(btn);
    });

    painel.setAttribute('role', 'tabpanel');
    painel.setAttribute('aria-labelledby', tabs[0].id);

    var setActive = function (i, moveFocus) {
      var next = ((i % equipe.length) + equipe.length) % equipe.length;
      if (next === activeIndex) { if (moveFocus) tabs[next].focus(); return; }
      activeIndex = next;
      var person = equipe[activeIndex];

      tabs.forEach(function (tab, ti) {
        var isActive = ti === activeIndex;
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        tab.setAttribute('tabindex', isActive ? '0' : '-1');
      });
      painel.setAttribute('aria-labelledby', tabs[activeIndex].id);

      var swap = function () {
        /* <img> direto, sem <picture>/<source> — troca de srcset via
           JS é inconsistente entre navegadores (fotos ficavam presas
           na primeira pessoa em alguns casos); .src num único <img>
           é o jeito confiável de garantir a troca. */
        fotoImg.src = person.foto.replace('.png', '.webp');
        fotoImg.alt = person.nome;
        numEl.textContent = pad2(activeIndex + 1);
        nomeEl.textContent = person.nome;
        cargoEl.textContent = person.cargo;
        bioEl.textContent = person.bio;
        painel.classList.remove('is-transitioning');
        if (moveFocus) tabs[activeIndex].focus();
      };

      if (reduceMotion) {
        swap();
      } else {
        painel.classList.add('is-transitioning');
        window.setTimeout(swap, 180);
      }
    };

    indice.addEventListener('keydown', function (e) {
      var tab = e.target.closest('.equipe-indice__item');
      if (!tab) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setActive(activeIndex + 1, true);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setActive(activeIndex - 1, true);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        var i = tabs.indexOf(tab);
        if (i > -1) setActive(i, false);
      }
    });

    if (prevBtn) prevBtn.addEventListener('click', function () { setActive(activeIndex - 1, false); });
    if (nextBtn) nextBtn.addEventListener('click', function () { setActive(activeIndex + 1, false); });
  }

  /* =====================================================
     LOCALIZAÇÃO — mapa do Google só carrega quando pedido
     (o iframe é pesado); até lá é um placeholder leve com
     altura reservada e um link direto como alternativa.
     ===================================================== */
  function initLocationMap() {
    var mapWrap = document.getElementById('location-map');
    var loadBtn = document.getElementById('location-map-load');
    if (!mapWrap || !loadBtn) return;

    loadBtn.addEventListener('click', function () {
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.google.com/maps?q=R.+Caetano+Vieira+da+Costa,+190,+Centro,+Lages+-+SC,+88502-070&output=embed';
      iframe.title = 'Mapa — New Idiomas, R. Caetano Vieira da Costa, 190, Centro, Lages-SC';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      mapWrap.appendChild(iframe);
      mapWrap.classList.add('is-loaded');
    });
  }

  /* =====================================================
     JOGO — desafio de idiomas, 8 perguntas, dificuldade
     crescente; termina com CTA piscando pro WhatsApp
     ===================================================== */
  function initJogo() {
    var card = document.getElementById('jogo-card');
    var idiomasKeys = Object.keys(idiomasQuiz);
    if (!card || !idiomasKeys.length) return;

    var langKey = null;
    var index = 0;
    var score = 0;
    var answered = false;

    var escapeHtml = function (str) {
      return String(str).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    };

    /* embaralha as opções a cada pergunta — nos dados a resposta
       certa sempre vem primeiro (mais fácil de escrever/revisar),
       então sem isso dava pra "ganhar" só clicando sempre na
       primeira opção. */
    var shuffle = function (arr) {
      for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
      }
      return arr;
    };

    /* logotipo do jogo — identidade própria, tipo "modo jogo",
       separada da tipografia editorial do resto do site */
    var jogoLogoHtml =
      '<div class="jogo-logo">' +
        '<span class="jogo-logo__badge">' +
          '<svg viewBox="0 0 24 24" fill="none"><path d="M12 21c4.97 0 9-3.58 9-8s-4.03-8-9-8-9 3.58-9 8c0 1.85.68 3.55 1.83 4.93L4 21l4.5-1.31A10 10 0 0 0 12 21Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>' +
        '</span>' +
        'Desafio <strong>New</strong>' +
      '</div>';

    var renderLangSelect = function () {
      var tilesHtml = idiomasKeys.map(function (key) {
        var lang = idiomasQuiz[key];
        return (
          '<button type="button" class="jogo-lang" data-lang="' + key + '" style="--lang-cor:' + lang.cor + '">' +
            '<span class="jogo-lang__flag"><img src="' + lang.bandeira + '" alt="" loading="lazy"></span>' +
            '<span class="jogo-lang__nome">' + escapeHtml(lang.nome) + '</span>' +
          '</button>'
        );
      }).join('');

      card.innerHTML =
        '<div class="jogo-select">' +
          jogoLogoHtml +
          '<h3 class="jogo-select__title">Escolha seu idioma</h3>' +
          '<p class="jogo-select__text">8 perguntas, começando fácil e ficando mais difícil. Não vale colar.</p>' +
          '<div class="jogo-langs">' + tilesHtml + '</div>' +
        '</div>';

      card.querySelectorAll('.jogo-lang').forEach(function (btn) {
        btn.addEventListener('click', function () {
          langKey = btn.getAttribute('data-lang');
          index = 0;
          score = 0;
          renderQuestion();
        });
      });
    };

    var renderQuestion = function () {
      answered = false;
      var lang = idiomasQuiz[langKey];
      var perguntas = lang.perguntas;
      var q = perguntas[index];
      var opcoes = shuffle(q.opcoes.slice());
      var pct = Math.round((index / perguntas.length) * 100);

      var optionsHtml = opcoes.map(function (opt, i) {
        return '<button type="button" class="jogo-option" data-i="' + i + '">' + escapeHtml(opt.rotulo) + '</button>';
      }).join('');

      card.style.setProperty('--lang-cor', lang.cor);
      card.innerHTML =
        '<div class="jogo-progress">' +
          '<span class="jogo-progress__lang"><img src="' + lang.bandeira + '" alt="" loading="lazy">' + escapeHtml(lang.nome) + '</span>' +
          '<span class="jogo-progress__track"><span class="jogo-progress__fill" style="width:' + pct + '%"></span></span>' +
          '<span class="jogo-progress__count">' + (index + 1) + '/' + perguntas.length + '</span>' +
        '</div>' +
        '<div class="jogo-question" aria-live="polite">' +
          '<span class="jogo-progress__difficulty">' + escapeHtml(q.nivel) + '</span>' +
          '<p class="jogo-question__text">' + escapeHtml(q.texto) + '</p>' +
          '<div class="jogo-options">' + optionsHtml + '</div>' +
        '</div>';

      card.querySelectorAll('.jogo-option').forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (answered) return;
          answered = true;
          var i = Number(btn.getAttribute('data-i'));
          var correct = opcoes[i].correta === true;
          if (correct) score++;

          card.querySelectorAll('.jogo-option').forEach(function (b, bi) {
            b.setAttribute('disabled', 'true');
            if (opcoes[bi].correta) b.classList.add('is-correct');
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
      var lang = idiomasQuiz[langKey];
      var total = lang.perguntas.length;
      var msg;
      if (score >= 7) msg = 'Mandou muito bem! Bora colocar isso pra funcionar de verdade numa conversa?';
      else if (score >= 4) msg = 'Você já tem base — falta destravar a fala. É exatamente aí que a gente entra.';
      else msg = 'Todo mundo começa de algum lugar. Bora montar um plano pra você sair do zero de verdade?';

      /* só idioma + placar — nada de nome, e-mail, telefone ou
         respostas individuais na mensagem. */
      var waText = encodeURIComponent(
        'Olá! Fiz o desafio de ' + lang.nome.toLowerCase() + ' no site da New e acertei ' + score + ' de ' + total + ' perguntas. Gostaria de saber qual curso é mais indicado para mim.'
      );

      card.innerHTML =
        '<div class="jogo-result" aria-live="polite">' +
          '<span class="jogo-result__flag"><img src="' + lang.bandeira + '" alt="" loading="lazy"></span>' +
          '<span class="jogo-result__score" id="jogo-score">' + (reduceMotion ? score : 0) + '/' + total + '</span>' +
          '<h3 class="jogo-result__title">Resultado em ' + escapeHtml(lang.nome) + '</h3>' +
          '<p class="jogo-result__msg">' + msg + '</p>' +
          '<a class="btn btn--solid btn--whatsapp jogo-result__cta" target="_blank" rel="noopener" href="https://api.whatsapp.com/send?phone=5549984100055&text=' + waText + '">' +
            '<svg class="btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
              '<path fill="currentColor" d="M17.47 14.38c-.29-.15-1.71-.85-1.98-.94-.27-.1-.46-.15-.66.15-.2.29-.76.94-.93 1.13-.17.2-.34.22-.63.07-.29-.15-1.22-.45-2.32-1.43-.86-.76-1.44-1.71-1.6-2-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.66-1.59-.9-2.18-.24-.57-.48-.5-.66-.5h-.56c-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.43 0 1.43 1.04 2.82 1.19 3.01.15.2 2.05 3.13 4.96 4.39.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.11.55-.08 1.71-.7 1.96-1.37.24-.68.24-1.26.17-1.38-.07-.13-.27-.2-.56-.35z"/>' +
              '<path fill="currentColor" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.5 3.62 1.42 5.13L2 22l5.13-1.51a9.9 9.9 0 0 0 4.91 1.3h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.02h-.01a8.1 8.1 0 0 1-4.12-1.13l-.3-.18-3.05.9.91-2.98-.19-.31a8.08 8.08 0 0 1-1.25-4.4c0-4.46 3.63-8.09 8.1-8.09 2.16 0 4.19.85 5.72 2.38a8.05 8.05 0 0 1 2.37 5.72c0 4.46-3.63 8.09-8.18 8.09z"/>' +
            '</svg>' +
            'Quero conversar sobre meu resultado' +
          '</a>' +
          '<div class="jogo-result__actions">' +
            '<button type="button" class="jogo-result__retry" id="jogo-retry">Jogar de novo</button>' +
            '<button type="button" class="jogo-result__retry" id="jogo-outro">Tentar outro idioma</button>' +
          '</div>' +
        '</div>';

      var retryBtn = document.getElementById('jogo-retry');
      if (retryBtn) retryBtn.addEventListener('click', function () { index = 0; score = 0; renderQuestion(); });
      var outroBtn = document.getElementById('jogo-outro');
      if (outroBtn) outroBtn.addEventListener('click', renderLangSelect);

      /* placar sobe contando até o valor final — um toque de jogo,
         sem exagero (só na revelação do resultado, uma vez). */
      if (!reduceMotion && score > 0) {
        var scoreEl = document.getElementById('jogo-score');
        var startTime = null;
        var DURATION = 700;
        var countUp = function (ts) {
          if (!startTime) startTime = ts;
          var t = Math.min(1, (ts - startTime) / DURATION);
          var current = Math.round(t * score);
          scoreEl.textContent = current + '/' + total;
          if (t < 1) window.requestAnimationFrame(countUp);
        };
        window.requestAnimationFrame(countUp);
      }
    };

    renderLangSelect();
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
     MENU MOBILE — fecha por botão, link, overlay (clique fora
     da lista) e Escape; bloqueia o scroll do body enquanto aberto.
     ===================================================== */
  function initMobileNav() {
    var toggle = document.getElementById('nav-toggle');
    var nav = document.getElementById('main-nav');
    if (!toggle || !nav) return;

    var close = function () {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      root.classList.remove('intro-lock');
    };
    var open = function () {
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      root.classList.add('intro-lock');
    };

    toggle.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) close(); else open();
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', close);
    });

    nav.addEventListener('click', function (e) {
      if (e.target === nav) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) close();
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
    safeInit('initHeroParallax', initHeroParallax);
    safeInit('initVideosPlayer', initVideosPlayer);
    safeInit('initVideoLightbox', initVideoLightbox);
    safeInit('initEquipeMesa', initEquipeMesa);
    safeInit('initLocationMap', initLocationMap);
    safeInit('initJogo', initJogo);
    safeInit('initHeader', initHeader);
    safeInit('initMobileNav', initMobileNav);
    safeInit('initScrollSpy', initScrollSpy);
    safeInit('initReveal', initReveal);
    safeInit('initFooterYear', initFooterYear);
  });
})();
