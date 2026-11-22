"use strict";

let exerciciActual = null;
let modeActual = '';
let ronda = { total: 0, encerts: 0, errors: 0, acabada: false };
let cromosGuanyats = [];

const TITOLS = {
  operacions: 'Operacions amb fraccions',
  grafiques: 'Fraccions gràfiques',
  problemes: 'Problemes de comprensió'
};

const EXERCICIS_PER_RONDA = {
  facil: 5,
  mitja: 5,
  dificil: 5
};

const CLAU_DIFICULTAT = 'mates-de-4rt-dificultat';

function fraccioVerticalHtml(text) {
  return text.replace(/(\d+)\/(\d+)/g, (coincidencia, numerador, denominador) => {
    return `<span style='display:inline-flex;flex-direction:column;align-items:center;margin:0 0.25rem;vertical-align:middle;'><span style='padding:0 0.25rem;'>${numerador}</span><span style='width:100%;height:2px;background:#111827;'></span><span style='padding:0 0.25rem;'>${denominador}</span></span>`;
  });
}

function mostraMenu() {
  document.getElementById('album').classList.add('ocult');
  document.getElementById('joc').classList.add('ocult');
  document.getElementById('menu').classList.remove('ocult');
}

function mostraAlbum() {
  document.getElementById('menu').classList.add('ocult');
  document.getElementById('joc').classList.add('ocult');
  document.getElementById('album').classList.remove('ocult');
  mostraCromos();
}

function mostraJoc(mode) {
  modeActual = mode;
  document.getElementById('menu').classList.add('ocult');
  document.getElementById('album').classList.add('ocult');
  document.getElementById('joc').classList.remove('ocult');
  document.getElementById('titol-mode').textContent = TITOLS[mode];
  iniciaRonda();
}

function iniciaRonda() {
  const dificultat = document.getElementById('dificultat').value;
  ronda = {
    total: EXERCICIS_PER_RONDA[dificultat],
    encerts: 0,
    errors: 0,
    acabada: false
  };
  cromosGuanyats = [];
  generaExercici();
}

function generaExercici() {
  const area = document.getElementById('exercici');
  area.innerHTML = '';
  document.getElementById('missatge').textContent = '';

  if (ronda.encerts + ronda.errors >= ronda.total) {
    finalitzaRonda();
    return;
  }

  const dificultat = document.getElementById('dificultat').value;

  if (modeActual === 'operacions') {
    exerciciActual = window.Fraccions.genera(dificultat);
  } else if (modeActual === 'grafiques') {
    exerciciActual = window.FraccionsGrafiques.genera(dificultat);
  } else {
    exerciciActual = window.ProblemesComprensio.genera(dificultat);
  }

  const enunciat = document.createElement('p');
  enunciat.id = 'enunciat';
  enunciat.innerHTML = `Exercici ${ronda.encerts + ronda.errors + 1} de ${ronda.total}<br>${fraccioVerticalHtml(exerciciActual.enunciat)}`;
  area.appendChild(enunciat);

  exerciciActual.render(area);

  const accions = document.createElement('div');
  accions.className = 'accions-exercici';

  const revisar = document.createElement('button');
  revisar.type = 'button';
  revisar.id = 'revisar';
  revisar.textContent = 'Revisa el plantejament';
  revisar.addEventListener('click', () => {
    area.innerHTML = '';
    document.getElementById('missatge').textContent = '';
    const enunciatNou = document.createElement('p');
    enunciatNou.id = 'enunciat';
    enunciatNou.innerHTML = `Exercici ${ronda.encerts + ronda.errors + 1} de ${ronda.total}<br>${fraccioVerticalHtml(exerciciActual.enunciat)}`;
    area.appendChild(enunciatNou);
    exerciciActual.render(area);
    area.appendChild(accions);
  });

  const comprovar = document.createElement('button');
  comprovar.type = 'button';
  comprovar.id = 'comprovar';
  comprovar.textContent = 'Comprova';
  comprovar.addEventListener('click', comprovaExercici);

  accions.appendChild(revisar);
  accions.appendChild(comprovar);
  area.appendChild(accions);
}

function comprovaExercici() {
  if (!exerciciActual || ronda.acabada) return;

  const correcte = exerciciActual.comprova();
  const missatge = document.getElementById('missatge');

  if (correcte) {
    ronda.encerts++;
    missatge.className = 'correcte';
    missatge.textContent = 'Molt bé! Has encertat.';
  } else {
    ronda.errors++;
    missatge.className = 'incorrecte';
    missatge.textContent = 'Revisa-ho i torna-ho a provar.';
  }

  if (ronda.encerts + ronda.errors >= ronda.total) {
    finalitzaRonda();
  } else {
    setTimeout(generaExercici, 1200);
  }
}

