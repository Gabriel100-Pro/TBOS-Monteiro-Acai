const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((element) => revealObserver.observe(element));

const heroVisual = document.querySelector(".hero-visual");
const heroImage = document.querySelector(".hero-image");

if (heroVisual && heroImage) {
  heroVisual.addEventListener("mousemove", (event) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 10;
    const rotateX = ((y / rect.height) - 0.5) * -10;

    heroImage.style.transform = `rotate(-2deg) perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  heroVisual.addEventListener("mouseleave", () => {
    heroImage.style.transform = "rotate(-2deg) perspective(900px) rotateX(0) rotateY(0)";
  });
}

const statSection = document.querySelector("#stats");
const counters = document.querySelectorAll(".stat-number");
let hasCounted = false;

const animateCounter = (counter) => {
  const targetRaw = counter.dataset.target || "0";
  const target = Number(targetRaw);
  const isDecimal = targetRaw.includes(".");
  const duration = 1200;
  const start = performance.now();

  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const value = target * (1 - Math.pow(1 - progress, 3));

    counter.textContent = isDecimal ? value.toFixed(1) : Math.round(value).toString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  };

  requestAnimationFrame(update);
};

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasCounted) {
        counters.forEach(animateCounter);
        hasCounted = true;
        statsObserver.disconnect();
      }
    });
  },
  { threshold: 0.45 }
);

if (statSection) {
  statsObserver.observe(statSection);
}

const tiltCards = document.querySelectorAll(".tilt-card");

const resetTilt = (card) => {
  card.style.transform = "rotateX(0deg) rotateY(0deg)";
};

tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const bounds = card.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;

    const rotateX = ((y / bounds.height) - 0.5) * -8;
    const rotateY = ((x / bounds.width) - 0.5) * 8;

    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    resetTilt(card);
  });
});

document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("click", (event) => {
    const ripple = document.createElement("span");
    ripple.className = "ripple";

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 450);
  });
});

const style = document.createElement("style");
style.textContent = `
  .btn {
    position: relative;
    overflow: hidden;
  }

  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.45);
    transform: scale(0);
    animation: ripple 450ms ease-out;
    pointer-events: none;
  }

  @keyframes ripple {
    to {
      transform: scale(2.8);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

const year = document.querySelector("#year");
if (year) {
  year.textContent = new Date().getFullYear().toString();
}

// ── 1. BARRA DE PROGRESSO DE SCROLL ──────────────────────────────────────────
const progressBar = document.createElement("div");
progressBar.className = "scroll-progress";
document.body.prepend(progressBar);

window.addEventListener("scroll", () => {
  const scrolled = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${(scrolled / total) * 100}%`;
}, { passive: true });

// ── 2. CURSOR PERSONALIZADO COM RASTRO ───────────────────────────────────────
const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

if (!isTouchDevice) {
  const cursor = document.createElement("div");
  cursor.className = "cursor-dot";
  document.body.appendChild(cursor);

  const trail = Array.from({ length: 8 }, (_, i) => {
    const dot = document.createElement("div");
    dot.className = "cursor-trail";
    dot.style.setProperty("--i", String(i));
    document.body.appendChild(dot);
    return dot;
  });

  const positions = trail.map(() => ({ x: 0, y: 0 }));
  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  const animateTrail = () => {
    let x = mouseX;
    let y = mouseY;
    positions.forEach((pos, i) => {
      const lag = 0.22 + i * 0.04;
      pos.x += (x - pos.x) * lag;
      pos.y += (y - pos.y) * lag;
      trail[i].style.left = `${pos.x}px`;
      trail[i].style.top = `${pos.y}px`;
      x = pos.x;
      y = pos.y;
    });
    requestAnimationFrame(animateTrail);
  };
  animateTrail();
}

// ── 3. PARTÍCULAS FLUTUANTES NO HERO ─────────────────────────────────────────
const heroSection = document.querySelector(".hero");
const EMOJIS = ["🍇", "✨", "💜", "🫐", "🍓"];

if (heroSection) {
  for (let i = 0; i < 14; i++) {
    const p = document.createElement("span");
    p.className = "hero-particle";
    p.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    p.style.setProperty("--x", `${Math.random() * 100}%`);
    p.style.setProperty("--dur", `${4 + Math.random() * 6}s`);
    p.style.setProperty("--delay", `${Math.random() * 6}s`);
    p.style.setProperty("--size", `${0.9 + Math.random() * 1.1}rem`);
    heroSection.appendChild(p);
  }
}

// ── 4. GLARE NOS CARDS ───────────────────────────────────────────────────────
document.querySelectorAll(".flavor-card").forEach((card) => {
  const glare = document.createElement("div");
  glare.className = "card-glare";
  card.appendChild(glare);

  card.addEventListener("mousemove", (e) => {
    const b = card.getBoundingClientRect();
    const x = ((e.clientX - b.left) / b.width) * 100;
    const y = ((e.clientY - b.top) / b.height) * 100;
    glare.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.22) 0%, transparent 65%)`;
    glare.style.opacity = "1";
  });

  card.addEventListener("mouseleave", () => {
    glare.style.opacity = "0";
  });
});

