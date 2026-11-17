// Ao ATUALIZAR (F5) qualquer página interna, volta para a página principal.
(function () {
  const nav = performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
  if (nav && nav.type === "reload") location.replace("index.html");
})();
