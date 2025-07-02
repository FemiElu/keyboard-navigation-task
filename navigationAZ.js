/**
 * initKeyboardNav()
 * It's a function that enables keyboard-only navigation for headers (H), links (L), and landmarks (M)
 * with directional control via ArrowUp (backward) and ArrowDown (forward).
 * It returns a cleanup function to remove all listeners/observers.
 */
function initKeyboardNav() {
  const HIGHLIGHT_CLASS = "kbnav-highlight";

  let headers = [],
    links = [],
    landmarks = [];
  let currentType = null; // 'H' | 'L' | 'M'
  let currentIndex = 0; // pointer in current list
  let direction = 1; //  1 = forward, -1 = backward
  let prevEl = null; // last highlighted element

  // Injecting style
  const styleTag = document.createElement("style");
  styleTag.textContent = `
      .${HIGHLIGHT_CLASS} {
        outline: 3px solid #FFD700 !important;
        background: rgba(255, 215, 0, 0.2) !important;
      }
    `;
  document.head.appendChild(styleTag);

  // Utility functions
  function scanElements() {
    headers = Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6"));
    links = Array.from(document.querySelectorAll("a"));
    landmarks = Array.from(
      document.querySelectorAll(
        "nav,main,aside,form,header,footer,section," +
          "[role=banner],[role=navigation],[role=main],[role=complementary],[role=form],[role=contentinfo]"
      )
    );
  }

  function makeFocusable(el) {
    if (!el.hasAttribute("tabindex")) {
      el.setAttribute("tabindex", "-1");
    }
  }

  function clearHighlight() {
    if (prevEl) {
      prevEl.classList.remove(HIGHLIGHT_CLASS);
      prevEl = null;
    }
  }

  function focusElement(el) {
    clearHighlight();
    makeFocusable(el);
    el.focus({ preventScroll: true });
    el.classList.add(HIGHLIGHT_CLASS);
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    prevEl = el;
  }

  function movePointer(list) {
    if (!list.length) return;
    currentIndex = (currentIndex + direction + list.length) % list.length;
    focusElement(list[currentIndex]);
  }

  function handleNavKey(type) {
    if (
      ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)
    )
      return;

    scanElements();

    if (currentType !== type) {
      currentType = type;
      currentIndex = direction > 0 ? -1 : listLength(type);
    }
    movePointer(getList(type));
  }

  function listLength(type) {
    return getList(type).length;
  }
  function getList(type) {
    return type === "H"
      ? headers
      : type === "L"
      ? links
      : type === "M"
      ? landmarks
      : [];
  }

  // Event handling
  function onKeyDown(e) {
    const key = e.key.toUpperCase();
    if (key === "ARROWUP") {
      direction = -1;
      return;
    }
    if (key === "ARROWDOWN") {
      direction = 1;
      return;
    }
    if (key === "H") return handleNavKey("H");
    if (key === "L") return handleNavKey("L");
    if (key === "M") return handleNavKey("M");
  }

  // Dynamic DOM support
  const mo = new MutationObserver(debounce(() => scanElements(), 100));
  mo.observe(document.body, { childList: true, subtree: true });

  // Initialization & Cleanup
  scanElements();
  document.addEventListener("keydown", onKeyDown);

  return function teardown() {
    document.removeEventListener("keydown", onKeyDown);
    mo.disconnect();
    clearHighlight();
    styleTag.remove();
  };

  // Helper: debounce
  function debounce(fn, ms) {
    let timer = null;
    return () => {
      if (!timer) {
        fn();
      }
      // Claering any existing timer and start a new one
      clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
      }, ms);
    };
  }
}

export { initKeyboardNav };
