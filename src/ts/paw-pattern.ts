// Randomly coloured paws on the hero's paw lattice.
//
// The lattice is one repeating background tile (src/assets/paw-tile.svg), so
// CSS alone can't pick out a single paw. This places a small pool of
// paw-shaped elements inside the same layer (so they turn and breathe with
// it), each exactly over one paw in the tile, and cycles them: fade in on a
// random free paw in a random palette colour, hold, fade out, move on.
// Without JS it's just the outlines; under prefers-reduced-motion a
// scattering of paws is filled and stays put.

const FADE_MS = 2400; // keep in step with the .paw-fill transition

// The tile is 100x100 units with two paws: centred at (25, 25) turned -15deg
// and at (75, 75) turned 15deg, each scaled to 0.42 of the 42.8 x 49.7 mark.
const PAWS_IN_TILE = [
  { x: 25, y: 25, rotate: -15 },
  { x: 75, y: 75, rotate: 15 },
];
const PAW_W = 42.8 * 0.42;
const PAW_H = 49.7 * 0.42;

const PALETTE = ["--color-primary", "--color-heading", "--color-tertiary", "--color-verified", "--color-highlight"];

interface Cell {
  x: number; // centre, in layer pixels
  y: number;
  rotate: number;
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const colour = () =>
  `color-mix(in srgb, var(${PALETTE[Math.floor(Math.random() * PALETTE.length)]}) ${Math.round(rand(45, 75))}%, transparent)`;

export function initPawPattern(): void {
  const layer = document.querySelector<HTMLElement>(".hero-paws");
  if (!layer) return;

  // Rendered tile size, so the fills track any change to background-size.
  const tile = parseFloat(getComputedStyle(layer).backgroundSize);
  if (!tile) return;
  const unit = tile / 100;

  // Only paws in the middle of the layer: it's twice the hero's size
  // (inset: -50%) and turns, so the centre is always on screen.
  const { offsetWidth: w, offsetHeight: h } = layer;
  const cells: Cell[] = [];
  for (let ty = 0; ty * tile < h; ty++) {
    for (let tx = 0; tx * tile < w; tx++) {
      for (const paw of PAWS_IN_TILE) {
        const x = tx * tile + paw.x * unit;
        const y = ty * tile + paw.y * unit;
        if (x > w * 0.22 && x < w * 0.78 && y > h * 0.22 && y < h * 0.78) {
          cells.push({ x, y, rotate: paw.rotate });
        }
      }
    }
  }

  const pool = Math.min(36, Math.floor(cells.length / 3));
  if (pool < 1) return;

  const width = PAW_W * unit;
  const height = PAW_H * unit;
  const taken = new Set<number>();
  const place = (el: HTMLElement): number => {
    let index: number;
    do index = Math.floor(Math.random() * cells.length);
    while (taken.has(index));
    taken.add(index);
    const { x, y, rotate } = cells[index];
    Object.assign(el.style, {
      left: `${x - width / 2}px`,
      top: `${y - height / 2}px`,
      width: `${width}px`,
      height: `${height}px`,
      rotate: `${rotate}deg`,
      background: colour(),
    });
    return index;
  };

  const fills = Array.from({ length: pool }, () => {
    const el = document.createElement("span");
    el.className = "paw-fill";
    layer.append(el);
    return el;
  });

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    for (const el of fills) {
      place(el);
      el.classList.add("is-on");
    }
    return;
  }

  const cycle = async (el: HTMLElement, startDelay: number) => {
    await sleep(startDelay);
    for (;;) {
      const index = place(el);
      // Let the new position apply while transparent, then fade in.
      await new Promise(requestAnimationFrame);
      el.classList.add("is-on");
      await sleep(FADE_MS + rand(2500, 7000));
      el.classList.remove("is-on");
      await sleep(FADE_MS);
      taken.delete(index);
      await sleep(rand(500, 4000));
    }
  };
  fills.forEach((el) => void cycle(el, rand(0, 6000)));
}
