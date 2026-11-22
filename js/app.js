"use strict";
let exerciciActual = null;
let modeActual = '';
let ronda = { total: 0, encerts: 0, errors: 0, acabada: false };
let cromosGuanyats = [];
const TITOLS = { operacions: 'Operacions amb fraccions', grafiques: 'Fraccions gràfiques', problemes: 'Problemes de comprensió' };
const EXERCICIS_PER_RONDA = { facil: 5, mitja: 5, dificil: 5 };
const CLAU_DIFICULTAT = 'mates-de-4rt-dificultat';
function fraccioVerticalHtml(text) {
  return text.replace(/(\d+)\/(\d+)/g, (_, n, d) => `<span class='fraccio-vertical'><span class='numerador'>${n}</span><span class='linia'></span><span class='denominador'>${d}</span></span>`);
}
function mostraMenu() {
  document.getElementById('album').classList.add('ocult');
  document.getElementById('joc').classList.add('ocult');
  document.getElementById('menu').classList.remove('ocult');
}
function mostraAlbum() {
  document.getElementById('menu').classList.add('ocult');
  document.getElementById('joc').classList.add('ocult');
  document.getElementById('album').classList.remove('ocult'); mostraCromos();
}
function mostraJoc(mode) {
  modeActual = mode;
  document.getElementById('menu').classList.add('ocult');
  document.getElementById('album').classList.add('ocult');
  document.getElementById('joc').classList.remove('ocult');
  document.getElementById('titol-mode').textContent = TITOLS[mode]; iniciaRonda();
}
function iniciaRonda() {
  const dificultat = document.getElementById('dificultat').value;
  ronda = { total: EXERCICIS_PER_RONDA[dificultat], encerts: 0, errors: 0, acabada: false };
  cromosGuanyats = []; generaExercici();
}
function generaExercici() {
  if (ronda.acabada) return;
  if (ronda.encerts + ronda.errors >= ronda.total) { finalitzaRonda(); return; }
  const area = document.getElementById('exercici'); area.replaceChildren();
  document.getElementById('missatge').textContent = '';
  const dificultat = document.getElementById('dificultat').value;
  const generador = modeActual === 'operacions' ? window.Fraccions : modeActual === 'grafiques' ? window.FraccionsGrafiques : window.ProblemesComprensio;
  exerciciActual = generador.genera(dificultat);
  const accions = document.createElement('div'); accions.className = 'accions-exercici';
  function render() {
    area.replaceChildren(); document.getElementById('missatge').textContent = '';
    const enunciat = document.createElement('p'); enunciat.id = 'enunciat';
    enunciat.innerHTML = `Exercici ${ronda.encerts + ronda.errors + 1} de ${ronda.total}<br>${fraccioVerticalHtml(exerciciActual.enunciat)}`;
    area.appendChild(enunciat); exerciciActual.render(area); area.appendChild(accions);
  }
  const revisar = document.createElement('button'); revisar.type = 'button'; revisar.id = 'revisar'; revisar.textContent = 'Revisa el plantejament'; revisar.addEventListener('click', render);
  const comprovar = document.createElement('button'); comprovar.type = 'button'; comprovar.id = 'comprovar'; comprovar.textContent = 'Comprova'; comprovar.addEventListener('click', comprovaExercici);
  accions.append(revisar, comprovar); render();
}
function comprovaExercici() {
  if (!exerciciActual || ronda.acabada || document.getElementById('seguent')) return;
  const correcte = exerciciActual.comprova();
  const missatge = document.getElementById('missatge');
  if (correcte) { ronda.encerts++; missatge.className = 'correcte'; missatge.textContent = 'Molt bé! Has encertat.'; }
  else { ronda.errors++; missatge.className = 'incorrecte'; missatge.textContent = 'La resposta no és correcta. Revisa-la abans de continuar.'; }
  if (ronda.encerts + ronda.errors >= ronda.total) { finalitzaRonda(); return; }
  document.getElementById('comprovar').disabled = true; document.getElementById('revisar').disabled = true;
  const boto = document.createElement('button'); boto.type = 'button'; boto.id = 'seguent'; boto.textContent = 'Següent exercici'; boto.addEventListener('click', generaExercici);
  document.getElementById('exercici').appendChild(boto);
}
function calculaCromos(nivell, encerts, total) {
  if (nivell === 'facil') return encerts === total ? 1 : 0;
  if (nivell === 'mitja') return encerts === total ? 2 : encerts >= 3 ? 1 : 0;
  if (nivell === 'dificil') return encerts === total ? 3 : encerts >= 3 ? 1 : 0;
  return 0;
}
function finalitzaRonda() {
  if (ronda.acabada) return;
  ronda.acabada = true;
  const area = document.getElementById('exercici'); area.replaceChildren();
  document.getElementById('missatge').textContent = '';
  const quantitat = calculaCromos(document.getElementById('dificultat').value, ronda.encerts, ronda.total);
  cromosGuanyats = []; let errorDesat = false;
  for (let i = 0; i < quantitat; i++) {
    try { const id = desbloquejaCromoPerEncert(); if (id === null) break; cromosGuanyats.push(id); }
    catch (error) { errorDesat = true; break; }
  }
  const titol = document.createElement('h3'); titol.textContent = `Has acabat la ronda: ${ronda.encerts} de ${ronda.total} encerts`; area.appendChild(titol);
  const resultat = document.createElement('p');
  resultat.textContent = cromosGuanyats.length ? `Molt bé! Has guanyat ${cromosGuanyats.length} ${cromosGuanyats.length === 1 ? 'cromo' : 'cromos'}.` : quantitat > 0 && !errorDesat ? 'Ja tens tots els cromos de la col·lecció!' : 'Continua practicant per guanyar cromos.';
  area.appendChild(resultat);
  if (errorDesat) { const avis = document.createElement('p'); avis.className = 'incorrecte'; avis.textContent = 'No s’han pogut desar tots els premis. Comprova l’emmagatzematge del navegador.'; area.appendChild(avis); }
  if (cromosGuanyats.length) {
    const subtitol = document.createElement('p'); subtitol.textContent = 'Toca els cromos per descobrir-los.'; area.appendChild(subtitol);
    const graella = document.createElement('div'); graella.className = 'graella-cromos-guanyats';
    cromosGuanyats.forEach(id => {
      const cromo = window.CROMOS_ANIMALS.CROMOS.find(item => item.id === id);
      if (!cromo) return;
      const categoria = window.CROMOS_ANIMALS.CATEGORIES.find(item => item.id === cromo.categoria);
      if (!categoria) return;
      const targeta = document.createElement('button'); targeta.type = 'button'; targeta.className = 'cromo-tapat'; targeta.setAttribute('aria-label', `Descobreix el cromo ${id}`); targeta.setAttribute('aria-expanded', 'false');
      const peu = document.createElement('span'); peu.textContent = `Cromo ${id} · toca per descobrir`;
      targeta.append(creaVisualCromo(cromo, categoria, false), peu);
      targeta.addEventListener('click', () => {
        targeta.classList.add('destapat'); targeta.setAttribute('aria-expanded', 'true');
        targeta.setAttribute('aria-label', `Cromo ${id} · ${cromo.nom || 'desbloquejat, imatge pendent'}`);
        const nom = document.createElement('span'); nom.textContent = `Cromo ${id} · ${cromo.nom || 'Desbloquejat'}`;
        targeta.replaceChildren(creaVisualCromo(cromo, categoria, true), nom);
      }, {once:true});
      graella.appendChild(targeta);
    });
    area.appendChild(graella);
  }
  const boto = document.createElement('button'); boto.type = 'button'; boto.textContent = 'Jugar una altra ronda'; boto.addEventListener('click', iniciaRonda); area.appendChild(boto);
  const album = document.createElement('button'); album.type = 'button'; album.textContent = 'Veure l’àlbum de cromos'; album.addEventListener('click', mostraAlbum); area.appendChild(album);
}
document.addEventListener('DOMContentLoaded', () => {
  const selector = document.getElementById('dificultat');
  try { const valor = localStorage.getItem(CLAU_DIFICULTAT); if (['facil', 'mitja', 'dificil'].includes(valor)) selector.value = valor; } catch (error) {}
  selector.addEventListener('change', event => { try { localStorage.setItem(CLAU_DIFICULTAT, event.target.value); } catch (error) {} });
  document.querySelectorAll('.mode').forEach(boto => boto.addEventListener('click', event => mostraJoc(event.currentTarget.dataset.mode)));
  document.getElementById('obrir-album').addEventListener('click', mostraAlbum);
  document.getElementById('tornar-album').addEventListener('click', mostraMenu);
  document.getElementById('tornar').addEventListener('click', mostraMenu);
  document.getElementById('nou').addEventListener('click', generaExercici);
});
