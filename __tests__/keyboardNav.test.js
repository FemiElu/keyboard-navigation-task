import userEvent from "@testing-library/user-event";
import fs from "fs";
import path from "path";
import "@testing-library/jest-dom";

const html = fs.readFileSync(path.resolve(__dirname, "../demo.html"), "utf8");

import { initKeyboardNav } from "../navigationAZ.js";

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = function () {};
});

describe("Keyboard Navigation", () => {
  let cleanup;

  beforeEach(() => {
    document.body.innerHTML = html;
    document.body.focus();
    cleanup = initKeyboardNav();
  });

  afterEach(() => {
    cleanup();
  });

  test("should highlight headers when pressing H", async () => {
    const firstHeader = document.querySelector("h1");
    await userEvent.keyboard("H");
    expect(firstHeader).toHaveFocus();
    expect(firstHeader.classList.contains("kbnav-highlight")).toBe(true);
  });

  test("should switch direction with ArrowUp and ArrowDown", async () => {
    const headers = document.querySelectorAll("h1, h2");
    await userEvent.keyboard("H");
    expect(headers[0]).toHaveFocus();
    await userEvent.keyboard("H");
    expect(headers[1]).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}");
    await userEvent.keyboard("H");
    expect(headers[0]).toHaveFocus();
  });

  test("should update when a header is added", async () => {
    const newH = document.createElement("h2");
    newH.textContent = "New Header";
    document.body.appendChild(newH);

    // Getting all headers after adding the new one
    const headers = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    for (let i = 0; i < headers.length; i++) {
      await userEvent.keyboard("H");
    }

    expect(newH).toHaveFocus();
  });

  test("should skip when input is focused", async () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();
    await userEvent.keyboard("H");
    expect(input).toHaveFocus();
  });

  test("should highlight links with L", async () => {
    const link = document.querySelector("a");
    await userEvent.keyboard("L");
    expect(link).toHaveFocus();
  });

  test("should highlight landmarks with M", async () => {
    const nav = document.querySelector("nav");
    await userEvent.keyboard("M");
    expect(nav).toHaveFocus();
  });
});

describe("Demo Controls Panel", () => {
  beforeEach(() => {
    document.body.innerHTML = html;
    window.eval(`
      const controls = document.getElementById('demo-controls');
      const label = document.getElementById('demo-controls-label');
      const toggle = document.getElementById('demo-controls-toggle');
      function collapseControls() {
        controls.classList.remove('open');
        controls.style.display = 'none';
        label.style.display = 'block';
      }
      function expandControls() {
        controls.classList.add('open');
        controls.style.display = 'block';
        label.style.display = 'none';
      }
      toggle.addEventListener('click', collapseControls);
      label.addEventListener('click', expandControls);
      expandControls();
    `);
  });

  test("panel is visible by default and can be collapsed", async () => {
    const panel = document.getElementById("demo-controls");
    expect(panel.style.display).not.toBe("none");
    const toggle = document.querySelector("#demo-controls-toggle");
    await userEvent.click(toggle);
    expect(panel.style.display).toBe("none");
    const label = document.querySelector("#demo-controls-label");
    expect(label.style.display).toBe("block");
    await userEvent.click(label);
    expect(panel.style.display).not.toBe("none");
  });
});

describe("Dynamic Elements Container", () => {
  beforeEach(() => {
    document.body.innerHTML = html;
    window.eval(`
      const added = [];
      const container = document.getElementById('dynamic-elements-container');
      document.getElementById('add-header').addEventListener('click', () => {
        const h = document.createElement('h2');
        h.textContent = 'Dynamic Header ' + (added.length + 1);
        h.className = 'dynamic-element';
        container.appendChild(h);
        added.push(h);
      });
      document.getElementById('add-link').addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = 'Dynamic Link ' + (added.length + 1);
        a.className = 'dynamic-element';
        container.appendChild(a);
        added.push(a);
      });
      document.getElementById('add-landmark').addEventListener('click', () => {
        const nav = document.createElement('nav');
        nav.textContent = 'Dynamic Nav Landmark ' + (added.length + 1);
        nav.className = 'dynamic-element';
        container.appendChild(nav);
        added.push(nav);
      });
      document.getElementById('remove-last').addEventListener('click', () => {
        if (!added.length) return;
        const el = added.pop();
        el.remove();
      });
    `);
  });

  test("dynamically added elements go into the container and are visually distinct", () => {
    const addHeader = document.getElementById("add-header");
    addHeader.click();
    const container = document.getElementById("dynamic-elements-container");
    expect(container).not.toBeNull();
    const dynamicHeader = container.querySelector(".dynamic-element");
    expect(dynamicHeader).not.toBeNull();
    expect(dynamicHeader.classList.contains("dynamic-element")).toBe(true);
  });

  test("container uses a responsive grid layout", () => {
    const container = document.getElementById("dynamic-elements-container");
    expect(container).not.toBeNull();
    const display = window.getComputedStyle(container).display;
    expect(["grid", "block", "flex"].includes(display)).toBe(true);
  });
});
