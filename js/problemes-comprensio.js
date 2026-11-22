"use strict";

window.ProblemesComprensio = (function () {
  const problemes = {
    facil: [
      {
        text: 'Un pastís està tallat en 8 trossos iguals. La Júlia en menja 2 i en Pau en menja 3. Quina part del pastís s’han menjat entre tots dos?',
        fraccio1: { num: 2, den: 8 },
        fraccio2: { num: 3, den: 8 },
        operacio: '+',
        resultat: { num: 5, den: 8 }
      },
      {
        text: 'Una cinta mesura 10/12 de metre. En tallem 4/12 de metre. Quina part queda?',
        fraccio1: { num: 10, den: 12 },
        fraccio2: { num: 4, den: 12 },
        operacio: '-',
        resultat: { num: 6, den: 12 }
      },
      {
        text: 'En una caixa hi ha 6/10 de quilogram de xocolata. En traiem 2/10. Quina part queda?',
        fraccio1: { num: 6, den: 10 },
        fraccio2: { num: 2, den: 10 },
        operacio: '-',
        resultat: { num: 4, den: 10 }
      }
    ],
    mitja: [
      {
        text: 'Tenim 3/4 de litre de suc i en bevem 1/4. Quina part queda?',
        fraccio1: { num: 3, den: 4 },
        fraccio2: { num: 1, den: 4 },
        operacio: '-',
        resultat: { num: 2, den: 4 }
      },
      {
        text: 'Una pizza està tallada en 6 trossos. En mengem 2 i després en mengem 1 més. Quina part hem menjat?',
        fraccio1: { num: 2, den: 6 },
        fraccio2: { num: 1, den: 6 },
        operacio: '+',
        resultat: { num: 3, den: 6 }
      },
      {
        text: 'D’una cinta de 5/8 de metre, en tallem 2/8. Quina part queda?',
        fraccio1: { num: 5, den: 8 },
        fraccio2: { num: 2, den: 8 },
        operacio: '-',
        resultat: { num: 3, den: 8 }
      }
    ],
    dificil: [
      {
        text: 'Tens 3/4 de litre de suc. Cada got conté 1/8 de litre. Quants gots pots omplir?',
        fraccio1: { num: 3, den: 4 },
        fraccio2: { num: 1, den: 8 },
        operacio: '÷',
        resultat: { tipus: 'numero', num: 6 }
      },
      {
        text: 'Una cinta mesura 5/6 de metre. En tallem 1/3 de metre. Quina part queda?',
        fraccio1: { num: 5, den: 6 },
        fraccio2: { num: 1, den: 3 },
        operacio: '-',
        resultat: { tipus: 'fraccio', num: 1, den: 2 }
      },
      {
        text: 'La meitat de 3/4 de pastís. Quina part del pastís és?',
        fraccio1: { num: 3, den: 4 },
        fraccio2: { num: 1, den: 2 },
        operacio: '×',
        resultat: { tipus: 'fraccio', num: 3, den: 8 }
      }
    ]
  };

  function genera(dificultat) {
    const llista = problemes[dificultat];
    const problema = llista[Math.floor(Math.random() * llista.length)];
    let plantejamentValidat = false;

    return {
      enunciat: problema.text,
      render(container) {
        const formulari = document.createElement('div');
        formulari.className = 'entrada-fraccio';
        formulari.innerHTML = `
          <input type="number" id="p1-num" placeholder="Numerador 1">
          <span>/</span>
          <input type="number" id="p1-den" placeholder="Denominador 1">

          <select id="p-operacio">
            <option value="">Operació</option>
            <option value="+">+</option>
            <option value="-">−</option>
            <option value="×">×</option>
            <option value="÷">÷</option>
          </select>

          <input type="number" id="p2-num" placeholder="Numerador 2">
          <span>/</span>
          <input type="number" id="p2-den" placeholder="Denominador 2">
        `;

        const boto = document.createElement('button');
        boto.type = 'button';
        boto.textContent = 'Comprova el plantejament';
        boto.addEventListener('click', () => {
          const n1 = Number(document.getElementById('p1-num').value);
          const d1 = Number(document.getElementById('p1-den').value);
          const n2 = Number(document.getElementById('p2-num').value);
          const d2 = Number(document.getElementById('p2-den').value);
          const operacio = document.getElementById('p-operacio').value;

          plantejamentValidat =
            n1 === problema.fraccio1.num &&
            d1 === problema.fraccio1.den &&
            n2 === problema.fraccio2.num &&
            d2 === problema.fraccio2.den &&
            operacio === problema.operacio;

          const missatge = document.getElementById('missatge');

          if (plantejamentValidat) {
            missatge.className = 'correcte';
            missatge.textContent = 'Plantejament correcte. Ara resol l’operació.';
            formulari.querySelectorAll('input, select, button').forEach(element => {
              element.disabled = true;
            });
            mostraResultat(container, problema);
          } else {
            missatge.className = 'incorrecte';
            missatge.textContent = 'Revisa les fraccions i l’operació que cal fer.';
          }
        });

        container.appendChild(formulari);
        container.appendChild(boto);
      },
      comprova() {
        if (!plantejamentValidat) return false;

        if (problema.resultat.tipus === 'numero') {
          return Number(document.getElementById('p-resultat').value) === problema.resultat.num;
        }

        const num = Number(document.getElementById('p-resultat-num').value);
        const den = Number(document.getElementById('p-resultat-den').value);
        const solucio = window.FraccionsUtils.simplifica(problema.resultat.num, problema.resultat.den);
        return num === solucio.num && den === solucio.den;
      }
    };
  }

  function mostraResultat(container, problema) {
    const div = document.createElement('div');

    if (problema.resultat.tipus === 'numero') {
      div.className = 'entrada-fraccio';
      div.innerHTML = `
        <label>Quants gots?
          <input type="number" id="p-resultat" placeholder="Resposta">
        </label>
      `;
    } else {
      div.className = 'entrada-fraccio';
      div.innerHTML = `
        <input type="number" id="p-resultat-num" placeholder="Numerador">
        <span>/</span>
        <input type="number" id="p-resultat-den" placeholder="Denominador">
      `;
    }

    container.appendChild(div);
  }

  return { genera };
})();