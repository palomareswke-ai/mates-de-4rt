"use strict";

const TOTAL_CROMOS = 250;
const CLAU_EMMAGATZEMATGE = 'mates-de-4rt-cromos';
const CONTRASENYA_CROMOS = 'Prat2026';

function obtenirCromosDesbloquejats() {
  try {
    const dades = JSON.parse(localStorage.getItem(CLAU_EMMAGATZEMATGE) || '[]');
    return Array.isArray(dades) ? dades : [];
  } catch (error) {
    return [];
  }
}

function desarCromosDesbloquejats(cromos) {
  localStorage.setItem(CLAU_EMMAGATZEMATGE, JSON.stringify(cromos));
}

function esCromoValid(numero) {
  return Number.isInteger(numero) && numero >= 1 && numero <= TOTAL_CROMOS;
}

function desbloquejaCromo(numero) {
  const desbloquejats = obtenirCromosDesbloquejats();
  if (!esCromoValid(numero) || desbloquejats.includes(numero)) return false;
  desbloquejats.push(numero);
  desarCromosDesbloquejats(desbloquejats);
  mostraCromos();
  return true;
}

function bloquejaCromo(numero) {
  const desbloquejats = obtenirCromosDesbloquejats();
  if (!esCromoValid(numero) || !desbloquejats.includes(numero)) return false;
  desarCromosDesbloquejats(desbloquejats.filter(item => item !== numero));
  mostraCromos();
  return true;
}

function desbloquejaCromoAleatori() {
  const desbloquejats = obtenirCromosDesbloquejats();
  if (desbloquejats.length >= TOTAL_CROMOS) return null;

  const disponibles = [];
  for (let numero = 1; numero <= TOTAL_CROMOS; numero++) {
    if (!desbloquejats.includes(numero)) disponibles.push(numero);
  }

  const numeroNou = disponibles[Math.floor(Math.random() * disponibles.length)];
  desbloquejats.push(numeroNou);
  desarCromosDesbloquejats(desbloquejats);
  return numeroNou;
}

function desbloquejaCromoPerEncert() {
  return desbloquejaCromoAleatori();
}

function mostraCromos() {
  const contenidor = document.getElementById('coleccio-cromos');
  if (!contenidor) return;

  const desbloquejats = obtenirCromosDesbloquejats();
  contenidor.innerHTML = '';

  window.CROMOS_ANIMALS.CATEGORIES.forEach((categoria, index) => {
    const seccio = document.createElement('section');
    seccio.style.marginBottom = '1.5rem';

    const titol = document.createElement('h4');
    titol.textContent = categoria.nom;
    titol.style.margin = '0 0 0.5rem';
    seccio.appendChild(titol);

    const graella = document.createElement('div');
    graella.style.display = 'grid';
    graella.style.gridTemplateColumns = 'repeat(auto-fill, minmax(120px, 1fr))';
    graella.style.gap = '0.5rem';

    for (let numero = 1; numero <= 50; numero++) {
      const id = index * 50 + numero;
      const desbloquejat = desbloquejats.includes(id);

      const targeta = document.createElement('div');
      targeta.style.border = desbloquejat ? '2px solid #16a34a' : '2px solid #cbd5e1';
      targeta.style.borderRadius = '10px';
      targeta.style.overflow = 'hidden';
      targeta.style.background = 'white';

      const imatge = document.createElement('img');
      imatge.src = categoria.imatge;
      imatge.alt = categoria.nom;
      imatge.style.width = '100%';
      imatge.style.height = '80px';
      imatge.style.objectFit = 'cover';
      targeta.appendChild(imatge);

      const peu = document.createElement('div');
      peu.style.padding = '0.4rem';
      peu.style.fontSize = '0.8rem';
      peu.style.textAlign = 'center';
      peu.textContent = desbloquejat ? `Cromo ${id}` : `Cromo ${id} · per descobrir`;
      targeta.appendChild(peu);

      graella.appendChild(targeta);
    }

    seccio.appendChild(graella);
    contenidor.appendChild(seccio);
  });
}

function gestionaCromoManual(accio) {
  const contrasenya = document.getElementById('contrasenya-cromos').value;
  const numero = Number(document.getElementById('numero-cromo').value);
  const missatge = document.getElementById('missatge-cromos');

  if (contrasenya !== CONTRASENYA_CROMOS) {
    missatge.className = 'incorrecte';
    missatge.textContent = 'Contrasenya incorrecta.';
    return;
  }

  if (!esCromoValid(numero)) {
    missatge.className = 'incorrecte';
    missatge.textContent = `Introdueix un número de cromo entre 1 i ${TOTAL_CROMOS}.`;
    return;
  }

  const correcte = accio === 'desbloquejar' ? desbloquejaCromo(numero) : bloquejaCromo(numero);

  if (correcte) {
    missatge.className = 'correcte';
    missatge.textContent = `Cromo ${numero} ${accio === 'desbloquejar' ? 'desbloquejat' : 'bloquejat'}.`;
  } else {
    missatge.className = 'incorrecte';
    missatge.textContent = `El cromo ${numero} ja estava en aquest estat.`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const botoDesbloqueja = document.getElementById('desbloqueja-cromo');
  const botoBloqueja = document.getElementById('bloqueja-cromo');

  if (botoDesbloqueja) {
    botoDesbloqueja.addEventListener('click', () => gestionaCromoManual('desbloquejar'));
  }

  if (botoBloqueja) {
    botoBloqueja.addEventListener('click', () => gestionaCromoManual('bloquejar'));
  }

  mostraCromos();
});