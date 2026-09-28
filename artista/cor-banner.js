async function pegarCorDoBanner(img) {
  if (!img.complete || img.naturalWidth === 0) {
    await new Promise((resolve, reject) => {
      img.addEventListener('load', resolve, { once: true });
      img.addEventListener('error', reject, { once: true });
    });
  }

  const TAMANHO = 64;
  const canvas = document.createElement('canvas');
  canvas.width = TAMANHO;
  canvas.height = TAMANHO;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, TAMANHO, TAMANHO);

  let pixels;
  try {
    pixels = ctx.getImageData(0, 0, TAMANHO, TAMANHO).data;
  } catch (erro) {
    console.warn('[cor-banner] Não deu pra ler a imagem. Use o Live Server em vez de abrir o arquivo direto.', erro);
    return null;
  }

  const baldes = new Map();
  const BORDA = Math.round(TAMANHO * 0.15);

  for (let i = 0; i < pixels.length; i += 4) {
    const x = (i / 4) % TAMANHO;
    const y = Math.floor(i / 4 / TAMANHO);
    const naBorda = x < BORDA || x >= TAMANHO - BORDA || y < BORDA || y >= TAMANHO - BORDA;
    if (!naBorda) continue;

    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];

    if (a < 20) continue;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturacao = max === 0 ? 0 : (max - min) / max;

    if (max < 30) continue;
    if (min > 225) continue;
    if (saturacao < 0.2) continue;

    const chave = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
    const peso = (1 + saturacao * 2) * (a / 255);

    const balde = baldes.get(chave) || { r: 0, g: 0, b: 0, peso: 0 };
    balde.r += r * peso;
    balde.g += g * peso;
    balde.b += b * peso;
    balde.peso += peso;
    baldes.set(chave, balde);
  }

  if (baldes.size === 0) return null;

  let vencedor = null;
  for (const balde of baldes.values()) {
    if (!vencedor || balde.peso > vencedor.peso) vencedor = balde;
  }

  const r = vencedor.r / vencedor.peso;
  const g = vencedor.g / vencedor.peso;
  const b = vencedor.b / vencedor.peso;

  return avivarCor(r, g, b, 0.75);
}

function avivarCor(r, g, b, saturacaoMinima) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;

  let h = 0;
  let s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  s = Math.max(s, saturacaoMinima);

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r1, g1, b1] =
    h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] :
    h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];

  const paraHex = (v) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return `#${paraHex(r1)}${paraHex(g1)}${paraHex(b1)}`;
}

async function aplicarCorDoBanner(img) {
  const cor = await pegarCorDoBanner(img);
  if (cor) {
    document.documentElement.style.setProperty('--accent', cor);
  }
  return cor;
}
