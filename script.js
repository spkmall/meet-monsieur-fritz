const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const body = document.body;
const progress = document.querySelector(".scroll-meter span");
const motionButton = document.querySelector(".motion-switch");

if (prefersReduced) {
  body.classList.add("motion-off");
  motionButton.setAttribute("aria-pressed", "true");
}

const setProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const amount = max > 0 ? (window.scrollY / max) * 100 : 0;
  progress.style.width = `${amount}%`;
};

window.addEventListener("scroll", setProgress, { passive: true });
setProgress();

const showReveal = (node) => {
  node.classList.remove("reveal-pending");
  node.classList.add("is-visible");
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      showReveal(entry.target);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll(".reveal").forEach((node) => {
  const rect = node.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.95) {
    showReveal(node);
  } else {
    node.classList.add("reveal-pending");
    revealObserver.observe(node);
  }
});

motionButton.addEventListener("click", () => {
  const off = body.classList.toggle("motion-off");
  motionButton.setAttribute("aria-pressed", String(off));
});

const stage = document.querySelector("[data-tilt]");
const floaters = document.querySelectorAll("[data-float]");

window.addEventListener("pointermove", (event) => {
  if (body.classList.contains("motion-off") || !stage) return;
  const x = (event.clientX / window.innerWidth - 0.5) * 2;
  const y = (event.clientY / window.innerHeight - 0.5) * 2;
  stage.style.transform = `rotateX(${y * -1.5}deg) rotateY(${x * 2}deg)`;
  floaters.forEach((el) => {
    const speed = Number(el.dataset.float || 0);
    el.style.translate = `${x * speed}px ${y * speed}px`;
  });
}, { passive: true });

const worlds = {
  chef: {
    image: "assets/dino-rib.jpg",
    alt: "Barbecue beef rib closeup",
    meta: "06h00 / 225 degrees / post oak",
    title: "Le Chef",
    copy: "The Dino rib gets logged like a lab report: six hours low, then higher until 208 inside, rested, judged, remembered."
  },
  prof: {
    image: "assets/lantern.svg",
    alt: "Green Lantern inspired symbol",
    meta: "French / linguistics / language acquisition",
    title: "Le Prof",
    copy: "His classroom theory is direct and generous: show up, participate, and every student can acquire another language."
  },
  family: {
    image: "assets/family-bottle-tree.jpg",
    alt: "The Fritz family at Elmer's Bottle Tree Ranch",
    meta: "Layla / Abner / Elias",
    title: "La Famille",
    copy: "A husband, a father, and a coach at heart. He left the tennis sideline so he could be present for the people at home."
  },
  road: {
    image: "assets/grand-staircase.jpg",
    alt: "Monsieur Fritz standing in a canyon landscape with arms open",
    meta: "Vegas / Bryce / Grand Canyon / Zion",
    title: "Grand Staircase",
    copy: "In 2025 the family completed the Grand Staircase, only out of order: Grand Canyon first, Bryce second, Zion last."
  },
  coach: {
    image: "assets/bryce-family.jpg",
    alt: "Family selfie in a canyon landscape",
    meta: "Varsity tennis / Troy / Little League",
    title: "Coach",
    copy: "Tennis followed him from Lewis & Clark to John Glenn, Diamond Ranch, and Troy. Coaching never really leaves; it just changes courts."
  },
  lantern: {
    image: "assets/hero-bbq-portrait.jpg",
    alt: "Monsieur Fritz enjoying barbecue ribs",
    meta: "Comics / sci-fi / anime / reading",
    title: "Green Lantern",
    copy: "A comics-and-sci-fi frequency runs under everything: curiosity, oath-level commitment, and a green accent that refuses to behave quietly."
  }
};

const worldImage = document.querySelector("#world-image");
const worldMeta = document.querySelector("#world-meta");
const worldTitle = document.querySelector("#world-title");
const worldCopy = document.querySelector("#world-copy");
const tabs = document.querySelectorAll(".world-tab");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const item = worlds[tab.dataset.world];
    if (!item) return;
    tabs.forEach((btn) => {
      btn.classList.remove("is-active");
      btn.setAttribute("aria-selected", "false");
    });
    tab.classList.add("is-active");
    tab.setAttribute("aria-selected", "true");

    worldImage.animate(
      [{ opacity: 0.35, transform: "scale(1.025)" }, { opacity: 1, transform: "scale(1)" }],
      { duration: body.classList.contains("motion-off") ? 1 : 320, easing: "ease-out" }
    );
    worldImage.src = item.image;
    worldImage.alt = item.alt;
    worldMeta.textContent = item.meta;
    worldTitle.textContent = item.title;
    worldCopy.textContent = item.copy;
  });
});

const closeCasefiles = (except) => {
  document.querySelectorAll("[data-casefile]").forEach((card) => {
    if (card !== except) {
      card.classList.remove("is-open");
      card.setAttribute("aria-pressed", "false");
    }
  });
};

const openCasefile = (card) => {
  closeCasefiles(card);
  card.classList.add("is-open");
  card.setAttribute("aria-pressed", "true");
};

document.querySelectorAll("[data-casefile]").forEach((card) => {
  card.addEventListener("click", () => {
    openCasefile(card);
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openCasefile(card);
    }
  });
});

document.querySelectorAll("[data-drag-scroll]").forEach((rail) => {
  let isDown = false;
  let startX = 0;
  let startScroll = 0;

  rail.addEventListener("pointerdown", (event) => {
    isDown = true;
    startX = event.clientX;
    startScroll = rail.scrollLeft;
    rail.classList.add("is-dragging");
    rail.setPointerCapture(event.pointerId);
  });

  rail.addEventListener("pointermove", (event) => {
    if (!isDown) return;
    rail.scrollLeft = startScroll - (event.clientX - startX);
  });

  const stop = () => {
    isDown = false;
    rail.classList.remove("is-dragging");
  };

  rail.addEventListener("pointerup", stop);
  rail.addEventListener("pointercancel", stop);
  rail.addEventListener("mouseleave", stop);
});
