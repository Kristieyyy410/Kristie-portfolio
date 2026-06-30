const root = document.documentElement;
const toggle = document.getElementById("langToggle");
const langButtons = document.querySelectorAll("[data-lang]");
const storedLang = window.localStorage.getItem("portfolio-lang");
let lang = storedLang === "zh" ? "zh" : "en";

function setActiveNav(activeLang) {
  document.querySelectorAll(".nav a").forEach((link) => {
    const key = link.getAttribute("data-nav");
    if (window.PORTFOLIO_CONTENT[activeLang].nav[key]) {
      link.textContent = window.PORTFOLIO_CONTENT[activeLang].nav[key];
    }
  });
}

function applyLanguage(activeLang) {
  const dict = window.PORTFOLIO_CONTENT[activeLang];
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const path = node.getAttribute("data-i18n");
    const value = path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), dict);
    if (typeof value === "string") {
      node.textContent = value;
    }
  });
  document.querySelectorAll("[data-i18n-html]").forEach((node) => {
    const path = node.getAttribute("data-i18n-html");
    const value = path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), dict);
    if (typeof value === "string") {
      node.innerHTML = value;
    }
  });
  document.documentElement.lang = activeLang === "zh" ? "zh-CN" : "en";
  document.title =
    activeLang === "zh"
      ? "郑欣妍 Kristie | AI 产品增长运营作品集"
      : "Kristie Zheng | AI Growth & Community Portfolio";
  toggle.classList.toggle("is-zh", activeLang === "zh");
  langButtons.forEach((button) => {
    const isActive = button.getAttribute("data-lang") === activeLang;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  setActiveNav(activeLang);
  root.dataset.lang = activeLang;
  window.localStorage.setItem("portfolio-lang", activeLang);
}

langButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextLang = button.getAttribute("data-lang");
    if (nextLang && nextLang !== lang) {
      lang = nextLang;
      applyLanguage(lang);
    }
  });
});

applyLanguage(lang);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".section").forEach((section) => observer.observe(section));

function enableHorizontalGallery(gallery) {
  let isDragging = false;
  let startX = 0;
  let startScrollLeft = 0;

  gallery.addEventListener(
    "wheel",
    (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      gallery.scrollLeft += event.deltaY;
    },
    { passive: false }
  );

  gallery.addEventListener("pointerdown", (event) => {
    isDragging = true;
    startX = event.clientX;
    startScrollLeft = gallery.scrollLeft;
    gallery.classList.add("is-dragging");
    gallery.setPointerCapture(event.pointerId);
  });

  gallery.addEventListener("pointermove", (event) => {
    if (!isDragging) return;
    gallery.scrollLeft = startScrollLeft - (event.clientX - startX);
  });

  function endDrag(event) {
    if (!isDragging) return;
    isDragging = false;
    gallery.classList.remove("is-dragging");
    if (event.pointerId && gallery.hasPointerCapture(event.pointerId)) {
      gallery.releasePointerCapture(event.pointerId);
    }
  }

  gallery.addEventListener("pointerup", endDrag);
  gallery.addEventListener("pointercancel", endDrag);
  gallery.addEventListener("pointerleave", endDrag);
}

function updateLifestyleDepth() {
  const gallery = document.querySelector(".lifestyle-gallery");
  if (!gallery) return;
  const galleryBox = gallery.getBoundingClientRect();
  const galleryCenter = galleryBox.left + galleryBox.width / 2;

  gallery.querySelectorAll(".life-card").forEach((card) => {
    const cardBox = card.getBoundingClientRect();
    const cardCenter = cardBox.left + cardBox.width / 2;
    const distance = (cardCenter - galleryCenter) / galleryBox.width;
    const absDistance = Math.min(Math.abs(distance), 0.75);
    card.style.setProperty("--tilt", `${(-distance * 26).toFixed(2)}deg`);
    card.style.setProperty("--lift", `${(absDistance * 34).toFixed(2)}px`);
    card.style.setProperty("--scale", `${(1.05 - absDistance * 0.18).toFixed(3)}`);
  });
}

function updateBlogDepth() {
  const gallery = document.querySelector(".blog-gallery");
  if (!gallery) return;
  const galleryBox = gallery.getBoundingClientRect();
  const galleryCenter = galleryBox.left + galleryBox.width / 2;

  gallery.querySelectorAll(".blog-card").forEach((card) => {
    const cardBox = card.getBoundingClientRect();
    const cardCenter = cardBox.left + cardBox.width / 2;
    const distance = (cardCenter - galleryCenter) / galleryBox.width;
    const absDistance = Math.min(Math.abs(distance), 0.7);
    card.style.setProperty("--blog-tilt", `${(-distance * 18).toFixed(2)}deg`);
    card.style.setProperty("--blog-lift", `${(absDistance * 26).toFixed(2)}px`);
    card.style.setProperty("--blog-scale", `${(1.02 - absDistance * 0.18).toFixed(3)}`);
    card.style.setProperty("--blog-opacity", `${(1 - absDistance * 0.32).toFixed(3)}`);
  });
}

document.querySelectorAll(".blog-gallery, .lifestyle-gallery").forEach(enableHorizontalGallery);

const blogGallery = document.querySelector(".blog-gallery");
if (blogGallery) {
  blogGallery.addEventListener("scroll", () => window.requestAnimationFrame(updateBlogDepth));
  window.addEventListener("resize", updateBlogDepth);
  blogGallery.querySelectorAll("video").forEach((video) => {
    video.addEventListener("mouseenter", () => video.play());
    video.addEventListener("mouseleave", () => video.pause());
  });
  updateBlogDepth();
}

const lifestyleGallery = document.querySelector(".lifestyle-gallery");
if (lifestyleGallery) {
  lifestyleGallery.addEventListener("scroll", () => window.requestAnimationFrame(updateLifestyleDepth));
  window.addEventListener("resize", updateLifestyleDepth);
  updateLifestyleDepth();
}
