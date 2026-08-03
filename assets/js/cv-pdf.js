(() => {
  const viewer = document.querySelector("[data-cv-pdf-viewer]");
  if (!viewer) return;

  const buttons = Array.from(viewer.querySelectorAll("[data-cv-language]"));
  const object = viewer.querySelector("[data-cv-object]");
  const openLink = viewer.querySelector("[data-cv-open]");
  const fallbackLink = viewer.querySelector("[data-cv-fallback]");
  const status = viewer.querySelector("[data-cv-status]");

  if (!buttons.length || !object || !openLink || !status) return;

  const activate = (button, updateHash = true) => {
    const source = button.dataset.cvSrc;
    const label = button.dataset.cvLabel;
    const language = button.dataset.cvLanguage;
    if (!source || !label) return;

    buttons.forEach((candidate) => {
      const active = candidate === button;
      candidate.classList.toggle("button-primary", active);
      candidate.setAttribute("aria-pressed", String(active));
    });

    object.setAttribute("data", `${source}#view=FitH`);
    object.setAttribute("aria-label", `Embedded ${label} PDF`);
    openLink.setAttribute("href", source);
    openLink.setAttribute("aria-label", `Open ${label} PDF in a new window`);
    fallbackLink?.setAttribute("href", source);
    status.textContent = label;
    if (updateHash && language) window.history.replaceState(null, "", `#${language}`);
  };

  viewer.addEventListener("click", (event) => {
    const button = event.target.closest("[data-cv-language]");
    if (button && viewer.contains(button)) activate(button);
  });

  const requestedLanguage = window.location.hash.slice(1);
  const initialButton = buttons.find((button) => button.dataset.cvLanguage === requestedLanguage) ?? buttons[0];
  activate(initialButton, false);
})();
