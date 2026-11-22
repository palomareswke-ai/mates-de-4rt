"use strict";

const TOTAL_CROMOS = 100;
const CLAU_EMMAGATZEMATGE = 'mates-de-4rt-cromos';

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

  return numeroNou;
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

function desbloquejaCromoPerEncert() {
  const numero = desbloquejaCromoAleatori();

  if (numero !== null) {
    mostraCromos();
    return numero;
  }

  return null;
}