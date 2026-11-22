"use strict";

let exerciciActual = null;
let modeActual = '';

const TITOLS = {
  operacions: 'Operacions amb fraccions',
  grafiques: 'Fraccions gràfiques',
  problemes: 'Problemes de comprensió'
};

function mostraMenu() {
  document.getElementById('joc').classList.add('ocult');
  document.getElementById('menu').classList.remove('ocult');
}

function mostraJoc(mode) {
  modeActual = mode;
  document.getElementById('menu').classList.add('ocult');
  document.getElementById('joc').classList.remove('ocult');
  document.getElementById('titol-mode').textContent = TITOLS[mode];
  generaExercici();
  mostraCromos();
}

function generaExercici() {
  const dificultat = document.getElementById('dificultat').value;
  const area = document.getElementById('exercici');
  area.innerHTML = '';
  document.getElementById('missatge').textContent = '';

  if (modeActual === 'operacions') {
    exerciciActual = window.Fraccions.genera(dificultat);
  } else if (modeActual === 'grafiques') {
    exerciciActual = window.FraccionsGrafiques.genera(dificultat);
  } else {
    exerciciActual = window.ProblemesComprensio.genera(dificultat);
  }

  const enunciat = document.createElement('p');
  enunciat.id = 'enunciat';
  enunciat.textContent = exerciciActual.enunciat;
  area.appendChild(enunciat);

  exerciciActual.render(area);
}

function comprovaExercici() {
  if (!exerciciActual) return;

  const correcte = exerciciActual.comprova();
  const missatge = document.getElementById('missatge');

  if (correcte) {
    missatge.className = 'correcte';
    missatge.textContent = 'Molt bé! Has encertat.';
  } else {
    missatge.className = 'incorrecte';
    missatge.textContent = 'Revisa-ho i torna-ho a provar.';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.mode').forEach(boto => {
    boto.addEventListener('click', event => {
      mostraJoc(event.currentTarget.dataset.mode);
    });
  });

  document.getElementById('tornar').addEventListener('click', mostraMenu);
  document.getElementById('nou').addEventListener('click', generaExercici);

  const comprovar = document.createElement('button');
  comprovar.id = 'comprovar';
  comprovar.textContent = 'Comprova';
  comprovar.addEventListener('click', comprovaExercici);
  document.getElementById('joc').appendChild(comprovar);
});