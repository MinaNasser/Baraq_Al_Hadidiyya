// Language and Theme Management
class AppManager {
  constructor() {
    this.currentLang = localStorage.getItem("preferredLang") || "ar";
    this.currentTheme = localStorage.getItem("preferredTheme") || "light-mode";
    this.init();
  }

  init() {
    this.applyLanguage(this.currentLang);
    this.applyTheme(this.currentTheme);
    this.setupEventListeners();
    this.setupSmoothScroll();
    this.setupAnimations();
  }

  // Language Management
  applyLanguage(lang) {
    this.currentLang = lang;
    document.body.setAttribute("data-lang", lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", lang);

    // Update all language-specific elements
    document.querySelectorAll("[data-lang]").forEach((element) => {
      element.style.display =
        element.getAttribute("data-lang") === lang ? "inline" : "none";
    });

    localStorage.setItem("preferredLang", lang);
    this.updateLanguageButton();
  }

  updateLanguageButton() {
    const button = document.getElementById("languageToggle");
    if (button) {
      const spans = button.querySelectorAll("span[data-lang]");
      spans.forEach((span) => {
        span.style.display =
          span.getAttribute("data-lang") === this.currentLang
            ? "inline"
            : "none";
      });
    }
  }

  toggleLanguage() {
    const newLang = this.currentLang === "ar" ? "en" : "ar";
    this.applyLanguage(newLang);
  }

  // Theme Management
  applyTheme(theme) {
    this.currentTheme = theme;
    document.body.className = theme;
    localStorage.setItem("preferredTheme", theme);
    this.updateThemeButton();
  }

  updateThemeButton() {
    const button = document.getElementById("themeToggle");
    if (button) {
      const icon = button.querySelector("i");
      const isDark = this.currentTheme === "dark-mode";
      icon.className = isDark ? "fas fa-sun" : "fas fa-moon";

      const spans = button.querySelectorAll("span[data-lang]");
      spans.forEach((span) => {
        if (span.getAttribute("data-lang") === this.currentLang) {
          span.textContent = isDark
            ? this.currentLang === "ar"
              ? "الوضع الفاتح"
              : "Light Mode"
            : this.currentLang === "ar"
            ? "الوضع الغامق"
            : "Dark Mode";
        }
      });
    }
  }

  toggleTheme() {
    const newTheme =
      this.currentTheme === "light-mode" ? "dark-mode" : "light-mode";
    this.applyTheme(newTheme);
  }

  // Event Listeners
  setupEventListeners() {
    // Language toggle
    const langToggle = document.getElementById("languageToggle");
    if (langToggle) {
      langToggle.addEventListener("click", () => this.toggleLanguage());
    }

    // Theme toggle
    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => this.toggleTheme());
    }

    // Navbar background on scroll
    window.addEventListener("scroll", () => {
      const navbar = document.querySelector(".navbar");
      if (navbar) {
        if (window.scrollY > 100) {
          navbar.style.backgroundColor = "rgba(33, 37, 41, 0.95)";
          navbar.style.backdropFilter = "blur(10px)";
        } else {
          navbar.style.backgroundColor = "";
          navbar.style.backdropFilter = "";
        }
      }
    });
  }

  // Smooth Scroll
  setupSmoothScroll() {
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        const targetId = link.getAttribute("href");
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 100;

          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });

          // Close mobile navbar
          const navbarCollapse = document.querySelector(".navbar-collapse");
          if (navbarCollapse && navbarCollapse.classList.contains("show")) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
          }
        }
      });
    });
  }

  // Animations
  setupAnimations() {
    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all sections
    document.querySelectorAll("section").forEach((section) => {
      observer.observe(section);
    });

    // Counter animations
    this.setupCounterAnimations();
  }

  setupCounterAnimations() {
    const stats = document.querySelectorAll(".stat-box h3");
    let animated = false;

    const animateStats = () => {
      if (animated) return;

      const heroSection = document.querySelector(".hero-section");
      if (!heroSection) return;

      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      const scrollPosition = window.scrollY + window.innerHeight;

      if (scrollPosition > heroBottom - 100) {
        animated = true;

        stats.forEach((stat) => {
          const target = parseInt(stat.textContent);
          let current = 0;
          const increment = target / 50;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              stat.textContent =
                target + (stat.textContent.includes("+") ? "+" : "");
              clearInterval(timer);
            } else {
              stat.textContent =
                Math.floor(current) +
                (stat.textContent.includes("+") ? "+" : "");
            }
          }, 30);
        });
      }
    };

    window.addEventListener("scroll", animateStats);
    animateStats(); // Run once on load
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new AppManager();
});

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
