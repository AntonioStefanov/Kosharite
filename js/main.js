(function () {
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', function () {
    var open = menu.classList.toggle('active');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '✕' : '☰';
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = '☰';
    });
  });

  document.addEventListener('click', function (e) {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      menu.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = '☰';
    }
  });
})();

(function () {
  const dialog = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbTitle = document.getElementById('lb-title');
  const lbSub = document.getElementById('lb-sub');
  const lbCounter = document.getElementById('lb-counter');
  const btnPrev = document.getElementById('lb-prev');
  const btnNext = document.getElementById('lb-next');
  const btnClose = document.getElementById('lb-close');

  if (!dialog) return;

  const items = Array.from(document.querySelectorAll('.gallery-item[data-full]'));
  let current = 0;

  items.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'lb-dot';
    dot.setAttribute('aria-label', `Снимка ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    lbCounter.appendChild(dot);
  });

  function updateDots() {
    lbCounter.querySelectorAll('.lb-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function setImage(index, animate) {
    const item = items[index];
    const src = item.dataset.full;
    const img = item.querySelector('img');
    const alt = img ? img.alt : '';

    if (animate) {
      lbImg.classList.add('fade');
      setTimeout(() => {
        lbImg.src = src;
        lbImg.alt = alt;
        if (lbTitle) lbTitle.textContent = alt;
        lbImg.classList.remove('fade');
      }, 280);
    } else {
      lbImg.src = src;
      lbImg.alt = alt;
      if (lbTitle) lbTitle.textContent = alt;
    }
    updateDots();
  }

  function goTo(index) {
    current = (index + items.length) % items.length;
    setImage(current, true);
  }

  function open(index) {
    current = index;
    setImage(current, false);
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  }

  function close() {
    dialog.close();
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => open(i));
  });

  btnPrev?.addEventListener('click', () => goTo(current - 1));
  btnNext?.addEventListener('click', () => goTo(current + 1));
  btnClose?.addEventListener('click', close);

  dialog.addEventListener('click', (e) => {
    const rect = dialog.getBoundingClientRect();
    const inside =
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (!inside) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!dialog.open) return;
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
    if (e.key === 'Escape') close();
  });
})();