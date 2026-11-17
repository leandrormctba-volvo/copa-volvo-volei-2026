// Coisas comuns a todas as páginas:
//  1) bola oficial (foto) nos lugares marcados com data-bola,
//     recolorida: gomos azuis -> neon (cor do "2026"), gomos amarelos -> branco
//  2) aurora animada no fundo das áreas .fundo-volei
//  3) logo da Associação Volvo como marca d'água

// Foto: "Wedstrijdbal EGLF4 1.jpg" – TOPCyber – Wikimedia Commons – CC BY-SA 4.0
const BOLA_FOTO = "https://commons.wikimedia.org/wiki/Special:FilePath/Wedstrijdbal_EGLF4_1.jpg?width=900";
const COR_NEON  = [120, 228, 245];   // mesmo tom neon do "2026"
const COR_CLARA = [246, 250, 251];   // branco gelo

document.querySelectorAll("[data-bola]").forEach(el => {
  el.innerHTML = '<span class="bola-foto" style="width:100%;height:100%"></span>';
});

function recolorirBola(img) {
  const w = img.naturalWidth, h = img.naturalHeight;
  const cx = .4917 * w, cy = .5125 * h, r = .2729 * w, S = 400;   // recorte só da bola
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const x = c.getContext("2d");
  x.drawImage(img, cx - r, cy - r, 2 * r, 2 * r, 0, 0, S, S);
  const dados = x.getImageData(0, 0, S, S), d = dados.data;
  for (let i = 0; i < d.length; i += 4) {
    const R = d[i], G = d[i + 1], B = d[i + 2];
    const mx = Math.max(R, G, B), mn = Math.min(R, G, B);
    if (!mx || (mx - mn) / mx < .35) continue;           // ignora branco, preto e cinza
    let mat;
    if (mx === R) mat = 60 * (((G - B) / (mx - mn)) % 6);
    else if (mx === G) mat = 60 * ((B - R) / (mx - mn) + 2);
    else mat = 60 * ((R - G) / (mx - mn) + 4);
    if (mat < 0) mat += 360;
    const L = (.299 * R + .587 * G + .114 * B) / 255;    // mantém luz e sombra da foto
    let cor, t;
    if (mat > 185 && mat < 300)     { cor = COR_NEON;  t = Math.min(1.12, Math.max(.25, L / .26)); }
    else if (mat > 25 && mat < 75)  { cor = COR_CLARA; t = Math.min(1.06, Math.max(.3, L / .80)); }
    else continue;
    d[i] = Math.min(255, cor[0] * t);
    d[i + 1] = Math.min(255, cor[1] * t);
    d[i + 2] = Math.min(255, cor[2] * t);
  }
  x.putImageData(dados, 0, 0);
  return c.toDataURL("image/jpeg", .9);
}

(function carregarBola() {
  const aplicar = url => {
    document.documentElement.style.setProperty("--bola-img", "url(" + url + ")");
    document.documentElement.classList.add("bola-pronta");
  };
  let salva = null;
  try { salva = sessionStorage.getItem("bola-neon-v1"); } catch (e) {}
  if (salva) { aplicar(salva); return; }

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    try {
      const url = recolorirBola(img);
      try { sessionStorage.setItem("bola-neon-v1", url); } catch (e) {}
      aplicar(url);
    } catch (e) {
      document.documentElement.classList.add("bola-original", "bola-pronta");
    }
  };
  img.onerror = () => document.documentElement.classList.add("bola-pronta");
  img.src = BOLA_FOTO;
})();

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
