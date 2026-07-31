(() => {
  const viewport = document.querySelector("[data-updates-viewport]");
  if (!viewport) return;

  const controls = document.querySelector(".update-controls");
  const items = Array.from(viewport.querySelectorAll(".update-item"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!controls || items.length < 2 || reduceMotion.matches) {
    controls?.setAttribute("hidden", "");
    return;
  }

  const toggle = controls.querySelector('[data-update-action="toggle"]');
  let currentIndex = 0;
  let paused = false;
  let timer;

  const nearestIndex = () => {
    const top = viewport.scrollTop;
    return items.reduce((best, item, index) => {
      const currentDistance = Math.abs(item.offsetTop - top);
      const bestDistance = Math.abs(items[best].offsetTop - top);
      return currentDistance < bestDistance ? index : best;
    }, 0);
  };

  const show = (index) => {
    currentIndex = (index + items.length) % items.length;
    viewport.scrollTo({ top: items[currentIndex].offsetTop, behavior: "smooth" });
  };

  const stopTimer = () => window.clearInterval(timer);
  const startTimer = () => {
    stopTimer();
    if (!paused && !document.hidden) timer = window.setInterval(() => show(currentIndex + 1), 5000);
  };

  const setPaused = (nextPaused) => {
    paused = nextPaused;
    toggle.textContent = paused ? "Play" : "Pause";
    toggle.setAttribute("aria-pressed", String(paused));
    startTimer();
  };

  controls.addEventListener("click", (event) => {
    const action = event.target.closest("button")?.dataset.updateAction;
    if (!action) return;
    currentIndex = nearestIndex();
    if (action === "previous") show(currentIndex - 1);
    if (action === "next") show(currentIndex + 1);
    if (action === "toggle") setPaused(!paused);
    startTimer();
  });

  viewport.addEventListener("mouseenter", stopTimer);
  viewport.addEventListener("mouseleave", startTimer);
  viewport.addEventListener("focusin", stopTimer);
  viewport.addEventListener("focusout", startTimer);
  viewport.addEventListener("scroll", () => {
    currentIndex = nearestIndex();
  });
  document.addEventListener("visibilitychange", startTimer);
  reduceMotion.addEventListener("change", () => {
    if (reduceMotion.matches) {
      stopTimer();
      controls.setAttribute("hidden", "");
    }
  });

  startTimer();
})();
