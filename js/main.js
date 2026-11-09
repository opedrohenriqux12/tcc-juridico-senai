    /* ==========================================================================
       CONFIGURAÇÃO DOS DADOS DA APRESENTAÇÃO (FÁCIL EDIÇÃO)
       ========================================================================== */
    const PRESENTATION_CONFIG = {
      totalSlides: 17,
      autoplayIntervalMs: 12000,
      
      // Integrantes do Grupo (Slide 2)
      team: [
        {
          nome: "Arthur",
          funcao: "Logística (EMS)",
          foto: "assets/team/arthur.jpg"
        },
        {
          nome: "Heloisa",
          funcao: "Backoffice",
          foto: "assets/team/heloisa.jpg"
        },
        {
          nome: "Isaias",
          funcao: "Logística",
          foto: "assets/team/isaias.jpg"
        },
        {
          nome: "Pedro",
          funcao: "NOC",
          foto: "assets/team/pedro.jpg"
        }
      ],

      // Títulos dos Slides para Dots e Overview
      slideTitles: [
        "Capa",
        "Quem somos?",
        "Introdução",
        "Dor Relatada",
        "Mapeamento do Processo",
        "Fluxo Atual (AS-IS)",
        "Diagnóstico: Tempo de resolução e Retrabalho",
        "Ferramentas de Mapeamento",
        "Ishikawa",
        "Propostas do Grupo",
        "Proposta: Lecom",
        "Demonstração Lecom",
        "Proposta: Capacitação",
        "Demonstração Universidade",
        "Nossos Objetivos",
        "Fluxo Futuro (TO-BE)",
        "Conclusão"
      ],

      // Dados Comparativos Slide 7 (Inicial vs Atualizado)
      diagnosticsData: {
        initial: {
          slaDays: 12,
          slaIdeal: 5,
          slaPercent: "+140%",
          reworkPercent: "45%",
          reworkDonutOffset: 138, // 45% de 251.2
          barWidthCurrent: "100%",
          barWidthIdeal: "41.6%"
        },
        updated: {
          slaDays: 20,
          slaIdeal: 5,
          slaPercent: "+300%",
          reworkPercent: "63,13%",
          reworkDonutOffset: 92.6, // 63.13% de 251.2
          barWidthCurrent: "100%",
          barWidthIdeal: "25%"
        }
      },

      // Ferramentas Metodológicas (Slide 9)
      methodologyDetails: {
        kanban: {
          title: "Kanban",
          icon: "trello",
          desc: "Permite acompanhar visualmente o status das tarefas e chamados contratuais em tempo real, limitando o trabalho em andamento (WIP) e expondo gargalos imediatos."
        },
        sipoc: {
          title: "SIPOC",
          icon: "workflow",
          desc: "Oferece uma visão panorâmica de ponta a ponta: Fornecedores (Suppliers), Entradas (Inputs), Processos (Process), Saídas (Outputs) e Clientes (Customers) do fluxo contratual."
        },
        ishikawa: {
          title: "Diagrama de Ishikawa",
          icon: "git-pull-request",
          desc: "Mapeia as causas-raiz dos problemas agrupadas por categorias (Pessoas, Processos, Tecnologia e Documentos), identificando a origem das falhas."
        },
        "5w2h": {
          title: "5W2H",
          icon: "help-circle",
          desc: "Estrutura planos de ação definindo com clareza: O que (What), Por que (Why), Onde (Where), Quando (When), Quem (Who), Como (How) e Quanto custa (How much)."
        },
        pdca: {
          title: "Ciclo PDCA",
          icon: "refresh-cw",
          desc: "Promove a melhoria contínua através do ciclo iterativo: Planejar (Plan), Executar (Do), Checar (Check) e Agir corretivamente (Act)."
        },
        gut: {
          title: "Matriz GUT",
          icon: "bar-chart-2",
          desc: "Auxilia na priorização de problemas com base na Gravidade, Urgência e Tendência de piora se nada for feito de imediato."
        },
        esforco: {
          title: "Matriz Esforço × Impacto",
          icon: "sliders",
          desc: "Prioriza ações de 'ganho rápido' (baixo esforço e alto impacto), garantindo resultados rápidos antes de projetos de alta complexidade."
        }
      }
    };

    /* ==========================================================================
       ESTADO DA APLICAÇÃO
       ========================================================================== */
    const state = {
      currentSlideIndex: 0,
      totalSlides: PRESENTATION_CONFIG.totalSlides,
      isAutoplayActive: false,
      autoplayTimer: null,
      isOverviewOpen: false,
      isShortcutsOpen: false,
      isAnimating: false,
      // Touch / Swipe
      touchStartX: 0,
      touchStartY: 0,
      touchEndX: 0,
      touchEndY: 0,
      isDragging: false,
      dragOffset: 0,
      lockScroll: false
    };

    /* ==========================================================================
       ELEMENTOS DOM PRINCIPAIS
       ========================================================================== */
    const track = document.getElementById('slidesTrack');
    const slides = document.querySelectorAll('.slide');
    const topProgressBar = document.getElementById('topProgressBar');
    const dotsContainer = document.getElementById('dotsContainer');
    const prevBtn = document.getElementById('prevSlideBtn');
    const nextBtn = document.getElementById('nextSlideBtn');
    const autoplayBtn = document.getElementById('autoplayBtn');
    const overviewModal = document.getElementById('overviewModal');
    const overviewGrid = document.getElementById('overviewGrid');
    const shortcutsModal = document.getElementById('shortcutsModal');
    const brandWatermark = document.getElementById('brandWatermark');

    /* ==========================================================================
       INICIALIZAÇÃO DA INTERFACE
       ========================================================================== */
    function init() {
      // Inicializar Tema (Salvo em localStorage)
      initTheme();

      // Renderizar Integrantes da Equipe (Slide 2)
      renderTeamMembers();

      // Renderizar Dots de Navegação
      renderNavDots();

      // Renderizar Grid da Visão Geral (Overview)
      renderOverviewGrid();

      // Configurar Ícones Lucide
      if (window.lucide) lucide.createIcons();

      // Configurar Canvas de Partículas
      initAmbientCanvas();

      // Configurar Cursor Personalizado
      initCustomCursor();

      // Checar Hash da URL (ex.: #/3)
      checkInitialHash();

      // Configurar Eventos Globais
      setupEventListeners();

      // Keep the header hidden in API fullscreen and browser fullscreen (F11).
      const fullscreenDisplay = window.matchMedia('(display-mode: fullscreen)');
      const syncFullscreenState = () => {
        document.body.classList.toggle('is-fullscreen', Boolean(
          document.fullscreenElement || document.webkitFullscreenElement || fullscreenDisplay.matches
        ));
      };
      document.addEventListener('fullscreenchange', syncFullscreenState);
      document.addEventListener('webkitfullscreenchange', syncFullscreenState);
      fullscreenDisplay.addEventListener('change', syncFullscreenState);
      syncFullscreenState();

      setupVideoControls();

      // Ir para o slide inicial
      goToSlide(state.currentSlideIndex, false);
    }

    /* Renderizar Integrantes */
    function renderTeamMembers() {
      const container = document.getElementById('teamContainer');
      if (!container) return;
      container.innerHTML = PRESENTATION_CONFIG.team.map((member, idx) => `
        <div class="hex-member-card">
          <div class="hex-avatar-wrap">
            <div class="hex-avatar-inner">
              <img src="${member.foto}" alt="${member.nome}" loading="lazy">
            </div>
          </div>
          <h3 class="member-name">${member.nome}</h3>
          ${member.funcao ? `<p class="member-role">${member.funcao}</p>` : ''}
        </div>
      `).join('');
    }

    /* Renderizar Dots de Navegação */
    function renderNavDots() {
      dotsContainer.innerHTML = '<span class="fiber-core" aria-hidden="true"></span><span class="fiber-progress" aria-hidden="true"></span><span class="fiber-signal" aria-hidden="true"></span><span class="fiber-terminal fiber-terminal--start" aria-hidden="true"></span><span class="fiber-terminal fiber-terminal--end" aria-hidden="true"></span>';
      dotsContainer.style.setProperty('--fiber-stops', state.totalSlides);
      for (let i = 0; i < state.totalSlides; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = `nav-dot ${i === 0 ? 'is-active' : ''}`;
        if (i === 0) dot.setAttribute('aria-current', 'step');
        dot.setAttribute('aria-label', `Ir para slide ${i + 1}: ${PRESENTATION_CONFIG.slideTitles[i]}`);
        dot.innerHTML = `<span class="dot-tooltip">${i + 1}. ${PRESENTATION_CONFIG.slideTitles[i]}</span>`;
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    }

    /* Renderizar Visão Geral */
    function renderOverviewGrid() {
      overviewGrid.innerHTML = '';
      PRESENTATION_CONFIG.slideTitles.forEach((title, idx) => {
        const card = document.createElement('div');
        card.className = `overview-card ${idx === state.currentSlideIndex ? 'is-current' : ''}`;
        card.innerHTML = `
          <div class="num-tag">SLIDE ${String(idx + 1).padStart(2, '0')}</div>
          <div class="title-tag">${title}</div>
        `;
        card.addEventListener('click', () => {
          goToSlide(idx);
          toggleOverview(false);
        });
        overviewGrid.appendChild(card);
      });
    }

    /* ==========================================================================
       LÓGICA DE TRANSIÇÃO E NAVEGAÇÃO ENTRE SLIDES
       ========================================================================== */
    function goToSlide(index, animate = true) {
      if (index < 0) index = 0;
      if (index >= state.totalSlides) index = state.totalSlides - 1;

      state.currentSlideIndex = index;
      const targetPercent = -(index * 100);

      // Movimento do trilho horizontal
      if (animate) {
        track.style.transition = 'transform 0.75s cubic-bezier(0.25, 1, 0.5, 1)';
      } else {
        track.style.transition = 'none';
      }
      track.style.transform = `translate3d(-${index * 100}vw, 0, 0)`;

      // Atualizar classes ativas dos slides
      slides.forEach((slide, idx) => {
        if (idx === index) {
          slide.classList.add('is-active');
        } else {
          slide.classList.remove('is-active');
        }
      });

      // Atualizar Barra de Progresso e Contador
      const progressPercent = ((index + 1) / state.totalSlides) * 100;
      topProgressBar.style.width = `${progressPercent}%`;

      // Atualizar Dots
      const dots = dotsContainer.querySelectorAll('.nav-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('is-active', idx === index);
        if (idx === index) dot.setAttribute('aria-current', 'step');
        else dot.removeAttribute('aria-current');
      });

      dotsContainer.style.setProperty('--fiber-progress', `${((index + 0.5) / state.totalSlides) * 100}%`);

      // Atualizar Botões Prev/Next
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === state.totalSlides - 1;

      // Parallax sutil na marca d'água 'Y'
      if (brandWatermark) {
        const rotateDeg = (index % 2 === 0 ? 0 : 3);
        const scaleVal = 1 + (index * 0.008);
        brandWatermark.style.transform = `translate(-50%, -50%) rotate(${rotateDeg}deg) scale(${scaleVal})`;
      }

      // Atualizar Hash na URL
      history.replaceState(null, null, `#/${index + 1}`);

      // Atualizar cards da Visão Geral
      const overviewCards = overviewGrid.querySelectorAll('.overview-card');
      overviewCards.forEach((c, i) => c.classList.toggle('is-current', i === index));

      syncSlideVideos();

      // Disparar animações de entrada dos elementos do slide
      triggerSlideAnimations(index);
    }

    // Start only the active demonstration; never leave audio playing off-screen.
    async function playSlideVideo(video) {
      const slide = video.closest('.slide');
      const playButton = slide.querySelector('[data-video-play]');
      const soundButton = slide.querySelector('[data-video-sound]');
      playButton.hidden = true;
      soundButton.hidden = video.muted;
      video.muted = false;
      try {
        await video.play();
      } catch (error) {
        if (!slide.classList.contains('is-active')) return;
        if (error.name === 'NotAllowedError') {
          video.muted = true;
          try {
            await video.play();
          } catch (_) {
            playButton.hidden = false;
          }
        } else if (error.name !== 'AbortError') {
          playButton.hidden = false;
        }
      }
      if (!slide.classList.contains('is-active')) video.pause();
      soundButton.hidden = !video.muted;
    }

    function syncSlideVideos() {
      const activeVideo = slides[state.currentSlideIndex].querySelector('video');
      document.body.classList.toggle('is-video-slide', Boolean(activeVideo));
      document.body.classList.toggle('is-flow-slide', slides[state.currentSlideIndex].classList.contains('slide--flow'));
      document.querySelectorAll('.slide video').forEach(video => {
        if (video !== activeVideo) video.pause();
      });
      if (!activeVideo) return;
      // Re-entering a demonstration starts it from the beginning.
      activeVideo.currentTime = 0;
      playSlideVideo(activeVideo);
      // Native fullscreen is allowed only during a user gesture.
      if (!document.fullscreenElement && navigator.userActivation?.isActive) {
        document.documentElement.requestFullscreen?.().catch(() => {});
      }
    }

    function setupVideoControls() {
      document.querySelectorAll('.slide--video').forEach(slide => {
        const video = slide.querySelector('video');
        slide.querySelector('[data-video-prev]').addEventListener('click', prevSlide);
        slide.querySelector('[data-video-next]').addEventListener('click', nextSlide);
        slide.querySelector('[data-video-fullscreen]').addEventListener('click', toggleFullscreen);
        slide.querySelector('[data-video-play]').addEventListener('click', () => playSlideVideo(video));
        slide.querySelector('[data-video-sound]').addEventListener('click', () => {
          video.muted = false;
          video.play().catch(() => { slide.querySelector('[data-video-play]').hidden = false; });
        });
        video.addEventListener('volumechange', () => {
          slide.querySelector('[data-video-sound]').hidden = !video.muted;
        });
        video.addEventListener('play', () => {
          slide.querySelector('[data-video-play]').hidden = true;
        });
      });
    }

    function nextSlide() {
      if (state.currentSlideIndex < state.totalSlides - 1) {
        goToSlide(state.currentSlideIndex + 1);
      } else if (state.isAutoplayActive) {
        goToSlide(0); // Reiniciar no autoplay
      }
    }

    function prevSlide() {
      if (state.currentSlideIndex > 0) {
        goToSlide(state.currentSlideIndex - 1);
      }
    }

    /* Checar Hash da URL */
    function checkInitialHash() {
      const hash = window.location.hash;
      const match = hash.match(/#\/(\d+)/);
      if (match && match[1]) {
        const slideIndex = parseInt(match[1], 10) - 1;
        if (slideIndex >= 0 && slideIndex < state.totalSlides) {
          state.currentSlideIndex = slideIndex;
        }
      }
    }

    /* ==========================================================================
       ANIMAÇÕES DE ENTRADA DO SLIDE & CONTADORES NUMÉRICOS
       ========================================================================== */
    function triggerSlideAnimations(slideIndex) {
      const currentSlide = slides[slideIndex];
      if (!currentSlide) return;

      // Animação com GSAP para stagger de elementos filhos
      if (typeof gsap !== 'undefined') {
        const animElements = currentSlide.querySelectorAll('.title-large, .title-medium, .brand-divider-line, .premium-card, .hex-member-card, .problem-highlight-box, .badge-chip, .objective-card, .expect-card, .mapping-card, .tool-item-box');
        
        gsap.fromTo(animElements, 
          { opacity: 0, y: 25, filter: 'blur(4px)' },
          { 
            opacity: 1, 
            y: 0, 
            filter: 'blur(0px)', 
            duration: 0.65, 
            stagger: 0.07, 
            ease: "power2.out" 
          }
        );
      }

      // Animar contadores numéricos presentes no slide
      const counters = currentSlide.querySelectorAll('.counter-number');
      counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target')) || 0;
        animateNumber(counter, 0, target, 1200);
      });

      // Animar barras horizontais de SLA
      const slaFills = currentSlide.querySelectorAll('.sla-fill');
      slaFills.forEach(fill => {
        const targetWidth = fill.getAttribute('data-width') || '100%';
        fill.style.width = '0%';
        setTimeout(() => {
          fill.style.width = targetWidth;
        }, 150);
      });

      // Animar rosca de retrabalho
      const donutCircle = currentSlide.querySelector('.donut-progress-circle');
      if (donutCircle) {
        const offset = donutCircle.getAttribute('data-offset') || 138;
        donutCircle.style.strokeDashoffset = '251.2';
        setTimeout(() => {
          donutCircle.style.strokeDashoffset = offset;
        }, 200);
      }
    }

    /* Função utilitária para animação suave de números */
    function animateNumber(element, start, end, duration) {
      let startTime = null;
      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        const current = Math.floor(start + (end - start) * easeProgress);
        element.textContent = current;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          element.textContent = end;
        }
      }
      requestAnimationFrame(step);
    }

    /* ==========================================================================
       GESTÃO DE EVENTOS (TECLADO, MOUSE, TOUCH, RESIZE)
       ========================================================================== */
    function setupEventListeners() {
      // 1. Teclado
      window.addEventListener('keydown', handleKeyboardNavigation);

      // 2. Roda do Mouse / Trackpad (com debounce para não pular slides acidentalmente)
      window.addEventListener('wheel', handleWheelScroll, { passive: false });

      // 3. Arrastar / Swipe (Touch e Mouse Drag)
      const viewport = document.getElementById('presentationViewport');
      viewport.addEventListener('touchstart', handleTouchStart, { passive: true });
      viewport.addEventListener('touchmove', handleTouchMove, { passive: false });
      viewport.addEventListener('touchend', handleTouchEnd);

      // 4. Botões de Navegação
      prevBtn.addEventListener('click', prevSlide);
      nextBtn.addEventListener('click', nextSlide);
      document.getElementById('startPresentationBtn').addEventListener('click', () => goToSlide(1));
      document.getElementById('restartBtn')?.addEventListener('click', () => goToSlide(0));

      // 5. Autoplay
      // autoplay removed

      // 6. Visão Geral (Overview)
      document.getElementById('overviewFinalBtn')?.addEventListener('click', () => toggleOverview(true));
      document.getElementById('closeOverviewBtn').addEventListener('click', () => toggleOverview(false));

      // 7. Tela Cheia
      document.getElementById('fullscreenBtn').addEventListener('click', toggleFullscreen);

      // 8. Modal de Atalhos
      // shortcuts removed
      document.getElementById('closeShortcutsBtn').addEventListener('click', () => toggleShortcuts(false));

      // 9. Impressão / PDF
      document.getElementById('printBtn')?.addEventListener('click', () => window.print());

      // 10. Toggle de Dados (Slide 7: Inicial vs Atualizado)
      // setupDataToggleSlide7();

      // 11. Chips Interativos de Metodologia (Slide 9)
      // setupMethodologyChips();

      // 12. Ishikawa Interativo (Slide 6)
      setupIshikawaInteraction();
    }

    /* Navegação por Teclado */
    function handleKeyboardNavigation(e) {
      if (e.target instanceof Element && e.target.closest('video, button, a, input, textarea, select, [contenteditable="true"]')) return;
      // Não interceptar comandos quando Ctrl ou Meta (Command) estiver pressionado (ex: zoom Ctrl + / -, atalhos do navegador)
      if (e.ctrlKey || e.metaKey) {
        return;
      }

      if (state.isOverviewOpen || state.isShortcutsOpen) {
        if (e.key === 'Escape') {
          toggleOverview(false);
          toggleShortcuts(false);
        }
        return;
      }

      switch(e.key) {
        case 'ArrowRight':
        case 'PageDown':
        case ' ': // Barra de espaço avança
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          prevSlide();
          break;
        case 'Home':
          e.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          goToSlide(state.totalSlides - 1);
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'o':
        case 'O':
          toggleOverview(true);
          break;
        case '?':
          toggleShortcuts(true);
          break;
      }
    }

    /* Scroll do Mouse / Trackpad com Lock de 850ms */
    function handleWheelScroll(e) {
      // Se a tecla Ctrl estiver pressionada, permitir zoom nativo do navegador sem interceptar
      if (e.ctrlKey || e.metaKey) {
        return;
      }

      if (state.isOverviewOpen || state.isShortcutsOpen) return;

      // Verificar se o slide atual tem scroll interno vertical
      const currentSlideElem = slides[state.currentSlideIndex];
      const hasVerticalScroll = currentSlideElem.scrollHeight > currentSlideElem.clientHeight;

      if (hasVerticalScroll) {
        // Permitir scroll normal dentro do slide se não estiver nos limites
        const isAtBottom = currentSlideElem.scrollTop + currentSlideElem.clientHeight >= currentSlideElem.scrollHeight - 5;
        const isAtTop = currentSlideElem.scrollTop <= 5;
        
        if ((e.deltaY > 0 && !isAtBottom) || (e.deltaY < 0 && !isAtTop)) {
          return; // Deixa o conteúdo interno rolar
        }
      }

      e.preventDefault();
      if (state.lockScroll) return;

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

      if (Math.abs(delta) > 25) {
        state.lockScroll = true;
        if (delta > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        setTimeout(() => {
          state.lockScroll = false;
        }, 400);
      }
    }

    /* Swipe / Touch Navigation */
    function handleTouchStart(e) {
      if (e.target instanceof Element && e.target.closest('video, button, a')) {
        state.isDragging = false;
        return;
      }
      state.touchStartX = e.touches[0].clientX;
      state.touchStartY = e.touches[0].clientY;
      state.touchEndX = state.touchStartX;
      state.touchEndY = state.touchStartY;
      state.isDragging = true;
    }

    function handleTouchMove(e) {
      if (!state.isDragging) return;
      state.touchEndX = e.touches[0].clientX;
      state.touchEndY = e.touches[0].clientY;

      const diffX = state.touchStartX - state.touchEndX;
      const diffY = state.touchStartY - state.touchEndY;

      // Se o movimento for mais horizontal que vertical, bloqueia o scroll nativo da página
      if (Math.abs(diffX) > Math.abs(diffY)) {
        e.preventDefault();
      }
    }

    function handleTouchEnd() {
      if (!state.isDragging) return;
      state.isDragging = false;

      const diffX = state.touchStartX - state.touchEndX;
      const diffY = state.touchStartY - state.touchEndY;

      // Threshold de sensibilidade de swipe
      if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }

    /* ==========================================================================
       MODAIS, AUTOPLAY & TELA CHEIA
       ========================================================================== */
    function toggleAutoplay() {
      state.isAutoplayActive = !state.isAutoplayActive;
      autoplayBtn.classList.toggle('is-playing', state.isAutoplayActive);

      if (state.isAutoplayActive) {
        autoplayBtn.querySelector('span').textContent = 'Pausar';
        autoplayBtn.querySelector('i').setAttribute('data-lucide', 'pause');
        state.autoplayTimer = setInterval(nextSlide, PRESENTATION_CONFIG.autoplayIntervalMs);
      } else {
        autoplayBtn.querySelector('span').textContent = 'Autoplay';
        autoplayBtn.querySelector('i').setAttribute('data-lucide', 'play');
        clearInterval(state.autoplayTimer);
      }
      if (window.lucide) lucide.createIcons();
    }

    function toggleOverview(open) {
      state.isOverviewOpen = open;
      overviewModal.classList.toggle('is-open', open);
    }

    function toggleShortcuts(open) {
      state.isShortcutsOpen = open;
      shortcutsModal.classList.toggle('is-open', open);
    }

    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => console.log(err));
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }

    /* ==========================================================================
       INTERAÇÕES ESPECÍFICAS DOS SLIDES
       ========================================================================== */
    // Slide 7: Toggle de Dados Inicial vs Atualizado
    function setupDataToggleSlide7() {
      const btnInitial = document.getElementById('toggleInitialBtn');
      const btnUpdated = document.getElementById('toggleUpdatedBtn');
      const slaPercent = document.getElementById('slaPercentDisplay');
      const slaDays = document.getElementById('slaDaysRealDisplay');
      const slaRealBar = document.getElementById('slaRealBar');
      const slaIdealBar = document.getElementById('slaIdealBar');
      const reworkPercent = document.getElementById('reworkPercentDisplay');
      const donutCircle = document.getElementById('donutUpdatedCircle');

      if (!btnInitial || !btnUpdated) return;

      btnInitial.addEventListener('click', () => {
        btnInitial.classList.add('is-active');
        btnUpdated.classList.remove('is-active');

        const d = PRESENTATION_CONFIG.diagnosticsData.initial;
        slaPercent.textContent = d.slaPercent;
        slaDays.textContent = `${d.slaDays} dias`;
        slaRealBar.style.width = d.barWidthCurrent;
        slaRealBar.textContent = `${d.slaDays} dias`;
        slaIdealBar.style.width = d.barWidthIdeal;
        reworkPercent.textContent = d.reworkPercent;
        donutCircle.style.strokeDashoffset = d.reworkDonutOffset;
      });

      btnUpdated.addEventListener('click', () => {
        btnUpdated.classList.add('is-active');
        btnInitial.classList.remove('is-active');

        const d = PRESENTATION_CONFIG.diagnosticsData.updated;
        slaPercent.textContent = d.slaPercent;
        slaDays.textContent = `${d.slaDays} dias`;
        slaRealBar.style.width = d.barWidthCurrent;
        slaRealBar.textContent = `${d.slaDays} dias`;
        slaIdealBar.style.width = d.barWidthIdeal;
        reworkPercent.textContent = d.reworkPercent;
        donutCircle.style.strokeDashoffset = d.reworkDonutOffset;
      });
    }

    // Slide 9: Ferramentas de Metodologia
    function setupMethodologyChips() {
      const chips = document.querySelectorAll('.method-tool-chip');
      const titleHolder = document.getElementById('methodTitleHolder');
      const descHolder = document.getElementById('methodDescHolder');
      const iconHolder = document.getElementById('methodIconHolder');

      chips.forEach(chip => {
        chip.addEventListener('click', () => {
          chips.forEach(c => c.classList.remove('is-active'));
          chip.classList.add('is-active');

          const toolKey = chip.getAttribute('data-tool');
          const data = PRESENTATION_CONFIG.methodologyDetails[toolKey];
          if (data) {
            titleHolder.textContent = data.title;
            descHolder.textContent = data.desc;
            iconHolder.innerHTML = `<i data-lucide="${data.icon}" style="width:32px; height:32px;"></i>`;
            if (window.lucide) lucide.createIcons();
          }
        });
      });
    }

    // Slide 6: Ishikawa Interativo
    function setupIshikawaInteraction() {
      const cards = document.querySelectorAll('.ishikawa-card');
      cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          cards.forEach(c => {
            if (c !== card) c.style.opacity = '0.4';
          });
        });
        card.addEventListener('mouseleave', () => {
          cards.forEach(c => c.style.opacity = '1');
        });
      });
    }

    /* ==========================================================================
       CURSOR PERSONALIZADO & PARTÍCULAS
       ========================================================================== */
    function initCustomCursor() {
      // Cursor customizado desativado - utilizando cursor padrão do sistema
      return;
    }

    
    /* ==========================================================================
       SISTEMA DE TEMAS: TEMA VERMELHO DESKTOP VS TEMA VINHO BORDÔ
       ========================================================================== */
    function initTheme() {
      let savedTheme = localStorage.getItem('presentation-theme');
      // Migração: se o usuário tinha salvo 'dark' ou 'light', ajustamos para 'red' ou 'wine'
      if (!savedTheme || savedTheme === 'dark' || savedTheme === 'red') {
        savedTheme = 'red';
      } else if (savedTheme === 'light' || savedTheme === 'wine') {
        savedTheme = 'wine';
      }
      applyTheme(savedTheme);

      const themeToggleBtn = document.getElementById('themeToggleBtn');
      if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
      }
    }

    function toggleTheme() {
      const isWine = document.body.classList.contains('theme-wine');
      const newTheme = isWine ? 'red' : 'wine';
      applyTheme(newTheme);
      localStorage.setItem('presentation-theme', newTheme);
    }

    function applyTheme(theme) {
      const icon = document.getElementById('themeToggleIcon');
      const toggleBtn = document.getElementById('themeToggleBtn');
      const themeColorMeta = document.querySelector('meta[name="theme-color"]');

      if (theme === 'wine') {
        document.body.classList.remove('theme-red', 'theme-light');
        document.body.classList.add('theme-wine');
        if (icon) {
          icon.setAttribute('data-lucide', 'sparkles');
        }
        if (toggleBtn) {
          toggleBtn.setAttribute('title', 'Tema Atual: Vinho Bordô (Clique para Vermelho)');
        }
        if (themeColorMeta) themeColorMeta.setAttribute('content', '#38080E');
      } else {
        document.body.classList.remove('theme-wine', 'theme-light');
        document.body.classList.add('theme-red');
        if (icon) {
          icon.setAttribute('data-lucide', 'flame');
        }
        if (toggleBtn) {
          toggleBtn.setAttribute('title', 'Tema Atual: Vermelho Gamer (Clique para Vinho)');
        }
        if (themeColorMeta) themeColorMeta.setAttribute('content', '#B30816');
      }
      if (window.lucide) {
        if (window.lucide) lucide.createIcons();
      }
    }

    /* Canvas de Partículas Douradas Discretas com taxa de atualização normalizada (Delta Time) */
    function initAmbientCanvas() {
      const canvas = document.getElementById('ambient-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      let width = canvas.width = window.innerWidth;
      let height = canvas.height = window.innerHeight;

      window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      });

      const particles = [];
      const particleCount = 28;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.6 + 0.6,
          vx: (Math.random() - 0.5) * 0.18,
          vy: -Math.random() * 0.22 - 0.08,
          alpha: Math.random() * 0.4 + 0.1
        });
      }

      let lastTime = 0;

      function loop(currentTime) {
        if (!lastTime) lastTime = currentTime;
        const delta = Math.min((currentTime - lastTime) / 16.67, 2.5); // Normaliza para 60fps
        lastTime = currentTime;

        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
          p.x += p.vx * delta;
          p.y += p.vy * delta;

          if (p.y < 0) p.y = height;
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 204, 20, ${p.alpha})`;
          ctx.fill();
        });
        requestAnimationFrame(loop);
      }
      requestAnimationFrame(loop);
    }

    // Inicializar quando a página carregar
    window.addEventListener('DOMContentLoaded', init);
