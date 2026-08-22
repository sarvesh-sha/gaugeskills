(() => {
  "use strict";

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const prefersReducedMotion = () => motionQuery.matches;

  /**
   * Runs `onEnter` the first time each element scrolls into view, then stops
   * watching it. Falls back to running immediately where IntersectionObserver
   * is unavailable, so nothing is left in its hidden starting state.
   */
  const observeOnce = (elements, onEnter, rootMargin = "0px") => {
    if (!elements.length) return;

    if (!("IntersectionObserver" in window)) {
      elements.forEach(onEnter);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          onEnter(entry.target);
        });
      },
      { rootMargin },
    );

    elements.forEach((element) => observer.observe(element));
  };

  const select = (selector) => Array.from(document.querySelectorAll(selector));

  /* ---------------------------------------------------------------- header */

  const header = document.getElementById("site-header");

  if (header) {
    const syncHeader = () => {
      const scrolled = window.scrollY > 12;
      header.classList.toggle("border-hairline", scrolled);
      header.classList.toggle("shadow-soft", scrolled);
      header.classList.toggle("border-transparent", !scrolled);
    };

    syncHeader();
    window.addEventListener("scroll", syncHeader, { passive: true });
  }

  /* ------------------------------------------------------------ mobile nav */

  const navToggle = document.getElementById("nav-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  if (navToggle && mobileNav) {
    const topBar = document.querySelector('[data-nav-bar="top"]');
    const middleBar = document.querySelector('[data-nav-bar="middle"]');
    const bottomBar = document.querySelector('[data-nav-bar="bottom"]');

    const setNavOpen = (open) => {
      mobileNav.hidden = !open;
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.style.overflow = open ? "hidden" : "";

      topBar.classList.toggle("top-0", !open);
      topBar.classList.toggle("top-1.5", open);
      topBar.classList.toggle("rotate-45", open);

      middleBar.classList.toggle("opacity-100", !open);
      middleBar.classList.toggle("opacity-0", open);

      bottomBar.classList.toggle("top-3", !open);
      bottomBar.classList.toggle("top-1.5", open);
      bottomBar.classList.toggle("-rotate-45", open);
    };

    navToggle.addEventListener("click", () => {
      setNavOpen(mobileNav.hidden);
    });

    mobileNav.addEventListener("click", (event) => {
      if (event.target.closest("a")) setNavOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !mobileNav.hidden) {
        setNavOpen(false);
        navToggle.focus();
      }
    });

    window.matchMedia("(min-width: 64rem)").addEventListener("change", (event) => {
      if (event.matches && !mobileNav.hidden) setNavOpen(false);
    });
  }

  /* ------------------------------------------------- scroll-in transitions */

  observeOnce(
    select("[data-reveal], [data-rise]"),
    (element) => element.classList.add("is-revealed"),
    "-80px",
  );

  observeOnce(
    select("[data-bar]"),
    (element) => element.classList.add("is-filled"),
    "0px 0px -40px 0px",
  );

  /* -------------------------------------------------------- audience tabs */

  const tabs = select("[data-audience-tab]");
  const panels = select("[data-audience-panel]");

  if (tabs.length && panels.length) {
    const selectedClasses = ["bg-ink", "text-white", "shadow-soft"];
    const unselectedClasses = [
      "border",
      "border-hairline",
      "bg-white",
      "text-slate-body",
      "hover:border-teal",
      "hover:text-teal",
    ];

    const activate = (id, { moveFocus = false } = {}) => {
      tabs.forEach((tab) => {
        const active = tab.dataset.audienceTab === id;

        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
        tab.classList.remove(...(active ? unselectedClasses : selectedClasses));
        tab.classList.add(...(active ? selectedClasses : unselectedClasses));

        if (active && moveFocus) tab.focus();
      });

      panels.forEach((panel) => {
        const active = panel.dataset.audiencePanel === id;

        panel.hidden = !active;
        panel.removeAttribute("data-panel-enter");

        if (active && !prefersReducedMotion()) {
          void panel.offsetWidth; // restart the enter animation
          panel.setAttribute("data-panel-enter", "");
        }
      });
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => activate(tab.dataset.audienceTab));
    });

    const tablist = tabs[0].parentElement;

    tablist.addEventListener("keydown", (event) => {
      const offsets = { ArrowRight: 1, ArrowLeft: -1 };
      const current = tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true");
      let next = -1;

      if (event.key in offsets) next = (current + offsets[event.key] + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next === -1) return;

      event.preventDefault();
      activate(tabs[next].dataset.audienceTab, { moveFocus: true });
    });
  }

  /* ------------------------------------------------------ tutor transcript */

  const tutorCard = document.getElementById("tutor-card");
  const tutorPrompt = document.getElementById("tutor-prompt");
  const tutorCaret = document.getElementById("tutor-caret");
  const tutorThinking = document.getElementById("tutor-thinking");
  const tutorReply = document.getElementById("tutor-reply");

  if (tutorCard && tutorPrompt && tutorCaret && tutorThinking && tutorReply && !prefersReducedMotion()) {
    const collapse = (text) => text.replace(/\s+/g, " ").trim();

    const promptText = collapse(tutorPrompt.textContent);
    const replyWords = collapse(tutorReply.textContent).split(" ");

    const streamReply = () => {
      tutorThinking.hidden = true;
      tutorReply.hidden = false;
      tutorReply.textContent = "";

      let spoken = 0;
      const streamer = setInterval(() => {
        spoken += 1;
        tutorReply.textContent = replyWords.slice(0, spoken).join(" ");
        if (spoken >= replyWords.length) clearInterval(streamer);
      }, 42);
    };

    const typePrompt = () => {
      tutorPrompt.textContent = "";
      tutorReply.hidden = true;
      tutorCaret.hidden = false;

      let typed = 0;
      const typer = setInterval(() => {
        typed += 1;
        tutorPrompt.textContent = promptText.slice(0, typed);
        if (typed < promptText.length) return;

        clearInterval(typer);
        tutorCaret.hidden = true;
        tutorThinking.hidden = false;
        setTimeout(streamReply, 900);
      }, 24);
    };

    observeOnce([tutorCard], typePrompt, "-120px");
  }

  /* ------------------------------------------------------------ demo form */

  // POST target for the demo form. There is no server behind a static build,
  // so while this is empty the form composes an email instead.
  const FORM_ENDPOINT = "";

  const demoForm = document.getElementById("demo-form");

  if (demoForm) {
    const successPanel = document.getElementById("demo-success");
    const successTitle = document.getElementById("demo-success-title");
    const successBody = document.getElementById("demo-success-body");
    const submitButton = document.getElementById("demo-submit");
    const failure = document.getElementById("demo-error");

    const messages = {
      posted: {
        title: "Thank you — that has reached us.",
        body: "We will reply within two working days with a proposed time. If it is easier, write to us directly and we will pick it up from there.",
      },
      email: {
        title: "Your email client should be open.",
        body: "We could not send this from the page itself, so we have composed the message for you instead. Send it and we will reply within two working days.",
      },
    };

    const showError = (name, message) => {
      const target = demoForm.querySelector(`[data-error-for="${name}"]`);
      if (!target) return;
      target.textContent = message;
      target.hidden = false;
    };

    const clearErrors = () => {
      demoForm.querySelectorAll("[data-error-for]").forEach((element) => {
        element.hidden = true;
        element.textContent = "";
      });
      failure.hidden = true;
    };

    const validate = (data) => {
      const errors = {};
      if (!data.name?.trim()) errors.name = "Please tell us who you are.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email ?? "")) {
        errors.email = "Enter an email we can reply to.";
      }
      if (!data.institution?.trim()) errors.institution = "Which college or university?";
      if (!data.role) errors.role = "Pick the closest role.";
      return errors;
    };

    const mailtoFor = (data) => {
      const lines = Object.entries(data)
        .filter(([, value]) => String(value).trim())
        .map(([key, value]) => `${key}: ${value}`);

      return `mailto:hello@gaugeskills.com?subject=${encodeURIComponent(
        `Pilot request — ${data.institution}`,
      )}&body=${encodeURIComponent(lines.join("\n"))}`;
    };

    const succeed = (mode) => {
      successTitle.textContent = messages[mode].title;
      successBody.textContent = messages[mode].body;
      demoForm.hidden = true;
      successPanel.hidden = false;
      successPanel.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    demoForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      clearErrors();

      const data = Object.fromEntries(new FormData(demoForm));
      const errors = validate(data);

      if (Object.keys(errors).length) {
        Object.entries(errors).forEach(([name, message]) => showError(name, message));
        demoForm.querySelector(`[name="${Object.keys(errors)[0]}"]`)?.focus();
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = "Sending…";

      try {
        if (FORM_ENDPOINT) {
          const response = await fetch(FORM_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (!response.ok) throw new Error("Request failed");
          demoForm.reset();
          succeed("posted");
        } else {
          window.location.href = mailtoFor(data);
          demoForm.reset();
          succeed("email");
        }
      } catch {
        failure.hidden = false;
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Request a session";
      }
    });

    document.getElementById("demo-reset")?.addEventListener("click", () => {
      successPanel.hidden = true;
      demoForm.hidden = false;
      demoForm.querySelector("[name='name']")?.focus();
    });
  }

  /* ----------------------------------------------------------------- misc */

  select("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
})();
