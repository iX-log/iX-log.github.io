(function () {
  const storageKey = "ix_theme";

  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    const btn = document.getElementById("theme-toggle");
    if (btn) btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  }

  function getInitialTheme() {
    const saved = localStorage.getItem(storageKey);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  const initial = getInitialTheme();
  applyTheme(initial);

  window.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("theme-toggle");
    if (toggle) {
      toggle.addEventListener("click", () => {
        const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
        localStorage.setItem(storageKey, next);
        applyTheme(next);
      });
    }

    // Optional: mailto composer for the contact form (static)
    const form = document.getElementById("contact-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = form.querySelector("[name='name']")?.value?.trim() || "";
        const email = form.querySelector("[name='email']")?.value?.trim() || "";
        const subject = form.querySelector("[name='subject']")?.value?.trim() || "Website contact";
        const message = form.querySelector("[name='message']")?.value?.trim() || "";
        const body =
          `Hi Ixhen,%0D%0A%0D%0A` +
          (message ? `${encodeURIComponent(message)}%0D%0A%0D%0A` : "") +
          `— ${encodeURIComponent(name)}%0D%0A${encodeURIComponent(email)}`;

        window.location.href = `mailto:ixhen.dev@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
      });
    }
  });
})();