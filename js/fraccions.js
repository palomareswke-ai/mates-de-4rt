"use strict";

window.FraccionsUtils = {
  mcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      [a, b] = [b, a % b];
    }
    return a || 1;
  },
  mcm(a, b) {
    return (a * b) / this.mcd(a, b);
  },
  simplifica(numerador, denominador) {
    const divisor = this.mcd(numerador, denominador);
    return {
      numerador: numerador / divisor,
      denominador: denominador / divisor
    };
  },
  suma(a, b) {
    const den = this.mcm(a.den, b.den);
    const n1 = a.num * (den / a.den);
    const n2 = b.num * (den / b.den);
    return this.simplifica(n1 + n2, den);
  },
  resta(a, b) {
    const den = this.mcm(a.den, b.den);
    const n1 = a.num * (den / a.den);
    const n2 = b.num * (den / b.den);
    return this.simplifica(n1 - n2, den);
  },
  multiplica(a, b) {
    return this.simplifica(a.num * b.num, a.den * b.den);
  },
  divideix(a, b) {
    return this.simplifica(a.num * b.den, a.den * b.num);
  }
};

window.Fraccions = {
  genera(dificultat) {
    const limits = {
      facil: { den: 6, num: 5 },
      mitja: { den: 12, num: 11 },
      dificil: { den: 20, num: 19 }
    };
    const limit = limits[dificultat];

    function fraccio() {
      const den = 2 + Math.floor(Math.random() * (limit.den - 1));
      let num = 1 + Math.floor(Math.random() * limit.num);
      if (num >= den) num = den - 1;
      if (num < 1) num = 1;
      return { num, den };
    }

    const tipus = dificultat === 'facil'
      ? (Math.random() < 0.5 ? 'suma' : 'resta')
      : ['suma', 'resta', 'multiplicacio', 'divisio'][Math.floor(Math.random() * 4)];

    let a = fraccio();
    let b = fraccio();

    if (tipus === 'resta' && (a.num / a.den) < (b.num / b.den)) {
      [a, b] = [b, a];
    }

    const simbol = {
      suma: '+',
      resta: '-',
      multiplicacio: '×',
      divisio: '÷'
    }[tipus];

    let solucio;
    const passos = [];

    if (tipus === 'suma' || tipus === 'resta') {
      const den = window.FraccionsUtils.mcm(a.den, b.den);
      const n1 = a.num * (den / a.den);
      const n2 = b.num * (den / b.den);
      const num = tipus === 'suma' ? n1 + n2 : n1 - n2;
      solucio = window.FraccionsUtils.simplifica(num, den);

      passos.push(`Els denominadors són ${a.den} i ${b.den}.`);
      passos.push(`El mínim comú múltiple és ${den}.`);
      passos.push(`Les fraccions es converteixen en ${n1}/${den} i ${n2}/${den}.`);
      passos.push(tipus === 'suma'
        ? `Sumem els numeradors: ${n1} + ${n2} = ${num}.`
        : `Restem els numeradors: ${n1} - ${n2} = ${num}.`);
      passos.push(`El resultat és ${num}/${den}.`);

      if (solucio.den !== den) {
        passos.push(`Simplifiquem: ${solucio.num}/${solucio.den}.`);
      }
    }

    if (tipus === 'multiplicacio') {
      solucio = window.FraccionsUtils.multiplica(a, b);
      passos.push(`Multipliquem els numeradors: ${a.num} × ${b.num} = ${a.num * b.num}.`);
      passos.push(`Multipliquem els denominadors: ${a.den} × ${b.den} = ${a.den * b.den}.`);
      passos.push(`El resultat és ${a.num * b.num}/${a.den * b.den}.`);

      if (solucio.num !== a.num * b.num) {
        passos.push(`Simplifiquem: ${solucio.num}/${solucio.den}.`);
      }
    }

    if (tipus === 'divisio') {
      solucio = window.FraccionsUtils.divideix(a, b);
      passos.push('Per dividir fraccions, multipliquem per la fracció inversa.');
      passos.push(`${a.num}/${a.den} ÷ ${b.num}/${b.den} = ${a.num}/${a.den} × ${b.den}/${b.num}.`);
      passos.push(`El resultat és ${a.num * b.den}/${a.den * b.num}.`);

      if (solucio.num !== a.num * b.den) {
        passos.push(`Simplifiquem: ${solucio.num}/${solucio.den}.`);
      }
    }

    return {
      enunciat: `${a.num}/${a.den} ${simbol} ${b.num}/${b.den}`,
      solucio,
      passos,
      render(container) {
        const div = document.createElement('div');
        div.className = 'entrada-fraccio';
        div.innerHTML = `
          <input type="number" id="o-num" placeholder="Numerador">
          <span>/</span>
          <input type="number" id="o-den" placeholder="Denominador">
        `;
        container.appendChild(div);

        const passosDiv = document.createElement('div');
        passosDiv.id = 'passos';
        container.appendChild(passosDiv);
      },
      comprova() {
        const num = Number(document.getElementById('o-num').value);
        const den = Number(document.getElementById('o-den').value);
        const correcte = num === solucio.num && den === solucio.den;

        if (correcte) {
          const passosDiv = document.getElementById('passos');
          passosDiv.innerHTML = '';
          passos.forEach((text, index) => {
            const element = document.createElement('div');
            element.className = 'pass';
            element.textContent = `${index + 1}. ${text}`;
            passosDiv.appendChild(element);
          });
        }

        return correcte;
      }
    };
  }
};