// ── 5. BOTÕES MAGNÉTICOS ─────────────────────────────────────────────────────
document.querySelectorAll(".btn-primary, .btn-header").forEach((btn) => {
  btn.addEventListener("mousemove", (e) => {
    const b = btn.getBoundingClientRect();
    const x = e.clientX - b.left - b.width / 2;
    const y = e.clientY - b.top - b.height / 2;
    btn.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px) scale(1.04)`;
  });

  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "translate(0,0) scale(1)";
  });
});

// ── 6. CONFETTI AO CLICAR EM BOTÕES DO WHATSAPP ───────────────────────────────
const CONFETTI_COLORS = ["#6a1b4d", "#f08a24", "#f6b149", "#a03e73", "#25d366", "#fff"];

const launchConfetti = (originX, originY) => {
  for (let i = 0; i < 28; i++) {
    const c = document.createElement("div");
    c.className = "confetti-piece";
    c.style.setProperty("--color", CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]);
    c.style.setProperty("--tx", `${(Math.random() - 0.5) * 260}px`);
    c.style.setProperty("--ty", `${-(80 + Math.random() * 180)}px`);
    c.style.setProperty("--rot", `${Math.random() * 720}deg`);
    c.style.left = `${originX}px`;
    c.style.top = `${originY}px`;
    c.style.width = `${6 + Math.random() * 7}px`;
    c.style.height = `${6 + Math.random() * 7}px`;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 900);
  }
};

document.querySelectorAll("a[href*='wa.me']").forEach((link) => {
  link.addEventListener("click", (e) => {
    const b = link.getBoundingClientRect();
    launchConfetti(b.left + b.width / 2, b.top + b.height / 2);
  });
});

// ── 7. DIGITACAO NO TITULO HERO ─────────────────────────────────────────────
const heroTitle = document.querySelector(".hero-content h1");
if (heroTitle) {
  const originalText = heroTitle.textContent || "";
  heroTitle.textContent = "";
  let index = 0;

  const typeTimer = setInterval(() => {
    heroTitle.textContent += originalText[index] || "";
    index += 1;
    if (index >= originalText.length) {
      clearInterval(typeTimer);
      heroTitle.classList.add("typed");
    }
  }, 45);
}

// ── 8. PARALLAX SUAVE COM ROLAGEM ───────────────────────────────────────────
const parallaxItems = [
  { element: document.querySelector(".shape-1"), speed: 0.08 },
  { element: document.querySelector(".shape-2"), speed: 0.12 },
  { element: document.querySelector(".hero-image"), speed: 0.04 }
];

window.addEventListener("scroll", () => {
  const scrolled = window.scrollY;
  parallaxItems.forEach((item) => {
    if (!item.element) {
      return;
    }
    const offset = scrolled * item.speed;
    item.element.style.translate = `0 ${offset}px`;
  });
}, { passive: true });

// ── 9. BURST DE EMOJI NOS CARDS ─────────────────────────────────────────────
const burstSymbols = ["🍓", "🫐", "✨", "🍇"];

document.querySelectorAll(".flavor-card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    for (let i = 0; i < 5; i++) {
      const pop = document.createElement("span");
      pop.className = "emoji-burst";
      pop.textContent = burstSymbols[Math.floor(Math.random() * burstSymbols.length)];
      pop.style.left = `${20 + Math.random() * 60}%`;
      pop.style.top = `${35 + Math.random() * 30}%`;
      pop.style.setProperty("--dx", `${(Math.random() - 0.5) * 70}px`);
      pop.style.setProperty("--dy", `${-35 - Math.random() * 60}px`);
      card.appendChild(pop);
      setTimeout(() => pop.remove(), 650);
    }
  });
});

// ── 10. MODO SURPRESA (5 CLIQUES NO LOGO) ─────────────────────────────────
const logo = document.querySelector(".logo");
let logoClicks = 0;
let clickResetTimer;
let surpriseTimer;

const burstCenterConfetti = () => {
  launchConfetti(window.innerWidth * 0.5, window.innerHeight * 0.45);
};

if (logo) {
  logo.addEventListener("click", (event) => {
    event.preventDefault();

    logoClicks += 1;
    clearTimeout(clickResetTimer);
    clickResetTimer = setTimeout(() => {
      logoClicks = 0;
    }, 1400);

    if (logoClicks < 5) {
      return;
    }

    logoClicks = 0;
    clearTimeout(surpriseTimer);

    document.body.classList.add("surprise-mode");
    burstCenterConfetti();

    const badge = document.createElement("div");
    badge.className = "surprise-badge";
    badge.textContent = "Modo Surpresa Ativado";
    document.body.appendChild(badge);

    setTimeout(() => {
      badge.classList.add("hide");
      setTimeout(() => badge.remove(), 280);
    }, 1800);

    surpriseTimer = setTimeout(() => {
      document.body.classList.remove("surprise-mode");
    }, 12000);
  });
}
