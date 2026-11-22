"use strict";

const CROMOS = [
  { id: "suma-1", nom: "Cromo de la suma", desbloquejat: false },
  { id: "resta-1", nom: "Cromo de la resta", desbloquejat: false },
  { id: "multiplicacio-1", nom: "Cromo de la multiplicació", desbloquejat: false },
  { id: "divisio-1", nom: "Cromo de la divisió", desbloquejat: false }
];

function mostraCromos() {
  const llista = document.getElementById("llista-cromos");
  llista.innerHTML = "";

  CROMOS.forEach(cromo => {
    const element = document.createElement("div");
    element.className = "cromo";
    element.textContent = cromo.desbloquejat ? cromo.nom : "Cromo bloquejat";
    llista.appendChild(element);
  });
}

function desbloquejaCromo(id) {
  const cromo = CROMOS.find(item => item.id === id);
  if (cromo) {
    cromo.desbloquejat = true;
    mostraCromos();
  }
}
