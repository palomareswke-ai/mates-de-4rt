"use strict";
window.ProblemesComprensio = (() => {
  const r = (a,b) => a + Math.floor(Math.random()*(b-a+1));
  const pick = xs => xs[r(0,xs.length-1)];
  const f = (n,d) => ({n,d});
  const eq = (a,b) => a && b && a.d > 0 && b.d > 0 && a.n*b.d === b.n*a.d;
  const txt = a => `${a.n}/${a.d}`;
  const plantilles = {
    facil: [
      ['+', (a,b,d) => `Un pastís està dividit en ${d} parts iguals. La Júlia en menja ${a} i en Pau en menja ${b}. Quina fracció del pastís han menjat entre tots dos?`],
      ['+', (a,b,d) => `Una pizza està tallada en ${d} porcions iguals. Al migdia en mengem ${a} i al vespre, ${b}. Quina fracció de la pizza hem menjat en total?`],
      ['-', (a,b,d) => `Una rajola de xocolata té ${d} preses iguals. En queden ${a} i ens en mengem ${b}. Quina fracció de la rajola sencera queda?`],
      ['-', (a,b,d) => `Una tira de paper està dividida en ${d} seccions iguals. En tenim ${a} i en retallem ${b}. Quina fracció de la tira original conservem?`],
      ['+', (a,b,d) => `Un mosaic té ${d} caselles iguals. En pintem ${a} de blau i ${b} de groc, sense pintar cap casella dues vegades. Quina fracció del mosaic està pintada?`],
      ['-', (a,b,d) => `Una ouera plena té ${d} espais. Hi queden ${a} ous i en fem servir ${b}. Quina fracció dels espais de l’ouera queda ocupada?`],
      ['+', (a,b,d) => `Una ruta està dividida en ${d} trams de la mateixa longitud. Al matí en recorrem ${a} i a la tarda continuem durant ${b} trams més. Quina fracció de la ruta hem recorregut?`],
      ['-', (a,b,d) => `Un àlbum té ${d} pàgines. Hi ha ${a} pàgines buides i n’omplim ${b}. Quina fracció de les pàgines de l’àlbum continua buida?`]
    ],
    mitja: [
      ['-', (a,b,d) => `Una cinta mesura ${a}/${d} de metre. En tallem ${b}/${d} de metre. Quina longitud de cinta queda, expressada en metres?`],
      ['+', (a,b,d) => `En una gerra hi ha ${a}/${d} de litre de suc. Hi afegim ${b}/${d} de litre més. Quants litres de suc hi ha ara?`],
      ['-', (a,b,d) => `Per fer pa tenim ${a}/${d} de quilogram de farina. En fem servir ${b}/${d} de quilogram. Quants quilograms de farina queden?`],
      ['+', (a,b,d) => `Un dipòsit conté aigua fins a ${a}/${d} de la seva capacitat. Hi afegim una quantitat equivalent a ${b}/${d} de la capacitat total. Quina fracció del dipòsit queda plena?`],
      ['-', (a,b,d) => `Una jardinera té plantes en ${a}/${d} de la superfície total. Retirem les plantes d’una zona que ocupa ${b}/${d} de la superfície total. Quina fracció de la jardinera conserva plantes?`],
      ['+', (a,b,d) => `La Laia estudia durant ${a}/${d} d’hora al matí i ${b}/${d} d’hora a la tarda. Quantes hores ha estudiat en total?`],
      ['-', (a,b,d) => `Un cabdell conté ${a}/${d} de metre de fil. En fem servir ${b}/${d} de metre. Quants metres de fil queden?`],
      ['+', (a,b,d) => `Per preparar una barreja fem servir ${a}/${d} de quilogram de nous i ${b}/${d} de quilogram d’ametlles. Quants quilograms pesa la barreja?`]
    ],
    dificil: [
      ['+', (a,b) => `Per preparar una beguda aboquem ${txt(a)} de litre de suc de taronja i ${txt(b)} de litre de suc de poma en una gerra prou gran. Quants litres de beguda obtenim?`],
      ['+', (a,b) => `En Marc camina ${txt(a)} de quilòmetre fins al parc i després ${txt(b)} de quilòmetre fins a la biblioteca. Quants quilòmetres ha caminat en total?`],
      ['-', (a,b) => `Tenim un tauló de ${txt(a)} de metre i en tallem ${txt(b)} de metre. Quants metres mesura el tros que queda?`],
      ['-', (a,b) => `En un recipient hi ha ${txt(a)} de litre d’oli. N’utilitzem ${txt(b)} de litre per cuinar. Quants litres d’oli queden?`],
      ['×', (a,b) => `Queden ${txt(a)} d’una coca. Reservem ${txt(b)} de la quantitat que queda. Quina fracció de la coca sencera hem reservat?`],
      ['×', (a,b) => `Un hort ocupa ${txt(a)} d’un terreny. Plantem tomàquets en ${txt(b)} de la superfície de l’hort. Quina fracció del terreny total ocupa la zona de tomàquets?`],
      ['÷', (a,b) => `Tenim ${txt(a)} de litre de llet. Omplim cada got amb ${txt(b)} de litre. Quants gots podem omplir completament?`],
      ['÷', (a,b) => `Disposem de ${txt(a)} de metre de cordill. En fem trossos de ${txt(b)} de metre cadascun. Quants trossos obtenim?`]
    ]
  };
  const darrers = {};
  function dades(nivell,op) {
    if(nivell !== 'dificil') {
      const d = pick(nivell === 'facil' ? [4,6,8,10,12] : [6,8,10,12,16]);
      if(op === '+') { const a=r(1,d-2); return [f(a,d),f(r(1,d-a),d)]; }
      const a=r(2,d); return [f(a,d),f(r(1,a-1),d)];
    }
    if(op === '÷') {
      const d=pick([6,8,10,12,16]), k=r(2,Math.min(5,d-1));
      return [f(k,d),f(2,2*d)];
    }
    const d=pick([2,3,4,5,6]), e=pick([2,3,4,5,6].filter(x=>x!==d));
    let a=f(r(1,d-1),d), b=f(r(1,e-1),e);
    if(op==='-' && a.n*b.d < b.n*a.d) [a,b]=[b,a];
    if(op==='-' && eq(a,b)) return [f(3,4),f(1,3)];
    return [a,b];
  }
  function calcula(a,b,op) {
    if(op==='+') return f(a.n*b.d+b.n*a.d,a.d*b.d);
    if(op==='-') return f(a.n*b.d-b.n*a.d,a.d*b.d);
    if(op==='×') return f(a.n*b.n,a.d*b.d);
    return f(a.n*b.d,a.d*b.n);
  }
  function entrada(id,nom) {
    return `<label>${nom}<input type="number" step="1" min="0" id="${id}"></label>`;
  }
  function llegeix(id) {
    const e=document.getElementById(id);
    if(!e || e.value.trim()==='') return null;
    const n=Number(e.value); return Number.isSafeInteger(n) && n>=0 ? n : null;
  }
  function llegirFraccio(prefix) {
    const n=llegeix(prefix+'n'), d=llegeix(prefix+'d');
    return n!==null && d!==null && d>0 ? f(n,d) : null;
  }
  function genera(nivell) {
    if(!plantilles[nivell]) nivell='facil';
    const opcions=plantilles[nivell].map((_,i)=>i).filter(i=>i!==darrers[nivell]);
    const index=pick(opcions); darrers[nivell]=index;
    const [op,enunciat]=plantilles[nivell][index];
    const [a,b]=dades(nivell,op), resultat=calcula(a,b,op);
    const text=nivell==='dificil' ? enunciat(a,b) : enunciat(a.n,b.n,a.d);
    let validat=false, area;
    return {
      enunciat:text,
      render(container) {
        const formulari=document.createElement('div');
        formulari.className='entrada-fraccio'; formulari.style.flexWrap='wrap';
        formulari.innerHTML=entrada('p1n','Numerador 1')+entrada('p1d','Denominador 1')+`<label>Operació<select id="p-op"><option value="">Tria una operació</option><option>+</option><option>-</option><option>×</option><option>÷</option></select></label>`+entrada('p2n','Numerador 2')+entrada('p2d','Denominador 2');
        const boto=document.createElement('button'); boto.type='button'; boto.textContent='Comprova el plantejament';
        area=document.createElement('div');
        boto.addEventListener('click',()=>{
          if(validat) return;
          const x=llegirFraccio('p1'), y=llegirFraccio('p2');
          const ordre=eq(x,a)&&eq(y,b);
          const invers=(op==='+'||op==='×')&&eq(x,b)&&eq(y,a);
          validat=document.getElementById('p-op').value===op && (ordre||invers);
          const missatge=document.getElementById('missatge');
          missatge.className=validat?'correcte':'incorrecte';
          missatge.textContent=validat?'Plantejament correcte. Ara resol l’operació.':'Revisa les quantitats i pensa quina operació resol el problema.';
          if(!validat) return;
          formulari.querySelectorAll('input,select').forEach(e=>e.disabled=true); boto.disabled=true;
          area.className='entrada-fraccio'; area.style.flexWrap='wrap';
          area.innerHTML=op==='÷' ? entrada('p-final','Nombre de gots o de trossos') : entrada('p-rn','Numerador del resultat')+entrada('p-rd','Denominador del resultat');
        });
        container.append(formulari,boto,area);
      },
      comprova() {
        if(!validat) return false;
        if(op==='÷') return llegeix('p-final')===resultat.n/resultat.d;
        return eq(llegirFraccio('p-r'),resultat);
      }
    };
  }
  return {genera};
})();
