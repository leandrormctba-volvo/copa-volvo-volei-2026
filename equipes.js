// ============================================================
// LISTA DAS EQUIPES
// nome     = texto que aparece no botão
// pasta    = identificador usado no endereço da página
// palavras = palavras que aparecem no nome da pasta do jogo no
//            Google Drive. Se o nome da pasta tiver uma dessas
//            palavras, as fotos do jogo aparecem nesta equipe.
// ============================================================
const EQUIPES = [
  { nome: "VOLVO",       pasta: "volvo",       palavras: ["volvo"] },
  { nome: "BOSCH",       pasta: "bosch",       palavras: ["bosch"] },
  { nome: "GS",          pasta: "gs",          palavras: ["gs", "curitiba"] },
  { nome: "CAMPO LARGO", pasta: "campo-largo", palavras: ["campo largo"] },
  { nome: "AVALANCHE",   pasta: "avalanche",   palavras: ["avalanche"] },
  { nome: "TAMANDARÉ",   pasta: "tamandare",   palavras: ["tamandare", "almirante"] },
];

// Deixa o texto sem acento e em minúsculas, para comparar nomes
function simplificar(texto) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// Diz se um jogo (nome da pasta no Drive) é da equipe
function jogoDaEquipe(nomeJogo, equipe) {
  const palavrasDoJogo = simplificar(nomeJogo);
  return equipe.palavras.some(p => new RegExp("\\b" + simplificar(p) + "\\b").test(palavrasDoJogo));
}
