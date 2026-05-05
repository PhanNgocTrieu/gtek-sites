export default function ThemeScript() {
  const script = `
    (function() {
      try {
        var stored = localStorage.getItem('theme');
        var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var mode = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
        var resolved = mode === 'system' ? (systemDark ? 'dark' : 'light') : mode;
        var root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(resolved);
        root.style.colorScheme = resolved;
        root.setAttribute('data-theme-mode', mode);
      } catch (e) {}
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
