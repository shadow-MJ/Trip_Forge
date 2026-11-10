const THEME_STORAGE_KEY = 'tripforge_theme';

export function getSavedTheme() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
  } catch {
    // Ignore storage access errors in restricted environments
  }
  return 'light';
}

export function applyTheme(theme) {
  const normalized = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', normalized);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, normalized);
  } catch {
    // Ignore storage access errors
  }
  return normalized;
}

export function initTheme() {
  const theme = getSavedTheme();
  applyTheme(theme);
  return theme;
}

