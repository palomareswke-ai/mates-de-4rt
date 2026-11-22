"use strict";

const TOTAL_CROMOS = 100;
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

  if (!esCromoValid(numero) || desbloquejats.includes(numero)) {
    return false;
  }

  desbloquejats.push(numero);
  desarCromosDesbloquejats(desbloquejats);
  mostraCromos();
  return true;
}

function bloquejaCromo(numero) {
  const desbloquejats = obtenirCromosDesbloquejats();

  if (!esCromoValid(numero) || !desbloquejats.includes(numero)) {
    return false;
  }

  const nous = desbloquejats.filter(item => item !== numero);
  desarCromosDesbloquejats(nous);
  mostraCromos();
  return true;
}

function desbloquejaCromoAleatori() {
  const desbloquejats = obtenirCromosDesbloquejats();

  if (desbloquejats.length >= TOTAL_CROMOS) {
    return null;
  }

  const disponibles = [];

  for (let numero = 1; numero <= TOTAL_CROMOS; numero++) {
    if (!desbloquejats.includes(numero)) {
      disponibles.push(numero);
    }
  }

  const numeroNou = disponibles[Math.floor(Math.random() * disponibles.length)];
  desbloquejats.push(numeroNou);
  desarCromosDesbloquejats(desbloquejats);
  mostraCromos();

  return numeroNou;
}

function desbloquejaCromoPerEncert() {
  return desbloquejaCromoAleatori();
}

function mostraCromos() {
  const llista = document.getElementById('llista-cromos');
  if (!llista) return;

  const desbloquejats = obtenirCromosDesbloquejats();
  llista.innerHTML = '';

  for (let numero = 1; numero <= TOTAL_CROMOS; numero++) {
    const cromo = document.createElement('div');
    cromo.className = 'cromo';
    cromo.textContent = desbloquejats.includes(numero)
      ? `Cromo ${numero}`
      : 'Cromo bloquejat';
    llista.appendChild(cromo);
  }
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

  const correcte = accio === 'desbloquejar'
    ? desbloquejaCromo(numero)
    : bloquejaCromo(numero);

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