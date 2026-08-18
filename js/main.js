/* ==========================================================================
   FLEUR — main.js
   Мобильное меню, рендер карточек товаров/статей, скролл каруселей.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Мобильное меню ---------- */
  const burgerBtn = document.getElementById("burgerBtn");
  const mobileNav = document.getElementById("mobileNav");
  const mobileNavClose = document.getElementById("mobileNavClose");
  const mobileNavOverlay = document.getElementById("mobileNavOverlay");

  function openMobileNav() {
    mobileNav.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeMobileNav() {
    mobileNav.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  if (burgerBtn) burgerBtn.addEventListener("click", openMobileNav);
  if (mobileNavClose) mobileNavClose.addEventListener("click", closeMobileNav);
  if (mobileNavOverlay) mobileNavOverlay.addEventListener("click", closeMobileNav);

  /* ---------- Панель «Избранное» ---------- */
  const favoritesLink = document.getElementById("favoritesLink");
  const favoritesDrawer = document.getElementById("favoritesDrawer");
  const favoritesClose = document.getElementById("favoritesClose");
  const favoritesOverlay = document.getElementById("favoritesOverlay");

  if (favoritesLink && favoritesDrawer) {
    favoritesLink.addEventListener("click", (e) => {
      e.preventDefault();
      favoritesDrawer.classList.add("is-open");
      document.body.style.overflow = "hidden";
    });
  }
  function closeFavorites() {
    if (!favoritesDrawer) return;
    favoritesDrawer.classList.remove("is-open");
    document.body.style.overflow = "";
  }
  if (favoritesClose) favoritesClose.addEventListener("click", closeFavorites);
  if (favoritesOverlay) favoritesOverlay.addEventListener("click", closeFavorites);

  /* ---------- Иконки для карточек товаров ---------- */
  const ICONS = {
    heart:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 5c-2.5 4.6-9.5 9-9.5 9Z"/></svg>',
    star:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6.1 6.6.7-4.9 4.6 1.3 6.6L12 17.6l-5.9 3 1.3-6.6-4.9-4.6 6.6-.7L12 2.5Z"/></svg>',
  };

  /* ---------- Данные товаров ---------- */
  const PRODUCTS = [
    { title: "Букет из пионовидных роз", price: "3 990 ₽", rating: "4.5", count: 24, ph: 1, inStock: true },
    { title: "Букет с гортензией и эустомой", price: "4 560 ₽", rating: "4.5", count: 18, ph: 2, inStock: true },
    { title: "Романтичный букет из роз", price: "3 250 ₽", rating: "4.5", count: 32, ph: 3, inStock: true },
    { title: "Букет с лилиями и альстромерией", price: "2 890 ₽", rating: "4.5", count: 11, ph: 4, inStock: true },
    { title: "Букет из тюльпанов", price: "2 190 ₽", rating: "4.5", count: 27, ph: 1, inStock: true },
    { title: "Букет с гортензией", price: "4 780 ₽", rating: "4.5", count: 9, ph: 3, inStock: false },
    { title: "Нежный букет с ранункулюсами", price: "3 690 ₽", rating: "4.5", count: 16, ph: 2, inStock: true },
    { title: "Весенний микс", price: "2 750 ₽", rating: "4.5", count: 22, ph: 4, inStock: true },
  ];

  function productCardHTML(p) {
    return `
      <article class="product-card">
        <div class="product-card__media ph ph--${p.ph}">
          <button class="product-card__fav icon-btn" aria-label="В избранное">${ICONS.heart}</button>
        </div>
        <div class="product-card__body">
          <div class="product-card__meta">
            <span class="badge-dot${p.inStock ? "" : " is-out"}">${p.inStock ? "В наличии" : "Нет в наличии"}</span>
            <span class="stars">${ICONS.star}${p.rating} <span class="stars__count">(${p.count})</span></span>
          </div>
          <h3 class="product-card__title">${p.title}</h3>
          <p class="product-card__price">${p.price}</p>
          <div class="product-card__actions">
            <a class="btn btn--outline" href="#">Подробнее</a>
            <button class="btn btn--primary" type="button">В корзину</button>
          </div>
        </div>
      </article>`;
  }

  const PRODUCTS_CATALOG = [
    { title: "Розовые пионы", price: "5 900 ₽", rating: "4.5", count: 32, ph: 1, inStock: true },
    { title: "Белая гортензия", price: "4 800 ₽", rating: "4.5", count: 18, ph: 3, inStock: true },
    { title: "Букет из розовых роз", price: "3 250 ₽", rating: "4.5", count: 27, ph: 2, inStock: true },
    { title: "Нежность", price: "6 200 ₽", rating: "5.0", count: 27, ph: 4, inStock: true },
    { title: "Эустома в облаках", price: "4 100 ₽", rating: "4.0", count: 14, ph: 3, inStock: true },
    { title: "Ромашковое поле", price: "2 800 ₽", rating: "4.5", count: 9, ph: 1, inStock: true },
    { title: "Тюльпаны микс", price: "3 100 ₽", rating: "4.0", count: 17, ph: 2, inStock: true },
    { title: "Весенний микс", price: "4 900 ₽", rating: "4.5", count: 23, ph: 4, inStock: true },
    { title: "Белые лилии", price: "4 700 ₽", rating: "4.0", count: 11, ph: 3, inStock: true },
  ];

  const PRODUCTS_ADDONS = [
    { title: "Набор конфет ручной работы", price: "1 890 ₽", rating: "4.5", count: 24, ph: 1, inStock: true },
    { title: "Мягкий плюшевый медведь", price: "2 490 ₽", rating: "4.5", count: 18, ph: 2, inStock: true },
    { title: "Набор макаронс", price: "1 590 ₽", rating: "4.5", count: 32, ph: 3, inStock: true },
    { title: "Подарочный набор для неё", price: "2 190 ₽", rating: "4.5", count: 11, ph: 4, inStock: true },
  ];

  const DATASETS = { popular: PRODUCTS, catalog: PRODUCTS_CATALOG, addons: PRODUCTS_ADDONS };

  document.querySelectorAll(".products__grid[data-products]").forEach((el) => {
    const list = DATASETS[el.dataset.products] || PRODUCTS;
    el.innerHTML = list.map(productCardHTML).join("");
  });

  // обратная совместимость со старыми id-грид (если где-то остались)
  ["productsGrid1", "productsGrid2"].forEach((id) => {
    const el = document.getElementById(id);
    if (el && !el.dataset.products) el.innerHTML = PRODUCTS.map(productCardHTML).join("");
  });

  /* ---------- Данные статей блога ---------- */
  const ARTICLES = [
    {
      title: "Как сохранить букет свежим надолго",
      text: "Простые и эффективные советы по уходу за цветами, чтобы они радовали вас как можно дольше.",
      author: "Анна Петрова",
      date: "20.07.2024",
      rating: "full",
      ph: 2,
    },
    {
      title: "Цветы для особых случаев",
      text: "Подбираем идеальный букет для свадьбы, юбилея, дня рождения и других важных моментов.",
      author: "Иван Смирнов",
      date: "18.07.2024",
      rating: "half",
      ph: 1,
    },
    {
      title: "Тренды флористики в 2024 году",
      text: "Актуальные направления, цвета и стили в мире флористики, которые будут в моде в этом году.",
      author: "Мария Волкова",
      date: "16.07.2024",
      rating: "full",
      ph: 3,
    },
    {
      title: "Цветы в интерьере: создаем уют",
      text: "Идеи и советы по использованию цветов для украшения дома и создания гармоничной атмосферы.",
      author: "Елена Кузнецова",
      date: "14.07.2024",
      rating: "half",
      ph: 4,
    },
  ];

  function blogCardHTML(a) {
    const stars = a.rating === "full" ? "★★★★★" : "★★★★<span style=\"opacity:.35\">★</span>";
    return `
      <article class="blog-card">
        <div class="blog-card__media ph ph--${a.ph}"></div>
        <div class="blog-card__body">
          <div class="blog-card__meta">
            <span>${a.date}</span>
            <span class="blog-card__author">
              <span class="blog-card__avatar ph ph--${a.ph}"></span>
              ${a.author}
            </span>
            <span class="stars">${stars}</span>
          </div>
          <h3 class="blog-card__title">${a.title}</h3>
          <p class="blog-card__text">${a.text}</p>
          <a class="btn btn--outline" href="#">Читать статью
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
        </div>
      </article>`;
  }

  const blogGrid = document.getElementById("blogGrid");
  if (blogGrid) blogGrid.innerHTML = ARTICLES.map(blogCardHTML).join("");

  /* ---------- Горизонтальный скролл каруселей стрелками ---------- */
  function wireArrowScroll(prevBtn, nextBtn, track) {
    if (!track) return;
    const step = () => Math.max(track.clientWidth * 0.7, 200);
    if (prevBtn) prevBtn.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
    if (nextBtn) nextBtn.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
  }

  const galleryTrack = document.querySelector(".gallery__track");
  const galleryArrows = document.querySelectorAll(".gallery__arrow");
  wireArrowScroll(galleryArrows[0], galleryArrows[1], galleryTrack);

  /* ---------- FAQ-аккордеон ---------- */
  document.querySelectorAll(".faq-item__q").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.closest(".faq-item").classList.toggle("is-open");
    });
  });

  /* ---------- «Показать ещё» для текстовых блоков ---------- */
  document.querySelectorAll(".prose__more").forEach((btn) => {
    btn.addEventListener("click", () => {
      const prose = btn.closest(".prose");
      const collapsed = prose.classList.toggle("is-clamped");
      btn.firstChild.textContent = collapsed ? "Показать ещё " : "Свернуть ";
    });
  });

  /* ---------- Фильтр-плашки (визуальное переключение) ---------- */
  document.querySelectorAll(".filter-chips").forEach((wrap) => {
    wrap.addEventListener("click", (e) => {
      const chip = e.target.closest(".filter-chip");
      if (!chip) return;
      wrap.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
    });
  });

  /* ---------- Чекбоксы фильтра: скрыть/показать остальные ---------- */
  document.querySelectorAll(".filter-more[data-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const list = btn.previousElementSibling;
      const hidden = list.classList.toggle("is-expanded");
      btn.firstChild.textContent = hidden ? "Скрыть " : "Показать ещё ";
    });
  });
})();
