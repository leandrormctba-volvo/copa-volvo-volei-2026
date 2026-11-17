// Coisas comuns a todas as páginas:
//  1) bola oficial (foto) nos lugares marcados com data-bola:
//     - apaga marca, logo, etiqueta e textos impressos na bola
//     - recolore: gomos azuis -> neon (cor do "2026"), gomos amarelos -> branco
//     - escreve "Associação / Volvo" no gomo de cima
//  2) aurora animada no fundo das áreas .fundo-volei
//  3) logo da Associação Volvo como marca d'água

// Foto: "Wedstrijdbal EGLF4 1.jpg" – TOPCyber – Wikimedia Commons – CC BY-SA 4.0
const BOLA_FOTO = "https://commons.wikimedia.org/wiki/Special:FilePath/Wedstrijdbal_EGLF4_1.jpg?width=900";
const COR_NEON  = [120, 228, 245];   // mesmo tom neon do "2026"
const COR_CLARA = [246, 250, 251];   // branco gelo
const COR_TEXTO = "#0c5868";         // verde-petróleo da Associação Volvo
const CHAVE_CACHE = "bola-neon-v2";

document.querySelectorAll("[data-bola]").forEach(el => {
  el.innerHTML = '<span class="bola-foto" style="width:100%;height:100%"></span>';
});

function matiz(R, G, B) {
  const mx = Math.max(R, G, B), mn = Math.min(R, G, B);
  if (mx === mn) return 0;
  let h;
  if (mx === R) h = 60 * (((G - B) / (mx - mn)) % 6);
  else if (mx === G) h = 60 * ((B - R) / (mx - mn) + 2);
  else h = 60 * ((R - G) / (mx - mn) + 4);
  return h < 0 ? h + 360 : h;
}

function montarBola(img) {
  const S = 400;
  const w = img.naturalWidth, h = img.naturalHeight;
  const cx = .4917 * w, cy = .5125 * h, r = .2729 * w;   // recorte só da bola
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const x = c.getContext("2d");
  x.drawImage(img, cx - r, cy - r, 2 * r, 2 * r, 0, 0, S, S);
  const dados = x.getImageData(0, 0, S, S), d = dados.data, N = S * S;

  // 1) marca tudo o que NÃO é gomo amarelo/azul limpo (letras, logos, etiqueta)
  const ruim = new Uint8Array(N);
  for (let p = 0; p < N; p++) {
    const i = p * 4, R = d[i], G = d[i + 1], B = d[i + 2];
    const mx = Math.max(R, G, B), mn = Math.min(R, G, B), s = mx ? (mx - mn) / mx : 0, m = matiz(R, G, B);
    const amarelo = m > 30 && m < 70 && s > .55 && mx > 140;
    const azul = m > 200 && m < 265 && s > .45 && mx > 70;
    if (!amarelo && !azul) ruim[p] = 1;
  }
  for (let k = 0; k < 2; k++) {                          // engrossa 2px para pegar bordas
    const cp = ruim.slice();
    for (let y = 1; y < S - 1; y++) for (let X = 1; X < S - 1; X++) {
      const p = y * S + X;
      if (cp[p - 1] || cp[p + 1] || cp[p - S] || cp[p + S]) ruim[p] = 1;
    }
  }
  const apagado = ruim.slice();

  // 2) preenche as áreas marcadas com a cor dos gomos ao redor
  const viz = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]];
  for (let falta = true, it = 0; falta && it < 600; it++) {
    falta = false;
    const cp = ruim.slice();
    for (let y = 0; y < S; y++) for (let X = 0; X < S; X++) {
      const p = y * S + X;
      if (!cp[p]) continue;
      let sr = 0, sg = 0, sb = 0, n = 0;
      for (const [dx, dy] of viz) {
        const xx = X + dx, yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= S || yy >= S) continue;
        const q = yy * S + xx;
        if (cp[q]) continue;
        sr += d[q * 4]; sg += d[q * 4 + 1]; sb += d[q * 4 + 2]; n++;
      }
      if (n) { d[p * 4] = sr / n; d[p * 4 + 1] = sg / n; d[p * 4 + 2] = sb / n; ruim[p] = 0; }
      else falta = true;
    }
  }
  // suaviza só as áreas preenchidas
  for (let k = 0; k < 3; k++) {
    const cp = d.slice();
    for (let y = 1; y < S - 1; y++) for (let X = 1; X < S - 1; X++) {
      const p = y * S + X;
      if (!apagado[p]) continue;
      for (let ch = 0; ch < 3; ch++) {
        let soma = 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) soma += cp[((y + dy) * S + X + dx) * 4 + ch];
        d[p * 4 + ch] = soma / 9;
      }
    }
  }

  // 3) recolore mantendo luz e sombra da foto
  for (let i = 0; i < d.length; i += 4) {
    const R = d[i], G = d[i + 1], B = d[i + 2];
    const mx = Math.max(R, G, B), mn = Math.min(R, G, B);
    if (!mx || (mx - mn) / mx < .35) continue;
    const m = matiz(R, G, B), L = (.299 * R + .587 * G + .114 * B) / 255;
    let cor, t;
    if (m > 185 && m < 300)    { cor = COR_NEON;  t = Math.min(1.12, Math.max(.25, L / .26)); }
    else if (m > 25 && m < 75) { cor = COR_CLARA; t = Math.min(1.06, Math.max(.3, L / .80)); }
    else continue;
    d[i] = Math.min(255, cor[0] * t);
    d[i + 1] = Math.min(255, cor[1] * t);
    d[i + 2] = Math.min(255, cor[2] * t);
  }
  x.putImageData(dados, 0, 0);

  // 4) "Associação / Volvo" no gomo de cima, centralizado
  x.save();
  x.translate(197, 66);
  x.rotate(-3 * Math.PI / 180);
  x.fillStyle = COR_TEXTO;
  x.textAlign = "center";
  x.textBaseline = "middle";
  x.font = "800 21px Montserrat, 'Segoe UI', Arial, sans-serif";
  x.fillText("Associação", 0, -12);
  x.font = "800 26px Montserrat, 'Segoe UI', Arial, sans-serif";
  x.fillText("Volvo", 0, 13);
  x.restore();

  return c.toDataURL("image/jpeg", .9);
}

(function carregarBola() {
  const aplicar = url => {
    document.documentElement.style.setProperty("--bola-img", "url(" + url + ")");
    document.documentElement.classList.add("bola-pronta");
  };
  let salva = null;
  try { salva = sessionStorage.getItem(CHAVE_CACHE); } catch (e) {}
  if (salva) { aplicar(salva); return; }

  const img = new Image();
  img.crossOrigin = "anonymous";
  const fonte = document.fonts && document.fonts.load
    ? document.fonts.load("800 24px Montserrat").catch(() => {})
    : Promise.resolve();
  img.onload = () => {
    fonte.then(() => {
      try {
        const url = montarBola(img);
        try { sessionStorage.setItem(CHAVE_CACHE, url); } catch (e) {}
        aplicar(url);
      } catch (e) {
        document.documentElement.classList.add("bola-original", "bola-pronta");
      }
    });
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
