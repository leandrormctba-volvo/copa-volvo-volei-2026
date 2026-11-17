// Coisas comuns a todas as páginas:
//  1) bola oficial (foto) nos lugares marcados com data-bola
//  2) aurora animada no fundo das áreas .fundo-volei
//  3) logo da Associação Volvo como marca d'água

document.querySelectorAll("[data-bola]").forEach(el => {
  el.innerHTML = '<span class="bola-foto" style="width:100%;height:100%"></span>';
});

document.querySelectorAll(".fundo-volei").forEach(el => {
  el.insertAdjacentHTML("afterbegin",
    '<span class="aurora a1"></span><span class="aurora a2"></span><span class="aurora a3"></span>');
});

(function () {
  const claro = document.body.classList.contains("claro");
  const logo = document.createElement("img");
  logo.className = "marca-dagua";
  logo.src = claro ? "img/logo-teal.png" : "img/logo-branco.png";
  logo.alt = "";
  document.body.appendChild(logo);
})();
