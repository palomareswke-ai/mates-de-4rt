"use strict";
const TOTAL_CROMOS = 250;
const CLAU_EMMAGATZEMATGE = 'mates-de-4rt-cromos';
const CONTRASENYA_CROMOS = 'Prat2026';
function esCromoValid(n) { return Number.isInteger(n) && n >= 1 && n <= TOTAL_CROMOS; }
function obtenirCromosDesbloquejats() {
  try { const dades = JSON.parse(localStorage.getItem(CLAU_EMMAGATZEMATGE) || '[]'); return Array.isArray(dades) ? [...new Set(dades.filter(esCromoValid))] : []; } catch (error) { return []; }
}
function desarCromosDesbloquejats(cromos) { localStorage.setItem(CLAU_EMMAGATZEMATGE, JSON.stringify(cromos)); }
function desbloquejaCromo(numero) {
  const ids = obtenirCromosDesbloquejats();
  if (!esCromoValid(numero) || ids.includes(numero)) return false;
  desarCromosDesbloquejats([...ids, numero]); mostraCromos(); return true;
}
function bloquejaCromo(numero) {
  const ids = obtenirCromosDesbloquejats();
  if (!esCromoValid(numero) || !ids.includes(numero)) return false;
  desarCromosDesbloquejats(ids.filter(id => id !== numero)); mostraCromos(); return true;
}
function desbloquejaCromoAleatori() {
  const ids = obtenirCromosDesbloquejats();
  const disponibles = Array.from({length: TOTAL_CROMOS}, (_, i) => i + 1).filter(id => !ids.includes(id));
  if (!disponibles.length) return null;
  const id = disponibles[Math.floor(Math.random() * disponibles.length)];
  desarCromosDesbloquejats([...ids, id]); return id;
}
function desbloquejaCromoPerEncert() { return desbloquejaCromoAleatori(); }
function creaVisualCromo(cromo, categoria, desbloquejat) {
  const visual = document.createElement('div');
  const pendent = text => {
    visual.replaceChildren(); visual.textContent = text;
    visual.style.cssText = 'min-height:100px;display:grid;place-items:center;padding:12px;text-align:center;background:#eff6ff;color:#334155;font-size:0.85rem;';
  };
  const src = desbloquejat ? cromo.imatge : categoria.imatge;
  if (!src) { pendent(desbloquejat ? 'Desbloquejat · imatge pendent' : categoria.nom); return visual; }
  const img = document.createElement('img');
  img.alt = desbloquejat ? (cromo.nom || `Cromo ${cromo.id}`) : categoria.nom;
  img.loading = 'lazy'; img.style.cssText = 'width:100%;height:100px;object-fit:contain;background:#f8fafc;';
  img.addEventListener('error', () => pendent(desbloquejat ? 'Desbloquejat · imatge no disponible' : categoria.nom), {once:true});
  img.src = src; visual.appendChild(img); return visual;
}
function mostraCromos() {
  const contenidor = document.getElementById('coleccio-cromos');
  if (!contenidor || !window.CROMOS_ANIMALS) return;
  const ids = obtenirCromosDesbloquejats(); contenidor.replaceChildren();
  const resum = document.createElement('p'); resum.textContent = `${ids.length} de ${TOTAL_CROMOS} cromos desbloquejats`; contenidor.appendChild(resum);
  window.CROMOS_ANIMALS.CATEGORIES.forEach(categoria => {
    const seccio = document.createElement('section'); seccio.style.marginBottom = '24px';
    const titol = document.createElement('h4'); titol.textContent = categoria.nom; seccio.appendChild(titol);
    const graella = document.createElement('div'); graella.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(min(120px,100%),1fr));gap:8px;';
    window.CROMOS_ANIMALS.CROMOS.filter(cromo => cromo.categoria === categoria.id).forEach(cromo => {
      const desbloquejat = ids.includes(cromo.id);
      const targeta = document.createElement('div');
      targeta.style.cssText = `min-width:0;border:2px solid ${desbloquejat ? '#16a34a' : '#cbd5e1'};border-radius:10px;overflow:hidden;background:white;`;
      targeta.appendChild(creaVisualCromo(cromo, categoria, desbloquejat));
      const peu = document.createElement('div'); peu.style.cssText = 'padding:8px;text-align:center;font-size:0.8rem;overflow-wrap:anywhere;';
      peu.textContent = desbloquejat ? `Cromo ${cromo.id} · ${cromo.nom || 'Desbloquejat'}` : `Cromo ${cromo.id} · per descobrir`;
      targeta.appendChild(peu); graella.appendChild(targeta);
    });
    seccio.appendChild(graella); contenidor.appendChild(seccio);
  });
}
function gestionaCromoManual(accio) {
  const contrasenya = document.getElementById('contrasenya-cromos').value;
  const numero = Number(document.getElementById('numero-cromo').value);
  const missatge = document.getElementById('missatge-cromos');
  if (contrasenya !== CONTRASENYA_CROMOS) { missatge.className = 'incorrecte'; missatge.textContent = 'Contrasenya incorrecta.'; return; }
  if (!esCromoValid(numero)) { missatge.className = 'incorrecte'; missatge.textContent = `Introdueix un número de cromo entre 1 i ${TOTAL_CROMOS}.`; return; }
  try {
    const correcte = accio === 'desbloquejar' ? desbloquejaCromo(numero) : bloquejaCromo(numero);
    missatge.className = correcte ? 'correcte' : 'incorrecte';
    missatge.textContent = correcte ? `Cromo ${numero} ${accio === 'desbloquejar' ? 'desbloquejat' : 'bloquejat'}.` : 'El cromo ja estava en aquest estat.';
  } catch (error) { missatge.className = 'incorrecte'; missatge.textContent = 'No s’ha pogut desar el canvi. Torna-ho a provar.'; }
}
document.addEventListener('DOMContentLoaded', () => {
  const desbloqueja = document.getElementById('desbloqueja-cromo');
  const bloqueja = document.getElementById('bloqueja-cromo');
  if (desbloqueja) desbloqueja.addEventListener('click', () => gestionaCromoManual('desbloquejar'));
  if (bloqueja) bloqueja.addEventListener('click', () => gestionaCromoManual('bloquejar'));
  mostraCromos();
});
