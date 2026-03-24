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

var icon = L.divIcon({
  className: 'map-marker',
  html: `
    <div class="map-marker__pin">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

const customIcon = L.divIcon({
  className: 'custom-pin',
  html: `
    <div class="pin-wrapper">
      <img src="assets/icons/map-marker.png" class="pin-icon" alt="">
      <div class="pin-tip"></div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

(function () {
  if (typeof L === 'undefined' || !document.getElementById('map')) return;
  var map = L.map('map').setView([43.38284844, 24.63029496], 16);
  L.tileLayer('https://api.maptiler.com/maps/openstreetmap/{z}/{x}/{y}.jpg?key=D0JSok60mwH7fw0T16Hw', {
    attribution:
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
      '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
  }).addTo(map);
  var marker = L.marker([43.38104844, 24.63135496], { icon: customIcon }).addTo(map);
})();