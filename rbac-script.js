// ============================================================
// CQPortal RBAC Redesign — Shared JavaScript
// Theme toggle, tab switching, collapsible sections
// ============================================================

(function() {
  'use strict';

  // -- Theme Management --
  const STORAGE_KEY = 'cq-rbac-theme';

  function getStoredTheme() {
    try { return localStorage.getItem(STORAGE_KEY); } catch(e) { return null; }
  }

  function setStoredTheme(theme) {
    try { localStorage.setItem(STORAGE_KEY, theme); } catch(e) {}
  }

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateToggleIcon(theme);
  }

  function updateToggleIcon(theme) {
    const toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach(function(toggle) {
      const sunIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
      const moonIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      toggle.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
      toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    });
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || getSystemTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setStoredTheme(next);
  }

  // Init theme as early as possible
  const stored = getStoredTheme();
  if (stored) {
    applyTheme(stored);
  } else {
    applyTheme(getSystemTheme());
  }

  // Listen for system theme changes (only if user hasn't set a preference)
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      if (!getStoredTheme()) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    // Wire up theme toggles
    document.querySelectorAll('.theme-toggle').forEach(function(toggle) {
      toggle.addEventListener('click', toggleTheme);
    });

    // Tab switching
    document.querySelectorAll('.tab').forEach(function(tab) {
      tab.addEventListener('click', function() {
        const tabGroup = tab.closest('.tab-group');
        if (!tabGroup) return;
        tabGroup.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
        tab.classList.add('active');
        const targetId = tab.getAttribute('data-tab');
        tabGroup.querySelectorAll('.tab-panel').forEach(function(panel) {
          panel.classList.toggle('active', panel.getAttribute('data-panel') === targetId);
        });
      });
    });

    // Collapsible perm domains
    document.querySelectorAll('.perm-domain-header').forEach(function(header) {
      header.addEventListener('click', function() {
        const body = header.nextElementSibling;
        if (!body) return;
        const isOpen = body.style.display !== 'none';
        body.style.display = isOpen ? 'none' : 'block';
        const arrow = header.querySelector('.perm-toggle-arrow');
        if (arrow) arrow.textContent = isOpen ? '[+]' : '[-]';
      });
    });
  });
})();