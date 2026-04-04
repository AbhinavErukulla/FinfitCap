(function (global) {
  function currentPage() {
    const path = window.location.pathname.replace(/.*\//, '') || 'index.html';
    return path;
  }

  function requireAuth() {
    if (!FindItApi.getToken()) {
      window.location.href = '/login.html';
      return false;
    }
    return true;
  }

  function logout() {
    FindItApi.setToken(null);
    window.location.href = '/login.html';
  }

  global.FindItLayout = { currentPage, requireAuth, logout };
})(window);
