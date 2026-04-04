(() => {
  const gallery = document.getElementById('gallery');
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbTitle = document.getElementById('lbTitle');
  const lbSubtitle = document.getElementById('lbSubtitle');
  const lbDescription = document.getElementById('lbDescription');
  const lbMedium = document.getElementById('lbMedium');
  const lbPrice = document.getElementById('lbPrice');
  const lbBuyBtn = document.getElementById('lbBuyBtn');
  const lbSold = document.getElementById('lbSold');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');

  let currentIndex = 0;

  function formatPrice(price) {
    return price.toLocaleString('sv-SE') + ' kr';
  }

  function openLightbox(index) {
    currentIndex = index;
    const art = artworks[index];

    lbImg.src = art.image;
    lbImg.alt = art.title;
    lbTitle.textContent = art.title;
    lbSubtitle.textContent = art.subtitle;
    lbDescription.textContent = art.description;
    lbMedium.textContent = art.medium;

    if (art.sold) {
      lbPrice.textContent = '';
      lbBuyBtn.style.display = 'none';
      lbSold.style.display = 'inline-block';
    } else if (art.forSale) {
      lbPrice.textContent = formatPrice(art.price);
      lbBuyBtn.href = art.stripeLink;
      lbBuyBtn.style.display = 'inline-block';
      lbSold.style.display = 'none';
    } else {
      lbPrice.textContent = '';
      lbBuyBtn.style.display = 'none';
      lbSold.style.display = 'none';
    }

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + artworks.length) % artworks.length;
    openLightbox(currentIndex);
  }

  function buildGallery() {
    artworks.forEach((art, index) => {
      const card = document.createElement('article');
      card.className = 'card' + (art.featured ? ' card--featured' : '');

      const badge = art.sold
        ? '<span class="badge badge--sold">Såld</span>'
        : art.forSale
          ? '<span class="badge badge--sale">Till salu</span>'
          : '';

      card.innerHTML = `
        <div class="card__img-wrap">
          <img
            class="card__img"
            src="${art.image}"
            alt="${art.title}"
            loading="lazy"
          >
          <div class="card__overlay">
            <span class="card__overlay-text">Visa</span>
          </div>
          ${badge}
        </div>
        <div class="card__body">
          <h3 class="card__title">${art.title}</h3>
          <p class="card__subtitle">${art.subtitle}</p>
          ${art.forSale && !art.sold ? `<p class="card__price">${formatPrice(art.price)}</p>` : ''}
        </div>
      `;

      card.addEventListener('click', () => openLightbox(index));
      gallery.appendChild(card);
    });
  }

  // Events
  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', (e) => { e.stopPropagation(); navigate(-1); });
  lbNext.addEventListener('click', (e) => { e.stopPropagation(); navigate(1); });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  // Touch swipe for lightbox
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 50) navigate(dx < 0 ? 1 : -1);
  }, { passive: true });

  buildGallery();
})();
