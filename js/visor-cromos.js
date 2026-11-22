"use strict";
(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const visor = document.createElement('dialog'); visor.id = 'visor-cromos'; visor.setAttribute('aria-labelledby','visor-cromo-nom');
    const tanca = document.createElement('button'); tanca.type = 'button'; tanca.className = 'visor-tanca'; tanca.textContent = 'Tanca';
    const nom = document.createElement('p'); nom.id = 'visor-cromo-nom'; nom.className = 'visor-nom';
    const foto = document.createElement('img'); foto.className = 'visor-foto';
    const ajuda = document.createElement('p'); ajuda.className = 'visor-ajuda'; ajuda.textContent = 'Toca la imatge per tancar-la.';
    visor.append(tanca,nom,foto,ajuda); document.body.appendChild(visor);
    let origen = null;
    function tancar() { if(visor.open) visor.close(); }
    tanca.addEventListener('click',tancar); foto.addEventListener('click',tancar);
    visor.addEventListener('click',event => { if(event.target === visor) tancar(); });
    visor.addEventListener('close',() => {
      document.documentElement.classList.remove('visor-cromos-obert'); foto.removeAttribute('src');
      if(origen && origen.isConnected) origen.focus({preventScroll:true}); origen = null;
    });
    foto.addEventListener('error',() => { ajuda.textContent = 'No s’ha pogut carregar la imatge. Prem Tanca per tornar.'; });
    function cromoDe(img) {
      if(!img || !img.matches('img') || !img.complete || !img.naturalWidth || !window.CROMOS_ANIMALS) return null;
      const recompensa = img.closest('.cromo-tapat');
      if(recompensa && !recompensa.classList.contains('destapat')) return null;
      if(!recompensa && !img.closest('#coleccio-cromos')) return null;
      return window.CROMOS_ANIMALS.CROMOS.find(c => {
        if(!c.imatge) return false;
        try { return new URL(c.imatge,document.baseURI).href === img.src && obtenirCromosDesbloquejats().includes(c.id); } catch(error) { return false; }
      }) || null;
    }
    function obrir(img) {
      const cromo = cromoDe(img); if(!cromo || visor.open) return;
      origen = img.closest('button') || img; nom.textContent = `Cromo ${cromo.id} · ${cromo.nom || ''}`;
      foto.alt = cromo.nom || `Cromo ${cromo.id}`; ajuda.textContent = 'Toca la imatge per tancar-la.'; foto.src = cromo.imatge;
      visor.showModal(); document.documentElement.classList.add('visor-cromos-obert');
    }
    document.addEventListener('click',event => {
      if(event.target instanceof HTMLImageElement && !visor.contains(event.target)) obrir(event.target);
    },true);
    document.addEventListener('keydown',event => {
      if((event.key === 'Enter' || event.key === ' ') && event.target instanceof HTMLImageElement && cromoDe(event.target)) { event.preventDefault(); obrir(event.target); }
    });
    function prepara(img) {
      if(!cromoDe(img)) return; img.dataset.ampliable = 'true'; img.title = 'Toca per ampliar';
      if(!img.closest('button')) { img.tabIndex = 0; img.setAttribute('role','button'); img.setAttribute('aria-label',`Amplia: ${img.alt}`); img.setAttribute('aria-haspopup','dialog'); }
    }
    function actualitza() { document.querySelectorAll('#coleccio-cromos img, .cromo-tapat.destapat img').forEach(prepara); }
    document.addEventListener('load',event => { if(event.target instanceof HTMLImageElement) prepara(event.target); },true);
    const observador = new MutationObserver(actualitza);
    const album = document.getElementById('coleccio-cromos'); const exercici = document.getElementById('exercici');
    if(album) observador.observe(album,{childList:true,subtree:true});
    if(exercici) observador.observe(exercici,{childList:true,subtree:true});
    actualitza();
  });
})();
