# Keyboard Navigation Utility

A standalone **vanilla JavaScript** utility that enables keyboard‑only navigation between headers, links, and semantic landmarks, with directional control, dynamic‑DOM support, and accessible highlighting.

---

## Features

- **Hotkey Navigation**
  - `H` → move focus to the next header (`<h1>`–`<h6>`)
  - `L` → move focus to the next link (`<a>`)
  - `M` → move focus to the next landmark (`<nav>`, `<main>`, `<form>`, etc.)
- **Directional Control**
  - `↑` sets backward mode
  - `↓` sets forward mode
- **Dynamic DOM Support** via `MutationObserver`
- **Automatic Focusability** by injecting `tabindex="-1"` on non‑focusable elements
- **Accessible Highlight**: high‑contrast outline & translucent background
- **Responsive Demo**: two‑column desktop layout, stacked mobile
- **No External Libraries**: pure JS, zero runtime dependencies
- **Customizable**: returns a `teardown()` method, configurable highlight styles & debounce timing

---

## Quick Start

1. **Clone the repo**
   git clone https://github.com/FemiElu/keyboard-navigation-task.git
   cd keyboard-navigation-task

2. **Install dev dependencies**
   npm install

3. **Serve the demo**
   npm install -g serve # if not already installed
   serve .

4. **Inject & initialize**
   <script src="navigationAZ.js"></script>
   <script>
     // Initialize keyboard navigation
     const teardown = initKeyboardNav();
   </script>

5. **Optional teardown**
   teardown(); // removes listeners, observers, and injected styles

## How the Script Works

Scan Elements
On load—and on each navigation key press or DOM mutation—the script queries:

All headers (h1–h6)

All links (<a>)

All semantic landmarks (nav, main, aside, form, header, footer, section) and elements with ARIA landmark roles

Maintain State

currentType: 'H', 'L', or 'M'

currentIndex: pointer in the current element list

direction: +1 (forward) or -1 (backward)

Keyboard Handlers

ArrowUp/Down: set direction

H/L/M:

Re‑scan elements

Reset pointer if switching type

Advance pointer by direction, wrap around

Programmatically focus the element, inject tabindex="-1" if needed

Apply high‑contrast highlight CSS and smooth scroll into view

Dynamic DOM

A MutationObserver watches for additions/removals in the document body and re‑scans elements automatically.

Immediate re‑scan on hotkey press ensures newly added items are navigable without delay.

Cleanup

teardown() removes all event listeners, disconnects the observer, and strips injected styles.

## Assumptions Made

Initial Focus: The <body> is focused at start so key events fire globally.

Landmark Types: We treat only semantic HTML5 elements and standard ARIA roles as landmarks.

Debounce Timing: 100 ms debounce avoids excessive scanning under rapid DOM changes.

Single Function Export: All logic encapsulated in initKeyboardNav() for easy injection.

## Accessibility

High‑Contrast Highlight: Gold outline (#FFD700) + translucent background ensures > 4.5:1 contrast.

ARIA Roles: Landmarks include ARIA roles (banner, navigation, main, etc.).

Focus Management: Elements not normally focusable receive tabindex="-1".

Form Exclusion: When focus is inside an <input>, <textarea>, or <select>, hotkeys are ignored to avoid disrupting native typing.

Smooth Scrolling: Ensures the focused element is centered in viewport.

## Testing

npm test

Environment: Jest + JSDOM + Testing Library

Coverage: ≥ 80% for statements, branches, functions, and lines

Automated Specs cover:

Hotkey navigation (H, L, M)

Direction toggling (↑/↓)

Dynamic DOM reactivity

Form‑field exclusion

Landmarks focus

## Demo Controls & Manual Verification

On demo.html you’ll find a Control Panel:

Add Header / Add Link / Add Landmark

Remove Last Added

Test Flow:

Click Add Header, then press H multiple times to see the new header focused.

Likewise for L and M with links and landmarks.

Click Remove Last Added and verify navigation skips removed elements.

## Project Structure

keyboard-navigation-task/
├── demo.html  
├── styles.css  
├── navigationAZ.js  
├── README.md  
├── package.json  
├── jest.config.mjs  
└── **tests**/keyboardNav.test.js

Thank you for reviewing!
I look forward to your feedback.
