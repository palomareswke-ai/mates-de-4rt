"use strict";

window.FraccionsGrafiques = (function () {
  function creaBarraInteractiva(total) {
    const barra = document.createElement('div');
    barra.className = 'fraccio-grafica';

    for (let i = 0; i < total; i++) {
      const part = document.createElement('button');
      part.type = 'button';
      part.className = 'part';
      part.addEventListener('click', () => part.classList.toggle('pintada'));
      barra.appendChild(part);
    }

    return barra;
  }

  function creaBarraEstatica(total, pintades) {
    const barra = document.createElement('div');
    barra.className = 'fraccio-grafica';

    for (let i = 0; i < total; i++) {
      const part = document.createElement('span');
      part.className = 'part' + (i < pintades ? ' pintada' : '');
      barra.appendChild(part);
    }

    return barra;
  }

  function comptaPintades(barra) {
    return barra.querySelectorAll('.pintada').length;
  }

  function creaEntradaFraccio() {
    const div = document.createElement('div');
    div.className = 'entrada-fraccio';
    div.innerHTML = `
      <input type="number" id="g-num" placeholder="Numerador">
      <span>/</span>
      <input type="number" id="g-den" placeholder="Denominador">
    `;
    return div;
  }

  function generaIdentificar(dificultat) {
    const total = dificultat === 'facil'
      ? 4 + Math.floor(Math.random() * 3)
      : dificultat === 'mitja'
        ? 6 + Math.floor(Math.random() * 3)
        : 8 + Math.floor(Math.random() * 5);

    const pintades = 1 + Math.floor(Math.random() * (total - 1));
    let barra;

    return {
      enunciat: `Pinta ${pintades} de les ${total} parts i escriu la fracció.`,
      render(container) {
        barra = creaBarraInteractiva(total);
        container.appendChild(barra);
        container.appendChild(creaEntradaFraccio());
      },
      comprova() {
        const pintadesUsuari = barra ? comptaPintades(barra) : 0;
        const num = Number(document.getElementById('g-num').value);
        const den = Number(document.getElementById('g-den').value);
        return pintadesUsuari === pintades && num === pintades && den === total;
      }
    };
  }

  function generaEquivalents() {
    const parelles = [
      [1, 2, 2, 4],
      [1, 2, 3, 6],
      [1, 3, 2, 6],
      [2, 3, 4, 6],
      [1, 4, 2, 8],
      [3, 4, 6, 8],
      [2, 5, 4, 10],
      [3, 5, 6, 10]
    ];

    const parella = parelles[Math.floor(Math.random() * parelles.length)];
    const base = { num: parella[0], den: parella[1] };
    const correcta = { num: parella[2], den: parella[3] };
    const opcions = [{ ...correcta }];

    while (opcions.length < 3) {
      const num = 1 + Math.floor(Math.random() * 8);
      const den = 2 + Math.floor(Math.random() * 8);
      const repetida = opcions.some(opcio => opcio.num === num && opcio.den === den);
      const esBase = num === base.num && den === base.den;

      if (!repetida && !esBase) {
        opcions.push({ num, den });
      }
    }

    opcions.sort(() => Math.random() - 0.5);
    let triada = null;

    return {
      enunciat: `Quina fracció és equivalent a ${base.num}/${base.den}?`,
      render(container) {
        const div = document.createElement('div');
        div.className = 'opcions-equivalents';

        opcions.forEach(opcio => {
          const boto = document.createElement('button');
          boto.type = 'button';
          boto.className = 'opcio-equivalent';
          boto.textContent = `${opcio.num}/${opcio.den}`;

          boto.addEventListener('click', () => {
            document.querySelectorAll('.opcio-equivalent').forEach(element => {
              element.classList.remove('seleccionada');
            });
            boto.classList.add('seleccionada');
            triada = opcio;
          });

          div.appendChild(boto);
        });

        container.appendChild(div);
      },
      comprova() {
        return Boolean(triada && triada.num === correcta.num && triada.den === correcta.den);
      }
    };
  }

  function generaMateixDenominador() {
    const den = 4 + Math.floor(Math.random() * 7);
    let a = 1 + Math.floor(Math.random() * (den - 1));
    let b = 1 + Math.floor(Math.random() * (den - 1));
    const operacio = Math.random() < 0.5 ? '+' : '-';

    let resultat;
    if (operacio === '+') {
      resultat = a + b;
    } else {
      if (a < b) [a, b] = [b, a];
      resultat = a - b;
    }

    const solucio = window.FraccionsUtils.simplifica(resultat, den);

    return {
      enunciat: `Calcula ${a}/${den} ${operacio} ${b}/${den}.`,
      render(container) {
        container.appendChild(creaBarraEstatica(den, a));
        container.appendChild(creaBarraEstatica(den, b));
        container.appendChild(creaEntradaFraccio());
      },
      comprova() {
        const num = Number(document.getElementById('g-num').value);
        const den2 = Number(document.getElementById('g-den').value);
        return num === solucio.num && den2 === solucio.den;
      }
    };
  }

  function generaDiferentsDenominadors() {
    const den1 = 2 + Math.floor(Math.random() * 6);
    let den2 = 2 + Math.floor(Math.random() * 6);
    if (den2 === den1) den2 = den1 + 1;

    const a = {
      num: 1 + Math.floor(Math.random() * (den1 - 1)),
      den: den1
    };

    const b = {
      num: 1 + Math.floor(Math.random() * (den2 - 1)),
      den: den2
    };

    const operacio = Math.random() < 0.5 ? '+' : '-';
    let solucio;

    if (operacio === '+') {
      solucio = window.FraccionsUtils.suma(a, b);
    } else {
      if ((a.num / a.den) < (b.num / b.den)) {
        [a, b] = [b, a];
      }
      solucio = window.FraccionsUtils.resta(a, b);
    }

    return {
      enunciat: `Calcula ${a.num}/${a.den} ${operacio} ${b.num}/${b.den}.`,
      render(container) {
        container.appendChild(creaBarraEstatica(a.den, a.num));
        container.appendChild(creaBarraEstatica(b.den, b.num));
        container.appendChild(creaEntradaFraccio());
      },
      comprova() {
        const num = Number(document.getElementById('g-num').value);
        const den = Number(document.getElementById('g-den').value);
        return num === solucio.num && den === solucio.den;
      }
    };
  }

  function generaMultiplicacioODivisio() {
    const a = {
      num: 1 + Math.floor(Math.random() * 5),
      den: 2 + Math.floor(Math.random() * 5)
    };

    const b = {
      num: 1 + Math.floor(Math.random() * 5),
      den: 2 + Math.floor(Math.random() * 5)
    };

    const operacio = Math.random() < 0.5 ? '×' : '÷';
    const solucio = operacio === '×'
      ? window.FraccionsUtils.multiplica(a, b)
      : window.FraccionsUtils.divideix(a, b);

    return {
      enunciat: `Calcula ${a.num}/${a.den} ${operacio} ${b.num}/${b.den}.`,
      render(container) {
        container.appendChild(creaBarraEstatica(a.den, a.num));
        container.appendChild(creaBarraEstatica(b.den, b.num));
        container.appendChild(creaEntradaFraccio());
      },
      comprova() {
        const num = Number(document.getElementById('g-num').value);
        const den = Number(document.getElementById('g-den').value);
        return num === solucio.num && den === solucio.den;
      }
    };
  }

  return {
    genera(dificultat) {
      if (dificultat === 'facil') {
        return Math.random() < 0.6
          ? generaIdentificar(dificultat)
          : generaEquivalents();
      }

      if (dificultat === 'mitja') {
        return Math.random() < 0.5
          ? generaMateixDenominador()
          : generaEquivalents();
      }

      return Math.random() < 0.5
        ? generaDiferentsDenominadors()
        : generaMultiplicacioODivisio();
    }
  };
})();