function calculaCromos(nivell, encerts, total) {
  if (nivell === 'facil') {
    return encerts === total ? 1 : 0;
  }

  if (nivell === 'mitja') {
    if (encerts === total) return 2;
    if (encerts >= 3) return 1;
    return 0;
  }

  if (nivell === 'dificil') {
    if (encerts === total) return 3;
    if (encerts >= 3) return 1;
    return 0;
  }

  return 0;
}

function finalitzaRonda() {
  ronda.acabada = true;
  const area = document.getElementById('exercici');
  area.innerHTML = '';

  const dificultat = document.getElementById('dificultat').value;
  const encerts = ronda.encerts;
  const total = ronda.total;
  const quantitat = calculaCromos(dificultat, encerts, total);

  let missatge = `Has encertat ${encerts} de ${total} exercicis. Continua practicant per guanyar cromos.`;

  if (quantitat === 1) {
    missatge = 'Molt bé! Has guanyat 1 cromo.';
  } else if (quantitat === 2) {
    missatge = 'Excel·lent! Has guanyat 2 cromos.';
  } else if (quantitat === 3) {
    missatge = 'Increïble! Has guanyat 3 cromos.';
  }

  cromosGuanyats = [];

  for (let i = 0; i < quantitat; i++) {
    const cromo = desbloquejaCromoPerEncert();
    if (cromo !== null) {
      cromosGuanyats.push(cromo);
    }
  }

  const titol = document.createElement('h3');
  titol.textContent = `Has acabat la ronda: ${encerts} de ${total} encerts`;
  area.appendChild(titol);

  const resultat = document.createElement('p');
  resultat.textContent = missatge;
  area.appendChild(resultat);

  if (cromosGuanyats.length > 0) {
    const subtitol = document.createElement('p');
    subtitol.textContent = 'Toca els cromos per descobrir-los.';
    area.appendChild(subtitol);

    const graella = document.createElement('div');
    graella.className = 'graella-cromos-guanyats';

    cromosGuanyats.forEach(id => {
      const cromo = window.CROMOS_ANIMALS.CROMOS[id - 1];
      const categoria = window.CROMOS_ANIMALS.CATEGORIES.find(item => item.id === cromo.categoria);

      const targeta = document.createElement('button');
      targeta.type = 'button';
      targeta.className = 'cromo-tapat';
      targeta.innerHTML = `
        <img src="${categoria.imatge}" alt="${categoria.nom}">
        <span>Cromo ${id}</span>
      `;

      targeta.addEventListener('click', () => {
        targeta.classList.add('destapat');
        targeta.innerHTML = `
          <img src="${categoria.imatge}" alt="${categoria.nom}">
          <span>Cromo ${id}</span>
        `;
      });

      graella.appendChild(targeta);
    });

    area.appendChild(graella);
  }

  const boto = document.createElement('button');
  boto.type = 'button';
  boto.textContent = 'Jugar una altra ronda';
  boto.addEventListener('click', iniciaRonda);
  area.appendChild(boto);

  const botoAlbum = document.createElement('button');
  botoAlbum.type = 'button';
  botoAlbum.textContent = 'Veure l’àlbum de cromos';
  botoAlbum.addEventListener('click', mostraAlbum);
  area.appendChild(botoAlbum);
}

document.addEventListener('DOMContentLoaded', () => {
  const dificultatDesada = localStorage.getItem(CLAU_DIFICULTAT);

  if (['facil', 'mitja', 'dificil'].includes(dificultatDesada)) {
    document.getElementById('dificultat').value = dificultatDesada;
  }

  document.getElementById('dificultat').addEventListener('change', event => {
    localStorage.setItem(CLAU_DIFICULTAT, event.target.value);
  });

  document.querySelectorAll('.mode').forEach(boto => {
    boto.addEventListener('click', event => {
      mostraJoc(event.currentTarget.dataset.mode);
    });
  });

  document.getElementById('obrir-album').addEventListener('click', mostraAlbum);
  document.getElementById('tornar-album').addEventListener('click', mostraMenu);
  document.getElementById('tornar').addEventListener('click', mostraMenu);
  document.getElementById('nou').addEventListener('click', generaExercici);
});