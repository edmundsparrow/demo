/**
 * hmenu.js — Shared Navigation for GNOKE College Attendance Register
 * Inject via <script src="../hmenu.js"></script> in each page's <body>
 */

(function () {
  const PAGES = [
    { id: 1, file: "attendance1", label: "Student Register",   icon: "📋", sub: "Individual records" },
    { id: 2, file: "attendance2", label: "Weekly Register",    icon: "📅", sub: "Class presence by week" },
    { id: 3, file: "attendance3", label: "Term Analysis",      icon: "📊", sub: "Master analytics" },
    { id: 4, file: "attendance4", label: "Session Register",   icon: "🕐", sub: "Daily AM/PM sessions" },
    { id: 5, file: "about",       label: "About",              icon: "ℹ️",  sub: "App info & updates" },
  ];

  // Detect current page from the folder name in the URL path
  // e.g. /attendance2/ → "attendance2"  |  /about/ → "about"
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const currentFile = pathParts[pathParts.length - 1] || "attendance1";

  // ─── Inject CSS ───────────────────────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    .hmenu-toggle {
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.2);
      color: white;
      width: 38px;
      height: 38px;
      border-radius: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      transition: background 0.15s;
      flex-shrink: 0;
    }
    .hmenu-toggle:hover { background: rgba(255,255,255,0.22); }

    .hmenu-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.45);
      z-index: 9998;
      backdrop-filter: blur(2px);
    }
    .hmenu-overlay.open { display: block; }

    .hmenu-drawer {
      position: fixed;
      top: 0;
      left: -300px;
      width: 270px;
      height: 100%;
      background: #111d15;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      transition: left 0.25s cubic-bezier(.4,0,.2,1);
      box-shadow: 4px 0 24px rgba(0,0,0,0.3);
    }
    .hmenu-drawer.open { left: 0; }

    .hmenu-head {
      padding: 1.4rem 1.2rem 1rem;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .hmenu-brand {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 3px;
      color: rgba(255,255,255,0.35);
      text-transform: uppercase;
    }
    .hmenu-app-name {
      font-size: 17px;
      font-weight: 800;
      color: white;
      margin-top: 2px;
    }

    .hmenu-nav { padding: 0.75rem 0; flex: 1; overflow-y: auto; }

    .hmenu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      cursor: pointer;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      color: rgba(255,255,255,0.6);
      text-decoration: none;
      transition: background 0.12s, color 0.12s;
      border-left: 3px solid transparent;
    }
    .hmenu-item:hover {
      background: rgba(255,255,255,0.06);
      color: rgba(255,255,255,0.9);
    }
    .hmenu-item.active {
      background: rgba(52,211,153,0.12);
      color: #34d399;
      border-left-color: #34d399;
    }

    .hmenu-icon { font-size: 20px; width: 28px; text-align: center; flex-shrink: 0; }

    .hmenu-item-label { font-size: 13px; font-weight: 700; display: block; }
    .hmenu-item-sub   { font-size: 10px; font-weight: 500; margin-top: 1px; opacity: 0.6; display: block; }

    .hmenu-divider {
      border: none;
      border-top: 1px solid rgba(255,255,255,0.08);
      margin: 6px 16px;
    }

    .hmenu-footer {
      padding: 1rem 1.2rem;
      border-top: 1px solid rgba(255,255,255,0.08);
      font-size: 10px;
      font-weight: 700;
      color: rgba(255,255,255,0.2);
      letter-spacing: 1px;
    }
  `;
  document.head.appendChild(style);

  // ─── Build DOM ────────────────────────────────────────────────────────────
  const overlay = document.createElement("div");
  overlay.className = "hmenu-overlay";
  overlay.onclick = close;

  // Separate main pages from utility pages (About) with a divider
  const mainPages    = PAGES.filter(p => p.id <= 4);
  const utilityPages = PAGES.filter(p => p.id >= 5);

  const drawer = document.createElement("div");
  drawer.className = "hmenu-drawer";
  drawer.innerHTML = `
    <div class="hmenu-head">
      <div class="hmenu-brand">GNOKE</div>
      <div class="hmenu-app-name">Attendance Register</div>
    </div>
    <nav class="hmenu-nav">
      ${mainPages.map(p => `
        <a class="hmenu-item ${p.file === currentFile ? 'active' : ''}" href="../${p.file}/">
          <span class="hmenu-icon">${p.icon}</span>
          <span class="hmenu-text">
            <span class="hmenu-item-label">${p.label}</span>
            <span class="hmenu-item-sub">${p.sub}</span>
          </span>
        </a>
      `).join("")}
      <hr class="hmenu-divider" />
      ${utilityPages.map(p => `
        <a class="hmenu-item ${p.file === currentFile ? 'active' : ''}" href="../${p.file}/">
          <span class="hmenu-icon">${p.icon}</span>
          <span class="hmenu-text">
            <span class="hmenu-item-label">${p.label}</span>
            <span class="hmenu-item-sub">${p.sub}</span>
          </span>
        </a>
      `).join("")}
    </nav>
    <div class="hmenu-footer">GNOKE COLLEGE ATTENDANCE SYSTEM</div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(drawer);

  // ─── Inject toggle button into existing header ────────────────────────────
  function injectToggle() {
    const header = document.querySelector("header");
    if (!header) return;

    header.style.display = "flex";
    header.style.alignItems = "center";

    const btn = document.createElement("button");
    btn.className = "hmenu-toggle";
    btn.setAttribute("aria-label", "Open navigation menu");
    btn.innerHTML = "☰";
    btn.onclick = open;

    // Insert as first child (left side of header)
    header.insertBefore(btn, header.firstChild);
  }

  function open()  { drawer.classList.add("open");  overlay.classList.add("open");  }
  function close() { drawer.classList.remove("open"); overlay.classList.remove("open"); }

  // Run after DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectToggle);
  } else {
    injectToggle();
  }
})();
