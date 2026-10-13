const hero = document.getElementById("hero");
const stage = document.getElementById("stage");
const reveal = document.getElementById("reveal");
const ring = document.getElementById("ring");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- 1. Intro animation ---------- */
const intro = gsap.timeline({ defaults: { ease: "power4.out" } });

intro
  .from(".topbar", { y: -30, opacity: 0, duration: prefersReducedMotion ? 0 : 0.8 })
  .from(".line-inner", { yPercent: 110, duration: prefersReducedMotion ? 0 : 1.1, stagger: 0.15 }, "-=0.5")
  .from(".role, .desc", { y: 24, opacity: 0, duration: prefersReducedMotion ? 0 : 0.8, stagger: 0.12 }, "-=0.6")
  .from(".btn", { y: 24, opacity: 0, duration: prefersReducedMotion ? 0 : 0.7, stagger: 0.1 }, "-=0.5")
  .from(".stage", { opacity: 0, x: 60, duration: prefersReducedMotion ? 0 : 1.2 }, 0.2)
  .from(".badge", { scale: 0, rotate: -90, duration: prefersReducedMotion ? 0 : 0.9, ease: "back.out(1.6)" }, "-=0.6")
  .from(".hint, .sparkle", { opacity: 0, duration: prefersReducedMotion ? 0 : 0.8 }, "-=0.3");

