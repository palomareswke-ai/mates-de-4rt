"use strict";

let exerciciActual = null;

function mostraSeccio(id) {
  document.getElementById("menu").classList.add("ocult");
  document.getElementById("fraccions").classList.remove("ocult");
  mostraCromos();
}

function tornaAlMenu() {
  document.getElementById("fraccions").classList.add("ocult");
  document.getElementById("menu").classList.remove("ocult");
}

function generaNouExercici() {
  const tipus = document.getElementById("tipus").value;
  const dificultat = document.getElementById("dificultat").value;

  exerciciActual = generaExercici(tipus, dificultat);

  document.getElementById("exercici").classList.remove("ocult");
  document.getElementById("enunciat").textContent = `Resol: ${exerciciActual.enunciat}`;

  const passos = document.getElementById("passos");
  passos.innerHTML = "";

  exerciciActual.passos.forEach((text, index) => {
    const element = document.createElement("div");
    element.className = "pass";
    element.textContent = `${index + 1}. ${text}`;
    passos.appendChild(element);
  });

  document.getElementById("numerador").value = "";
  document.getElementById("denominador").value = "";
  document.getElementById("missatge").textContent = "";
}

function comprovaResultat() {
  const numerador = Number(document.getElementById("numerador").value);
  const denominador = Number(document.getElementById("denominador").value);
  const missatge = document.getElementById("missatge");

  if (!exerciciActual) return;

  const esCorrecte =
    numerador === exerciciActual.solucio.numerador &&
    denominador === exerciciActual.solucio.denominador;

  if (esCorrecte) {
    missatge.className = "correcte";
    missatge.textContent = "Molt bé! Has encertat el resultat.";
  } else {
    missatge.className = "incorrecte";
    missatge.textContent = "Revisa els passos i torna-ho a provar.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".tema").forEach(boto => {
    boto.addEventListener("click", event => {
      if (event.currentTarget.dataset.tema === "fraccions") {
        mostraSeccio("fraccions");
      }
    });
  });

  document.querySelector(".tornar").addEventListener("click", tornaAlMenu);
  document.getElementById("nou-exercici").addEventListener("click", generaNouExercici);
  document.getElementById("comprovar").addEventListener("click", comprovaResultat);
});
