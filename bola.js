// Desenho da bola de vôlei (usado em todas as páginas)
const BOLA_SVG = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <clipPath id="bola-recorte"><circle cx="50" cy="50" r="46"/></clipPath>
    <radialGradient id="bola-brilho" cx="35%" cy="30%" r="75%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity=".55"/>
      <stop offset="60%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity=".25"/>
    </radialGradient>
  </defs>
  <circle cx="50" cy="50" r="46" fill="#ffffff"/>
  <g clip-path="url(#bola-recorte)">
    <path d="M-10 30 Q50 0 110 30 L110 50 Q50 20 -10 50 Z" fill="#f5c400"/>
    <path d="M18 110 Q30 55 75 25 L90 40 Q45 65 38 110 Z" fill="#1f5fa8"/>
    <path d="M55 110 Q60 75 105 55 L110 75 Q75 85 75 110 Z" fill="#f5c400"/>
    <path d="M-10 30 Q50 0 110 30 M-10 50 Q50 20 110 50 M18 110 Q30 55 75 25 M38 110 Q45 65 90 40 M55 110 Q60 75 105 55 M75 110 Q75 85 110 75"
          fill="none" stroke="#0a2240" stroke-width="1.6" stroke-opacity=".55"/>
  </g>
  <circle cx="50" cy="50" r="46" fill="url(#bola-brilho)"/>
  <circle cx="50" cy="50" r="46" fill="none" stroke="#0a2240" stroke-width="2" stroke-opacity=".6"/>
</svg>`;

document.querySelectorAll("[data-bola]").forEach(el => { el.innerHTML = BOLA_SVG; });
