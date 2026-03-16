/**
 * Páscoa Proteica - Main Interactivity Script
 */
(function () {
  'use strict';

  // ========================================
  // 1. COUNTDOWN TIMER
  // ========================================
  function initCountdown() {
    var STORAGE_KEY = 'pp_countdown_end';
    var TOTAL_MINUTES = 10;
    var header = document.querySelector('.countdown-header');
    if (!header) return;

    var digitSpans = header.querySelectorAll('.countdown-digit');
    var progressBar = header.querySelector('.countdown-progress-bar');

    var endTime = localStorage.getItem(STORAGE_KEY);
    if (!endTime) {
      endTime = Date.now() + TOTAL_MINUTES * 60 * 1000;
      localStorage.setItem(STORAGE_KEY, endTime);
    } else {
      endTime = parseInt(endTime, 10);
    }

    function tick() {
      var remaining = Math.max(0, endTime - Date.now());
      var totalMs = TOTAL_MINUTES * 60 * 1000;
      var mins = Math.floor(remaining / 60000);
      var secs = Math.floor((remaining % 60000) / 1000);

      if (digitSpans.length >= 2) {
        digitSpans[0].textContent = String(mins).padStart(2, '0');
        digitSpans[1].textContent = String(secs).padStart(2, '0');
      }
      if (progressBar) {
        progressBar.style.width = Math.min(((totalMs - remaining) / totalMs) * 100, 100) + '%';
      }
      if (remaining > 0 && remaining < 120000) {
        header.classList.remove('countdown-normal');
        header.classList.add('countdown-urgent');
      }
      if (remaining <= 0) {
        header.classList.remove('countdown-normal', 'countdown-urgent');
        header.classList.add('countdown-expired');
        clearInterval(timer);
      }
    }

    tick();
    var timer = setInterval(tick, 1000);
  }

  // ========================================
  // 2. FAQ ACCORDION
  // ========================================
  function initFAQ() {
    var answers = [
      'Não! Nossas receitas foram criadas pensando em iniciantes. Cada passo é detalhado com fotos e dicas práticas. Se você sabe usar um micro-ondas e uma panela, já consegue fazer ovos incríveis.',
      'De jeito nenhum! Você precisa apenas de utensílios básicos que provavelmente já tem em casa: formas de silicone, panela, micro-ondas e uma balança simples. Nada de equipamentos profissionais.',
      'Absolutamente! Esse é o nosso diferencial. Usamos adoçantes naturais e técnicas que realçam o sabor do chocolate. Nossos clientes dizem que é MELHOR que chocolate convencional. Você vai se surpreender!',
      'Com certeza! Com o Guia de Onde Vender Mais e a Planilha de Precificação inclusa, você consegue margem de até 300% por unidade. Muitos alunos faturam R$3.000 a R$10.000 só na Páscoa.',
      'Imediatamente após a compra, você recebe acesso à área de membros com todos os e-books em PDF e materiais de apoio. É tudo digital — acesse pelo celular, tablet ou computador, quando e onde quiser.',
      'Sem problemas! Você tem 7 dias de garantia incondicional. Se não ficar satisfeito(a) por qualquer motivo, basta enviar um e-mail e devolvemos 100% do seu dinheiro. Risco zero!'
    ];

    var faqList = document.getElementById('faq-list');
    if (!faqList) return;

    var items = faqList.children;
    var panels = [];

    for (var i = 0; i < items.length; i++) {
      (function(idx) {
        var item = items[idx];
        var btn = item.querySelector('button[type="button"]');
        if (!btn || idx >= answers.length) return;
        var chevron = btn.querySelector('svg');

        // Create answer panel
        var panel = document.createElement('div');
        panel.style.cssText = 'max-height:0;overflow:hidden;transition:max-height 0.3s ease;';
        panel.innerHTML = '<p style="padding:0 0 16px;font-size:0.875rem;line-height:1.6;color:hsl(150,10%,40%)">' + answers[idx] + '</p>';
        item.appendChild(panel);

        panels.push({ panel: panel, chevron: chevron, open: false });

        btn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();

          // Close all others
          for (var j = 0; j < panels.length; j++) {
            if (j !== idx) {
              panels[j].panel.style.maxHeight = '0';
              panels[j].open = false;
              if (panels[j].chevron) panels[j].chevron.style.transform = 'rotate(0deg)';
            }
          }

          // Toggle clicked
          panels[idx].open = !panels[idx].open;
          if (panels[idx].open) {
            panels[idx].panel.style.maxHeight = panels[idx].panel.scrollHeight + 'px';
            if (chevron) chevron.style.transform = 'rotate(180deg)';
          } else {
            panels[idx].panel.style.maxHeight = '0';
            if (chevron) chevron.style.transform = 'rotate(0deg)';
          }
        });
      })(i);
    }
  }

  // ========================================
  // 3. CTA BUTTONS → scroll to #oferta
  // ========================================
  function initCTAButtons() {
    var oferta = document.getElementById('oferta');
    if (!oferta) return;

    var keywords = ['lucrar nessa', 'garantir agora', 'garantir minhas', 'quero lucrar', 'quero este'];

    document.querySelectorAll('button').forEach(function(btn) {
      var txt = btn.textContent.toLowerCase().trim();
      for (var i = 0; i < keywords.length; i++) {
        if (txt.indexOf(keywords[i]) !== -1) {
          btn.addEventListener('click', function(e) {
            e.preventDefault();
            oferta.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
          break;
        }
      }
    });

    var countdownCTA = document.querySelector('.countdown-cta');
    if (countdownCTA) {
      countdownCTA.addEventListener('click', function(e) {
        e.preventDefault();
        oferta.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  // ========================================
  // 4. CAROUSEL — duplicate for infinite loop + hover pause
  // ========================================
  function initCarousel() {
    var carousel = document.querySelector('.animate-carousel');
    if (!carousel) return;

    var kids = Array.prototype.slice.call(carousel.children);
    kids.forEach(function(kid) {
      carousel.appendChild(kid.cloneNode(true));
    });

    carousel.addEventListener('mouseenter', function() {
      carousel.style.animationPlayState = 'paused';
    });
    carousel.addEventListener('mouseleave', function() {
      carousel.style.animationPlayState = 'running';
    });
  }

  // ========================================
  // 5. SCROLL REVEAL ANIMATIONS
  // ========================================
  function initScrollReveal() {
    var selectors = [
      '.grid > .flex.flex-col',
      '.grid > .relative',
      '.grid > .bg-white',
      '#faq-list > div'
    ];
    var els = document.querySelectorAll(selectors.join(','));

    els.forEach(function(el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    if (!('IntersectionObserver' in window)) {
      els.forEach(function(el) { el.style.opacity = '1'; el.style.transform = 'none'; });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var siblings = entry.target.parentElement.children;
          var idx = Array.prototype.indexOf.call(siblings, entry.target);
          setTimeout(function() {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, idx * 100);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function(el) { observer.observe(el); });
  }

  // ========================================
  // 6. SCROLL PADDING for fixed header
  // ========================================
  function initScrollPadding() {
    document.documentElement.style.scrollPaddingTop = '60px';
  }

  // ========================================
  // INIT ALL
  // ========================================
  document.addEventListener('DOMContentLoaded', function() {
    initCountdown();
    initFAQ();
    initCTAButtons();
    initCarousel();
    initScrollPadding();
    initScrollReveal();
  });
})();
