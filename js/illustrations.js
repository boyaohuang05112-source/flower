(function () {
  'use strict';

  const P = window.Pastel;
  if (!P) return;

  const SCENE_ZOOM = 1.14;
  const WINDOW_VIEW = { x: 0, y: 0, w: 720, h: 680 };

  function sceneZoomWrap(inner, h) {
    return `<g class="scene-zoom" transform="translate(0, ${h}) scale(${SCENE_ZOOM}) translate(0, ${-h})">${inner}</g>`;
  }

  let uidCounter = 0;
  function uid() { return (uidCounter++ % 900) + 1; }

  function wrapSvg(inner, w, h, id) {
    const u = id || uid();
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" class="pastel-art">
      ${P.globalDefs(u)}
      <g filter="url(#pastel-edge-${u})">${inner}</g>
      ${P.grainOverlay(u, w, h)}
    </svg>`;
  }

  function sunflowerArt(sc, c, u) {
    const petals = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((rot) =>
      `<g transform="rotate(${rot} 24 14)">${P.pastelFoliage('M24 14 m-3.5 0 a3.5 10 0 1 0 7 0 a3.5 10 0 1 0 -7 0', c.petal, { deep: '#E8B838' })}</g>`
    ).join('');
    return `<g transform="scale(${sc})">
      ${P.pastelStroke('M24 46 Q25 24 24 10', c.stem, 2.4, u)}
      ${P.pastelFoliage('M24 32 Q14 30 10 24 Q16 28 12 20 Q18 26 24 30', c.leaf, { deep: '#4A6741' })}
      ${P.pastelFoliage('M24 28 Q34 26 38 20 Q32 24 36 16 Q30 22 24 26', c.leaf, { deep: '#4A6741' })}
      ${petals}
      <circle cx="24" cy="14" r="6" fill="${c.center}"/>
      <circle cx="24" cy="14" r="4.5" fill="#8B6838"/>
    </g>`;
  }

  function wildflowerArt(type, sc, u) {
    const s = 48 * sc;
    const cx = s / 2;
    const cy = s * 0.35;
    switch (type) {
      case 'daisy':
        return `<g transform="scale(${sc})">
          ${P.pastelStroke(`M24 46 L24 28`, '#5A7848', 1.8, u)}
          ${[0, 45, 90, 135, 180, 225, 270, 315].map((r) =>
            `<ellipse cx="24" cy="16" rx="3" ry="7" fill="#FAF7F2" transform="rotate(${r} 24 22)"/>`
          ).join('')}
          <circle cx="24" cy="22" r="5" fill="#F0C848"/>
        </g>`;
      case 'lily':
        return `<g transform="scale(${sc})">
          ${P.pastelStroke(`M24 46 Q26 30 24 18`, '#5A7848', 1.6, u)}
          ${P.pastelShape('M20 20 Q24 10 28 20 Q24 24 20 20 Z', '#F0F0E8', { uid: u, highlight: '#FAFAF2', strokeWidth: 0.35 })}
          ${P.pastelShape('M16 24 Q20 14 24 24 Q20 28 16 24 Z', '#EDE8DC', { uid: u, strokeWidth: 0.3 })}
          ${P.pastelShape('M24 26 Q28 16 32 26 Q28 30 24 26 Z', '#EDE8DC', { uid: u, strokeWidth: 0.3 })}
        </g>`;
      case 'lavender':
        return `<g transform="scale(${sc})">
          ${P.pastelStroke(`M24 46 L24 20`, '#5A7848', 1.6, u)}
          ${[0, 1, 2, 3, 4].map((i) =>
            P.pastelShape(`M${20 + i % 2} ${34 - i * 5} q3 -3 8 0 q-3 3 -8 0`, '#B8A8D0', { uid: u, strokeWidth: 0.25 })
          ).join('')}
        </g>`;
      case 'bellflower':
        return `<g transform="scale(${sc})">
          ${P.pastelStroke(`M24 46 L24 22`, '#5A7848', 1.6, u)}
          ${P.pastelShape('M20 22 Q24 14 28 22 L26 30 Q24 32 22 30 Z', '#A8C0E8', { uid: u, highlight: '#C0D4F0', strokeWidth: 0.35 })}
          ${P.pastelShape('M17 26 Q20 18 23 26 L22 32 Q20 33 18 32 Z', '#98B0D8', { uid: u, strokeWidth: 0.3 })}
        </g>`;
      case 'dandelion':
        return `<g transform="scale(${sc})">
          ${P.pastelStroke(`M24 46 L24 24`, '#5A7848', 1.5, u)}
          <circle cx="24" cy="18" r="7" fill="#F0E868" opacity="0.9"/>
          <circle cx="24" cy="18" r="3" fill="#E8D040"/>
        </g>`;
      case 'poppy':
        return `<g transform="scale(${sc})">
          ${P.pastelStroke(`M24 46 L24 24`, '#5A7848', 1.4, u)}
          ${[0, 40, 80, 120, 160, 200, 240, 280, 320].map((r) =>
            `<ellipse cx="24" cy="14" rx="2.5" ry="8" fill="#E86858" opacity="0.92" transform="rotate(${r} 24 18)"/>`
          ).join('')}
          <circle cx="24" cy="18" r="4" fill="#8B4040"/>
        </g>`;
      case 'cornflower':
        return `<g transform="scale(${sc})">
          ${P.pastelStroke(`M24 46 L24 24`, '#5A7848', 1.5, u)}
          ${[0, 60, 120, 180, 240, 300].map((r) =>
            `<ellipse cx="24" cy="16" rx="2.8" ry="7" fill="#6888D0" transform="rotate(${r} 24 18)"/>`
          ).join('')}
          <circle cx="24" cy="18" r="4.5" fill="#5068A8"/>
        </g>`;
      case 'violet':
        return `<g transform="scale(${sc})">
          ${P.pastelStroke(`M24 46 L24 28`, '#5A7848', 1.4, u)}
          ${P.pastelShape('M18 24 Q20 15 24 19 Q28 15 30 24 Q24 29 18 24 Z', '#A888C8', { uid: u, highlight: '#C0A8D8', strokeWidth: 0.3 })}
          ${P.pastelShape('M20 26 Q22 20 26 24 Q22 28 20 26 Z', '#9878B8', { uid: u, strokeWidth: 0.25 })}
        </g>`;
      case 'foxglove':
        return `<g transform="scale(${sc})">
          ${P.pastelStroke(`M24 46 L24 6`, '#5A7848', 2, u)}
          ${[0, 1, 2, 3, 4, 5].map((i) => {
            const y = 10 + i * 6;
            const tilt = i % 2 === 0 ? 1 : -1;
            return P.pastelShape(
              `M${24 - 4 * tilt} ${y + 2} Q${24} ${y - 2} ${24 + 4 * tilt} ${y + 2} L${24 + 3 * tilt} ${y + 8} Q${24} ${y + 10} ${24 - 3 * tilt} ${y + 8} Z`,
              '#C888D8',
              { uid: u, highlight: '#E0A8E8', strokeWidth: 0.3 }
            );
          }).join('')}
        </g>`;
      case 'yarrow':
        return `<g transform="scale(${sc})">
          ${P.pastelStroke(`M24 46 L24 24`, '#5A7848', 1.6, u)}
          ${[[0, 0], [4, -2], [-4, -2], [3, 3], [-3, 3], [0, 4], [6, 1], [-6, 1], [5, -4], [-5, -4]].map(([dx, dy]) =>
            P.pastelCircle(24 + dx, 20 + dy, 2, '#F4F0E8', u)
          ).join('')}
          ${P.pastelCircle(24, 20, 3.2, '#F8F0D8', u)}
        </g>`;
      case 'wildrose':
        return `<g transform="scale(${sc})">
          ${P.pastelStroke(`M24 46 Q26 34 24 22`, '#5A7848', 1.5, u)}
          ${[0, 72, 144, 216, 288].map((r) =>
            `<ellipse cx="24" cy="16" rx="3" ry="6.5" fill="#E8A0B0" opacity="0.92" transform="rotate(${r} 24 18)"/>`
          ).join('')}
          <circle cx="24" cy="18" r="4" fill="#F0D0A8"/>
        </g>`;
      case 'buttercup':
        return `<g transform="scale(${sc})">
          ${P.pastelStroke(`M24 46 L24 28`, '#5A7848', 1.5, u)}
          ${P.pastelShape('M18 26 Q24 14 30 26 Q24 32 18 26 Z', '#F0D848', { uid: u, highlight: '#F8F090', strokeWidth: 0.35 })}
          ${P.pastelShape('M20 28 Q24 18 28 28', '#E8C838', { uid: u, strokeWidth: 0.25 })}
        </g>`;
      default:
        return sunflowerArt(sc, window.FLOWER_DATA.sunflower.colors, u);
    }
  }

  function flowerSvg(type, size) {
    const s = size || 48;
    const u = uid();
    const sc = s / 48;
    const art = type === 'sunflower'
      ? sunflowerArt(sc, window.FLOWER_DATA.sunflower.colors, u)
      : wildflowerArt(type, sc, u);
    return `<svg viewBox="0 0 ${s} ${s}" xmlns="http://www.w3.org/2000/svg" class="pastel-art">
      ${P.globalDefs(u)}
      <g filter="url(#pastel-edge-${u})">${art}</g>
      ${P.grainOverlay(u, s, s)}
    </svg>`;
  }

  function stemRemains(type, size) {
    const s = size || 48;
    const c = window.FLOWER_DATA.sunflower.colors.stem;
    const u = uid();
    return `<svg viewBox="0 0 ${s} ${s}" xmlns="http://www.w3.org/2000/svg" class="pastel-art">
      ${P.globalDefs(u)}
      ${P.pastelStroke(`M${s/2} ${s} Q${s/2+2} ${s*0.55} ${s/2} ${s*0.35}`, c, 1.8, u)}
    </svg>`;
  }

  const PALETTE = [
    { canopy: '#3D5638', canopyHi: '#5A7850', canopyMid: '#4A6741', trunk: '#887058' },
    { canopy: '#4A6741', canopyHi: '#6B8860', canopyMid: '#3D5638', trunk: '#9A7B5A' },
    { canopy: '#5A7850', canopyHi: '#7A9870', canopyMid: '#4A6741', trunk: '#887058' },
    { canopy: '#4D6B44', canopyHi: '#6B8860', canopyMid: '#3F5A3A', trunk: '#7A6850' },
    { canopy: '#567850', canopyHi: '#88A880', canopyMid: '#4A6741', trunk: '#9A7B5A' },
    { canopy: '#3F5A3A', canopyHi: '#5A7850', canopyMid: '#354830', trunk: '#786850' },
  ];

  function foliageShape(d, colors, u, sw) {
    return P.pastelFoliage(d, colors.canopy, {
      highlight: colors.canopyHi,
      deep: colors.canopyMid,
      strokeWidth: sw || 0.45,
    });
  }

  function cedarTree(x, baseY, height, spread, colors, u) {
    const tiers = 6;
    const tierH = height / tiers;
    let d = `M ${P.pt(x)} ${P.pt(baseY - height + 4)}`;

    for (let t = 0; t < tiers; t++) {
      const ratio = (t + 1) / tiers;
      const wOut = spread * (0.24 + ratio * 0.9);
      const wIn = wOut * 0.58;
      const yOut = baseY - height + tierH * (t + 0.5);
      const yIn = baseY - height + tierH * (t + 1);
      d += ` Q ${P.pt(x + wOut * 0.48)} ${P.pt(yOut - tierH * 0.08)} ${P.pt(x + wOut)} ${P.pt(yOut)}`;
      if (t < tiers - 1) d += ` Q ${P.pt(x + wIn * 0.42)} ${P.pt(yIn - tierH * 0.1)} ${P.pt(x + wIn)} ${P.pt(yIn)}`;
    }

    const baseW = spread * 0.48;
    d += ` Q ${P.pt(x + baseW)} ${P.pt(baseY - tierH * 0.12)} ${P.pt(x + baseW)} ${P.pt(baseY)}`;
    d += ` Q ${P.pt(x + baseW * 0.5)} ${P.pt(baseY + 6)} ${P.pt(x)} ${P.pt(baseY + 4)}`;
    d += ` Q ${P.pt(x - baseW * 0.5)} ${P.pt(baseY + 6)} ${P.pt(x - baseW)} ${P.pt(baseY)}`;
    d += ` Q ${P.pt(x - baseW)} ${P.pt(baseY - tierH * 0.12)} ${P.pt(x - spread * 0.55)} ${P.pt(baseY - tierH * 0.18)}`;

    for (let t = tiers - 1; t >= 0; t--) {
      const ratio = (t + 1) / tiers;
      const wOut = spread * (0.24 + ratio * 0.9);
      const wIn = wOut * 0.58;
      const yOut = baseY - height + tierH * (t + 0.5);
      const yIn = baseY - height + tierH * t;
      if (t < tiers - 1) d += ` Q ${P.pt(x - wIn * 0.42)} ${P.pt(yIn + tierH * 0.9)} ${P.pt(x - wIn)} ${P.pt(yIn + tierH * 0.98)}`;
      d += ` Q ${P.pt(x - wOut * 0.48)} ${P.pt(yOut - tierH * 0.08)} ${P.pt(x - wOut)} ${P.pt(yOut)}`;
    }
    d += ` Q ${P.pt(x)} ${P.pt(baseY - height + tierH * 0.08)} ${P.pt(x)} ${P.pt(baseY - height + 4)}`;

    const baseFoliageD = `M ${P.pt(x - baseW * 0.85)} ${P.pt(baseY + 2)} Q ${P.pt(x - baseW * 0.35)} ${P.pt(baseY - tierH * 0.4)} ${P.pt(x)} ${P.pt(baseY - tierH * 0.22)} Q ${P.pt(x + baseW * 0.35)} ${P.pt(baseY - tierH * 0.4)} ${P.pt(x + baseW * 0.85)} ${P.pt(baseY + 2)} Q ${P.pt(x + baseW * 0.4)} ${P.pt(baseY + 8)} ${P.pt(x)} ${P.pt(baseY + 6)} Q ${P.pt(x - baseW * 0.4)} ${P.pt(baseY + 8)} ${P.pt(x - baseW * 0.85)} ${P.pt(baseY + 2)} Z`;

    const roots = `
      ${P.pastelStroke(`M ${x - 3} ${baseY + 5} Q ${x - spread * 0.18} ${baseY + 10} ${x - spread * 0.26} ${baseY + 6}`, colors.trunk, 1.6, u)}
      ${P.pastelStroke(`M ${x + 3} ${baseY + 5} Q ${x + spread * 0.18} ${baseY + 10} ${x + spread * 0.26} ${baseY + 6}`, colors.trunk, 1.6, u)}
    `;

    return `<g class="sway-tree">
      ${foliageShape(d, colors, u)}
      ${foliageShape(baseFoliageD, colors, u, 0.35)}
      ${roots}
    </g>`;
  }

  function jungleTrees(w, h, u) {
    const total = w < 500 ? 22 : 26;
    const back = [];
    const mid = [];
    const front = [];

    for (let i = 0; i < total; i++) {
      const layer = i < Math.floor(total * 0.42) ? 'back'
        : i < Math.floor(total * 0.72) ? 'mid' : 'front';
      const colors = PALETTE[i % PALETTE.length];
      const x = w * (-0.02 + (i / (total - 1)) * 1.04) + (P.seeded(i, 3) - 0.5) * w * 0.07;

      let height; let spread; let baseY;
      if (layer === 'back') {
        height = h * (0.34 + P.seeded(i, 7) * 0.16);
        spread = height * 0.38;
        baseY = h * (0.78 + P.seeded(i, 11) * 0.05);
      } else if (layer === 'mid') {
        height = h * (0.44 + P.seeded(i, 7) * 0.2);
        spread = height * 0.36;
        baseY = h * (0.83 + P.seeded(i, 11) * 0.05);
      } else {
        height = h * (0.52 + P.seeded(i, 7) * 0.24);
        spread = height * 0.34;
        baseY = h * (0.87 + P.seeded(i, 11) * 0.04);
      }

      const tree = cedarTree(x, baseY, height, spread, colors, u);
      if (layer === 'back') back.push(tree);
      else if (layer === 'mid') mid.push(tree);
      else front.push(tree);
    }

    return { back, mid, front };
  }

  function grassBlade(x, y, h, color, u, i) {
    const bend = (P.seeded(i, x) - 0.5) * 6;
    const d = `M ${P.pt(x)} ${P.pt(y)} Q ${P.pt(x + bend)} ${P.pt(y - h * 0.5)} ${P.pt(x + bend * 0.8)} ${P.pt(y - h)}`;
    return P.pastelStroke(d, color, 1.4 + P.seeded(i, y) * 0.8, u);
  }

  function mushroom(x, y, scale, u) {
    const s = scale || 1;
    return `<g transform="translate(${x},${y}) scale(${s})">
      ${P.pastelShape('M0 0 m-8 0 a8 5 0 1 0 16 0 a8 5 0 1 0 -16 0', '#E8C4C4', { uid: u, highlight: '#F0D8D8', strokeWidth: 0.55 })}
      ${P.pastelShape('M-2.5 0 h5 v9 q0 2 -2.5 2 q-2.5 0 -2.5 -2 Z', '#EDE6D6', { uid: u, strokeWidth: 0.5 })}
    </g>`;
  }

  function fern(x, y, scale, u) {
    const s = scale || 1;
    return `<g transform="translate(${x},${y}) scale(${s})">
      ${P.pastelStroke('M0 18 Q1 9 0 0', '#6B7B4C', 1.6, u)}
      ${P.pastelStroke('M0 4 Q-7 6 -11 2', '#8AAB82', 1.2, u)}
      ${P.pastelStroke('M0 8 Q8 10 11 5', '#8AAB82', 1.2, u)}
      ${P.pastelStroke('M0 12 Q-9 14 -13 9', '#8AAB82', 1.1, u)}
      ${P.pastelStroke('M0 16 Q9 18 13 13', '#8AAB82', 1.1, u)}
    </g>`;
  }

  function rock(x, y, w, h, u) {
    return P.pastelShape(`M ${x} ${y} m -${w} -${h*0.5} a ${w} ${h} 0 1 0 ${w*2} 0 a ${w} ${h} 0 1 0 -${w*2} 0`, '#C8B898', { uid: u, highlight: '#D8C8A8', opacity: 0.75, strokeWidth: 0.5 });
  }

  function softHill(w, h, y, color, u) {
    return P.pastelShape(`M0 ${y} Q${w*0.3} ${y-h*0.08} ${w*0.55} ${y} Q${w*0.8} ${y+h*0.06} ${w} ${y} L${w} ${h} L0 ${h} Z`, color, { uid: u, opacity: 0.65, strokeWidth: 0.4 });
  }

  function horizonBand(w, h, u, color) {
    const y = h * 0.5;
    return P.pastelShape(
      `M0 ${y + 50} Q${w * 0.22} ${y - 8} ${w * 0.45} ${y + 18} Q${w * 0.68} ${y + 32} ${w} ${y + 10} L${w} ${y + 58} L0 ${y + 58} Z`,
      color || '#B8C8A8',
      { uid: u, opacity: 0.4, strokeWidth: 0.25 }
    );
  }

  function coastalTrees(w, h, u) {
    const total = 16;
    const back = [];
    const mid = [];
    const front = [];

    for (let i = 0; i < total; i++) {
      const layer = i < 6 ? 'back' : i < 11 ? 'mid' : 'front';
      const colors = PALETTE[i % PALETTE.length];
      const x = w * (0.01 + (i / (total - 1)) * 0.42) + (P.seeded(i, 3) - 0.5) * w * 0.04;

      let height; let spread; let baseY;
      if (layer === 'back') {
        height = h * (0.28 + P.seeded(i, 7) * 0.12);
        spread = height * 0.36;
        baseY = h * (0.72 + P.seeded(i, 11) * 0.04);
      } else if (layer === 'mid') {
        height = h * (0.36 + P.seeded(i, 7) * 0.16);
        spread = height * 0.34;
        baseY = h * (0.78 + P.seeded(i, 11) * 0.04);
      } else {
        height = h * (0.42 + P.seeded(i, 7) * 0.18);
        spread = height * 0.32;
        baseY = h * (0.82 + P.seeded(i, 11) * 0.03);
      }

      const tree = cedarTree(x, baseY, height, spread, colors, u);
      if (layer === 'back') back.push(tree);
      else if (layer === 'mid') mid.push(tree);
      else front.push(tree);
    }

    return { back, mid, front };
  }

  function entranceTrees(w, h, u) {
    const back = [];
    const mid = [];
    const front = [];

    function treeDims(layer, i, seedOff = 0) {
      const s = i + seedOff;
      if (layer === 'back') {
        return {
          height: h * (0.24 + P.seeded(s, 7) * 0.12),
          spread: h * (0.24 + P.seeded(s, 7) * 0.12) * 0.35,
          baseY: h * (0.72 + P.seeded(s, 11) * 0.04),
        };
      }
      if (layer === 'mid') {
        const height = h * (0.34 + P.seeded(s, 7) * 0.15);
        return {
          height,
          spread: height * 0.33,
          baseY: h * (0.78 + P.seeded(s, 11) * 0.03),
        };
      }
      const height = h * (0.4 + P.seeded(s, 7) * 0.16);
      return {
        height,
        spread: height * 0.31,
        baseY: h * (0.82 + P.seeded(s, 11) * 0.025),
      };
    }

    function placeTree(x, layer, i, seedOff = 0) {
      const { height, spread, baseY } = treeDims(layer, i, seedOff);
      const colors = PALETTE[i % PALETTE.length];
      const tree = cedarTree(x, baseY, height, spread, colors, u);
      if (layer === 'back') back.push(tree);
      else if (layer === 'mid') mid.push(tree);
      else front.push(tree);
    }

    function placeLeftTree(xFrac, layer, i) {
      const x = w * xFrac + (P.seeded(i, 3) - 0.5) * w * 0.012;
      placeTree(x, layer, i);
    }

    for (let i = 0; i < 10; i++) {
      const layer = i % 3 === 0 ? 'back' : i % 3 === 1 ? 'mid' : 'front';
      const xFrac = 0.005 + (i / 9) * 0.11 + (P.seeded(i, 1) - 0.5) * 0.018;
      placeLeftTree(xFrac, layer, i);
    }

    [0.18, 0.24, 0.29].forEach((xFrac, j) => {
      const i = 10 + j;
      const layer = j === 0 ? 'mid' : j === 1 ? 'front' : 'back';
      placeLeftTree(xFrac, layer, i);
    });

    const leftCount = 13;

    const rightCount = 7;
    for (let i = 0; i < rightCount; i++) {
      const layer = i < 2 ? 'back' : i < 5 ? 'mid' : 'front';
      const x = w * (0.74 + P.seeded(i + 40, 1) * 0.22) + (P.seeded(i + 40, 3) - 0.5) * w * 0.02;
      const dims = treeDims(layer, i, 40);
      dims.baseY += h * 0.08;
      const colors = PALETTE[(i + leftCount) % PALETTE.length];
      const tree = cedarTree(x, dims.baseY, dims.height, dims.spread, colors, u);
      if (layer === 'back') back.push(tree);
      else if (layer === 'mid') mid.push(tree);
      else front.push(tree);
    }

    return { back, mid, front };
  }

  function seaSurface(w, h, u) {
    const seaTop = h * 0.48;
    const seaBottom = h * 0.76;
    const sea = P.pastelShape(
      `M0 ${seaTop} L${w} ${seaTop} L${w} ${seaBottom} Q${w * 0.5} ${seaBottom + 8} 0 ${seaBottom - 4} Z`,
      '#A8C8D8',
      { uid: u, highlight: '#C0D8E8', opacity: 0.92, strokeWidth: 0.35 }
    );
    const waves = [];
    for (let i = 0; i < 7; i++) {
      const wy = seaTop + h * 0.06 + i * h * 0.038;
      const wx = w * 0.38 + (i % 3) * w * 0.08;
      const ww = w * (0.22 + (i % 4) * 0.06);
      waves.push(P.pastelStroke(
        `M${wx} ${wy} Q${wx + ww * 0.25} ${wy - 4} ${wx + ww * 0.5} ${wy} Q${wx + ww * 0.75} ${wy + 4} ${wx + ww} ${wy}`,
        '#B8D4E4', 1.6 + (i % 2) * 0.4, u
      ));
    }
    return { sea, waves: waves.join(''), seaTop };
  }

  function seasideRail(w, h, u, opts) {
    const pierY = h * 0.66;
    const startX = opts?.startX ?? w * 0.18;
    const endX = opts?.endX ?? w * 0.94;
    const pierW = endX - startX;
    const postCount = opts?.postCount ?? 9;
    const posts = [];
    for (let i = 0; i < postCount; i++) {
      const px = startX + (i / (postCount - 1)) * pierW;
      const postH = h * (0.1 + (i % 3) * 0.02);
      posts.push(P.pastelShape(
        `M${px - 3} ${pierY + 4} L${px - 4} ${pierY + postH} L${px + 4} ${pierY + postH} L${px + 3} ${pierY + 4} Z`,
        '#9A7B5A',
        { uid: u, highlight: '#B89878', opacity: 0.85, strokeWidth: 0.4 }
      ));
    }

    const deck = P.pastelShape(
      `M${startX} ${pierY} L${endX} ${pierY - 6} L${endX} ${pierY + 10} L${startX} ${pierY + 14} Z`,
      '#C8B090',
      { uid: u, highlight: '#D8C4A8', opacity: 0.95, strokeWidth: 0.45 }
    );

    const railY1 = pierY - 2;
    const railY2 = pierY + 6;
    const sleepers = [];
    for (let i = 0; i < 16; i++) {
      const sx = startX + 12 + (i / 15) * (pierW - 24);
      sleepers.push(P.pastelShape(
        `M${sx - 5} ${railY1 - 2} L${sx + 5} ${railY1 - 2} L${sx + 5} ${railY2 + 4} L${sx - 5} ${railY2 + 4} Z`,
        '#887058',
        { uid: u, opacity: 0.7, strokeWidth: 0.3 }
      ));
    }

    const rails = `
      ${P.pastelStroke(`M${startX + 8} ${railY1} L${endX - 8} ${railY1 - 5}`, '#6B6358', 2.2, u)}
      ${P.pastelStroke(`M${startX + 8} ${railY2} L${endX - 8} ${railY2 - 5}`, '#6B6358', 2.2, u)}
    `;

    return { deck, posts: posts.join(''), sleepers: sleepers.join(''), rails, pierY, startX, endX };
  }

  function coastalTrain(x, y, u, travelDist) {
    const body = '#EDE6D6';
    const accent = '#6B8860';
    const window = '#B8D4E8';
    const travelSec = 14;
    const pauseSec = 2;
    const totalSec = travelSec * 2 + pauseSec;
    const t1 = travelSec / totalSec;
    const t2 = (travelSec + pauseSec) / totalSec;
    const dist = Math.round(travelDist);

    const loco = `
      ${P.pastelShape(`M${x} ${y} h38 v16 q0 4 -4 4 h-30 q-4 0 -4 -4 v-16 Z`, body, { uid: u, highlight: '#FAF7F2', strokeWidth: 0.5 })}
      ${P.pastelShape(`M${x + 4} ${y + 3} h12 v8 h-12 Z`, window, { uid: u, opacity: 0.8, strokeWidth: 0.35 })}
      ${P.pastelShape(`M${x + 20} ${y + 3} h10 v8 h-10 Z`, window, { uid: u, opacity: 0.8, strokeWidth: 0.35 })}
      ${P.pastelShape(`M${x + 34} ${y + 2} h6 v12 q0 3 -3 3 h-3 v-15 Z`, accent, { uid: u, strokeWidth: 0.4 })}
      <circle cx="${x + 10}" cy="${y + 22}" r="4" fill="#5A4028" opacity="0.7"/>
      <circle cx="${x + 26}" cy="${y + 22}" r="4" fill="#5A4028" opacity="0.7"/>
      ${P.pastelCircle(x + 37, y - 2, 3.5, '#D8D0C0', u)}
      ${P.pastelCircle(x + 40, y - 5, 2.5, '#E8E4DC', u)}
    `;

    const car1 = `
      ${P.pastelShape(`M${x + 44} ${y + 2} h28 v14 q0 3 -3 3 h-22 q-3 0 -3 -3 v-14 Z`, '#F0E8DC', { uid: u, highlight: '#FAF7F2', strokeWidth: 0.45 })}
      ${P.pastelShape(`M${x + 48} ${y + 5} h8 v7 h-8 Z`, window, { uid: u, opacity: 0.75, strokeWidth: 0.3 })}
      ${P.pastelShape(`M${x + 58} ${y + 5} h8 v7 h-8 Z`, window, { uid: u, opacity: 0.75, strokeWidth: 0.3 })}
      <circle cx="${x + 54}" cy="${y + 22}" r="3.5" fill="#5A4028" opacity="0.65"/>
      <circle cx="${x + 66}" cy="${y + 22}" r="3.5" fill="#5A4028" opacity="0.65"/>
    `;

    const car2 = `
      ${P.pastelShape(`M${x + 76} ${y + 3} h22 v13 q0 3 -3 3 h-16 q-3 0 -3 -3 v-13 Z`, accent, { uid: u, highlight: '#88A880', strokeWidth: 0.45 })}
      ${P.pastelShape(`M${x + 80} ${y + 6} h6 v6 h-6 Z`, window, { uid: u, opacity: 0.7, strokeWidth: 0.3 })}
      ${P.pastelShape(`M${x + 88} ${y + 6} h6 v6 h-6 Z`, window, { uid: u, opacity: 0.7, strokeWidth: 0.3 })}
      <circle cx="${x + 84}" cy="${y + 21}" r="3.2" fill="#5A4028" opacity="0.65"/>
      <circle cx="${x + 94}" cy="${y + 21}" r="3.2" fill="#5A4028" opacity="0.65"/>
    `;

    const anim = `
      <animateTransform attributeName="transform" type="translate"
        values="0,0; ${dist},0; ${dist},0; 0,0"
        keyTimes="0; ${t1.toFixed(4)}; ${t2.toFixed(4)}; 1"
        dur="${totalSec}s" repeatCount="indefinite" calcMode="linear"/>
    `;

    return `<g class="coastal-train-motion">${anim}<g class="coastal-train-bob">${loco}${car1}${car2}</g></g>`;
  }

  function seagull(x, y, u, flip) {
    const dir = flip ? -1 : 1;
    return `<g transform="translate(${x},${y}) scale(${dir},1)">
      ${P.pastelStroke(`M0 0 Q8 -6 16 0 Q8 4 0 0`, '#FAF7F2', 1.4, u)}
      ${P.pastelStroke(`M0 0 Q-6 -4 -10 0`, '#EDE6D6', 1.1, u)}
    </g>`;
  }

  function beachGrass(w, h, u, chapter) {
    const blades = [];
    for (let i = 0; i < 40; i++) {
      const gx = w * (0.08 + (i / 40) * 0.55) + (P.seeded(i, 2) - 0.5) * 8;
      const gy = h * 0.9 + (i % 3);
      const gh = 7 + (i % 5) * 2;
      blades.push(grassBlade(gx, gy, gh, i % 3 ? '#C8B888' : '#A8B878', u, i + 50));
    }
    return blades.join('');
  }

  function shellSpiral(x, y, s, rot, u) {
    return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})">
      ${P.pastelShape('M0 2 m-7 -3 a7 9 0 1 0 14 0 a7 9 0 1 0 -14 0', '#F0E4D4', { uid: u, highlight: '#FAF0E4', opacity: 0.92, strokeWidth: 0.4 })}
      ${P.pastelStroke('M-3 3 Q0 -4 5 1 Q2 4 -1 3', '#D8C4B0', 0.9, u)}
      ${P.pastelStroke('M1 0 Q3 -2 5 0', '#E8D8C8', 0.6, u)}
    </g>`;
  }

  function shellClam(x, y, s, rot, u) {
    return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})">
      ${P.pastelShape('M-8 0 Q0 -7 8 0 Q0 5 -8 0 Z', '#EDE0D0', { uid: u, highlight: '#F8F0E4', opacity: 0.9, strokeWidth: 0.4 })}
      ${P.pastelStroke('M-8 0 Q0 4 8 0', '#C8B8A8', 0.7, u)}
    </g>`;
  }

  function shellCone(x, y, s, rot, u) {
    return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})">
      ${P.pastelShape('M0 -8 L6 6 Q0 8 -6 6 Z', '#E8D8C8', { uid: u, highlight: '#F5EDE0', opacity: 0.88, strokeWidth: 0.4 })}
      ${P.pastelStroke('M-3 2 L0 -4 L3 2', '#D0C0B0', 0.5, u)}
    </g>`;
  }

  function beachShells(w, h, u, rich) {
    const spots = [
      [0.09, 0.915, 'spiral', 1.1, 22],
      [0.16, 0.935, 'clam', 0.95, -18],
      [0.24, 0.908, 'cone', 0.85, 35],
      [0.35, 0.928, 'spiral', 0.75, -8],
      [0.44, 0.912, 'clam', 1, 12],
      [0.52, 0.938, 'cone', 0.7, -25],
      [0.08, 0.895, 'cone', 0.65, 50],
      [0.38, 0.945, 'spiral', 0.6, 70],
    ];
    if (rich) {
      spots.push(
        [0.12, 0.948, 'spiral', 0.8, -35],
        [0.2, 0.898, 'clam', 0.7, 28],
        [0.3, 0.942, 'cone', 0.9, -12],
        [0.42, 0.898, 'spiral', 0.65, 45],
        [0.48, 0.925, 'clam', 0.8, -5],
        [0.06, 0.928, 'spiral', 0.55, 15],
        [0.55, 0.905, 'cone', 0.6, 80],
        [0.18, 0.952, 'cone', 0.5, -42],
        [0.32, 0.918, 'clam', 0.75, 33],
      );
    }
    return spots.map(([rx, ry, kind, s, rot], i) => {
      const x = w * rx + (P.seeded(i, 9) - 0.5) * 10;
      const y = h * ry;
      if (kind === 'clam') return shellClam(x, y, s, rot, u);
      if (kind === 'cone') return shellCone(x, y, s, rot, u);
      return shellSpiral(x, y, s, rot, u);
    }).join('');
  }

  function smallCrab(x, y, s, flip, u, delay) {
    const f = flip ? -1 : 1;
    const body = `
      ${P.pastelShape('M-9 0 m-9 -5 a9 6 0 1 0 18 0 a9 6 0 1 0 -18 0', '#E8A090', { uid: u, highlight: '#F0B8A8', opacity: 0.92, strokeWidth: 0.45 })}
      <circle cx="-5" cy="-7" r="1.8" fill="#5A4028" opacity="0.6"/>
      <circle cx="5" cy="-7" r="1.8" fill="#5A4028" opacity="0.6"/>
      ${P.pastelStroke('M-5 -7 L-5 -10', '#D89080', 1.2, u)}
      ${P.pastelStroke('M5 -7 L5 -10', '#D89080', 1.2, u)}
      ${P.pastelShape('M-14 -2 Q-18 -6 -16 -10 Q-12 -8 -11 -3 Z', '#E8A090', { uid: u, highlight: '#F0B8A8', strokeWidth: 0.4 })}
      ${P.pastelShape('M14 -2 Q18 -6 16 -10 Q12 -8 11 -3 Z', '#E8A090', { uid: u, highlight: '#F0B8A8', strokeWidth: 0.4 })}
      ${P.pastelStroke('M-8 4 L-10 8', '#C87868', 1.3, u)}
      ${P.pastelStroke('M-3 5 L-4 9', '#C87868', 1.1, u)}
      ${P.pastelStroke('M3 5 L4 9', '#C87868', 1.1, u)}
      ${P.pastelStroke('M8 4 L10 8', '#C87868', 1.3, u)}
    `;
    return `<g transform="translate(${x},${y}) scale(${s * f}, ${s})"><g class="beach-crab beach-crab-${delay}">${body}</g></g>`;
  }

  function beachCrabs(w, h, u) {
    return [
      smallCrab(w * 0.14, h * 0.922, 1, false, u, 0),
      smallCrab(w * 0.28, h * 0.932, 0.85, true, u, 2),
      smallCrab(w * 0.46, h * 0.918, 0.75, false, u, 4),
    ].join('');
  }

  function leapingFish(x, y, delay, flip, u) {
    const dir = flip ? -1 : 1;
    const fish = `
      ${P.pastelShape('M0 0 m-10 -4 a10 5 0 1 0 20 0 a10 5 0 1 0 -20 0', '#88B8C8', { uid: u, highlight: '#A8D0DC', opacity: 0.9, strokeWidth: 0.4 })}
      ${P.pastelShape('M10 0 L18 -5 L18 5 Z', '#78A8B8', { uid: u, highlight: '#98C0CC', strokeWidth: 0.35 })}
      <circle cx="-4" cy="-1" r="1.5" fill="#5A6870" opacity="0.55"/>
      ${P.pastelStroke('M-6 3 Q0 5 6 3', '#6A98A8', 0.8, u)}
    `;
    return `<g transform="translate(${x},${y}) scale(${dir},1)"><g class="sea-fish sea-fish-${delay}">${fish}</g></g>`;
  }

  function seaLife(w, h, seaTop, u) {
    const spots = [
      [0.52, seaTop + h * 0.07, 0, false],
      [0.64, seaTop + h * 0.11, 3, true],
      [0.76, seaTop + h * 0.05, 6, false],
      [0.58, seaTop + h * 0.14, 9, true],
      [0.84, seaTop + h * 0.09, 12, false],
    ];
    return spots.map(([rx, fy, delay, flip]) =>
      leapingFish(w * rx, fy, delay, flip, u)
    ).join('');
  }

  function sandBeach(w, h, u, fromX, toX) {
    const fx = fromX || 0;
    const tx = toX || w;
    const bw = tx - fx;
    const shoreY = h * 0.71;
    const sandTop = h * 0.735;

    const sand = P.pastelShape(
      `M${fx} ${sandTop} Q${fx + bw * 0.2} ${shoreY} ${fx + bw * 0.45} ${sandTop + 6} Q${fx + bw * 0.72} ${sandTop + 12} ${tx} ${sandTop + 2} L${tx} ${h} L${fx} ${h} Z`,
      '#F2E8D4', { uid: u, highlight: '#FAF4EA', opacity: 1, strokeWidth: 0.3 }
    );

    const wetSand = P.pastelShape(
      `M${fx} ${sandTop + 1} Q${fx + bw * 0.3} ${sandTop - 8} ${fx + bw * 0.62} ${sandTop + 3} L${fx + bw * 0.62} ${sandTop + 14} Q${fx + bw * 0.3} ${sandTop + 10} ${fx} ${sandTop + 12} Z`,
      '#E6D6C0', { uid: u, highlight: '#EEE4D4', opacity: 0.9, strokeWidth: 0.25 }
    );

    let grains = '';
    const count = Math.max(24, Math.floor(bw / 18));
    for (let i = 0; i < count; i++) {
      const gx = fx + P.seeded(i, 11) * bw;
      const gy = sandTop + 16 + P.seeded(i, 12) * (h - sandTop - 28);
      grains += `<circle cx="${P.pt(gx)}" cy="${P.pt(gy)}" r="${0.35 + P.seeded(i, 13) * 0.55}" fill="#D4C4A8" opacity="0.3"/>`;
    }

    const foam = P.pastelStroke(
      `M${fx} ${sandTop - 2} Q${fx + bw * 0.2} ${sandTop - 6} ${fx + bw * 0.4} ${sandTop - 3} Q${fx + bw * 0.6} ${sandTop - 7} ${fx + bw * 0.85} ${sandTop - 2}`,
      '#FAF7F2', 1.2, u
    );

    return `<g class="sand-beach">${sand}${wetSand}${foam}<g class="sand-grain">${grains}</g></g>`;
  }

  function buildCoastalScene(chapter, w, h) {
    const u = uid();
    const jungle = coastalTrees(w, h, u);
    const sea = seaSurface(w, h, u);
    const rail = seasideRail(w, h, u);
    const trainLen = 100;
    const trainX = rail.startX + 40;
    const trainY = rail.pierY - 18;
    const travelDist = Math.max(60, rail.endX - 8 - trainX - trainLen);

    const inner = `
      <rect width="${w}" height="${h}" fill="${chapter.sky[0]}"/>
      <rect width="${w}" height="${h}" fill="url(#skyGrad-${u})"/>
      ${horizonBand(w, h, u, chapter.hills)}
      ${sea.sea}
      ${sea.waves}
      <g class="sea-life">${seaLife(w, h, sea.seaTop, u)}</g>
      ${sandBeach(w, h, u, 0, w)}
      ${P.pastelShape(`M0 ${h*0.86} Q${w*0.3} ${h*0.82} ${w*0.55} ${h*0.86} L${w} ${h} L0 ${h} Z`, chapter.groundDark, { uid: u, opacity: 0.7, strokeWidth: 0.25 })}
      <g class="jungle-back">${jungle.back.join('')}</g>
      <g class="jungle-mid">${jungle.mid.join('')}</g>
      ${rock(w * 0.12, h * 0.9, 14, 8, u)}
      ${rock(w * 0.32, h * 0.91, 10, 6, u)}
      ${fern(w * 0.2, h * 0.88, 1, u)}
      ${rail.posts}
      ${rail.deck}
      ${rail.sleepers}
      ${rail.rails}
      <g transform="translate(${trainX}, ${trainY})">${coastalTrain(0, 0, u, travelDist)}</g>
      <g class="jungle-front">${jungle.front.join('')}</g>
      <g>${beachGrass(w, h, u, chapter)}</g>
      <g class="beach-shells beach-foreground">${beachShells(w, h, u)}</g>
      <g class="beach-crabs beach-foreground">${beachCrabs(w, h, u)}</g>
      ${seagull(w * 0.62, h * 0.18, u, false)}
      ${seagull(w * 0.74, h * 0.14, u, true)}
      ${seagull(w * 0.85, h * 0.22, u, false)}
      ${P.pastelCircle(w * 0.72, h * 0.08, 30, '#F0DFA8', u)}
      ${P.pastelCircle(w * 0.72, h * 0.08, 20, '#F8E8B0', u)}
    `;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" class="pastel-art coastal-scene">
      ${P.globalDefs(u)}
      <defs>
        <linearGradient id="skyGrad-${u}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${chapter.sky[0]}"/>
          <stop offset="100%" stop-color="${chapter.sky[1]}"/>
        </linearGradient>
      </defs>
      <g filter="url(#pastel-edge-${u})">${sceneZoomWrap(inner, h)}</g>
      ${P.grainOverlay(u, w, h)}
    </svg>`;
  }

  function flowerCluster(cx, cy, count, u, seed) {
    const colors = ['#F0E868', '#FAF7F2', '#B8A8D0', '#A8C0E8', '#F0B8C8', '#E8C8A8'];
    let out = '';
    for (let i = 0; i < count; i++) {
      const ang = P.seeded(seed, i) * Math.PI * 2;
      const dist = 6 + P.seeded(i, seed + 1) * 28;
      const fx = cx + Math.cos(ang) * dist;
      const fy = cy + Math.sin(ang) * dist * 0.3;
      const r = 2 + P.seeded(i, seed + 2) * 2.5;
      out += P.pastelCircle(fx, fy, r, colors[i % colors.length], u);
      if (i % 2 === 0) {
        out += P.pastelStroke(
          `M${fx} ${fy} L${fx + (P.seeded(i, 7) - 0.5) * 4} ${fy + 6}`,
          '#5A7848', 0.7, u
        );
      }
    }
    return out;
  }

  function seaSurfaceWide(w, h, u) {
    const base = seaSurface(w, h, u);
    let extra = '';
    for (let i = 0; i < 14; i++) {
      const wy = base.seaTop + h * 0.04 + (i % 5) * h * 0.032;
      const wx = w * (0.12 + (i / 13) * 0.82);
      const ww = w * (0.08 + (i % 3) * 0.04);
      extra += P.pastelStroke(
        `M${wx} ${wy} Q${wx + ww * 0.3} ${wy - 3} ${wx + ww * 0.55} ${wy} Q${wx + ww * 0.8} ${wy + 3} ${wx + ww} ${wy}`,
        '#B8D4E4', 1.2 + (i % 2) * 0.5, u
      );
    }
    return { sea: base.sea, waves: base.waves + extra, seaTop: base.seaTop };
  }

  function buildForestEntrance(w, h) {
    const u = uid();

    const trees = entranceTrees(w, h, u);
    const sea = seaSurfaceWide(w, h, u);
    const rail = seasideRail(w, h, u, {
      startX: w * 0.05,
      endX: w * 0.64,
      postCount: 8,
    });
    const trainLen = 100;
    const trainX = rail.startX + 10;
    const trainY = rail.pierY - 18;
    const travelDist = Math.max(80, rail.endX - 10 - trainX - trainLen);

    const inner = `
      <rect width="${w}" height="${h}" fill="url(#skyGrad-${u})"/>
      <g class="sky-sun">
        ${P.pastelCircle(w * 0.58, h * 0.28, 38, '#F0DFA8', u)}
        ${P.pastelCircle(w * 0.58, h * 0.28, 28, '#F8E8B0', u)}
      </g>
      ${horizonBand(w, h, u, '#C8D8C8')}
      ${sea.sea}
      <g class="sea-waves">${sea.waves}</g>
      <g class="sea-life">${seaLife(w, h, sea.seaTop, u)}</g>
      ${sandBeach(w, h, u, 0, w)}
      <g class="seaside-rail-layer">${rail.posts}${rail.deck}${rail.sleepers}${rail.rails}</g>
      <g class="train-under-trees" transform="translate(${trainX}, ${trainY})">${coastalTrain(0, 0, u, travelDist)}</g>
      <g class="tree-strip-back">${trees.back.join('')}</g>
      <g class="tree-strip-mid">${trees.mid.join('')}</g>
      <g class="tree-strip-front">${trees.front.join('')}</g>
      <g class="beach-foreground beach-shells">${beachShells(w, h, u, true)}</g>
      <g class="beach-foreground beach-crabs">${beachCrabs(w, h, u)}</g>
      ${seagull(w * 0.48, h * 0.14, u, false)}
      ${seagull(w * 0.68, h * 0.1, u, true)}
      ${seagull(w * 0.88, h * 0.16, u, false)}
      ${seagull(w * 0.32, h * 0.18, u, true)}
    `;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" class="pastel-art forest-entrance act1-coastal">
      ${P.globalDefs(u)}
      <defs>
        <linearGradient id="skyGrad-${u}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#C8DCE8"/>
          <stop offset="45%" stop-color="#D4E8EC"/>
          <stop offset="100%" stop-color="#DCE8D8"/>
        </linearGradient>
      </defs>
      <g filter="url(#pastel-edge-${u})">${sceneZoomWrap(inner, h)}</g>
      ${P.grainOverlay(u, w, h)}
    </svg>`;
  }

  function buildLongForest(totalW, h) {
    const u = uid();
    const coastalW = totalW * 0.28;
    const cw = coastalW;
    const ch = h;

    const jungle = jungleTrees(totalW - coastalW, h, u);
    const coastalJungle = coastalTrees(cw, ch, u);
    const sea = seaSurface(cw, ch, u);
    const rail = seasideRail(cw, ch, u);
    const trainLen = 100;
    const trainX = rail.startX + 40;
    const trainY = rail.pierY - 18;
    const travelDist = Math.max(60, rail.endX - 8 - trainX - trainLen);

    const treeXs = [];
    for (let i = 0; i < 48; i++) {
      const x = coastalW * 0.3 + (i / 47) * (totalW - coastalW * 0.5) + (P.seeded(i, 4) - 0.5) * 60;
      treeXs.push(x);
    }

    let clusters = '';
    treeXs.forEach((x, i) => {
      const baseY = h * (0.84 + P.seeded(i, 8) * 0.04);
      clusters += `<g class="flower-cluster">${flowerCluster(x, baseY, 14 + (i % 5), u, i + 20)}</g>`;
    });

    let mushrooms = '';
    for (let i = 0; i < 18; i++) {
      const mx = coastalW + (i / 17) * (totalW - coastalW) * 0.95;
      mushrooms += mushroom(mx, h * (0.87 + P.seeded(i, 2) * 0.03), 0.8 + P.seeded(i, 3) * 0.5, u);
    }

    let rocks = '';
    for (let i = 0; i < 14; i++) {
      const rx = coastalW * 0.5 + (i / 13) * (totalW - coastalW);
      rocks += rock(rx, h * (0.9 + P.seeded(i, 5) * 0.02), 8 + P.seeded(i, 6) * 6, 5 + P.seeded(i, 7) * 3, u);
    }

    const stream = P.pastelShape(
      `M${coastalW + 200} ${h * 0.84} Q${totalW * 0.45} ${h * 0.78} ${totalW * 0.62} ${h * 0.86} Q${totalW * 0.78} ${h * 0.9} ${totalW - 120} ${h * 0.83} L${totalW - 100} ${h * 0.88} Q${totalW * 0.75} ${h * 0.95} ${totalW * 0.5} ${h * 0.9} Q${totalW * 0.3} ${h * 0.86} ${coastalW + 180} ${h * 0.89} Z`,
      '#A8C8D8', { uid: u, highlight: '#C0DCE8', opacity: 0.55, strokeWidth: 0.3 }
    );

    const grass = [];
    for (let i = 0; i < 100; i++) {
      const gx = coastalW + (i / 100) * (totalW - coastalW) + (P.seeded(i, 1) - 0.5) * 8;
      const gy = h * 0.9 + (i % 4);
      grass.push(grassBlade(gx, gy, 7 + (i % 6) * 2, i % 2 ? '#6B8860' : '#A8B878', u, i));
    }

    const inner = `
      <rect width="${totalW}" height="${h}" fill="url(#skyGrad-${u})"/>
      <g class="sky-sun">
        ${P.pastelCircle(cw * 0.68, h * 0.17, 34, '#F0DFA8', u)}
        ${P.pastelCircle(cw * 0.68, h * 0.17, 24, '#F8E8B0', u)}
      </g>
      ${horizonBand(totalW, h, u, '#B8C8A8')}
      <defs><clipPath id="seaClip-${u}"><rect x="0" y="0" width="${cw}" height="${h}"/></clipPath></defs>
      <g clip-path="url(#seaClip-${u})">
        ${sea.sea}${sea.waves}
        <g class="sea-life">${seaLife(cw, ch, sea.seaTop, u)}</g>
      </g>
      ${sandBeach(cw, ch, u, 0, cw)}
      ${P.pastelShape(
        `M${coastalW} ${h * 0.77} Q${totalW * 0.4} ${h * 0.74} ${totalW * 0.6} ${h * 0.78} Q${totalW * 0.8} ${h * 0.81} ${totalW} ${h * 0.76} L${totalW} ${h} L${coastalW} ${h} Z`,
        '#C8D4B8', { uid: u, highlight: '#D8E4C8', opacity: 1, strokeWidth: 0.3 }
      )}
      ${P.pastelShape(
        `M${coastalW} ${h * 0.86} Q${totalW * 0.5} ${h * 0.82} ${totalW * 0.75} ${h * 0.86} L${totalW} ${h} L${coastalW} ${h} Z`,
        '#B0C0A0', { uid: u, opacity: 0.8, strokeWidth: 0.25 }
      )}
      ${stream}
      <g class="jungle-back" transform="translate(${coastalW * 0.15},0)">${jungle.back.join('')}</g>
      <g class="jungle-back">${coastalJungle.back.join('')}</g>
      <g class="jungle-mid" transform="translate(${coastalW * 0.1},0)">${jungle.mid.join('')}</g>
      <g class="jungle-mid">${coastalJungle.mid.join('')}</g>
      <g class="seaside-rail-layer">${rail.posts}${rail.deck}${rail.sleepers}${rail.rails}</g>
      ${rocks}
      ${mushrooms}
      <g class="jungle-front" transform="translate(${coastalW * 0.05},0)">${jungle.front.join('')}</g>
      <g class="jungle-front">${coastalJungle.front.join('')}</g>
      <g class="tree-flower-clusters">${clusters}</g>
      <g>${beachGrass(cw, ch, u, {})}</g>
      <g>${grass.join('')}</g>
      <g class="beach-foreground">${beachShells(cw, ch, u)}${beachCrabs(cw, ch, u)}</g>
      <g class="coastal-train-layer" transform="translate(${trainX}, ${trainY})">${coastalTrain(0, 0, u, travelDist)}</g>
      ${seagull(cw * 0.55, ch * 0.16, u, false)}
      ${seagull(cw * 0.72, ch * 0.12, u, true)}
    `;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${h}" preserveAspectRatio="xMinYMid meet" class="pastel-art long-forest">
      ${P.globalDefs(u)}
      <defs>
        <linearGradient id="skyGrad-${u}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#C8DCE8"/>
          <stop offset="100%" stop-color="#DCE8D0"/>
        </linearGradient>
      </defs>
      <g filter="url(#pastel-edge-${u})">${sceneZoomWrap(inner, h)}</g>
      ${P.grainOverlay(u, totalW, h)}
    </svg>`;
  }

  function buildChapterScene(chapter, w, h) {
    if (chapter.id === 'riverside') return buildCoastalScene(chapter, w, h);

    const u = uid();
    const jungle = jungleTrees(w, h, u);

    const grass = [];
    for (let i = 0; i < 55; i++) {
      const gx = (i / 55) * w + (P.seeded(i, 1) - 0.5) * 6;
      const gy = h * 0.9 + (i % 4) * 2;
      const gh = 8 + (i % 6) * 2;
      grass.push(grassBlade(gx, gy, gh, i % 2 ? chapter.groundDark : '#6B8860', u, i));
    }

    const inner = `
      <rect width="${w}" height="${h}" fill="${chapter.sky[0]}"/>
      <rect width="${w}" height="${h}" fill="url(#skyGrad-${u})"/>
      ${softHill(w, h, h * 0.76, chapter.hills, u)}
      ${P.pastelShape(`M0 ${h*0.8} Q${w*0.28} ${h*0.75} ${w*0.52} ${h*0.8} Q${w*0.78} ${h*0.85} ${w} ${h*0.78} L${w} ${h} L0 ${h} Z`, chapter.ground, { uid: u, highlight: chapter.ground, opacity: 1, strokeWidth: 0.3 })}
      ${P.pastelShape(`M0 ${h*0.88} Q${w*0.35} ${h*0.84} ${w*0.65} ${h*0.88} L${w} ${h} L0 ${h} Z`, chapter.groundDark, { uid: u, opacity: 1, strokeWidth: 0.25 })}
      <g class="jungle-back">${jungle.back.join('')}</g>
      <g class="jungle-mid">${jungle.mid.join('')}</g>
      ${mushroom(w * 0.15, h * 0.88, 0.9, u)}
      ${mushroom(w * 0.42, h * 0.9, 1.1, u)}
      ${mushroom(w * 0.68, h * 0.89, 0.85, u)}
      ${mushroom(w * 0.88, h * 0.9, 1, u)}
      ${fern(w * 0.28, h * 0.89, 1.1, u)}
      ${fern(w * 0.55, h * 0.9, 1.3, u)}
      ${fern(w * 0.78, h * 0.88, 1, u)}
      <g class="jungle-front">${jungle.front.join('')}</g>
      <g>${grass.join('')}</g>
      ${rock(w * 0.22, h * 0.92, 12, 7, u)}
      ${rock(w * 0.58, h * 0.93, 10, 6, u)}
      ${rock(w * 0.82, h * 0.92, 11, 6, u)}
      ${P.pastelCircle(w * 0.82, h * 0.1, 22, '#F0DFA8', u)}
    `;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" class="pastel-art">
      ${P.globalDefs(u)}
      <defs>
        <linearGradient id="skyGrad-${u}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${chapter.sky[0]}"/>
          <stop offset="100%" stop-color="${chapter.sky[1]}"/>
        </linearGradient>
      </defs>
      <g filter="url(#pastel-edge-${u})">${inner}</g>
      ${P.grainOverlay(u, w, h)}
    </svg>`;
  }

  function bagSvg() {
    const u = uid();
    return `<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" class="pastel-art">
      ${P.globalDefs(u)}
      <g filter="url(#pastel-edge-${u})">
        ${P.pastelShape('M12 22 Q14 13 28 13 Q42 13 44 22 L46 47 Q46 51 28 51 Q10 51 10 47 Z', '#EDE6D6', { uid: u, highlight: '#FAF7F2', strokeWidth: 0.6 })}
        ${P.pastelStroke('M20 22 Q20 15 28 15 Q36 15 36 22', P.OUTLINE, 0.8, u)}
      </g>
    </svg>`;
  }

  function envelopeSvg() {
    const u = uid();
    return `<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" class="pastel-art">
      ${P.globalDefs(u)}
      <g filter="url(#pastel-edge-${u})">
        ${P.pastelShape('M4 20 h112 v56 H4 Z', '#EDE6D6', { uid: u, highlight: '#FAF7F2', strokeWidth: 0.6 })}
        ${P.pastelStroke('M4 20 L60 50 L116 20', P.OUTLINE, 0.9, u)}
      </g>
    </svg>`;
  }

  function basketBloomHead(x, y, variant, u, scale, mode) {
    const palette = {
      daisy: { petal: '#FAF7F2', center: '#F0C848' },
      lily: { petal: '#F4F0E8', center: '#E8E0D0' },
      lavender: { petal: '#C8B8E0', center: '#A898C8' },
      bellflower: { petal: '#B0C8E8', center: '#98B0D8' },
      sunflower: { petal: '#F0C848', center: '#8B6838' },
      poppy: { petal: '#E86858', center: '#8B4040' },
      cornflower: { petal: '#6888D0', center: '#5068A8' },
      violet: { petal: '#A888C8', center: '#7860A0' },
    };
    const c = palette[variant] || palette.daisy;
    const pr = 3.2 * scale;
    const cr = 2.4 * scale;
    let out = '';

    const petalCount = mode === 'full' ? 7 : 4;
    const startAng = mode === 'half-left' ? Math.PI * 0.55 : mode === 'half-right' ? -Math.PI * 0.15 : 0;
    const arc = mode === 'full' ? Math.PI * 2 : Math.PI * 0.95;

    for (let i = 0; i < petalCount; i++) {
      const t = petalCount === 1 ? 0 : i / (petalCount - 1);
      const ang = startAng + t * arc;
      const px = x + Math.cos(ang) * pr * 1.1;
      const py = y + Math.sin(ang) * pr * 0.85;
      out += `<ellipse cx="${px}" cy="${py}" rx="${2.6 * scale}" ry="${4.2 * scale}" fill="${c.petal}" transform="rotate(${ang * 57.3} ${px} ${py})"/>`;
    }

    if (mode === 'full' || mode === 'half-top') {
      out += P.pastelCircle(x, y, cr, c.center, u);
    } else if (mode === 'half-left' || mode === 'half-right') {
      out += P.pastelCircle(x + (mode === 'half-left' ? pr * 0.15 : -pr * 0.15), y, cr * 0.75, c.center, u);
    }

    return out;
  }

  function basketGlowHalo(cx, cy, flowerId, u, scale) {
    const r = 20 * scale;
    return `
      <g class="basket-glow-halo" data-flower-id="${flowerId}" aria-label="花朵">
        <circle class="basket-halo-outer" cx="${cx}" cy="${cy}" r="${r + 8}" />
        <circle class="basket-halo-mid" cx="${cx}" cy="${cy}" r="${r}" />
        <circle class="basket-halo-core" cx="${cx}" cy="${cy}" r="${r * 0.38}" />
      </g>
    `;
  }

  function coupleChatHint(cx, cy, u, scale) {
    const noStroke = { strokeWidth: 0 };
    const bw = 54 * scale;
    const bh = 22 * scale;
    const fontSize = Math.max(8, 9.2 * scale);
    return `
      <g class="couple-chat-hint" transform="translate(${cx} ${cy})" aria-label="点击对话">
        <g class="couple-chat-bubble">
          <rect class="couple-chat-hit" x="${-30 * scale}" y="${-15 * scale}" width="${60 * scale}" height="${32 * scale}" fill="transparent" />
          ${P.pastelShape(
            `M${-bw * 0.5} ${-bh * 0.4} Q${-bw * 0.5} ${-bh * 0.55} ${-bw * 0.38} ${-bh * 0.55} L${bw * 0.38} ${-bh * 0.55} Q${bw * 0.5} ${-bh * 0.55} ${bw * 0.5} ${-bh * 0.4} L${bw * 0.5} ${bh * 0.22} Q${bw * 0.5} ${bh * 0.38} ${bw * 0.34} ${bh * 0.38} L${-bw * 0.04} ${bh * 0.38} L${-bw * 0.22} ${bh * 0.62} L${-bw * 0.1} ${bh * 0.38} L${-bw * 0.38} ${bh * 0.38} Q${-bw * 0.5} ${bh * 0.38} ${-bw * 0.5} ${bh * 0.22} Z`,
            '#FAF7F2',
            { uid: u, highlight: '#FFFFFF', opacity: 0.96, ...noStroke }
          )}
          <text class="couple-chat-label" x="0" y="${1.2 * scale}" font-family="Cormorant Garamond, serif" font-size="${fontSize}" font-weight="600" fill="#7A6A58" text-anchor="middle">点击对话</text>
        </g>
      </g>
    `;
  }

  function subtleSunflowerHalo(cx, cy, flowerId, u, scale, tone = 'normal') {
    const faint = tone === 'faint';
    const r = (faint ? 6.5 : 9) * scale;
    const hit = 18 * scale;
    const cls = faint ? 'sunflower-glow-halo is-faint' : 'sunflower-glow-halo';
    return `
      <g class="${cls}" data-flower-id="${flowerId}" aria-label="向日葵">
        <circle class="sunflower-halo-hit" cx="${cx}" cy="${cy}" r="${hit}" fill="transparent" />
        <circle class="sunflower-halo-outer" cx="${cx}" cy="${cy}" r="${r + (faint ? 2 : 3)}" />
        <circle class="sunflower-halo-mid" cx="${cx}" cy="${cy}" r="${r}" />
        <circle class="sunflower-halo-core" cx="${cx}" cy="${cy}" r="${r * 0.34}" />
      </g>
    `;
  }

  function act2SunflowerHalos(w, h, u) {
    const s = h / 900;
    const groundY = h * 0.985;
    const bh = h * 0.28;
    const bx = w * 0.07;
    const by = groundY - bh;
    const lx = bx - w * 0.028;
    const topY = by - h * 0.06;
    const poleH = groundY - topY;
    const lanternY = topY + poleH * 0.12;
    const benchCx = w * 0.672;
    const seatW = 152 * s;
    const seatTop = groundY - 40 * s;
    const boyX = benchCx + seatW * 0.06;

    return `
      <g class="act2-sunflower-halos">
        ${subtleSunflowerHalo(lx, lanternY + 35, 'sf-4', u, s)}
        ${subtleSunflowerHalo(boyX - 30 * s, seatTop - 16 * s, 'sf-5', u, s, 'faint')}
        ${subtleSunflowerHalo(w * 0.5, h * 0.752, 'sf-6', u, s, 'faint')}
      </g>
    `;
  }

  function flowerBasket(cx, cy, flowerType, u, scale, clickable, flowerId) {
    const noStroke = { strokeWidth: 0 };
    const hw = 16 * scale;
    const hh = 12 * scale;
    const clipId = `basket-clip-${u}-${flowerId}`;
    const variant = flowerType;

    const blooms = [
      { ox: 0, oy: -hh * 0.62, mode: 'full' },
      { ox: -hw * 0.38, oy: -hh * 0.42, mode: 'half-left' },
      { ox: hw * 0.38, oy: -hh * 0.42, mode: 'half-right' },
      { ox: -hw * 0.14, oy: -hh * 0.82, mode: 'half-top' },
      { ox: hw * 0.16, oy: -hh * 0.78, mode: 'full' },
    ];

    let bloomsSvg = '';
    blooms.forEach((b) => {
      bloomsSvg += basketBloomHead(cx + b.ox, cy + b.oy, variant, u, scale, b.mode);
    });

    const bloomCy = cy - hh * 0.48;

    return `
      <g class="flower-basket">
        <defs>
          <clipPath id="${clipId}">
            <path d="M${cx - hw * 0.92} ${cy + 1} L${cx + hw * 0.92} ${cy + 1} L${cx + hw * 0.78} ${cy + hh} L${cx - hw * 0.78} ${cy + hh} Z"/>
          </clipPath>
        </defs>
        ${P.pastelShape(
          `M${cx - hw} ${cy} L${cx + hw} ${cy} L${cx + hw * 0.82} ${cy + hh} L${cx - hw * 0.82} ${cy + hh} Z`,
          '#C8A878',
          { uid: u, highlight: '#D8B888', ...noStroke }
        )}
        <g clip-path="url(#${clipId})">${bloomsSvg}</g>
        ${P.pastelShape(
          `M${cx - hw * 0.95} ${cy - 2} L${cx + hw * 0.95} ${cy - 2} L${cx + hw * 0.8} ${cy + 2} L${cx - hw * 0.8} ${cy + 2} Z`,
          '#B89868',
          { uid: u, highlight: '#C8A878', ...noStroke }
        )}
        ${clickable ? basketGlowHalo(cx, bloomCy, flowerId, u, scale) : ''}
      </g>
    `;
  }

  function flowerShopLamp(lx, baseY, topY, u) {
    const noStroke = { strokeWidth: 0 };
    const poleH = baseY - topY;
    const lanternY = topY + poleH * 0.12;
    return `
      ${P.pastelShape(`M${lx - 3.5} ${baseY} L${lx + 3.5} ${baseY} L${lx + 2.5} ${lanternY + 18} L${lx - 2.5} ${lanternY + 18} Z`, '#5A6860', { uid: u, highlight: '#6A7870', ...noStroke })}
      ${P.pastelShape(`M${lx - 10} ${lanternY + 16} L${lx + 10} ${lanternY + 16} L${lx + 9} ${lanternY + 28} L${lx - 9} ${lanternY + 28} Z`, '#4A5850', { uid: u, ...noStroke })}
      ${P.pastelShape(`M${lx - 8} ${lanternY} L${lx + 8} ${lanternY} L${lx + 7} ${lanternY + 16} L${lx - 7} ${lanternY + 16} Z`, '#F8E8C0', { uid: u, highlight: '#FFFAE8', ...noStroke })}
      ${P.pastelCircle(lx, lanternY + 8, 5, '#FFF8E0', u)}
      ${P.pastelShape(`M${lx - 9} ${lanternY - 4} L${lx + 9} ${lanternY - 4} L${lx + 7} ${lanternY} L${lx - 7} ${lanternY} Z`, '#5A6860', { uid: u, ...noStroke })}
      ${P.pastelShape(`M${lx - 7} ${lanternY + 30} Q${lx - 14} ${lanternY + 34} ${lx - 10} ${lanternY + 40} Q${lx - 4} ${lanternY + 36} ${lx} ${lanternY + 32} Q${lx + 4} ${lanternY + 36} ${lx + 10} ${lanternY + 40} Q${lx + 14} ${lanternY + 34} ${lx + 7} ${lanternY + 30} Z`, '#F0A8C8', { uid: u, highlight: '#F8C0D8', ...noStroke })}
      ${P.pastelCircle(lx, lanternY + 35, 3.5, '#E890B0', u)}
    `;
  }

  function seatedChildLegs(cx, seatTop, seatH, groundY, scale, isGirl, u) {
    const noStroke = { strokeWidth: 0 };
    const pants = isGirl ? '#6A6070' : '#5A6070';
    const pantsDeep = isGirl ? '#5A5560' : '#4A5058';
    const footY = groundY - 2 * scale;
    const kneeY = seatTop + seatH + 10 * scale;
    const legSpread = isGirl ? 4.5 : 5;

    return `
      ${P.pastelShape(
        `M${cx - legSpread * scale} ${seatTop + 4 * scale} Q${cx - 20 * scale} ${kneeY} ${cx - 16 * scale} ${footY} L${cx - 10 * scale} ${footY} Q${cx - 13 * scale} ${kneeY} ${cx - 1.5 * scale} ${seatTop + 6 * scale} Z`,
        pants,
        { uid: u, highlight: pantsDeep, ...noStroke }
      )}
      ${P.pastelShape(
        `M${cx + 1 * scale} ${seatTop + 5 * scale} Q${cx - 8 * scale} ${kneeY + 2 * scale} ${cx - 5 * scale} ${footY} L${cx - 1 * scale} ${footY} Q${cx - 4 * scale} ${kneeY} ${cx + legSpread * scale} ${seatTop + 4 * scale} Z`,
        pantsDeep,
        { uid: u, highlight: pants, opacity: 0.92, ...noStroke }
      )}
      ${P.pastelCircle(cx - 14 * scale, footY, 3.2 * scale, '#8A7870', u)}
      ${P.pastelCircle(cx - 4 * scale, footY, 3 * scale, '#8A7870', u)}
    `;
  }

  function seatedChildUpperBody(cx, seatTop, scale, isGirl, u) {
    const noStroke = { strokeWidth: 0 };
    const headR = (isGirl ? 8.6 : 9.4) * scale;
    const headY = seatTop - (isGirl ? 34 : 38.5) * scale;
    const shoulderW = (isGirl ? 12.5 : 13.5) * scale;
    const shoulderY = headY + headR * 0.92;
    const hair = isGirl ? '#6A5040' : '#5A4838';
    const hairLight = isGirl ? '#8A6850' : '#7A5848';
    const skin = '#E8C0A8';
    const outfit = isGirl ? '#E8A8C0' : '#7A98C0';
    const outfitDeep = isGirl ? '#D090A8' : '#6888B0';

    let fig = `
      ${P.pastelShape(
        `M${cx - shoulderW} ${shoulderY - 2 * scale} Q${cx - shoulderW - 1 * scale} ${seatTop + 2 * scale} ${cx - 8 * scale} ${seatTop + 4 * scale} L${cx + 8 * scale} ${seatTop + 4 * scale} Q${cx + shoulderW + 1 * scale} ${seatTop + 2 * scale} ${cx + shoulderW} ${shoulderY - 2 * scale} Q${cx + shoulderW * 0.55} ${headY + headR * 1.15} ${cx} ${headY + headR * 1.05} Q${cx - shoulderW * 0.55} ${headY + headR * 1.15} ${cx - shoulderW} ${shoulderY - 2 * scale} Z`,
        outfit,
        { uid: u, highlight: isGirl ? '#F0B8D0' : '#90A8D0', ...noStroke }
      )}
      ${P.pastelShape(
        `M${cx - shoulderW * 0.75} ${shoulderY} Q${cx - shoulderW * 0.5} ${seatTop + 3 * scale} ${cx - 5 * scale} ${seatTop + 4 * scale} L${cx + 5 * scale} ${seatTop + 4 * scale} Q${cx + shoulderW * 0.5} ${seatTop + 3 * scale} ${cx + shoulderW * 0.75} ${shoulderY} Q${cx + shoulderW * 0.35} ${headY + headR * 1.08} ${cx} ${headY + headR * 1.02} Q${cx - shoulderW * 0.35} ${headY + headR * 1.08} ${cx - shoulderW * 0.75} ${shoulderY} Z`,
        outfitDeep,
        { uid: u, highlight: isGirl ? '#E0A0B8' : '#7898B8', opacity: 0.88, ...noStroke }
      )}
      ${P.pastelCircle(cx, headY, headR * 0.92, skin, u)}
    `;

    if (isGirl) {
      fig += `
        ${P.pastelShape(
          `M${cx - headR * 0.9} ${headY - headR * 0.1} Q${cx - headR * 0.95} ${headY - headR * 0.82} ${cx} ${headY - headR * 0.95} Q${cx + headR * 0.95} ${headY - headR * 0.82} ${cx + headR * 0.9} ${headY - headR * 0.1} L${cx + headR * 0.82} ${headY + headR * 0.38} L${cx} ${headY + headR * 0.42} L${cx - headR * 0.82} ${headY + headR * 0.38} Z`,
          hair,
          { uid: u, highlight: hairLight, ...noStroke }
        )}
        ${P.pastelShape(
          `M${cx - headR * 0.78} ${headY + headR * 0.12} L${cx - headR * 0.68} ${headY + headR * 0.92} L${cx - headR * 0.56} ${headY + headR * 0.9} L${cx - headR * 0.66} ${headY + headR * 0.1} Z`,
          hair,
          { uid: u, highlight: hairLight, opacity: 0.95, ...noStroke }
        )}
        ${P.pastelShape(
          `M${cx + headR * 0.66} ${headY + headR * 0.1} L${cx + headR * 0.56} ${headY + headR * 0.9} L${cx + headR * 0.68} ${headY + headR * 0.92} L${cx + headR * 0.78} ${headY + headR * 0.12} Z`,
          hair,
          { uid: u, highlight: hairLight, opacity: 0.95, ...noStroke }
        )}
        ${P.pastelShape(
          `M${cx - headR * 0.2} ${headY + headR * 0.36} L${cx + headR * 0.2} ${headY + headR * 0.36} L${cx + headR * 0.16} ${headY + headR * 1.02} Q${cx} ${headY + headR * 1.08} ${cx - headR * 0.16} ${headY + headR * 1.02} Z`,
          hair,
          { uid: u, highlight: hairLight, opacity: 0.92, ...noStroke }
        )}
        ${P.pastelCircle(cx, headY + headR * 0.38, 2.1 * scale, '#E8B0C8', u)}
      `;
    } else {
      fig += `
        ${P.pastelShape(
          `M${cx - headR * 0.9} ${headY - headR * 0.08} Q${cx - headR * 0.94} ${headY - headR * 0.88} ${cx} ${headY - headR * 0.98} Q${cx + headR * 0.94} ${headY - headR * 0.88} ${cx + headR * 0.9} ${headY - headR * 0.08} Q${cx + headR * 0.84} ${headY + headR * 0.38} ${cx} ${headY + headR * 0.44} Q${cx - headR * 0.84} ${headY + headR * 0.38} ${cx - headR * 0.9} ${headY - headR * 0.08} Z`,
          hair,
          { uid: u, highlight: hairLight, ...noStroke }
        )}
        ${P.pastelShape(
          `M${cx - headR * 0.55} ${headY - headR * 0.72} L${cx - headR * 0.48} ${headY - headR * 0.82} L${cx - headR * 0.42} ${headY - headR * 0.72} L${cx - headR * 0.48} ${headY - headR * 0.64} Z`,
          hairLight,
          { uid: u, opacity: 0.55, ...noStroke }
        )}
        ${P.pastelShape(
          `M${cx + headR * 0.42} ${headY - headR * 0.72} L${cx + headR * 0.48} ${headY - headR * 0.82} L${cx + headR * 0.55} ${headY - headR * 0.72} L${cx + headR * 0.48} ${headY - headR * 0.64} Z`,
          hairLight,
          { uid: u, opacity: 0.55, ...noStroke }
        )}
      `;
    }

    return fig;
  }

  function parkBenchSlats(x1, x2, y, gap, count, color, altColor, depth, u, noStroke) {
    let out = '';
    const span = x2 - x1;
    for (let i = 0; i < count; i++) {
      const t0 = i / count;
      const t1 = (i + 0.82) / count;
      const sx1 = x1 + span * t0;
      const sx2 = x1 + span * t1;
      out += P.pastelShape(
        `M${sx1} ${y} L${sx2} ${y} L${sx2} ${y + depth} L${sx1} ${y + depth} Z`,
        i % 2 ? altColor : color,
        { uid: u, opacity: 0.96, ...noStroke }
      );
    }
    return out;
  }

  function londonRiversideBench(w, h, u) {
    const noStroke = { strokeWidth: 0 };
    const s = h / 900;
    const benchCx = w * 0.672;
    const groundY = h * 0.985;
    const seatTop = groundY - 40 * s;
    const seatH = 7 * s;
    const seatW = 152 * s;
    const seatLeft = benchCx - seatW * 0.48;
    const seatRight = benchCx + seatW * 0.4;
    const girlShoulderY = seatTop - 34 * s + 8.6 * s * 0.92;
    const backTop = girlShoulderY - 0.5 * s;
    const backBottom = seatTop - 2 * s;
    const frame = '#5A6058';
    const frameDeep = '#4A5048';
    const wood = '#9A8068';
    const woodDeep = '#7A6850';
    const woodLight = '#B89878';
    const boyX = benchCx + seatW * 0.06;
    const girlX = benchCx + seatW * 0.2;
    const coupleCx = (boyX + girlX) * 0.5;
    const coupleCy = seatTop - 50 * s;

    const endFrame = (x, flip) => {
      const dir = flip ? -1 : 1;
      return `
        ${P.pastelShape(
          `M${x} ${seatTop + seatH + 2 * s} L${x} ${backTop - 4 * s} L${x + dir * 5 * s} ${backTop - 4 * s} L${x + dir * 5 * s} ${seatTop + seatH + 2 * s} Z`,
          frameDeep,
          { uid: u, highlight: frame, ...noStroke }
        )}
        ${P.pastelStroke(
          `M${x + dir * 1 * s} ${seatTop - 2 * s} Q${x + dir * 14 * s} ${seatTop - 10 * s} ${x + dir * 14 * s} ${seatTop + 8 * s}`,
          frame,
          2.2 * s,
          u
        )}
        ${P.pastelShape(
          `M${x + dir * 2 * s} ${backBottom - 2 * s} L${x + dir * 10 * s} ${backBottom - 2 * s} L${x + dir * 9 * s} ${backBottom + 3 * s} L${x + dir * 3 * s} ${backBottom + 3 * s} Z`,
          frame,
          { uid: u, highlight: '#6A7068', ...noStroke }
        )}
      `;
    };

    return `
      <g class="london-riverside-bench">
        ${P.pastelShape(
          `M${seatLeft + 8 * s} ${groundY - 1 * s} Q${benchCx + seatW * 0.05} ${groundY + 4 * s} ${seatRight - 4 * s} ${groundY - 1 * s} Z`,
          '#90A080',
          { uid: u, opacity: 0.28, ...noStroke }
        )}
        ${P.pastelShape(
          `M${seatLeft + 12 * s} ${seatTop + seatH + 2 * s} L${seatLeft + 16 * s} ${seatTop + seatH + 2 * s} L${seatLeft + 14 * s} ${groundY - 2 * s} L${seatLeft + 10 * s} ${groundY - 2 * s} Z`,
          frameDeep,
          { uid: u, highlight: frame, ...noStroke }
        )}
        ${P.pastelShape(
          `M${seatRight - 20 * s} ${seatTop + seatH + 2 * s} L${seatRight - 16 * s} ${seatTop + seatH + 2 * s} L${seatRight - 18 * s} ${groundY - 2 * s} L${seatRight - 22 * s} ${groundY - 2 * s} Z`,
          frameDeep,
          { uid: u, highlight: frame, ...noStroke }
        )}
        ${seatedChildLegs(boyX, seatTop, seatH, groundY, s, false, u)}
        ${seatedChildLegs(girlX, seatTop, seatH, groundY, s, true, u)}
        ${seatedChildUpperBody(boyX, seatTop, s, false, u)}
        ${seatedChildUpperBody(girlX, seatTop, s, true, u)}
        ${parkBenchSlats(seatLeft + 8 * s, seatRight - 8 * s, seatTop, 2.8 * s, 5, woodLight, wood, seatH, u, noStroke)}
        ${P.pastelShape(
          `M${seatLeft + 6 * s} ${seatTop + seatH} L${seatRight - 6 * s} ${seatTop + seatH} L${seatRight - 6 * s} ${seatTop + seatH + 3 * s} L${seatLeft + 6 * s} ${seatTop + seatH + 3 * s} Z`,
          woodDeep,
          { uid: u, highlight: wood, ...noStroke }
        )}
        ${P.pastelShape(
          `M${seatLeft + 4 * s} ${backTop} L${seatRight - 4 * s} ${backTop} L${seatRight - 4 * s} ${backBottom} L${seatLeft + 4 * s} ${backBottom} Z`,
          wood,
          { uid: u, highlight: woodLight, opacity: 0.98, ...noStroke }
        )}
        ${P.pastelShape(
          `M${seatLeft + 4 * s} ${backTop - 1.5 * s} L${seatRight - 4 * s} ${backTop - 1.5 * s} L${seatRight - 4 * s} ${backTop} L${seatLeft + 4 * s} ${backTop} Z`,
          woodDeep,
          { uid: u, highlight: wood, ...noStroke }
        )}
        ${endFrame(seatLeft, 1)}
        ${endFrame(seatRight, -1)}
        ${coupleChatHint(coupleCx, coupleCy, u, s)}
      </g>
    `;
  }

  function londonFlowerShop(w, h, u) {
    const noStroke = { strokeWidth: 0 };
    const groundY = h * 0.985;
    const bw = w * 0.17;
    const bh = h * 0.28;
    const bx = w * 0.07;
    const by = groundY - bh;
    const doorX = bx + bw * 0.58;
    const winL = bx + bw * 0.1;
    const winR = bx + bw * 0.4;
    const winT = by + bh * 0.46;
    const winB = by + bh * 0.72;
    const awningBottom = by + bh * 0.52;
    const doorCenterX = doorX + bw * 0.12;
    const doorW = bw * 0.15;
    const doorTop = awningBottom + bh * 0.02;
    const doorLeft = doorCenterX - doorW * 0.5;

    let shop = `
      ${flowerShopLamp(bx - w * 0.028, groundY, by - h * 0.06, u)}
      ${P.pastelShape(
        `M${bx} ${by + bh} L${bx} ${by + bh * 0.26} L${bx + bw * 0.5} ${by} L${bx + bw} ${by + bh * 0.26} L${bx + bw} ${by + bh} Z`,
        '#F8ECE0',
        { uid: u, highlight: '#FFFAF4', ...noStroke }
      )}
      ${P.pastelShape(
        `M${bx} ${by + bh} L${bx + bw} ${by + bh} L${bx + bw} ${by + bh * 0.36} L${bx} ${by + bh * 0.36} Z`,
        '#EDE4D8',
        { uid: u, highlight: '#F8F0E8', ...noStroke }
      )}
      ${P.pastelShape(
        `M${doorX - bw * 0.04} ${by + bh * 0.36} L${bx + bw + bw * 0.05} ${by + bh * 0.36} L${bx + bw + bw * 0.05} ${by + bh * 0.52} L${doorX - bw * 0.04} ${by + bh * 0.52} Z`,
        '#F0B8B8',
        { uid: u, highlight: '#F8C8C8', opacity: 0.92, ...noStroke }
      )}
      ${P.pastelShape(
        `M${doorX - bw * 0.04} ${by + bh * 0.36} L${bx + bw + bw * 0.015} ${by + bh * 0.36} L${bx + bw + bw * 0.015} ${by + bh * 0.52} L${doorX - bw * 0.04} ${by + bh * 0.52} Z`,
        '#F8D0D0',
        { uid: u, highlight: '#FFE0E0', opacity: 0.88, ...noStroke }
      )}
      ${P.pastelShape(
        `M${doorLeft - 2} ${doorTop - 2} L${doorLeft + doorW + 2} ${doorTop - 2} L${doorLeft + doorW + 2} ${by + bh + 1} L${doorLeft - 2} ${by + bh + 1} Z`,
        '#C8B8A8',
        { uid: u, highlight: '#D8C8B8', ...noStroke }
      )}
      ${P.pastelShape(
        `M${doorLeft} ${doorTop} L${doorLeft + doorW} ${doorTop} L${doorLeft + doorW} ${by + bh} L${doorLeft} ${by + bh} Z`,
        '#B89878',
        { uid: u, highlight: '#C8A888', ...noStroke }
      )}
      ${P.pastelShape(
        `M${doorLeft + doorW * 0.5 - 1} ${doorTop + 3} L${doorLeft + doorW * 0.5 + 1} ${doorTop + 3} L${doorLeft + doorW * 0.5 + 1} ${by + bh - 3} L${doorLeft + doorW * 0.5 - 1} ${by + bh - 3} Z`,
        '#A88868',
        { uid: u, opacity: 0.5, ...noStroke }
      )}
      ${P.pastelCircle(doorLeft + doorW - 5, doorTop + (by + bh - doorTop) * 0.52, 2.5, '#D8C8A8', u)}
      ${P.pastelShape(
        `M${winL - 3} ${winT - 3} L${winR + 3} ${winT - 3} L${winR + 3} ${winB + 3} L${winL - 3} ${winB + 3} Z`,
        '#C8B8A8',
        { uid: u, highlight: '#D8C8B8', ...noStroke }
      )}
      ${P.pastelShape(
        `M${winL} ${winT} L${winR} ${winT} L${winR} ${winB} L${winL} ${winB} Z`,
        '#C8DCE8',
        { uid: u, highlight: '#E0EEF8', opacity: 0.92, ...noStroke }
      )}
      ${P.pastelShape(
        `M${winL + (winR - winL) * 0.5 - 1.5} ${winT} L${winL + (winR - winL) * 0.5 + 1.5} ${winT} L${winL + (winR - winL) * 0.5 + 1.5} ${winB} L${winL + (winR - winL) * 0.5 - 1.5} ${winB} Z`,
        '#B8CCD8',
        { uid: u, opacity: 0.55, ...noStroke }
      )}
      ${P.pastelShape(
        `M${winL} ${winT + (winB - winT) * 0.5 - 1.5} L${winR} ${winT + (winB - winT) * 0.5 - 1.5} L${winR} ${winT + (winB - winT) * 0.5 + 1.5} L${winL} ${winT + (winB - winT) * 0.5 + 1.5} Z`,
        '#B8CCD8',
        { uid: u, opacity: 0.55, ...noStroke }
      )}
      ${P.pastelShape(
        `M${winL + 4} ${winT + 4} L${winL + (winR - winL) * 0.5 - 4} ${winT + 4} L${winL + (winR - winL) * 0.5 - 8} ${winT + (winB - winT) * 0.5 - 4} L${winL + 4} ${winT + (winB - winT) * 0.5 - 4} Z`,
        '#E8F4FA',
        { uid: u, opacity: 0.45, ...noStroke }
      )}
      ${P.pastelShape(
        `M${bx + bw * 0.16} ${by + bh * 0.2} L${bx + bw * 0.84} ${by + bh * 0.2} L${bx + bw * 0.84} ${by + bh * 0.33} L${bx + bw * 0.16} ${by + bh * 0.33} Z`,
        '#FAF0E4',
        { uid: u, highlight: '#FFFAF4', opacity: 0.95, ...noStroke }
      )}
      <text x="${bx + bw * 0.5}" y="${by + bh * 0.28}" font-family="Cormorant Garamond, serif" font-size="${Math.max(14, w * 0.014)}" font-weight="600" fill="#9A8070" text-anchor="middle">Flower</text>
    `;

    const baskets = window.ACT2_BASKET_FLOWERS || [];
    const basketScale = 1.12;

    baskets.forEach((b) => {
      const cx = w * (b.x / 100);
      const cy = h * (b.rimY / 100);
      shop += flowerBasket(cx, cy, b.type, u, basketScale, b.clickable, b.instanceId);
    });

    return `<g class="london-flower-shop">${shop}</g>`;
  }

  function londonSkyline(w, h, u) {
    const shoreY = h * 0.5;
    const riverTop = h * 0.57;
    const riverBottom = h * 0.94;
    const riverLeft = w * 0.02;
    const riverRight = w * 0.98;
    const noStroke = { strokeWidth: 0 };

    const skyGlow = `
      ${P.pastelCircle(w * 0.5, h * 0.26, 118, '#F8C898', u)}
      ${P.pastelCircle(w * 0.5, h * 0.26, 78, '#F8D8B0', u)}
    `;

    const parliament = P.pastelShape(
      `M${w * 0.04} ${shoreY} L${w * 0.07} ${shoreY - 58} L${w * 0.12} ${shoreY - 42} L${w * 0.17} ${shoreY - 66} L${w * 0.22} ${shoreY - 46} L${w * 0.27} ${shoreY - 62} L${w * 0.32} ${shoreY - 40} L${w * 0.37} ${shoreY - 54} L${w * 0.42} ${shoreY - 32} L${w * 0.48} ${shoreY} Z`,
      '#889098',
      { uid: u, highlight: '#A0A8B0', opacity: 0.92, ...noStroke }
    );

    const bx = w * 0.39;
    const northBank = `
      ${P.pastelShape(
        `M0 ${riverTop} L0 ${shoreY} L${w * 0.54} ${shoreY} L${w * 0.58} ${riverTop} Z`,
        '#A8A498',
        { uid: u, highlight: '#C0B8B0', opacity: 0.94, ...noStroke }
      )}
      ${P.pastelShape(
        `M${bx - 10} ${shoreY} L${bx + 58} ${shoreY} L${bx + 54} ${riverTop} L${bx - 6} ${riverTop} Z`,
        '#989088',
        { uid: u, highlight: '#B0A8A0', opacity: 0.9, ...noStroke }
      )}
    `;

    const bigBen = `
      ${P.pastelShape(`M${bx + 14} ${shoreY - 168} L${bx + 38} ${shoreY - 168} L${bx + 40} ${shoreY - 90} L${bx + 12} ${shoreY - 90} Z`, '#788088', { uid: u, highlight: '#98A0A8', ...noStroke })}
      ${P.pastelShape(`M${bx + 4} ${shoreY - 88} L${bx + 48} ${shoreY - 88} L${bx + 46} ${shoreY} L${bx + 6} ${shoreY} Z`, '#889098', { uid: u, highlight: '#A0A8B0', ...noStroke })}
      ${P.pastelShape(`M${bx + 20} ${shoreY - 192} L${bx + 32} ${shoreY - 192} L${bx + 30} ${shoreY - 168} L${bx + 22} ${shoreY - 168} Z`, '#9098A0', { uid: u, ...noStroke })}
      ${P.pastelCircle(bx + 26, shoreY - 108, 12, '#F0E8C8', u)}
    `;

    const riverBanks = `
      ${P.pastelShape(
        `M0 ${riverTop} L${w * 0.22} ${riverTop} L${w * 0.22} ${riverBottom} L0 ${riverBottom} Z`,
        '#A8A498',
        { uid: u, highlight: '#C0B8B0', opacity: 0.92, ...noStroke }
      )}
      ${P.pastelShape(
        `M${w * 0.78} ${riverTop} L${w} ${riverTop} L${w} ${riverBottom} L${w * 0.78} ${riverBottom} Z`,
        '#A8A498',
        { uid: u, highlight: '#C0B8B0', opacity: 0.92, ...noStroke }
      )}
      ${P.pastelShape(
        `M0 ${riverBottom} L${w} ${riverBottom} L${w} ${h} L0 ${h} Z`,
        '#B0BCA0',
        { uid: u, highlight: '#C0CCB0', opacity: 0.95, ...noStroke }
      )}
    `;

    const river = `
      ${P.pastelShape(
        `M${riverLeft} ${riverTop} Q${w * 0.5} ${riverTop - 14} ${riverRight} ${riverTop} L${riverRight} ${riverBottom} Q${w * 0.5} ${riverBottom + 10} ${riverLeft} ${riverBottom} Z`,
        '#90B0BC',
        { uid: u, highlight: '#B0CCD4', opacity: 0.72, ...noStroke }
      )}
      ${P.pastelShape(
        `M${riverLeft + 8} ${riverTop + 10} Q${w * 0.5} ${riverTop + 4} ${riverRight - 8} ${riverTop + 10} L${riverRight - 8} ${riverBottom - 8} Q${w * 0.5} ${riverBottom - 4} ${riverLeft + 8} ${riverBottom - 8} Z`,
        '#A8C8D0',
        { uid: u, highlight: '#C0DCE4', opacity: 0.38, ...noStroke }
      )}
    `;

    let railings = '';
    const topRailY = riverTop - 2;
    const bottomRailY = riverBottom + 2;
    railings += P.pastelShape(
      `M${riverLeft} ${topRailY - 10} L${riverRight} ${topRailY - 10} L${riverRight} ${topRailY - 6} L${riverLeft} ${topRailY - 6} Z`,
      '#B8B0A0',
      { uid: u, opacity: 0.8, ...noStroke }
    );
    railings += P.pastelShape(
      `M${riverLeft} ${bottomRailY + 6} L${riverRight} ${bottomRailY + 6} L${riverRight} ${bottomRailY + 10} L${riverLeft} ${bottomRailY + 10} Z`,
      '#B8B0A0',
      { uid: u, opacity: 0.8, ...noStroke }
    );
    for (let i = 0; i < 20; i++) {
      const rx = riverLeft + i * ((riverRight - riverLeft) / 19);
      railings += P.pastelShape(
        `M${rx} ${topRailY - 18} L${rx + 4} ${topRailY - 18} L${rx + 4} ${topRailY - 4} L${rx} ${topRailY - 4} Z`,
        '#A8A090',
        { uid: u, opacity: 0.75, ...noStroke }
      );
      railings += P.pastelShape(
        `M${rx} ${bottomRailY + 4} L${rx + 4} ${bottomRailY + 4} L${rx + 4} ${bottomRailY + 18} L${rx} ${bottomRailY + 18} Z`,
        '#A8A090',
        { uid: u, opacity: 0.75, ...noStroke }
      );
    }

    let lamps = '';
    [0.36, 0.5, 0.64].forEach((frac) => {
      const lx = w * frac;
      const ly = topRailY - 6;
      lamps += P.pastelShape(
        `M${lx - 3} ${ly} L${lx + 3} ${ly} L${lx + 2.5} ${ly - 30} L${lx - 2.5} ${ly - 30} Z`,
        '#5A6860',
        { uid: u, opacity: 0.88, ...noStroke }
      );
      lamps += P.pastelShape(
        `M${lx - 7} ${ly - 34} L${lx + 7} ${ly - 34} L${lx + 6} ${ly - 40} L${lx - 6} ${ly - 40} Z`,
        '#4A5850',
        { uid: u, opacity: 0.85, ...noStroke }
      );
      lamps += P.pastelCircle(lx, ly - 44, 7, '#F8E8C0', u);
    });

    const boatX = w * 0.5;
    const boatY = h * 0.76;
    const boat = `
      <g class="thames-boat">
      ${P.pastelShape(
        `M${boatX - 62} ${boatY} Q${boatX} ${boatY - 22} ${boatX + 62} ${boatY} L${boatX + 54} ${boatY + 18} Q${boatX} ${boatY + 28} ${boatX - 54} ${boatY + 18} Z`,
        '#8A6848',
        { uid: u, highlight: '#A88068', ...noStroke }
      )}
      ${P.pastelShape(
        `M${boatX - 28} ${boatY - 6} L${boatX + 28} ${boatY - 6} L${boatX + 24} ${boatY + 8} L${boatX - 24} ${boatY + 8} Z`,
        '#D0C0A8',
        { uid: u, highlight: '#E8D8C0', ...noStroke }
      )}
      ${P.pastelShape(
        `M${boatX - 3} ${boatY - 6} L${boatX + 3} ${boatY - 6} L${boatX + 2} ${boatY - 52} L${boatX - 2} ${boatY - 52} Z`,
        '#8A7868',
        { uid: u, ...noStroke }
      )}
      ${P.pastelShape(
        `M${boatX - 26} ${boatY - 52} L${boatX + 26} ${boatY - 52} L${boatX + 22} ${boatY - 38} L${boatX - 22} ${boatY - 38} Z`,
        '#F0E8D8',
        { uid: u, highlight: '#FAF4EC', opacity: 0.92, ...noStroke }
      )}
      </g>
    `;

    return { skyGlow, northBank, parliament, bigBen, riverBanks, river, railings, lamps, boat, flowerShop: londonFlowerShop(w, h, u), riversideBench: londonRiversideBench(w, h, u), riverTop, riverBottom };
  }

  function londonEdgeForest(w, h, u, riverTop, riverBottom) {
    const back = [];
    const mid = [];
    const front = [];
    const groundY = h * 0.96;
    const perSide = 12;

    for (let side = 0; side < 2; side++) {
      const isLeft = side === 0;
      for (let i = 0; i < perSide; i++) {
        const idx = side * perSide + i;
        const layer = i < 4 ? 'back' : i < 8 ? 'mid' : 'front';
        const colors = PALETTE[(idx + (isLeft ? 0 : 5)) % PALETTE.length];
        const edgeFrac = i / (perSide - 1);
        const x = isLeft
          ? w * (0.04 + edgeFrac * 0.15) + (P.seeded(idx, 3) - 0.5) * w * 0.015
          : w * (0.81 + edgeFrac * 0.15) + (P.seeded(idx, 3) - 0.5) * w * 0.015;

        let height; let spread;
        if (layer === 'back') {
          height = h * (0.42 + P.seeded(idx, 7) * 0.1);
          spread = height * 0.36;
        } else if (layer === 'mid') {
          height = h * (0.52 + P.seeded(idx, 7) * 0.12);
          spread = height * 0.38;
        } else {
          height = h * (0.6 + P.seeded(idx, 7) * 0.14);
          spread = height * 0.42;
        }

        const tree = cedarTree(x, groundY, height, spread, colors, u);
        if (layer === 'back') back.push(tree);
        else if (layer === 'mid') mid.push(tree);
        else front.push(tree);
      }
    }

    return { back, mid, front };
  }

  function denseJungleTrees(w, h, u) {
    const total = 36;
    const back = [];
    const mid = [];
    const front = [];

    for (let i = 0; i < total; i++) {
      const layer = i < 12 ? 'back' : i < 24 ? 'mid' : 'front';
      const colors = PALETTE[i % PALETTE.length];
      const x = w * (-0.03 + (i / (total - 1)) * 1.06) + (P.seeded(i, 3) - 0.5) * w * 0.05;

      let height; let spread; let baseY;
      if (layer === 'back') {
        height = h * (0.38 + P.seeded(i, 7) * 0.14);
        spread = height * 0.36;
        baseY = h * (0.76 + P.seeded(i, 11) * 0.04);
      } else if (layer === 'mid') {
        height = h * (0.48 + P.seeded(i, 7) * 0.18);
        spread = height * 0.34;
        baseY = h * (0.82 + P.seeded(i, 11) * 0.04);
      } else {
        height = h * (0.55 + P.seeded(i, 7) * 0.2);
        spread = height * 0.32;
        baseY = h * (0.86 + P.seeded(i, 11) * 0.03);
      }

      const tree = cedarTree(x, baseY, height, spread, colors, u);
      if (layer === 'back') back.push(tree);
      else if (layer === 'mid') mid.push(tree);
      else front.push(tree);
    }

    return { back, mid, front };
  }

  function heatherClump(cx, cy, s, u, i) {
    let stems = '';
    for (let j = 0; j < 7; j++) {
      const fx = cx + (P.seeded(i, j + 1) - 0.5) * 16 * s;
      const fy = cy - (j % 4) * 2.5 * s;
      const col = j % 3 ? '#A868B0' : '#8A5898';
      stems += P.pastelCircle(fx, fy, (1.6 + P.seeded(j, i) * 0.8) * s, col, u);
      stems += P.pastelStroke(`M${P.pt(fx)} ${P.pt(fy + 2 * s)} L${P.pt(fx)} ${P.pt(fy + 9 * s)}`, '#4A5848', 0.7, u);
    }
    return `<g class="act3-heather">${stems}</g>`;
  }

  function wildDaisy(cx, cy, s, u) {
    const petals = [0, 60, 120, 180, 240, 300].map((rot) =>
      `<ellipse cx="0" cy="${-4 * s}" rx="${2.2 * s}" ry="${4.5 * s}" fill="#F4F0E4" opacity="0.92" transform="rotate(${rot})"/>`
    ).join('');
    return `<g class="act3-daisy" transform="translate(${cx},${cy}) scale(${s})">${petals}${P.pastelCircle(0, 0, 2.2 * s, '#E8C848', u)}</g>`;
  }

  function mossPatch(x, y, rw, u) {
    return P.pastelShape(
      `M${x} ${y} q${rw * 0.35} -${rw * 0.25} ${rw * 0.9} -${rw * 0.05} q${rw * 0.25} ${rw * 0.2} ${rw * 0.05} ${rw * 0.35} q-${rw * 0.45} ${rw * 0.12} -${rw} ${rw * 0.05} Z`,
      '#3A5840',
      { uid: u, highlight: '#4A6848', opacity: 0.78, strokeWidth: 0.3 }
    );
  }

  function fallenBranch(x, y, rot, u) {
    return `<g class="act3-log" transform="translate(${x},${y}) rotate(${rot})">
      ${P.pastelShape('M0 4 Q36 0 72 4 Q78 10 72 14 Q36 18 0 14 Z', '#5A4838', { uid: u, highlight: '#6A5848', strokeWidth: 0.45 })}
      ${mossPatch(18, 2, 14, u)}
      ${mossPatch(48, 4, 11, u)}
    </g>`;
  }

  function act3Feather(x, y, rot, u) {
    return `<g class="act3-feather" transform="translate(${x},${y}) rotate(${rot})">
      ${P.pastelShape('M0 0 Q10 -3 22 0 Q12 4 0 8 Z', '#E4E0D4', { uid: u, highlight: '#F2EEE6', opacity: 0.88, strokeWidth: 0.35 })}
      ${P.pastelStroke('M4 2 L18 1', '#D8D4C8', 0.5, u)}
    </g>`;
  }

  function act3TallGrassBlade(x, y, bh, u, i) {
    const bend = (P.seeded(i, 11) - 0.5) * 10;
    const d = `M ${P.pt(x)} ${P.pt(y)} Q ${P.pt(x + bend)} ${P.pt(y - bh * 0.55)} ${P.pt(x + bend * 0.65)} ${P.pt(y - bh)}`;
    const delay = Math.floor(P.seeded(i, 13) * 2800);
    const col = i % 3 ? '#6A7858' : i % 2 ? '#8A9868' : '#7A8860';
    return `<g class="act3-tall-grass" style="--sway-delay:${delay}ms">${P.pastelStroke(d, col, 1.6 + P.seeded(i, 17) * 1.4, u)}</g>`;
  }

  function act3CrescentMoonDef(cx, cy, r, u) {
    const cutX = cx - r * 0.42;
    const cutY = cy + r * 0.02;
    const cutR = r * 0.86;
    return `<mask id="act3MoonMask-${u}">
      <circle cx="${cx}" cy="${cy}" r="${r + 0.5}" fill="white"/>
      <circle cx="${cutX}" cy="${cutY}" r="${cutR}" fill="black"/>
    </mask>`;
  }

  function act3CrescentMoon(cx, cy, r, u) {
    return `<g class="act3-moon" mask="url(#act3MoonMask-${u})">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#E4DCD0" opacity="0.94" filter="url(#pastel-wash-${u})"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#F2ECE2" opacity="0.9"/>
      <circle cx="${cx + r * 0.18}" cy="${cy + r * 0.06}" r="${r * 0.55}" fill="#FAF6EE" opacity="0.35"/>
    </g>`;
  }

  function arthurEdgeTrees(w, h, u) {
    const back = [];
    const mid = [];
    const front = [];
    const groundY = h * 0.96;
    const perSide = 12;

    for (let side = 0; side < 2; side++) {
      const isLeft = side === 0;
      for (let i = 0; i < perSide; i++) {
        const idx = side * perSide + i;
        const layer = i < 4 ? 'back' : i < 8 ? 'mid' : 'front';
        const colors = PALETTE[(idx + (isLeft ? 0 : 5)) % PALETTE.length];
        const edgeFrac = i / (perSide - 1);
        const x = isLeft
          ? w * (0.04 + edgeFrac * 0.15) + (P.seeded(idx, 3) - 0.5) * w * 0.015
          : w * (0.81 + edgeFrac * 0.15) + (P.seeded(idx, 3) - 0.5) * w * 0.015;

        let height; let spread;
        if (isLeft) {
          if (layer === 'back') {
            height = h * (0.22 + P.seeded(idx, 7) * 0.06);
            spread = height * 0.34;
          } else if (layer === 'mid') {
            height = h * (0.26 + P.seeded(idx, 7) * 0.07);
            spread = height * 0.36;
          } else {
            height = h * (0.3 + P.seeded(idx, 7) * 0.08);
            spread = height * 0.38;
          }
        } else if (layer === 'back') {
          height = h * (0.42 + P.seeded(idx, 7) * 0.1);
          spread = height * 0.36;
        } else if (layer === 'mid') {
          height = h * (0.52 + P.seeded(idx, 7) * 0.12);
          spread = height * 0.38;
        } else {
          height = h * (0.6 + P.seeded(idx, 7) * 0.14);
          spread = height * 0.42;
        }

        const tree = cedarTree(x, groundY, height, spread, colors, u);
        if (layer === 'back') back.push(tree);
        else if (layer === 'mid') mid.push(tree);
        else front.push(tree);
      }
    }

    return { back, mid, front };
  }

  function buildArthurSeatForest(w, h) {
    const u = uid();
    const noStroke = { strokeWidth: 0 };
    const groundY = h * 0.94;

    let stars = '';
    for (let i = 0; i < 28; i++) {
      const sx = w * (P.seeded(i, 1) * 0.94 + 0.03);
      const sy = h * (P.seeded(i, 5) * 0.5 + 0.04);
      const sr = 0.5 + P.seeded(i, 9) * 1.1;
      stars += P.pastelCircle(sx, sy, sr, '#E8E0D0', u);
    }

    const dipper = [
      { x: 0.12, y: 0.24, r: 2.8 },
      { x: 0.08, y: 0.32, r: 2.4 },
      { x: 0.16, y: 0.36, r: 2.4 },
      { x: 0.22, y: 0.30, r: 2.6 },
      { x: 0.28, y: 0.27, r: 2.5 },
      { x: 0.35, y: 0.24, r: 2.4 },
      { x: 0.42, y: 0.20, r: 2.8 },
    ];
    const dipperPts = dipper.map((s) => ({ x: w * s.x, y: h * s.y }));
    const dipperLines = [
      [0, 3], [3, 2], [2, 1], [1, 0],
      [3, 4], [4, 5], [5, 6],
    ];
    let bigDipper = '';
    dipperLines.forEach(([a, b]) => {
      const p1 = dipperPts[a];
      const p2 = dipperPts[b];
      bigDipper += P.pastelStroke(
        `M${p1.x} ${p1.y} L${p2.x} ${p2.y}`,
        '#D8D0C0',
        0.9,
        u
      );
    });
    dipper.forEach((s) => {
      bigDipper += P.pastelCircle(w * s.x, h * s.y, s.r, '#F4EEE0', u);
    });

    const dipperHaloStar = dipper[4];
    const dipperHalo = subtleSunflowerHalo(
      w * dipperHaloStar.x,
      h * dipperHaloStar.y,
      'sf-7',
      u,
      (h / 900) * 0.88,
      'faint'
    );

    const moonX = w * 0.72;
    const moonY = h * 0.22;
    const moonR = 28;
    const crescentMoon = act3CrescentMoon(moonX, moonY, moonR, u);

    let midGrass = '';
    for (let i = 0; i < 36; i++) {
      const gx = w * (0.1 + P.seeded(i, 3) * 0.82);
      const gy = h * (0.62 + P.seeded(i, 7) * 0.28);
      midGrass += act3TallGrassBlade(gx, gy, 14 + P.seeded(i, 9) * 10, u, i + 200);
    }

    let frontGrass = '';
    for (let i = 0; i < 52; i++) {
      const gx = w * (0.02 + P.seeded(i, 2) * 0.96);
      const gy = h * (0.86 + P.seeded(i, 4) * 0.1);
      frontGrass += act3TallGrassBlade(gx, gy, 22 + P.seeded(i, 6) * 18, u, i + 300);
    }

    let rocks = '';
    const rockSpots = [
      [0.14, 0.9, 11, 7], [0.22, 0.92, 7, 5], [0.31, 0.88, 14, 8],
      [0.55, 0.91, 9, 6], [0.68, 0.89, 16, 9], [0.78, 0.93, 8, 5], [0.88, 0.9, 12, 7],
    ];
    rockSpots.forEach(([xp, yp, rw, rh]) => {
      rocks += rock(w * xp, h * yp, rw, rh, u);
    });

    let mushrooms = '';
    [[0.18, 0.9, 0.9], [0.42, 0.92, 0.7], [0.61, 0.91, 1], [0.84, 0.89, 0.75]].forEach(([xp, yp, sc]) => {
      mushrooms += mushroom(w * xp, h * yp, sc, u);
    });

    let heather = '';
    [[0.12, 0.87], [0.26, 0.85], [0.38, 0.9], [0.52, 0.86], [0.72, 0.88], [0.9, 0.87]].forEach(([xp, yp], i) => {
      heather += heatherClump(w * xp, h * yp, 0.85 + P.seeded(i, 4) * 0.35, u, i + 40);
    });

    let daisies = '';
    [[0.08, 0.91], [0.2, 0.88], [0.35, 0.93], [0.48, 0.9], [0.64, 0.92], [0.76, 0.88], [0.92, 0.91]].forEach(([xp, yp], i) => {
      daisies += wildDaisy(w * xp, h * yp, 0.75 + P.seeded(i, 8) * 0.35, u);
    });

    let moss = '';
    [[0.25, 0.78], [0.45, 0.55], [0.62, 0.62], [0.35, 0.92], [0.7, 0.94]].forEach(([xp, yp], i) => {
      moss += mossPatch(w * xp, h * yp, 18 + P.seeded(i, 6) * 14, u);
    });

    const trees = arthurEdgeTrees(w, h, u);

    const inner = `
      <rect width="${w}" height="${h}" fill="url(#arthurSky-${u})"/>
      ${P.pastelShape(
        `M0 ${groundY} L${w} ${groundY} L${w} ${h} L0 ${h} Z`,
        '#3A5040',
        { uid: u, highlight: '#4A6048', opacity: 0.92, ...noStroke }
      )}
      ${P.pastelShape(
        `M0 ${groundY} L${w * 0.08} ${h * 0.78} L${w * 0.28} ${h * 0.58} L${w * 0.48} ${h * 0.42} L${w * 0.68} ${h * 0.52} L${w * 0.88} ${h * 0.74} L${w} ${groundY} Z`,
        '#4A5850',
        { uid: u, highlight: '#5A6860', opacity: 0.94, ...noStroke }
      )}
      <g class="act3-mid">${moss}${midGrass}
        <g class="act3-grass-wave">${P.pastelStroke(
          `M${w * 0.22} ${h * 0.74} Q${w * 0.38} ${h * 0.7} ${w * 0.52} ${h * 0.74} Q${w * 0.66} ${h * 0.78} ${w * 0.8} ${h * 0.73}`,
          '#5A6848',
          2.2,
          u
        )}</g>
      </g>
      <g class="act3-front">${rocks}${mushrooms}${heather}${daisies}${moss}${frontGrass}
        ${fallenBranch(w * 0.32, h * 0.9, -8, u)}
        ${act3Feather(w * 0.47, h * 0.895, 24, u)}
      </g>
      <g class="jungle-back">${trees.back.join('')}</g>
      <g class="jungle-mid">${trees.mid.join('')}</g>
      <g class="jungle-front">${trees.front.join('')}</g>
      <g class="act3-sky-stars">${stars}${crescentMoon}${bigDipper}${dipperHalo}</g>
    `;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" class="pastel-art arthur-seat act3-arthur">
      ${P.globalDefs(u)}
      <defs>
        <linearGradient id="arthurSky-${u}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0E1428"/>
          <stop offset="45%" stop-color="#1A2240"/>
          <stop offset="72%" stop-color="#2A2848"/>
          <stop offset="100%" stop-color="#1A2038"/>
        </linearGradient>
        ${act3CrescentMoonDef(moonX, moonY, moonR, u)}
      </defs>
      <g filter="url(#pastel-edge-${u})">${sceneZoomWrap(inner, h)}</g>
      ${P.grainOverlay(u, w, h)}
    </svg>`;
  }

  function buildLondonForest(w, h) {
    const u = uid();
    const sky = londonSkyline(w, h, u);
    const trees = londonEdgeForest(w, h, u, sky.riverTop, sky.riverBottom);

    const inner = `
      <rect width="${w}" height="${h}" fill="url(#londonSky-${u})"/>
      ${sky.skyGlow}
      ${sky.northBank}
      ${sky.parliament}
      ${sky.bigBen}
      ${P.pastelCircle(w * 0.5, h * 0.26, 42, '#F0A868', u)}
      ${P.pastelCircle(w * 0.5, h * 0.26, 32, '#F8C078', u)}
      ${P.pastelCircle(w * 0.5, h * 0.26, 22, '#F8D8A0', u)}
      ${P.pastelCircle(w * 0.5, h * 0.26, 14, '#FAE8C8', u)}
      ${sky.riverBanks}
      ${sky.river}
      ${sky.boat}
      ${sky.railings}
      ${sky.lamps}
      <g class="jungle-back">${trees.back.join('')}</g>
      <g class="jungle-mid">${trees.mid.join('')}</g>
      <g class="jungle-front">${trees.front.join('')}</g>
      ${sky.flowerShop}
      ${sky.riversideBench}
      ${act2SunflowerHalos(w, h, u)}
    `;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" class="pastel-art london-forest act2-london">
      ${P.globalDefs(u)}
      <defs>
        <linearGradient id="londonSky-${u}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#98A4B4"/>
          <stop offset="30%" stop-color="#D0A888"/>
          <stop offset="52%" stop-color="#F0B878"/>
          <stop offset="68%" stop-color="#F8D0A0"/>
          <stop offset="100%" stop-color="#A8C0C8"/>
        </linearGradient>
      </defs>
      <g filter="url(#pastel-edge-${u})">${sceneZoomWrap(inner, h)}</g>
      ${P.grainOverlay(u, w, h)}
    </svg>`;
  }

  function parkCloud(cx, cy, scale, u) {
    const s = scale;
    return P.pastelShape(
      `M${cx - 54 * s} ${cy + 4 * s}
       Q${cx - 58 * s} ${cy - 16 * s} ${cx - 24 * s} ${cy - 18 * s}
       Q${cx} ${cy - 24 * s} ${cx + 30 * s} ${cy - 16 * s}
       Q${cx + 56 * s} ${cy - 10 * s} ${cx + 50 * s} ${cy + 6 * s}
       Q${cx + 8 * s} ${cy + 12 * s} ${cx - 54 * s} ${cy + 4 * s} Z`,
      '#F8FAFE',
      { uid: u, highlight: '#FFFFFF', opacity: 0.78, strokeWidth: 0 }
    );
  }

  function parkEdgeHalfTrees(w, h, u) {
    const front = [];
    const mid = [];

    const leftSpecs = [
      { x: -w * 0.07, baseY: h * 0.998, height: h * 0.92, pal: 0 },
      { x: w * 0.022, baseY: h * 0.975, height: h * 0.78, pal: 1 },
      { x: -w * 0.035, baseY: h * 0.93, height: h * 0.62, pal: 2 },
      { x: w * 0.05, baseY: h * 0.87, height: h * 0.5, pal: 3 },
    ];
    const rightSpecs = [
      { x: w * 1.07, baseY: h * 0.998, height: h * 0.9, pal: 4 },
      { x: w * 0.978, baseY: h * 0.975, height: h * 0.76, pal: 5 },
      { x: w * 1.035, baseY: h * 0.925, height: h * 0.6, pal: 0 },
      { x: w * 0.95, baseY: h * 0.865, height: h * 0.48, pal: 1 },
    ];

    leftSpecs.forEach((spec, i) => {
      const spread = spec.height * 0.44;
      const tree = cedarTree(spec.x, spec.baseY, spec.height, spread, PALETTE[spec.pal % PALETTE.length], u);
      if (i < 2) front.push(tree);
      else mid.push(tree);
    });
    rightSpecs.forEach((spec, i) => {
      const spread = spec.height * 0.44;
      const tree = cedarTree(spec.x, spec.baseY, spec.height, spread, PALETTE[spec.pal % PALETTE.length], u);
      if (i < 2) front.push(tree);
      else mid.push(tree);
    });

    return { front, mid };
  }

  function parkStreetCedarForest(w, h, u, vpX, vpY, pathTopW, pathBotL, pathBotR) {
    const back = [];
    const mid = [];
    const front = [];
    const rowsPerSide = 10;
    const treesPerRow = 3;

    function lerp(a, b, t) { return a + (b - a) * t; }

    for (let side = 0; side < 2; side++) {
      const isLeft = side === 0;
      for (let row = 0; row < rowsPerSide; row++) {
        const t = row / (rowsPerSide - 1);
        const layer = t < 0.34 ? 'back' : t < 0.68 ? 'mid' : 'front';

        for (let col = 0; col < treesPerRow; col++) {
          const idx = side * 100 + row * 10 + col;
          const colors = PALETTE[(idx + (isLeft ? 0 : 5)) % PALETTE.length];
          const pathEdge = isLeft
            ? lerp(vpX - pathTopW, pathBotL, t)
            : lerp(vpX + pathTopW, pathBotR, t);
          const edgeBlend = Math.pow(t, 1.35);
          const innerOffset = w * (0.05 + col * 0.038);
          const outerOffset = w * (0.02 + col * 0.012);
          let x;
          if (isLeft) {
            const innerX = pathEdge - innerOffset;
            const outerX = w * (0.04 - col * 0.02) - (col === 0 ? w * 0.08 : 0);
            x = innerX + (outerX - innerX) * edgeBlend * (col === 0 ? 1 : 0.42);
          } else {
            const innerX = pathEdge + innerOffset;
            const outerX = w * (0.96 + col * 0.02) + (col === 0 ? w * 0.08 : 0);
            x = innerX + (outerX - innerX) * edgeBlend * (col === 0 ? 1 : 0.42);
          }
          x += (P.seeded(idx, 5) - 0.5) * w * 0.012;
          const baseY = lerp(vpY + h * 0.08, h * 0.98, t) + (P.seeded(idx, 11) - 0.5) * h * 0.015;

          let height; let spread;
          const depthScale = 0.38 + t * 0.62;
          if (layer === 'back') {
            height = h * (0.4 + P.seeded(idx, 7) * 0.1) * depthScale;
            spread = height * 0.36;
          } else if (layer === 'mid') {
            height = h * (0.5 + P.seeded(idx, 7) * 0.12) * depthScale;
            spread = height * 0.38;
          } else {
            height = h * (0.58 + P.seeded(idx, 7) * 0.14) * Math.max(0.78, depthScale);
            spread = height * 0.42;
          }

          if (col === 0 && t > 0.7) {
            height *= 1.08 + (t - 0.7) * 0.35;
            spread *= 1.06 + (t - 0.7) * 0.2;
          }

          const tree = cedarTree(x, baseY, height, spread, colors, u);
          if (layer === 'back') back.push(tree);
          else if (layer === 'mid') mid.push(tree);
          else front.push(tree);
        }
      }
    }

    return { back, mid, front };
  }

  function buildParkStreet(w, h) {
    const u = uid();
    const noStroke = { strokeWidth: 0 };
    const vpX = w * 0.5;
    const vpY = h * 0.38;
    const pathTopW = w * 0.08;
    const pathBotL = w * 0.3;
    const pathBotR = w * 0.7;

    function lerp(a, b, t) { return a + (b - a) * t; }

    const trees = parkStreetCedarForest(w, h, u, vpX, vpY, pathTopW, pathBotL, pathBotR);
    const edgeTrees = parkEdgeHalfTrees(w, h, u);
    trees.front.push(...edgeTrees.front);
    trees.mid.push(...edgeTrees.mid);

    let clouds = '';
    [
      [0.18, 0.1, 1.05], [0.42, 0.07, 0.88], [0.68, 0.11, 0.95], [0.86, 0.08, 0.8],
    ].forEach(([xp, yp, sc]) => {
      clouds += parkCloud(w * xp, h * yp, sc, u);
    });

    let grassTufts = '';
    for (let i = 0; i < 48; i++) {
      const side = P.seeded(i, 1) > 0.5 ? 1 : -1;
      const t = P.seeded(i, 3);
      const gx = side > 0
        ? lerp(w * 0.72, vpX + pathTopW * 0.6, t) + P.seeded(i, 7) * w * 0.04
        : lerp(w * 0.28, vpX - pathTopW * 0.6, t) - P.seeded(i, 7) * w * 0.04;
      const gy = lerp(h * 0.96, vpY + h * 0.06, t);
      if (gy > h * 0.42) {
        grassTufts += grassBlade(gx, gy, 10 + P.seeded(i, 9) * 14, '#6A8858', u, i + 500);
      }
    }

    let lamps = '';
    [[0.38, 0.62], [0.62, 0.6]].forEach(([xp, yp]) => {
      const lx = w * xp;
      const ly = h * yp;
      const lh = h * 0.09;
      lamps += `
        ${P.pastelStroke(`M${lx} ${ly} L${lx} ${ly - lh}`, '#8A8078', 2.2, u)}
        ${P.pastelCircle(lx, ly - lh - 4, 5, '#F8F0D8', u)}
      `;
    });

    const inner = `
      <rect width="${w}" height="${h}" fill="url(#parkSky-${u})"/>
      ${clouds}
      ${P.pastelCircle(w * 0.62, h * 0.14, 36, '#FFF8E8', u)}
      ${P.pastelCircle(w * 0.62, h * 0.14, 26, '#FFE8B0', u)}
      ${P.pastelCircle(w * 0.62, h * 0.14, 16, '#FFD888', u)}
      <g class="jungle-back">${trees.back.join('')}</g>
      ${P.pastelShape(
        `M0 ${h * 0.55} L0 ${h} L${pathBotL} ${h} L${vpX - pathTopW} ${vpY + h * 0.05} L${vpX - pathTopW * 1.8} ${vpY + h * 0.05} Z`,
        '#7A9A68',
        { uid: u, highlight: '#8AAA78', ...noStroke }
      )}
      ${P.pastelShape(
        `M${w} ${h * 0.55} L${w} ${h} L${pathBotR} ${h} L${vpX + pathTopW} ${vpY + h * 0.05} L${vpX + pathTopW * 1.8} ${vpY + h * 0.05} Z`,
        '#7A9A68',
        { uid: u, highlight: '#8AAA78', ...noStroke }
      )}
      ${P.pastelShape(
        `M${pathBotL} ${h} L${pathBotR} ${h} L${vpX + pathTopW} ${vpY + h * 0.05} L${vpX - pathTopW} ${vpY + h * 0.05} Z`,
        '#C8B8A0',
        { uid: u, highlight: '#D8CAB2', ...noStroke }
      )}
      ${P.pastelShape(
        `M${w * 0.47} ${h} L${w * 0.53} ${h} L${vpX + pathTopW * 0.15} ${vpY + h * 0.05} L${vpX - pathTopW * 0.15} ${vpY + h * 0.05} Z`,
        '#B8A890',
        { uid: u, highlight: '#C8B8A0', opacity: 0.55, ...noStroke }
      )}
      <g class="park-grass-tufts">${grassTufts}</g>
      ${lamps}
      <g class="jungle-mid">${trees.mid.join('')}</g>
      <g class="jungle-front">${trees.front.join('')}</g>
    `;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" class="pastel-art park-street act4-park">
      ${P.globalDefs(u)}
      <defs>
        <linearGradient id="parkSky-${u}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#8EC8F0"/>
          <stop offset="38%" stop-color="#B8DCF8"/>
          <stop offset="72%" stop-color="#D8ECD8"/>
          <stop offset="100%" stop-color="#A8C898"/>
        </linearGradient>
      </defs>
      <g filter="url(#pastel-edge-${u})">${inner}</g>
      ${P.grainOverlay(u, w, h)}
    </svg>`;
  }

  function heldSunflowerArt(u, uu, handX, handY, sfScale = 0.88) {
    const sf = uu * sfScale;
    const petals = [0, 45, 90, 135, 180, 225, 270, 315].map((rot) =>
      `<ellipse cx="${handX}" cy="${handY - 5 * sf}" rx="${4.2 * sf}" ry="${10.5 * sf}" fill="#F0C848" transform="rotate(${rot} ${handX} ${handY - 3 * sf})"/>`
    ).join('');
    return `
      ${P.pastelStroke(`M${handX} ${handY + 2 * sf} L${handX} ${handY + 24 * sf}`, '#5A7848', 2.6 * sf, u)}
      ${petals}
      <circle cx="${handX}" cy="${handY - 4 * sf}" r="${7.5 * sf}" fill="#6B4A28"/>
      <circle cx="${handX}" cy="${handY - 4 * sf}" r="${5.5 * sf}" fill="#8B6838"/>
    `;
  }

  function parkStandingLittleGirl(u, unit) {
    const ns = { strokeWidth: 0 };
    const skin = '#E8C0A8';
    const hair = '#6A5040';
    const hairHi = '#8A6850';
    const dress = '#EAA8C0';
    const dressD = '#D088A8';
    const shoe = '#8A8078';
    const leg = '#6A6078';
    const uu = unit;

    const sfX = 36 * uu;
    const sfY = -26 * uu;
    const sf = uu * 0.88;
    const petals = [0, 45, 90, 135, 180, 225, 270, 315].map((rot) =>
      `<ellipse cx="${sfX}" cy="${sfY - 5 * sf}" rx="${4.2 * sf}" ry="${10.5 * sf}" fill="#F0C848" transform="rotate(${rot} ${sfX} ${sfY - 3 * sf})"/>`
    ).join('');

    return `
      ${P.pastelShape(
        `M${-16 * uu} ${-2 * uu} Q${0} ${5 * uu} ${16 * uu} ${-2 * uu} L${14 * uu} ${2 * uu} Q${0} ${7 * uu} ${-14 * uu} ${2 * uu} Z`,
        '#3A5838',
        { uid: u, opacity: 0.32, ...ns }
      )}
      ${P.pastelShape(`M${-11 * uu} ${-2 * uu} L${-11 * uu} ${1 * uu} Q${-6 * uu} ${4 * uu} ${-2 * uu} ${1 * uu} L${-2 * uu} ${-2 * uu} Z`, shoe, { uid: u, ...ns })}
      ${P.pastelShape(`M${2 * uu} ${-2 * uu} L${2 * uu} ${1 * uu} Q${6 * uu} ${4 * uu} ${10 * uu} ${1 * uu} L${10 * uu} ${-2 * uu} Z`, shoe, { uid: u, ...ns })}
      ${P.pastelShape(`M${-9 * uu} ${-3 * uu} L${-7 * uu} ${-42 * uu} L${-3 * uu} ${-42 * uu} L${-1 * uu} ${-3 * uu} Z`, leg, { uid: u, highlight: '#7A7088', ...ns })}
      ${P.pastelShape(`M${1 * uu} ${-3 * uu} L${3 * uu} ${-42 * uu} L${7 * uu} ${-42 * uu} L${9 * uu} ${-3 * uu} Z`, leg, { uid: u, highlight: '#7A7088', ...ns })}
      ${P.pastelShape(
        `M${-18 * uu} ${-42 * uu} Q${-20 * uu} ${-6 * uu} ${-13 * uu} ${-2 * uu} L${13 * uu} ${-2 * uu} Q${20 * uu} ${-6 * uu} ${18 * uu} ${-42 * uu} Q${0} ${-54 * uu} ${-18 * uu} ${-42 * uu} Z`,
        dress,
        { uid: u, highlight: '#F0B8D0', ...ns }
      )}
      ${P.pastelShape(
        `M${-15 * uu} ${-40 * uu} Q${0} ${-46 * uu} ${15 * uu} ${-40 * uu} L${13 * uu} ${-8 * uu} Q${0} ${-4 * uu} ${-13 * uu} ${-8 * uu} Z`,
        dressD,
        { uid: u, opacity: 0.45, ...ns }
      )}
      ${P.pastelStroke(`M${-14 * uu} ${-36 * uu} Q${-20 * uu} ${-28 * uu} ${-18 * uu} ${-22 * uu}`, skin, 3 * uu, u)}
      ${P.pastelStroke(`M${15 * uu} ${-34 * uu} Q${26 * uu} ${-28 * uu} ${sfX - 4 * sf}`, skin, 3.2 * uu, u)}
      ${P.pastelShape(
        `M${-11 * uu} ${-58 * uu} Q${-12 * uu} ${-49 * uu} ${0} ${-47 * uu} Q${12 * uu} ${-49 * uu} ${11 * uu} ${-58 * uu} Q${0} ${-54 * uu} ${-11 * uu} ${-58 * uu} Z`,
        skin,
        { uid: u, highlight: '#F0D0B8', ...ns }
      )}
      ${P.pastelShape(
        `M${-16 * uu} ${-54 * uu} Q${-18 * uu} ${-80 * uu} ${0} ${-82 * uu} Q${18 * uu} ${-80 * uu} ${16 * uu} ${-54 * uu} L${13 * uu} ${-50 * uu} Q${0} ${-48 * uu} ${-13 * uu} ${-50 * uu} Z`,
        hair,
        { uid: u, highlight: hairHi, ...ns }
      )}
      ${P.pastelShape(
        `M${-14 * uu} ${-56 * uu} Q${0} ${-62 * uu} ${14 * uu} ${-56 * uu} L${12 * uu} ${-51 * uu} Q${0} ${-53 * uu} ${-12 * uu} ${-51 * uu} Z`,
        hair,
        { uid: u, highlight: hairHi, opacity: 0.92, ...ns }
      )}
      ${P.pastelShape(
        `M${-15 * uu} ${-58 * uu} L${-17 * uu} ${-72 * uu} Q${-12 * uu} ${-74 * uu} ${-10 * uu} ${-58 * uu} Z`,
        hair,
        { uid: u, highlight: hairHi, ...ns }
      )}
      ${P.pastelShape(
        `M${15 * uu} ${-58 * uu} L${17 * uu} ${-72 * uu} Q${12 * uu} ${-74 * uu} ${10 * uu} ${-58 * uu} Z`,
        hair,
        { uid: u, highlight: hairHi, ...ns }
      )}
      ${P.pastelCircle(-14 * uu, -60 * uu, 5.5 * uu, hair, u)}
      ${P.pastelCircle(14 * uu, -60 * uu, 5.5 * uu, hair, u)}
      ${P.pastelStroke(`M${sfX} ${sfY + 2 * sf} L${sfX} ${sfY + 24 * sf}`, '#5A7848', 2.6 * sf, u)}
      ${petals}
      <circle cx="${sfX}" cy="${sfY - 4 * sf}" r="${7.5 * sf}" fill="#6B4A28"/>
      <circle cx="${sfX}" cy="${sfY - 4 * sf}" r="${5.5 * sf}" fill="#8B6838"/>
    `;
  }

  function parkStandingTeenGirl(u, unit) {
    const ns = { strokeWidth: 0 };
    const skin = '#E8C0A8';
    const hair = '#4A3828';
    const hairHi = '#6A5040';
    const top = '#A8C8E8';
    const topD = '#88A8D0';
    const skirt = '#F0E8E0';
    const skirtD = '#D8D0C8';
    const shoe = '#6A6058';
    const leg = '#5A5060';
    const uu = unit * 1.22;

    return `
      ${P.pastelShape(
        `M${-18 * uu} ${-2 * uu} Q${0} ${6 * uu} ${18 * uu} ${-2 * uu} L${16 * uu} ${3 * uu} Q${0} ${8 * uu} ${-16 * uu} ${3 * uu} Z`,
        '#3A5838',
        { uid: u, opacity: 0.3, ...ns }
      )}
      ${P.pastelShape(`M${-12 * uu} ${-2 * uu} L${-12 * uu} ${2 * uu} Q${-7 * uu} ${5 * uu} ${-3 * uu} ${2 * uu} L${-3 * uu} ${-2 * uu} Z`, shoe, { uid: u, ...ns })}
      ${P.pastelShape(`M${3 * uu} ${-2 * uu} L${3 * uu} ${2 * uu} Q${7 * uu} ${5 * uu} ${11 * uu} ${2 * uu} L${11 * uu} ${-2 * uu} Z`, shoe, { uid: u, ...ns })}
      ${P.pastelShape(`M${-10 * uu} ${-4 * uu} L${-8 * uu} ${-58 * uu} L${-4 * uu} ${-58 * uu} L${-2 * uu} ${-4 * uu} Z`, leg, { uid: u, highlight: '#6A6070', ...ns })}
      ${P.pastelShape(`M${2 * uu} ${-4 * uu} L${4 * uu} ${-58 * uu} L${8 * uu} ${-58 * uu} L${10 * uu} ${-4 * uu} Z`, leg, { uid: u, highlight: '#6A6070', ...ns })}
      ${P.pastelShape(
        `M${-20 * uu} ${-58 * uu} Q${-22 * uu} ${-8 * uu} ${-14 * uu} ${-3 * uu} L${14 * uu} ${-3 * uu} Q${22 * uu} ${-8 * uu} ${20 * uu} ${-58 * uu} Q${0} ${-68 * uu} ${-20 * uu} ${-58 * uu} Z`,
        skirt,
        { uid: u, highlight: '#FAF2EA', ...ns }
      )}
      ${P.pastelShape(
        `M${-16 * uu} ${-56 * uu} Q${0} ${-62 * uu} ${16 * uu} ${-56 * uu} L${14 * uu} ${-12 * uu} Q${0} ${-8 * uu} ${-14 * uu} ${-12 * uu} Z`,
        skirtD,
        { uid: u, opacity: 0.4, ...ns }
      )}
      ${P.pastelShape(
        `M${-17 * uu} ${-88 * uu} Q${-19 * uu} ${-62 * uu} ${-13 * uu} ${-58 * uu} L${13 * uu} ${-58 * uu} Q${19 * uu} ${-62 * uu} ${17 * uu} ${-88 * uu} Q${0} ${-96 * uu} ${-17 * uu} ${-88 * uu} Z`,
        top,
        { uid: u, highlight: '#B8D4F0', ...ns }
      )}
      ${P.pastelShape(
        `M${-14 * uu} ${-86 * uu} Q${0} ${-90 * uu} ${14 * uu} ${-86 * uu} L${12 * uu} ${-64 * uu} Q${0} ${-60 * uu} ${-12 * uu} ${-64 * uu} Z`,
        topD,
        { uid: u, opacity: 0.35, ...ns }
      )}
      ${P.pastelStroke(`M${-15 * uu} ${-78 * uu} Q${-22 * uu} ${-68 * uu} ${-20 * uu} ${-58 * uu}`, skin, 3.2 * uu, u)}
      ${P.pastelStroke(`M${15 * uu} ${-76 * uu} Q${24 * uu} ${-64 * uu} ${22 * uu} ${-54 * uu}`, skin, 3.2 * uu, u)}
      ${P.pastelShape(
        `M${-12 * uu} ${-100 * uu} Q${-13 * uu} ${-90 * uu} ${0} ${-88 * uu} Q${13 * uu} ${-90 * uu} ${12 * uu} ${-100 * uu} Q${0} ${-95 * uu} ${-12 * uu} ${-100 * uu} Z`,
        skin,
        { uid: u, highlight: '#F0D0B8', ...ns }
      )}
      ${P.pastelShape(
        `M${-17 * uu} ${-96 * uu} Q${-20 * uu} ${-124 * uu} ${0} ${-126 * uu} Q${20 * uu} ${-124 * uu} ${17 * uu} ${-96 * uu} L${14 * uu} ${-90 * uu} Q${0} ${-88 * uu} ${-14 * uu} ${-90 * uu} Z`,
        hair,
        { uid: u, highlight: hairHi, ...ns }
      )}
      ${P.pastelShape(
        `M${-15 * uu} ${-98 * uu} Q${0} ${-106 * uu} ${15 * uu} ${-98 * uu} L${13 * uu} ${-92 * uu} Q${0} ${-94 * uu} ${-13 * uu} ${-92 * uu} Z`,
        hair,
        { uid: u, highlight: hairHi, opacity: 0.9, ...ns }
      )}
      ${P.pastelShape(
        `M${-16 * uu} ${-100 * uu} L${-20 * uu} ${-74 * uu} L${-13 * uu} ${-72 * uu} L${-11 * uu} ${-98 * uu} Z`,
        hair,
        { uid: u, highlight: hairHi, opacity: 0.95, ...ns }
      )}
      ${P.pastelShape(
        `M${16 * uu} ${-100 * uu} L${11 * uu} ${-98 * uu} L${13 * uu} ${-72 * uu} L${20 * uu} ${-74 * uu} Z`,
        hair,
        { uid: u, highlight: hairHi, opacity: 0.95, ...ns }
      )}
      ${heldSunflowerArt(u, uu, 22 * uu, -54 * uu, 0.9)}
    `;
  }

  function parkStandingYoungWoman(u, unit) {
    const ns = { strokeWidth: 0 };
    const skin = '#E8C0A8';
    const hair = '#3A3028';
    const hairHi = '#5A4838';
    const coat = '#E8E4DC';
    const coatD = '#D0CCC4';
    const dress = '#C8D8E8';
    const shoe = '#5A5850';
    const leg = '#4A4858';
    const uu = unit * 1.38;

    return `
      ${P.pastelShape(
        `M${-20 * uu} ${-2 * uu} Q${0} ${7 * uu} ${20 * uu} ${-2 * uu} L${18 * uu} ${4 * uu} Q${0} ${9 * uu} ${-18 * uu} ${4 * uu} Z`,
        '#3A5838',
        { uid: u, opacity: 0.28, ...ns }
      )}
      ${P.pastelShape(`M${-13 * uu} ${-2 * uu} L${-13 * uu} ${3 * uu} Q${-8 * uu} ${6 * uu} ${-4 * uu} ${3 * uu} L${-4 * uu} ${-2 * uu} Z`, shoe, { uid: u, ...ns })}
      ${P.pastelShape(`M${4 * uu} ${-2 * uu} L${4 * uu} ${3 * uu} Q${8 * uu} ${6 * uu} ${12 * uu} ${3 * uu} L${12 * uu} ${-2 * uu} Z`, shoe, { uid: u, ...ns })}
      ${P.pastelShape(`M${-11 * uu} ${-5 * uu} L${-9 * uu} ${-68 * uu} L${-5 * uu} ${-68 * uu} L${-3 * uu} ${-5 * uu} Z`, leg, { uid: u, highlight: '#5A5868', ...ns })}
      ${P.pastelShape(`M${3 * uu} ${-5 * uu} L${5 * uu} ${-68 * uu} L${9 * uu} ${-68 * uu} L${11 * uu} ${-5 * uu} Z`, leg, { uid: u, highlight: '#5A5868', ...ns })}
      ${P.pastelShape(
        `M${-14 * uu} ${-68 * uu} Q${-16 * uu} ${-10 * uu} ${-12 * uu} ${-4 * uu} L${12 * uu} ${-4 * uu} Q${16 * uu} ${-10 * uu} ${14 * uu} ${-68 * uu} Q${0} ${-78 * uu} ${-14 * uu} ${-68 * uu} Z`,
        dress,
        { uid: u, highlight: '#D8E8F8', ...ns }
      )}
      ${P.pastelShape(
        `M${-22 * uu} ${-72 * uu} Q${-24 * uu} ${-8 * uu} ${-14 * uu} ${-3 * uu} L${14 * uu} ${-3 * uu} Q${24 * uu} ${-8 * uu} ${22 * uu} ${-72 * uu} Q${0} ${-84 * uu} ${-22 * uu} ${-72 * uu} Z`,
        coat,
        { uid: u, highlight: '#F4F0E8', ...ns }
      )}
      ${P.pastelShape(
        `M${-18 * uu} ${-70 * uu} Q${0} ${-76 * uu} ${18 * uu} ${-70 * uu} L${16 * uu} ${-14 * uu} Q${0} ${-10 * uu} ${-16 * uu} ${-14 * uu} Z`,
        coatD,
        { uid: u, opacity: 0.38, ...ns }
      )}
      ${P.pastelStroke(`M${-16 * uu} ${-62 * uu} Q${-24 * uu} ${-50 * uu} ${-22 * uu} ${-40 * uu}`, skin, 3.4 * uu, u)}
      ${P.pastelStroke(`M${16 * uu} ${-60 * uu} Q${26 * uu} ${-46 * uu} ${24 * uu} ${-36 * uu}`, skin, 3.4 * uu, u)}
      ${P.pastelShape(
        `M${-13 * uu} ${-118 * uu} Q${-14 * uu} ${-106 * uu} ${0} ${-104 * uu} Q${14 * uu} ${-106 * uu} ${13 * uu} ${-118 * uu} Q${0} ${-112 * uu} ${-13 * uu} ${-118 * uu} Z`,
        skin,
        { uid: u, highlight: '#F0D0B8', ...ns }
      )}
      ${P.pastelShape(
        `M${-18 * uu} ${-114 * uu} Q${-22 * uu} ${-148 * uu} ${0} ${-150 * uu} Q${22 * uu} ${-148 * uu} ${18 * uu} ${-114 * uu} L${15 * uu} ${-106 * uu} Q${0} ${-104 * uu} ${-15 * uu} ${-106 * uu} Z`,
        hair,
        { uid: u, highlight: hairHi, ...ns }
      )}
      ${P.pastelShape(
        `M${-16 * uu} ${-116 * uu} Q${0} ${-126 * uu} ${16 * uu} ${-116 * uu} L${14 * uu} ${-108 * uu} Q${0} ${-110 * uu} ${-14 * uu} ${-108 * uu} Z`,
        hair,
        { uid: u, highlight: hairHi, opacity: 0.9, ...ns }
      )}
      ${P.pastelShape(
        `M${-17 * uu} ${-118 * uu} L${-22 * uu} ${-88 * uu} L${-14 * uu} ${-86 * uu} L${-12 * uu} ${-116 * uu} Z`,
        hair,
        { uid: u, highlight: hairHi, opacity: 0.95, ...ns }
      )}
      ${P.pastelShape(
        `M${17 * uu} ${-118 * uu} L${12 * uu} ${-116 * uu} L${14 * uu} ${-86 * uu} L${22 * uu} ${-88 * uu} Z`,
        hair,
        { uid: u, highlight: hairHi, opacity: 0.95, ...ns }
      )}
      ${heldSunflowerArt(u, uu, 24 * uu, -36 * uu, 0.92)}
    `;
  }

  function bouquetSunflowerHead(cx, cy, scale, u) {
    const petals = [0, 45, 90, 135, 180, 225, 270, 315].map((rot) =>
      `<ellipse cx="${cx}" cy="${cy - 4 * scale}" rx="${6.8 * scale}" ry="${16.5 * scale}" fill="#F0C848" transform="rotate(${rot} ${cx} ${cy - 2 * scale})"/>`
    ).join('');
    return `
      ${petals}
      <circle cx="${cx}" cy="${cy - 3 * scale}" r="${12.5 * scale}" fill="#6B4A28"/>
      <circle cx="${cx}" cy="${cy - 3 * scale}" r="${9 * scale}" fill="#8B6838"/>
    `;
  }

  function buildAct4SunflowerBouquet(w, h) {
    const u = uid();
    const cx = w * 0.5;
    const cy = h * 0.5;
    const sc = Math.min(w, h) / 520;
    const headScale = 1.52 * sc;
    const positions = [
      [-62, -108], [-21, -114], [21, -114], [62, -108],
      [-76, -70], [-38, -74], [0, -76], [38, -74], [76, -70],
      [-54, -38], [-18, -40], [18, -40],
    ];
    const wrapW = 168 * sc;
    const wrapTop = cy + 8 * sc;
    const wrapBot = cy + 78 * sc;
    const heads = positions.map(([dx, dy]) =>
      bouquetSunflowerHead(cx + dx * sc, cy + dy * sc, headScale, u)
    ).join('');
    const wrap = `
      ${P.pastelShape(
        `M${cx - wrapW * 0.42} ${wrapTop} Q${cx - wrapW * 0.5} ${wrapBot * 0.62 + wrapTop * 0.38} ${cx - wrapW * 0.22} ${wrapBot} L${cx + wrapW * 0.22} ${wrapBot} Q${cx + wrapW * 0.5} ${wrapBot * 0.62 + wrapTop * 0.38} ${cx + wrapW * 0.42} ${wrapTop} Z`,
        '#E88848',
        { uid: u, highlight: '#F0A058', strokeWidth: 0 }
      )}
      ${P.pastelShape(
        `M${cx - wrapW * 0.36} ${wrapTop + 6 * sc} Q${cx} ${wrapTop + 16 * sc} ${cx + wrapW * 0.36} ${wrapTop + 6 * sc} L${cx + wrapW * 0.28} ${wrapTop + 22 * sc} Q${cx} ${wrapTop + 30 * sc} ${cx - wrapW * 0.28} ${wrapTop + 22 * sc} Z`,
        '#F09850',
        { uid: u, opacity: 0.55, strokeWidth: 0 }
      )}
      ${P.pastelShape(
        `M${cx - wrapW * 0.08} ${wrapTop - 5 * sc} L${cx + wrapW * 0.08} ${wrapTop - 5 * sc} L${cx + wrapW * 0.06} ${wrapTop + 8 * sc} L${cx - wrapW * 0.06} ${wrapTop + 8 * sc} Z`,
        '#F8F4F0',
        { uid: u, highlight: '#FFFFFF', strokeWidth: 0 }
      )}
      <ellipse cx="${cx - wrapW * 0.14}" cy="${wrapTop + 1 * sc}" rx="${wrapW * 0.16}" ry="${wrapW * 0.1}" fill="#FAFAFA" opacity="0.95"/>
      <ellipse cx="${cx + wrapW * 0.14}" cy="${wrapTop + 1 * sc}" rx="${wrapW * 0.16}" ry="${wrapW * 0.1}" fill="#FAFAFA" opacity="0.95"/>
      <circle cx="${cx}" cy="${wrapTop + 2 * sc}" r="${wrapW * 0.07}" fill="#F0ECE8"/>
    `;
    const stems = positions.map(([dx, dy]) =>
      P.pastelStroke(
        `M${cx + dx * sc} ${cy + dy * sc + 9 * headScale} L${cx + dx * sc * 0.18} ${wrapTop + 8 * sc}`,
        '#5A7848',
        3 * sc,
        u
      )
    ).join('');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" class="pastel-art act4-bouquet-art">
      ${P.globalDefs(u)}
      <g filter="url(#pastel-edge-${u})" transform="translate(${cx} ${cy + h * 0.02}) scale(1.22) translate(${-cx} ${-cy})">
        ${stems}
        ${wrap}
        ${heads}
      </g>
      ${P.grainOverlay(u, w, h)}
    </svg>`;
  }

  function act4GirlArt(enc, u, unit, i) {
    if (enc.id === 'teen-girl') return parkStandingTeenGirl(u + i, unit);
    if (enc.id === 'young-woman') return parkStandingYoungWoman(u + i, unit);
    return parkStandingLittleGirl(u + i, unit);
  }

  function act4GirlChatY(enc, unit) {
    if (enc.id === 'young-woman') return -158 * unit * 1.38;
    if (enc.id === 'teen-girl') return -138 * unit * 1.22;
    return -118 * unit;
  }

  function buildAct4GirlScene(w, h) {
    const encounters = (window.ACTS || []).find((a) => a.id === 'park-street')?.girlEncounters || [];
    const u = uid();
    const sc = h / 900;
    const unit = (h / 900) * 1.2;

    const figures = encounters.map((enc, i) => {
      const cx = w * (enc.anchorX ?? 0.74);
      const gy = h * (enc.anchorY ?? 0.92);
      const art = act4GirlArt(enc, u, unit, i);
      const chatY = act4GirlChatY(enc, unit);
      const chatHint = coupleChatHint(0, chatY, u + i + 10, sc * 1.65).replace(
        'class="couple-chat-hint"',
        `class="couple-chat-hint act4-girl-chat-hint is-hidden" data-encounter="${i}"`
      );
      return `
        <g class="act4-girl-figure" data-encounter="${i}" opacity="0"
           transform="translate(${cx} ${gy}) scale(${enc.startScale ?? 0.28})"
           data-anchor-x="${enc.anchorX ?? 0.74}" data-anchor-y="${enc.anchorY ?? 0.92}">
          ${art}
          ${chatHint}
        </g>`;
    }).join('');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" class="pastel-art act4-girl-art">
      ${P.globalDefs(u)}
      <g filter="url(#pastel-edge-${u})">${figures}</g>
    </svg>`;
  }

  function buildWindowScene() {
    const forestH = 900;
    const { x, y, w, h: vh } = WINDOW_VIEW;
    const svg = buildForestEntrance(1200, forestH);
    return svg
      .replace(`viewBox="0 0 1200 ${forestH}"`, `viewBox="${x} ${y} ${w} ${vh}"`)
      .replace('preserveAspectRatio="xMidYMid slice"', 'preserveAspectRatio="xMidYMid meet"')
      .replace('preserveAspectRatio="xMinYMid meet"', 'preserveAspectRatio="xMidYMid meet"')
      .replace('forest-entrance', 'window-preview');
  }

  window.Illustrations = {
    flowerSvg, stemRemains, buildChapterScene, buildForestEntrance, buildLondonForest, buildArthurSeatForest, buildParkStreet, buildAct4GirlScene, buildAct4SunflowerBouquet, buildLongForest, buildWindowScene, bagSvg, envelopeSvg, cedarTree,
  };
})();
