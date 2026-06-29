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
