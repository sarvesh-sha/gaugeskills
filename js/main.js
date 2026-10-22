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

  /* --------------------------------------------------------- dropdown nav */

  // Desktop only. The mobile navigation uses native <details> elements, which
  // need no script at all.
  const dropdowns = select("[data-dropdown]").map((root) => {
    const toggle = root.querySelector("[data-dropdown-toggle]");
    const panel = root.querySelector("[data-dropdown-panel]");
    const chevron = root.querySelector("[data-dropdown-chevron]");
    return { root, toggle, panel, chevron };
  });

  if (dropdowns.length) {
    const setOpen = (entry, open) => {
      entry.panel.hidden = !open;
      entry.toggle.setAttribute("aria-expanded", String(open));
      entry.chevron?.classList.toggle("rotate-180", open);
    };

    const closeAll = (except) => {
      dropdowns.forEach((entry) => {
        if (entry !== except) setOpen(entry, false);
      });
    };

    dropdowns.forEach((entry) => {
      entry.toggle.addEventListener("click", () => {
        const open = entry.panel.hidden;
        closeAll(entry);
        setOpen(entry, open);
      });

      // Pointer users expect hover; keyboard users get click and Escape.
      entry.root.addEventListener("pointerenter", (event) => {
        if (event.pointerType !== "mouse") return;
        closeAll(entry);
        setOpen(entry, true);
      });

      entry.root.addEventListener("pointerleave", (event) => {
        if (event.pointerType !== "mouse") return;
        setOpen(entry, false);
      });

      entry.root.addEventListener("focusout", (event) => {
        if (!entry.root.contains(event.relatedTarget)) setOpen(entry, false);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      const open = dropdowns.find((entry) => !entry.panel.hidden);
      if (!open) return;
      setOpen(open, false);
      open.toggle.focus();
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest("[data-dropdown]")) closeAll();
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

  /* ------------------------------------------------------------- lead forms */

  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /**
   * Wire one lead form. If the form posts to an https endpoint (Web3Forms),
   * submit there and stay on the page. Otherwise open a mailto. A filled
   * honeypot (`website`) is treated as spam and acknowledged silently.
   *
   * @param {object} config
   * @param {string} config.formId
   * @param {string} config.successId
   * @param {string} config.titleId
   * @param {string} config.bodyId
   * @param {string} config.submitId
   * @param {string} config.errorId
   * @param {string} config.resetId
   * @param {string} config.submitLabel
   * @param {(data: Record<string, string>) => Record<string, string>} config.validate
   * @param {(data: Record<string, string>) => string} config.subject
   * @param {{posted: {title: string, body: string}, email: {title: string, body: string}}} config.messages
   */
  const bindLeadForm = ({
    formId,
    successId,
    titleId,
    bodyId,
    submitId,
    errorId,
    resetId,
    submitLabel,
    validate,
    subject,
    messages,
  }) => {
    const form = document.getElementById(formId);
    if (!form) return;

    const successPanel = document.getElementById(successId);
    const successTitle = document.getElementById(titleId);
    const successBody = document.getElementById(bodyId);
    const submitButton = document.getElementById(submitId);
    const failure = document.getElementById(errorId);

    const showError = (name, message) => {
      const target = form.querySelector(`[data-error-for="${name}"]`);
      if (!target) return;
      target.textContent = message;
      target.hidden = false;
    };

    const clearErrors = () => {
      form.querySelectorAll("[data-error-for]").forEach((element) => {
        element.hidden = true;
        element.textContent = "";
      });
      if (failure) failure.hidden = true;
    };

    const mailtoFor = (data) => {
      const lines = Object.entries(data)
        .filter(([key, value]) => key !== "website" && String(value).trim())
        .map(([key, value]) => `${key}: ${value}`);

      return `mailto:info@gaugeskills.com?subject=${encodeURIComponent(
        subject(data),
      )}&body=${encodeURIComponent(lines.join("\n"))}`;
    };

    const succeed = (mode) => {
      successTitle.textContent = messages[mode].title;
      successBody.textContent = messages[mode].body;
      form.hidden = true;
      successPanel.hidden = false;
      successPanel.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      clearErrors();

      const data = Object.fromEntries(new FormData(form));

      if (String(data.website ?? "").trim()) {
        form.reset();
        succeed("posted");
        return;
      }

      const errors = validate(data);

      if (Object.keys(errors).length) {
        Object.entries(errors).forEach(([name, message]) => showError(name, message));
        form.querySelector(`[name="${Object.keys(errors)[0]}"]`)?.focus();
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = "Sending…";

      const endpoint = form.getAttribute("action") ?? "";
      const remote = /^https:\/\//i.test(endpoint);

      try {
        if (remote) {
          const payload = Object.fromEntries(
            Object.entries(data).filter(
              ([key, value]) => key !== "website" && key !== "botcheck" && String(value).trim(),
            ),
          );
          payload.subject = subject(data);

          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(payload),
          });
          const result = await response.json().catch(() => ({}));
          if (!response.ok || result.success === false) {
            throw new Error(result.message || "Request failed");
          }
          form.reset();
          succeed("posted");
        } else {
          window.location.href = mailtoFor(data);
          form.reset();
          succeed("email");
        }
      } catch {
        if (failure) failure.hidden = false;
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = submitLabel;
      }
    });

    document.getElementById(resetId)?.addEventListener("click", () => {
      successPanel.hidden = true;
      form.hidden = false;
      form.querySelector("[name='name']")?.focus();
    });
  };

  bindLeadForm({
    formId: "demo-form",
    successId: "demo-success",
    titleId: "demo-success-title",
    bodyId: "demo-success-body",
    submitId: "demo-submit",
    errorId: "demo-error",
    resetId: "demo-reset",
    submitLabel: "Request a session",
    subject: (data) => `Demo request — ${data.institution}`,
    messages: {
      posted: {
        title: "Thank you — that has reached us.",
        body: "We will reply within two working days with a proposed time. If it is easier, write to us directly and we will pick it up from there.",
      },
      email: {
        title: "Your email client should be open.",
        body: "We could not send this from the page itself, so we have composed the message for you instead. Send it and we will reply within two working days.",
      },
    },
    validate: (data) => {
      const errors = {};
      if (!data.name?.trim()) errors.name = "Please tell us who you are.";
      if (!EMAIL.test(data.email ?? "")) errors.email = "Enter an email we can reply to.";
      if (!data.institution?.trim()) errors.institution = "Which school, college or organization?";
      if (!data.organizationType) errors.organizationType = "Pick the closest type.";
      if (!data.role) errors.role = "Pick the closest role.";
      return errors;
    },
  });

  bindLeadForm({
    formId: "contact-form",
    successId: "contact-success",
    titleId: "contact-success-title",
    bodyId: "contact-success-body",
    submitId: "contact-submit",
    errorId: "contact-error",
    resetId: "contact-reset",
    submitLabel: "Send message",
    subject: (data) => `Contact — ${data.name}`,
    messages: {
      posted: {
        title: "Thank you — that has reached us.",
        body: "We will reply within two working days. If it is easier, write to us directly and we will pick it up from there.",
      },
      email: {
        title: "Your email client should be open.",
        body: "We could not send this from the page itself, so we have composed the message for you instead. Send it and we will reply within two working days.",
      },
    },
    validate: (data) => {
      const errors = {};
      if (!data.name?.trim()) errors.name = "Please tell us who you are.";
      if (!EMAIL.test(data.email ?? "")) errors.email = "Enter an email we can reply to.";
      if (!data.message?.trim()) errors.message = "Tell us what you would like to talk about.";
      return errors;
    },
  });

  /* ----------------------------------------------------------------- misc */

  select("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
})();