/* ---------- 2. Ambient motion ---------- */
if (!prefersReducedMotion) {
  gsap.to(".badge-text", { rotate: 360, duration: 18, ease: "none", repeat: -1, transformOrigin: "50% 50%" });
  gsap.to(".sparkle", { y: -14, rotate: 20, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
}

/* ---------- 3. Reveal effect ---------- */
const state = { x: 0, y: 0, r: 0 };

const getMaxRadius = () => (window.innerWidth < 768 ? 120 : 210);

const moveX = gsap.quickTo(state, "x", { duration: prefersReducedMotion ? 0 : 0.6, ease: "power3" });
const moveY = gsap.quickTo(state, "y", { duration: prefersReducedMotion ? 0 : 0.6, ease: "power3" });

gsap.ticker.add(() => {
  reveal.style.setProperty("--x", state.x + "px");
  reveal.style.setProperty("--y", state.y + "px");
  reveal.style.setProperty("--r", state.r + "px");
  ring.style.left = state.x + "px";
  ring.style.top = state.y + "px";
  ring.style.width = ring.style.height = state.r * 1.5 + "px";
});

// pointer position relative to the image stage
function localPos(e) {
  const rect = stage.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function showReveal() {
  gsap.to([reveal, ring], { opacity: 1, duration: 0.25, overwrite: "auto" });
  gsap.to(state, { r: getMaxRadius(), duration: prefersReducedMotion ? 0 : 0.7, ease: "power3.out", overwrite: "auto" });
}

function hideReveal() {
  gsap.to(state, { r: 0, duration: prefersReducedMotion ? 0 : 0.5, ease: "power3.in", overwrite: "auto" });
  gsap.to([reveal, ring], { opacity: 0, duration: 0.3, delay: 0.25, overwrite: "auto" });
}

hero.addEventListener("pointerenter", (e) => {
  const p = localPos(e);
  gsap.set(state, { x: p.x, y: p.y });
  showReveal();
});

hero.addEventListener("pointermove", (e) => {
  const p = localPos(e);
  moveX(p.x);
  moveY(p.y);
});

hero.addEventListener("pointerleave", hideReveal);
hero.addEventListener("pointercancel", hideReveal);

window.addEventListener("resize", () => {
  if (state.r > 0) gsap.to(state, { r: getMaxRadius(), duration: 0.3 });
});


/* ================= Featured Case Studies ================= */
gsap.registerPlugin(ScrollTrigger);

/* ---------- 1. ScrollTrigger animations ---------- */
if (!prefersReducedMotion) {
  gsap.from(".cases-panel", {
    y: 90,
    opacity: 0,
    duration: 1.1,
    ease: "power3.out",
    scrollTrigger: { trigger: ".cases", start: "top 85%" },
  });

  gsap.from(".cases-head > *", {
    y: 20,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: "power3.out",
    scrollTrigger: { trigger: ".cases", start: "top 75%" },
  });

  // cards slide up one by one
  gsap.from(".case-card", {
    y: 140,
    opacity: 0,
    scale: 0.92,
    duration: 1.1,
    stagger: 0.2,
    ease: "power4.out",
    scrollTrigger: {
      trigger: ".cases-grid",
      start: "top 85%",
      toggleActions: "play none none reverse",
    },
  });

  // soft parallax on every image while scrolling
  gsap.utils.toArray(".thumb img").forEach((img) => {
    gsap.fromTo(
      img,
      { yPercent: -5 },
      {
        yPercent: 5,
        ease: "none",
        scrollTrigger: {
          trigger: img.closest(".thumb"),
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  });
}

window.addEventListener("load", () => ScrollTrigger.refresh());

/* ---------- 2. Image popup (click -> image grows to center) ---------- */
const lightbox = document.getElementById("lightbox");
const lbMedia = document.getElementById("lbMedia");
const lbImg = document.getElementById("lbImg");
const lbTitle = document.getElementById("lbTitle");
const lbDesc = document.getElementById("lbDesc");
const lbClose = document.getElementById("lbClose");
const lbBackdrop = document.getElementById("lbBackdrop");

let activeThumb = null;
let lbOpen = false;
const dur = (n) => (prefersReducedMotion ? 0 : n);

// where the small image is, compared to the big one
function flipFrom(thumb) {
  const from = thumb.getBoundingClientRect();
  const to = lbMedia.getBoundingClientRect();
  return {
    x: from.left + from.width / 2 - (to.left + to.width / 2),
    y: from.top + from.height / 2 - (to.top + to.height / 2),
    scale: from.width / to.width,
  };
}

function openLightbox(card) {
  if (lbOpen) return;
  lbOpen = true;

  const thumb = card.querySelector(".thumb");
  activeThumb = thumb;

  const img = thumb.querySelector("img");
  const hasImg = img && img.complete && img.naturalWidth > 0;
  lbImg.style.display = hasImg ? "block" : "none";
  if (hasImg) lbImg.src = img.currentSrc || img.src;
  lbMedia.style.backgroundImage = getComputedStyle(thumb).backgroundImage;

  lbTitle.textContent = card.querySelector(".case-title").textContent;
  lbDesc.textContent = card.querySelector(".case-desc").textContent;

  lightbox.style.display = "flex";
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  const f = flipFrom(thumb);
  thumb.style.opacity = 0;

  gsap.fromTo(lbBackdrop, { opacity: 0 }, { opacity: 1, duration: dur(0.4) });
  gsap.fromTo(
    lbMedia,
    { x: f.x, y: f.y, scale: f.scale, borderRadius: 22 },
    { x: 0, y: 0, scale: 1, borderRadius: 28, duration: dur(0.85), ease: "power4.out" }
  );
  gsap.fromTo(
    ".lb-caption, .lb-close",
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: dur(0.5), delay: dur(0.4) }
  );
}

function closeLightbox() {
  if (!lbOpen) return;
  lbOpen = false;

  gsap.killTweensOf([lbMedia, lbBackdrop, ".lb-caption, .lb-close"]);
  gsap.set(lbMedia, { x: 0, y: 0, scale: 1 });
  const f = flipFrom(activeThumb);

  gsap.to(".lb-caption, .lb-close", { opacity: 0, duration: dur(0.2) });
  gsap.to(lbBackdrop, { opacity: 0, duration: dur(0.5), delay: dur(0.1) });
  gsap.to(lbMedia, {
    x: f.x,
    y: f.y,
    scale: f.scale,
    borderRadius: 22,
    duration: dur(0.65),
    ease: "power3.inOut",
    onComplete: () => {
      lightbox.style.display = "none";
      lightbox.setAttribute("aria-hidden", "true");
      activeThumb.style.opacity = 1;
      document.body.style.overflow = "";
    },
  });
}

document.querySelectorAll(".case-card .thumb").forEach((thumb) => {
  const card = thumb.closest(".case-card");
  thumb.addEventListener("click", () => openLightbox(card));
  thumb.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openLightbox(card);
    }
  });
});

lbClose.addEventListener("click", closeLightbox);
lbBackdrop.addEventListener("click", closeLightbox);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

/* ================= Story + Orbit + Footer ================= */
(() => {
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- 1. Pinned story (scrubbed timeline) ---------- */
  const cardsTrack = document.querySelector(".rs-cards");

  gsap.set(".rs-initial-text h1", { scale: 2 });
  gsap.set(".rs-final-text", { xPercent: 100 });

  const story = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: ".story",
      start: "top top",
      end: "+=600%", // scroll length of the pinned section
      pin: true,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  story
    // image grows to full screen, text shrinks
    .to(".rs-media", { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 1 })
    .to(".rs-initial-text h1", { scale: 1, duration: 1 }, "<")
    // 3 strips wipe in from the right
    .to(".rs-strip", {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 0.8,
      stagger: { each: 0.18, from: "end" },
    })
    // cards sweep right -> left
    .to(cardsTrack, { x: () => -(cardsTrack.offsetWidth + window.innerWidth), duration: 3 })
    // final image + text follow behind the cards
    .to(".rs-final-media", { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6 }, "<+=1.4")
    .to(".rs-final-text", { xPercent: 0, duration: 1.6 }, "<");

  /* ---------- 2. Orbit gallery ---------- */
  const items = [...document.querySelectorAll(".orbit-item")];
  const itemsWrap = document.querySelector(".orbit-items");

  const radius = window.innerWidth < 768 ? 300 : 500;
  const angleStep = 360 / items.length;

  let current = 0;
  let rotation = 0;
  let isAnimating = false;

  items.forEach((item, i) => {
    const angle = i * angleStep - 90;
    gsap.set(item, {
      x: Math.cos((angle * Math.PI) / 180) * radius,
      y: Math.sin((angle * Math.PI) / 180) * radius,
      rotation: angle + 90,
    });
  });

  function goTo(index) {
    if (isAnimating) return;
    isAnimating = true;

    const diff = index - current;
    let shortest = diff;
    if (diff > items.length / 2) shortest -= items.length;
    if (diff < -items.length / 2) shortest += items.length;

    current = (current + shortest + items.length) % items.length;
    rotation -= shortest * angleStep;

    gsap.to(itemsWrap, {
      rotation,
      duration: 1.5,
      ease: "elastic.out(0.5,0.2)",
      onComplete: () => (isAnimating = false),
    });
  }

  const next = () => goTo((current + 1) % items.length);
  const prev = () => goTo((current - 1 + items.length) % items.length);

  document.querySelector(".orbit-next").addEventListener("click", next);
  document.querySelector(".orbit-prev").addEventListener("click", prev);
  items.forEach((item, i) => item.addEventListener("click", () => goTo(i)));

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  /* ---------- 3. Footer (big letters move up on scroll) ---------- */
  gsap.from(".ft-word span", {
    yPercent: 115,
    ease: "none",
    stagger: 0.05,
    scrollTrigger: {
      trigger: ".footer",
      start: "top 75%",
      end: "bottom bottom",
      scrub: true,
    },
  });

  gsap.from(".ft-top > *", {
    y: 50,
    opacity: 0,
    duration: 0.9,
    stagger: 0.12,
    ease: "power3.out",
    scrollTrigger: { trigger: ".footer", start: "top 70%" },
  });

  document.querySelector(".ft-form").addEventListener("submit", (e) => e.preventDefault());
})();


/* ================= Extras: links, navbar, progress, form ================= */
(() => {
  /* ---------- APNI DETAILS YAHAN LIKHO ---------- */
  const CONFIG = {
    email: "sanaashraf0987sr@gmail.com",
    instagram: "https://www.instagram.com/moondev_code/?hl=en#",
    linkedin: "www.linkedin.com/in/sanashahzadi33",
  };

  /* ---------- 1. Social links ---------- */
  document.querySelectorAll("[data-social]").forEach((a) => {
    const key = a.dataset.social;
    if (key === "email") {
      a.href = `mailto:${CONFIG.email}`;
    } else {
      a.href = CONFIG[key];
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
  });

  /* ---------- 2. Toast message ---------- */
  const toast = document.getElementById("toast");
  gsap.set(toast, { xPercent: -50, y: 20, opacity: 0 });

  function showToast(msg) {
    toast.textContent = msg;
    gsap.killTweensOf(toast);
    gsap
      .timeline()
      .to(toast, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" })
      .to(toast, { y: 20, opacity: 0, duration: 0.4, delay: 2.2, ease: "power3.in" });
  }

  /* ---------- 3. Footer form -> opens mail app ---------- */
  const form = document.querySelector(".ft-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector("input");
    const val = input.value.trim();

    if (!/^\S+@\S+\.\S+$/.test(val)) {
      showToast("Please enter a valid email");
      input.focus();
      return;
    }

    const subject = encodeURIComponent("Project inquiry from your website");
    const body = encodeURIComponent(`Hi, I'd like to work with you.\n\nMy email: ${val}`);
    window.location.href = `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;

    showToast("Opening your mail app…");
    input.value = "";
  });

  /* ---------- 4. Scroll progress bar ---------- */
  gsap.set("#progress", { scaleX: 0, transformOrigin: "left center" });
  gsap.to("#progress", {
    scaleX: 1,
    ease: "none",
    scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
  });

  /* ---------- 5. Navbar: shows when scrolling up ---------- */
  const nav = document.getElementById("nav");
  gsap.set(nav, { yPercent: -160, autoAlpha: 0 });
  let navShown = false;

  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      const show = self.scroll() > 300 && self.direction === -1;
      if (show !== navShown) {
        navShown = show;
        gsap.to(nav, {
          yPercent: show ? 0 : -160,
          autoAlpha: show ? 1 : 0,
          duration: 0.4,
          ease: "power3.out",
          overwrite: true,
        });
      }
    },
  });

  /* ---------- 6. Smooth scroll for all # links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    const id = a.getAttribute("href");
    if (id.length < 2) return;

    a.addEventListener("click", (e) => {
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();

      // pinned section ka stable position lene ke liye
      const el = target.closest(".pin-spacer") || target;
      const y = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });
})();