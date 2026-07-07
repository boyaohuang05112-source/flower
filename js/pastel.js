(function () {
  'use strict';

  /** Shared pastel rendering utilities */
  const OUTLINE = '#6B6358';
  const OUTLINE_OP = 0.38;

  function seeded(i, salt) {
    const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
    return x - Math.floor(x);
  }

  function pt(n) { return Number(n.toFixed(1)); }

  function globalDefs(uid) {
    return `<defs>
      <filter id="pastel-edge-${uid}" x="-8%" y="-8%" width="116%" height="116%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="${uid}" result="n"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="2.8" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <filter id="pastel-blur-${uid}" x="-15%" y="-15%" width="130%" height="130%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="pastel-wash-${uid}" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3.5"/>
      </filter>
      <pattern id="pastel-grain-${uid}" width="64" height="64" patternUnits="userSpaceOnUse">
        <rect width="64" height="64" fill="transparent"/>
        <circle cx="8" cy="12" r="0.6" fill="#6B6358" opacity="0.06"/>
        <circle cx="28" cy="6" r="0.5" fill="#6B6358" opacity="0.05"/>
        <circle cx="48" cy="22" r="0.7" fill="#6B6358" opacity="0.07"/>
        <circle cx="18" cy="38" r="0.5" fill="#6B6358" opacity="0.04"/>
        <circle cx="52" cy="44" r="0.6" fill="#6B6358" opacity="0.06"/>
        <circle cx="34" cy="54" r="0.5" fill="#6B6358" opacity="0.05"/>
      </pattern>
    </defs>`;
  }

  function grainOverlay(uid, w, h) {
    return `<rect width="${w}" height="${h}" fill="url(#pastel-grain-${uid})" opacity="0.55" style="mix-blend-mode:multiply" pointer-events="none"/>`;
  }

  /** Layered soft fill — core pastel technique */
  function pastelShape(d, color, opts) {
    const o = opts || {};
    const hi = o.highlight || color;
    const sw = o.strokeWidth || 0.65;
    const op = o.opacity != null ? o.opacity : 0.88;
    return `
      <path d="${d}" fill="${color}" opacity="${op * 0.55}" filter="url(#pastel-wash-${o.uid})"/>
      <path d="${d}" fill="${hi}" opacity="${op * 0.72}"/>
      <path d="${d}" fill="none" stroke="${OUTLINE}" stroke-width="${sw}" stroke-opacity="${OUTLINE_OP}" stroke-linecap="round" stroke-linejoin="round"/>
    `;
  }

  function pastelStroke(d, color, w, uid) {
    return `
      <path d="${d}" stroke="${color}" stroke-width="${w * 1.6}" fill="none" stroke-linecap="round" opacity="0.35" filter="url(#pastel-wash-${uid})"/>
      <path d="${d}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" opacity="0.82"/>
    `;
  }

  function pastelCircle(cx, cy, r, color, uid) {
    return pastelShape(`M ${cx} ${cy} m -${r} 0 a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 -${r * 2} 0`, color, { uid });
  }

  /** Solid opaque foliage — fully covers trunk */
  function pastelFoliage(d, color, opts) {
    const o = opts || {};
    const deep = o.deep || color;
    const sw = o.strokeWidth || 0.4;
    return `
      <path d="${d}" fill="${deep}"/>
      <path d="${d}" fill="${color}"/>
      <path d="${d}" fill="none" stroke="${OUTLINE}" stroke-width="${sw}" stroke-opacity="0.15" stroke-linejoin="round"/>
    `;
  }

  window.Pastel = {
    OUTLINE, OUTLINE_OP, seeded, pt, globalDefs, grainOverlay,
    pastelShape, pastelStroke, pastelCircle, pastelFoliage,
  };
})();
