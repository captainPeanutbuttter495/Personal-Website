// src/utils/navigate.js
export function navigateTo(route) {
  const base = import.meta.env.BASE_URL || "/";

  // ensure no leading/trailing slash issues
  const cleanRoute = String(route || "").replace(/^\/+/, "");
  const cleanBase = String(base || "/").replace(/\/+$/, "/");

  const nextUrl = `${cleanBase}${cleanRoute}`;

  // Update URL without a full reload
  window.history.pushState({}, "", nextUrl);

  // Tell App.jsx to re-read window.location.pathname and re-render
  window.dispatchEvent(new Event("app:navigate"));
}
