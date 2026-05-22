(function () {
  try {
    var t = localStorage.getItem('theme-preview');
    if (t) {
      if (t !== 'dark') {
        document.documentElement.setAttribute('data-theme', t);
      }
    } else if (location.hostname.indexOf('greg.') === 0) {
      document.documentElement.setAttribute('data-theme', 'light-greg');
    }
  } catch (e) {}
})();
