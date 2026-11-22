"use strict";

function mcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

function mcm(a, b) {
  return (a * b) / mcd(a, b);
}

function simplificaFraccio(numerador, denominador) {
  const divisor = mcd(numerador, denominador);
  return {
    numerador: numerador / divisor,
    denominador: denominador / divisor
  };
}

function sumaFraccions(a, b) {
  const denominadorComu = mcm(a.denominador, b.denominador);
  const numeradorA = a.numerador * (denominadorComu / a.denominador);
  const numeradorB = b.numerador * (denominadorComu / b.denominador);
  const numerador = numeradorA + numeradorB;

  return {
    denominadorComu,
    numeradorA,
    numeradorB,
    resultat: simplificaFraccio(numerador, denominadorComu)
  };
}

function restaFraccions(a, b) {
  const denominadorComu = mcm(a.denominador, b.denominador);
  const numeradorA = a.numerador * (denominadorComu / a.denominador);
  const numeradorB = b.numerador * (denominadorComu / b.denominador);
  const numerador = numeradorA - numeradorB;

  return {
    denominadorComu,
    numeradorA,
    numeradorB,
    resultat: simplificaFraccio(numerador, denominadorComu)
  };
}

function multiplicaFraccions(a, b) {
  const numerador = a.numerador * b.numerador;
  const denominador = a.denominador * b.denominador;
  return simplificaFraccio(numerador, denominador);
}

function divideixFraccions(a, b) {
  const numerador = a.numerador * b.denominador;
  const denominador = a.denominador * b.numerador;
  return simplificaFraccio(numerador, denominador);
}

function generaFraccio(config) {
  let denominador = 2 + Math.floor(Math.random() * (config.denominadorMaxim - 1));
  let numerador = 1 + Math.floor(Math.random() * config.numeradorMaxim);

  if (numerador >= denominador) {
    numerador = denominador - 1;
  }

  if (numerador < 1) numerador = 1;

  return { numerador, denominador };
}

function generaExercici(tipus, dificultat) {
  const config = DIFICULTATS[dificultat];
  const a = generaFraccio(config);
  let b = generaFraccio(config);

  if (tipus === "resta" && a.numerador / a.denominador < b.numerador / b.denominador) {
    [a, b] = [b, a];
  }

  let solucio;
  let passos = [];

  if (tipus === "suma" || tipus === "resta") {
    const calcul = tipus === "suma" ? sumaFraccions(a, b) : restaFraccions(a, b);
    solucio = calcul.resultat;

    passos = [
      `Els denominadors són ${a.denominador} i ${b.denominador}.`,
      `El mínim comú múltiple és ${calcul.denominadorComu}.`,
      `La primera fracció es converteix en ${calcul.numeradorA}/${calcul.denominadorComu}.`,
      `La segona fracció es converteix en ${calcul.numeradorB}/${calcul.denominadorComu}.`,
      tipus === "suma"
        ? `Sumem els numeradors: ${calcul.numeradorA} + ${calcul.numeradorB} = ${calcul.numeradorA + calcul.numeradorB}.`
        : `Restem els numeradors: ${calcul.numeradorA} - ${calcul.numeradorB} = ${calcul.numeradorA - calcul.numeradorB}.`,
      `El resultat és ${calcul.numeradorA + (tipus === "resta" ? -calcul.numeradorB : calcul.numeradorB)}/${calcul.denominadorComu}.`
    ];

    if (solucio.denominador !== calcul.denominadorComu) {
      passos.push(`Simplifiquem la fracció: ${solucio.numerador}/${solucio.denominador}.`);
    }
  }

  if (tipus === "multiplicacio") {
    solucio = multiplicaFraccions(a, b);
    passos = [
      `Multipliquem els numeradors: ${a.numerador} × ${b.numerador} = ${a.numerador * b.numerador}.`,
      `Multipliquem els denominadors: ${a.denominador} × ${b.denominador} = ${a.denominador * b.denominador}.`,
      `El resultat és ${a.numerador * b.numerador}/${a.denominador * b.denominador}.`
    ];

    if (solucio.numerador !== a.numerador * b.numerador) {
      passos.push(`Simplifiquem la fracció: ${solucio.numerador}/${solucio.denominador}.`);
    }
  }

  if (tipus === "divisio") {
    solucio = divideixFraccions(a, b);
    passos = [
      `Per dividir fraccions, multipliquem per la fracció inversa.`,
      `${a.numerador}/${a.denominador} ÷ ${b.numerador}/${b.denominador} = ${a.numerador}/${a.denominador} × ${b.denominador}/${b.numerador}.`,
      `Multipliquem els numeradors: ${a.numerador} × ${b.denominador} = ${a.numerador * b.denominador}.`,
      `Multipliquem els denominadors: ${a.denominador} × ${b.numerador} = ${a.denominador * b.numerador}.`,
      `El resultat és ${a.numerador * b.denominador}/${a.denominador * b.numerador}.`
    ];

    if (solucio.numerador !== a.numerador * b.denominador) {
      passos.push(`Simplifiquem la fracció: ${solucio.numerador}/${solucio.denominador}.`);
    }
  }

  const simbol = {
    suma: "+",
    resta: "-",
    multiplicacio: "×",
    divisio: "÷"
  }[tipus];

  return {
    enunciat: `${a.numerador}/${a.denominador} ${simbol} ${b.numerador}/${b.denominador}`,
    solucio,
    passos
  };
}
