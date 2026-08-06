// ============================================================
// Abbi & Raúl - Invitación de boda (misma arquitectura que Euni & Fran)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Countdown ----------
  const targetDate = new Date('2026-09-26T11:00:00');

  const cdDias = document.getElementById('cd-dias');
  const cdHoras = document.getElementById('cd-horas');
  const cdMin = document.getElementById('cd-min');
  const cdSeg = document.getElementById('cd-seg');

  const pad2 = (n) => String(n).padStart(2, '0');

  const updateCountdown = () => {
    const now = new Date();
    const difference = targetDate - now;

    let days = 0, hours = 0, minutes = 0, seconds = 0;

    if (difference > 0) {
      days = Math.floor(difference / (1000 * 60 * 60 * 24));
      hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      minutes = Math.floor((difference / 1000 / 60) % 60);
      seconds = Math.floor((difference / 1000) % 60);
    }

    cdDias.textContent = days;
    cdHoras.textContent = pad2(hours);
    cdMin.textContent = pad2(minutes);
    cdSeg.textContent = pad2(seconds);
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ---------- Formulario de confirmación: nombre + contadores de adultos/menores ----------
  const guestNameInput = document.getElementById('guestNameInput');
  const adultsCountEl = document.getElementById('adultsCount');
  const childrenCountEl = document.getElementById('childrenCount');
  const rsvpSummaryText = document.getElementById('rsvp-summary-text');
  const rsvpErrorText = document.getElementById('rsvp-error');
  const tarjetaTotalText = document.getElementById('tarjeta-total-text');

  const PRECIO_TARJETA = 35000;
  let adults = 1;
  let children = 0;

  const pluralize = (n, singular, plural) => `${n} ${n === 1 ? singular : plural}`;

  const updateTarjetaTotal = (totalPersonas) => {
    if (!tarjetaTotalText) return;
    const totalTarjeta = PRECIO_TARJETA * totalPersonas;
    const totalFormateado = totalTarjeta.toLocaleString('es-AR');
    tarjetaTotalText.textContent = totalPersonas === 1
      ? `Total por tu pase: $${totalFormateado}`
      : `Total por sus ${totalPersonas} pases: $${totalFormateado}`;
  };

  const updateRsvpUI = () => {
    adultsCountEl.textContent = adults;
    childrenCountEl.textContent = children;

    const totalPersonas = adults + children;
    if (rsvpSummaryText) {
      rsvpSummaryText.textContent = totalPersonas === 1
        ? 'Confirmás para 1 persona'
        : `Confirmás para ${totalPersonas} personas`;
    }
    updateTarjetaTotal(totalPersonas);
  };

  document.querySelectorAll('.counter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      const action = btn.dataset.action;

      if (target === 'adults') {
        adults = action === 'inc' ? adults + 1 : Math.max(1, adults - 1);
      } else if (target === 'children') {
        children = action === 'inc' ? children + 1 : Math.max(0, children - 1);
      }
      updateRsvpUI();
    });
  });

  const showRsvpError = (msg) => {
    if (!rsvpErrorText) return;
    rsvpErrorText.textContent = msg;
    rsvpErrorText.classList.add('visible');
  };

  const hideRsvpError = () => {
    if (!rsvpErrorText) return;
    rsvpErrorText.classList.remove('visible');
  };

  guestNameInput && guestNameInput.addEventListener('input', hideRsvpError);

  updateRsvpUI();

  // ---------- Copiar alias (con fallback) ----------
  const ALIAS_TEXT = 'RAUL00.NX';

  const fallbackCopyText = (text, onSuccess) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        onSuccess();
      } else {
        console.error('Fallback copy command unsuccessful');
      }
    } catch (err) {
      console.error('Fallback copy execution error: ', err);
    }
    document.body.removeChild(textArea);
  };

  const copyAliasBtn = document.getElementById('copyAlias');
  copyAliasBtn.addEventListener('click', () => {
    const triggerSuccess = () => {
      copyAliasBtn.textContent = '¡Copiado!';
      setTimeout(() => { copyAliasBtn.textContent = 'Copiar'; }, 2000);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(ALIAS_TEXT)
        .then(triggerSuccess)
        .catch((err) => {
          console.error('navigator.clipboard failed, trying fallback: ', err);
          fallbackCopyText(ALIAS_TEXT, triggerSuccess);
        });
    } else {
      fallbackCopyText(ALIAS_TEXT, triggerSuccess);
    }
  });

  // ---------- Copiar alias de la Tarjeta (con fallback) ----------
  const ALIAS_TARJETA_TEXT = 'QUINTEROSABBI.UALA26';

  const copyAliasTarjetaBtn = document.getElementById('copyAliasTarjeta');
  copyAliasTarjetaBtn.addEventListener('click', () => {
    const triggerSuccess = () => {
      copyAliasTarjetaBtn.textContent = '¡Copiado!';
      setTimeout(() => { copyAliasTarjetaBtn.textContent = 'Copiar'; }, 2000);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(ALIAS_TARJETA_TEXT)
        .then(triggerSuccess)
        .catch((err) => {
          console.error('navigator.clipboard failed, trying fallback: ', err);
          fallbackCopyText(ALIAS_TARJETA_TEXT, triggerSuccess);
        });
    } else {
      fallbackCopyText(ALIAS_TARJETA_TEXT, triggerSuccess);
    }
  });

  // ---------- Confirmación por WhatsApp ----------
  const handleConfirmRSVP = (phoneNumber) => {
    const name = guestNameInput ? guestNameInput.value.trim() : '';

    if (!name) {
      showRsvpError('Por favor ingresá tu nombre antes de confirmar.');
      guestNameInput && guestNameInput.focus();
      return;
    }
    hideRsvpError();

    const total = adults + children;
    const isSingular = total === 1;
    const leadVerb = isSingular ? 'Soy' : 'Somos';
    const confirmVerb = isSingular ? 'confirmo' : 'confirmamos';
    const possessive = isSingular ? 'mi' : 'nuestra';

    let detalle;
    if (adults > 0 && children > 0) {
      detalle = ` (${pluralize(adults, 'adulto', 'adultos')} y ${pluralize(children, 'menor', 'menores')})`;
    } else if (children > 0) {
      detalle = ` (${pluralize(children, 'menor', 'menores')})`;
    } else {
      detalle = '';
    }

    const placesText = `${pluralize(total, 'persona', 'personas')}${detalle}`;

    const message = encodeURIComponent(
      `¡Hola! ${leadVerb} ${name} y les ${confirmVerb} con mucho cariño ${possessive} asistencia por ${placesText} para su boda el Sábado 26 de Septiembre. ¡Los queremos mucho!`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  document.getElementById('rsvp-abbi').addEventListener('click', () => {
    handleConfirmRSVP('5493863514370');
  });

  document.getElementById('rsvp-raul').addEventListener('click', () => {
    handleConfirmRSVP('5493863449619');
  });

  // ---------- Carrusel (Nuestra Historia + Galería) ----------
  // Las fotos se deslizan solas; ya no se pueden ampliar con un click.
  const initCarousel = (root, { autoplayDelay = 4200 } = {}) => {
    if (!root) return;
    const track = root.querySelector('.carousel-track');
    const slides = Array.from(root.querySelectorAll('.carousel-slide'));
    const dotsWrap = root.querySelector('.carousel-dots');
    const prevBtn = root.querySelector('.carousel-prev');
    const nextBtn = root.querySelector('.carousel-next');
    if (!track || slides.length === 0) return;

    let index = 0;
    let autoplayTimer = null;

    // Crear los puntos de navegación
    const dots = slides.map((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Ir a la foto ${i + 1}`);
      dot.addEventListener('click', () => {
        goTo(i);
        restartAutoplay();
      });
      dotsWrap.appendChild(dot);
      return dot;
    });

    const goTo = (i) => {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, di) => d.classList.toggle('active', di === index));
      slides.forEach((s, si) => s.classList.toggle('active', si === index));
    };

    const startAutoplay = () => {
      if (slides.length < 2) return;
      autoplayTimer = setInterval(() => goTo(index + 1), autoplayDelay);
    };

    const stopAutoplay = () => {
      clearInterval(autoplayTimer);
    };

    const restartAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    prevBtn && prevBtn.addEventListener('click', () => {
      goTo(index - 1);
      restartAutoplay();
    });
    nextBtn && nextBtn.addEventListener('click', () => {
      goTo(index + 1);
      restartAutoplay();
    });

    // ---- Deslizar con el dedo / mouse (swipe) ----
    let startX = 0;
    let deltaX = 0;
    let dragging = false;

    const onDragStart = (clientX) => {
      dragging = true;
      startX = clientX;
      deltaX = 0;
      stopAutoplay();
      track.classList.add('dragging');
    };

    const onDragMove = (clientX) => {
      if (!dragging) return;
      deltaX = clientX - startX;
      const percent = (deltaX / root.clientWidth) * 100;
      track.style.transform = `translateX(calc(-${index * 100}% + ${percent}%))`;
    };

    const onDragEnd = () => {
      if (!dragging) return;
      dragging = false;
      track.classList.remove('dragging');
      const threshold = root.clientWidth * 0.15;
      if (deltaX > threshold) {
        goTo(index - 1);
      } else if (deltaX < -threshold) {
        goTo(index + 1);
      } else {
        goTo(index);
      }
      startAutoplay();
    };

    track.addEventListener('touchstart', (e) => onDragStart(e.touches[0].clientX), { passive: true });
    track.addEventListener('touchmove', (e) => onDragMove(e.touches[0].clientX), { passive: true });
    track.addEventListener('touchend', onDragEnd);

    track.addEventListener('mousedown', (e) => {
      e.preventDefault();
      onDragStart(e.clientX);
    });
    window.addEventListener('mousemove', (e) => onDragMove(e.clientX));
    window.addEventListener('mouseup', onDragEnd);

    // Pausar mientras el mouse está sobre el carrusel (desktop)
    root.addEventListener('mouseenter', stopAutoplay);
    root.addEventListener('mouseleave', startAutoplay);

    goTo(0);
    startAutoplay();
  };

  initCarousel(document.getElementById('historia-carousel'));
  initCarousel(document.getElementById('gallery-carousel'));

  // ---------- Música de fondo ----------
  const audio = document.getElementById('bg-audio');
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const musicIconWrapper = document.getElementById('music-icon-wrapper');
  const iconPlay = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');

  let isPlaying = false;

  const setPlayingUI = (playing) => {
    isPlaying = playing;
    iconPlay.style.display = playing ? 'none' : 'block';
    iconPause.style.display = playing ? 'block' : 'none';
    musicIconWrapper.classList.toggle('spinning', playing);
    musicToggleBtn.setAttribute('aria-label', playing ? 'Pausar música' : 'Reproducir música');
  };

  const playAudio = () => {
    audio.play()
      .then(() => setPlayingUI(true))
      .catch((err) => console.log('Playback blocked or failed: ', err));
  };

  const pauseAudio = () => {
    audio.pause();
    setPlayingUI(false);
  };

  musicToggleBtn.addEventListener('click', () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  });

  // ---------- Sobre de apertura ----------
  // La música arranca recién cuando la persona toca el sello del sobre,
  // así evitamos que el navegador bloquee el autoplay.
  const envelopeScreen = document.getElementById('envelope-screen');
  const sealBtn = document.getElementById('sealBtn');

  sealBtn.addEventListener('click', () => {
    envelopeScreen.classList.add('opening');
    playAudio();

    setTimeout(() => {
      envelopeScreen.classList.add('hidden');
    }, 1300);
  }, { once: true });

});