/* =========================================================
   昆明学院国防先锋队官网 — 交互脚本
   ========================================================= */
(function () {
  "use strict";

  /* ---------- 工具函数 ---------- */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const STORAGE_THEME = "kmun-defense-theme";

  /* =========================================================
     1. 导航栏：滚动后加 scrolled，移动端菜单切换
     ========================================================= */
  function initNav() {
    const nav = $("#nav");
    const navToggle = $("#navToggle");
    const navLinks = $("#navLinks");

    // 滚动时改变导航栏背景
    const onScroll = () => {
      if (window.scrollY > 80) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // 移动端汉堡菜单
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      const icon = navToggle.querySelector("i");
      if (navLinks.classList.contains("open")) {
        icon.className = "bi bi-x-lg";
      } else {
        icon.className = "bi bi-list";
      }
    });

    // 点击链接后自动关闭菜单
    $$(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.querySelector("i").className = "bi bi-list";
      });
    });
  }

  /* =========================================================
     2. 暗色模式：data-bs-theme + localStorage
     ========================================================= */
  function initTheme() {
    const toggle = $("#themeToggle");
    const html = document.documentElement;
    let saved = localStorage.getItem(STORAGE_THEME);

    // 默认跟随系统偏好
    if (!saved) {
      saved = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    html.setAttribute("data-bs-theme", saved);

    toggle.addEventListener("click", () => {
      const current = html.getAttribute("data-bs-theme") || "light";
      const next = current === "light" ? "dark" : "light";
      html.setAttribute("data-bs-theme", next);
      localStorage.setItem(STORAGE_THEME, next);
    });
  }

  /* =========================================================
     3. Hero 轮播：自动播放 + 圆点控制
     ========================================================= */
  function initHeroCarousel() {
    const slides = $$(".hero-slide");
    const dots = $$(".hero-dot");
    if (slides.length === 0) return;

    let current = 0;
    let timer = null;

    const show = (idx) => {
      slides.forEach((s, i) => s.classList.toggle("active", i === idx));
      dots.forEach((d, i) => d.classList.toggle("active", i === idx));
      current = idx;
    };

    const next = () => show((current + 1) % slides.length);

    const start = () => {
      stop();
      timer = setInterval(next, 5000);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };

    dots.forEach((d) => {
      d.addEventListener("click", () => {
        show(parseInt(d.dataset.slide, 10));
        start();
      });
    });

    // 鼠标进入暂停
    const carousel = $(".hero-carousel");
    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);

    start();
  }

  /* =========================================================
     4. 滚动入场动画：IntersectionObserver
     ========================================================= */
  function initFadeUp() {
    const items = $$(".fade-up");
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            // 同批次元素依次进入
            const target = entry.target;
            const delay = Array.from(target.parentNode.children).indexOf(target) * 80;
            setTimeout(() => target.classList.add("visible"), Math.min(delay, 400));
            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.15 }
    );

    items.forEach((el) => observer.observe(el));
  }

  /* =========================================================
     5. 数字滚动计数（统计条）
     ========================================================= */
  function initCountUp() {
    const counters = $$("[data-count]");
    if (counters.length === 0) return;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (el) => {
      const target = parseInt(el.dataset.count, 10);
      const duration = 1800;
      const startTime = performance.now();

      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(easeOutCubic(progress) * target);
        el.textContent = value.toLocaleString();
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toLocaleString();
        }
      };
      requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animate);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach((c) => observer.observe(c));
  }

  /* =========================================================
     6. 返回顶部按钮
     ========================================================= */
  function initBackToTop() {
    const btn = $("#backToTop");
    const onScroll = () => {
      if (window.scrollY > 300) {
        btn.classList.add("visible");
      } else {
        btn.classList.remove("visible");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* =========================================================
     7. 报名模态框：打开/关闭/表单提交
     ========================================================= */
  function initJoinModal() {
    const modal = $("#joinModal");
    const form = $("#joinForm");
    const success = $("#formSuccess");

    const open = () => {
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
    };
    const close = () => {
      modal.classList.remove("open");
      document.body.style.overflow = "";
      // 短暂延迟后重置成功状态
      setTimeout(() => {
        success.classList.remove("show");
      }, 400);
    };

    // 打开
    $$("[data-open-modal]").forEach((btn) => {
      btn.addEventListener("click", open);
    });
    // 关闭
    $$("[data-close-modal]").forEach((btn) => {
      btn.addEventListener("click", close);
    });
    // 点击遮罩关闭
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });
    // ESC 关闭
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("open")) close();
    });

    // 表单提交（前端模拟）
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // 简单校验
      const name = $("#name").value.trim();
      const gender = $("#gender").value;
      const grade = $("#grade").value;
      const phone = $("#phone").value.trim();
      const agree = $("#agree").checked;

      if (!name) return alert("请填写姓名");
      if (!gender) return alert("请选择性别");
      if (!grade) return alert("请选择年级");
      if (!/^1\d{10}$/.test(phone)) return alert("请输入正确的 11 位手机号");
      if (!agree) return alert("请阅读并同意《入队须知》");

      // 模拟提交成功
      const submitBtn = form.querySelector(".form-submit");
      submitBtn.disabled = true;
      submitBtn.textContent = "提交中...";

      setTimeout(() => {
        success.classList.add("show");
        submitBtn.disabled = false;
        submitBtn.textContent = "提交报名";
        form.reset();

        // 5 秒后自动关闭
        setTimeout(() => {
          close();
        }, 5000);
      }, 800);
    });
  }

  /* =========================================================
     启动
     ========================================================= */
  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initTheme();
    initHeroCarousel();
    initFadeUp();
    initCountUp();
    initBackToTop();
    initJoinModal();
  });
})();
