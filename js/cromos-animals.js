"use strict";

window.CROMOS_ANIMALS = (function () {
  function portada(linia1, linia2, color) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="300" viewBox="0 0 480 300"><rect width="480" height="300" rx="24" fill="${color}"/><rect x="18" y="18" width="444" height="264" rx="16" fill="none" stroke="white" stroke-opacity="0.4" stroke-width="3"/><text x="240" y="126" text-anchor="middle" fill="white" font-family="sans-serif" font-size="32" font-weight="bold">${linia1}</text><text x="240" y="169" text-anchor="middle" fill="white" font-family="sans-serif" font-size="30">${linia2}</text><text x="240" y="232" text-anchor="middle" fill="white" font-family="sans-serif" font-size="20">Àlbum de cromos</text></svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
  const CARATEULES = {
    mamifers: portada('Mamífers', 'terrestres', '#92400e'),
    aus: portada('Aus', '', '#0369a1'),
    reptils: portada('Rèptils', 'i amfibis', '#3f6212'),
    aquatics: portada('Animals', 'aquàtics', '#0f766e'),
    insectes: portada('Insectes', 'i invertebrats', '#6b21a8')
  };
  const CATEGORIES = [
    { id: 'mamifers', nom: 'Mamífers terrestres', imatge: CARATEULES.mamifers },
    { id: 'aus', nom: 'Aus', imatge: CARATEULES.aus },
    { id: 'reptils', nom: 'Rèptils i amfibis', imatge: CARATEULES.reptils },
    { id: 'aquatics', nom: 'Animals aquàtics', imatge: CARATEULES.aquatics },
    { id: 'insectes', nom: 'Insectes i invertebrats', imatge: CARATEULES.insectes }
  ];
  const CROMOS = [];
  let id = 1;
  CATEGORIES.forEach(categoria => {
    for (let numero = 1; numero <= 50; numero++) {
      CROMOS.push({ id: id++, categoria: categoria.id, numero, nom: null, imatge: null });
    }
  });
  return { CATEGORIES, CROMOS, CARATEULES };
})();
