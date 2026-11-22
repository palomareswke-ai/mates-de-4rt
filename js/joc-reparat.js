"use strict";
(() => {
  const $ = id => document.getElementById(id);
  const r = (a,b) => a + Math.floor(Math.random() * (b-a+1));
  const pick = xs => xs[r(0,xs.length-1)];
  const valid = f => f && Number.isSafeInteger(f.num) && Number.isSafeInteger(f.den) && f.num >= 0 && f.den > 0;
  const eq = (a,b) => Boolean(valid(a) && valid(b) && BigInt(a.num)*BigInt(b.den) === BigInt(b.num)*BigInt(a.den));
  const read = prefix => {
    const n=$(prefix+'num'), d=$(prefix+'den');
    if(!n || !d || n.value.trim()==='' || d.value.trim()==='') return null;
    const f={num:Number(n.value),den:Number(d.value)}; return valid(f) ? f : null;
  };
  const calc = (a,b,op) => op==='+' ? {num:a.num*b.den+b.num*a.den,den:a.den*b.den} : op==='-' ? {num:a.num*b.den-b.num*a.den,den:a.den*b.den} : op==='×' ? {num:a.num*b.num,den:a.den*b.den} : {num:a.num*b.den,den:a.den*b.num};
  const fraction = f => `${f.num}/${f.den}`;
  function maths(parent,text) {
    const re=/(\d+)\/(\d+)/g; let last=0;
    for(const m of text.matchAll(re)) {
      parent.append(document.createTextNode(text.slice(last,m.index)));
      const span=document.createElement('span'); span.className='fraccio-vertical';
      ['numerador','linia','denominador'].forEach((name,i)=>{const part=document.createElement('span');part.className=name;part.textContent=i===0?m[1]:i===2?m[2]:'';span.appendChild(part);});
      parent.appendChild(span);last=m.index+m[0].length;
    }
    parent.append(document.createTextNode(text.slice(last)));
  }
  function inputs(parent) {
    const wrap=document.createElement('div');wrap.className='resposta-fraccio';
    ['num','den'].forEach((name,i)=>{
      const input=document.createElement('input');input.id='r-'+name;input.type='number';input.step='1';input.min=i?'1':'0';input.inputMode='numeric';input.placeholder=i?'Denominador':'Numerador';input.setAttribute('aria-label',input.placeholder);wrap.appendChild(input);
      if(!i) {const line=document.createElement('span');line.className='ratlla-resposta';wrap.appendChild(line);}
    });parent.appendChild(wrap);
  }
  function bar(parent,total,painted,interactive=false) {
    const wrap=document.createElement('div');wrap.className='fraccio-grafica';wrap.style.gridTemplateColumns=`repeat(${total},minmax(0,1fr))`;
    for(let i=0;i<total;i++) {
      const part=document.createElement(interactive?'button':'span');part.className='part'+(i<painted?' pintada':'');
      if(interactive) {
        part.type='button';part.setAttribute('aria-label',`Part ${i+1} de ${total}`);part.setAttribute('aria-pressed',String(i<painted));
        part.addEventListener('click',()=>{const on=part.classList.toggle('pintada');part.setAttribute('aria-pressed',String(on));});
      } else part.setAttribute('aria-hidden','true');
      wrap.appendChild(part);
    }
    if(!interactive) {wrap.setAttribute('role','img');wrap.setAttribute('aria-label',`${painted} de ${total} parts pintades`);}
    parent.appendChild(wrap);return wrap;
  }
  function operation(level,graphic=false) {
    const max=level==='facil'?6:level==='mitja'?12:20;
    let a={den:r(2,max)},b={den:r(2,max)};a.num=r(1,a.den-1);b.num=r(1,b.den-1);
    let op=pick(level==='facil'||graphic&&level==='mitja'?['+','-']:['+','-','×','÷']);
    if(graphic&&level==='mitja') b.den=a.den,b.num=r(1,a.den-1);
    if(op==='-'&&a.num*b.den<b.num*a.den) [a,b]=[b,a];
    const result=calc(a,b,op);
    return {
      enunciat:`Calcula ${fraction(a)} ${op} ${fraction(b)}.`,
      render(parent) {if(graphic) {bar(parent,a.den,a.num);const sign=document.createElement('p');sign.textContent=op;parent.appendChild(sign);bar(parent,b.den,b.num);}inputs(parent);},
      comprova() {const f=read('r-');return f?eq(f,result):null;}
    };
  }
  function identify(level) {
    const total=r(4,level==='facil'?6:12), count=r(1,total-1);let drawing;
    return {enunciat:`Pinta ${count} de les ${total} parts i escriu la fracció.`,render(parent){drawing=bar(parent,total,0,true);inputs(parent);},comprova(){const f=read('r-');return f?drawing.querySelectorAll('.pintada').length===count&&f.num===count&&f.den===total:null;}};
  }
  function equivalent() {
    const base=pick([{num:1,den:2},{num:1,den:3},{num:2,den:3},{num:1,den:4},{num:3,den:4},{num:2,den:5}]);
    const factor=r(2,3),options=[{num:base.num*factor,den:base.den*factor}];
    while(options.length<3){const den=r(2,12),f={num:r(1,den-1),den};if(!eq(f,base)&&!options.some(x=>x.num===f.num&&x.den===f.den))options.push(f);}
    for(let i=options.length-1;i>0;i--){const j=r(0,i);[options[i],options[j]]=[options[j],options[i]];}
    let chosen=null;
    return {enunciat:`Quina fracció és equivalent a ${fraction(base)}?`,render(parent){const wrap=document.createElement('div');wrap.className='opcions-equivalents';options.forEach(f=>{const button=document.createElement('button');button.type='button';button.className='opcio-equivalent';button.setAttribute('aria-pressed','false');maths(button,fraction(f));button.addEventListener('click',()=>{wrap.querySelectorAll('button').forEach(b=>{b.classList.remove('seleccionada');b.setAttribute('aria-pressed','false');});button.classList.add('seleccionada');button.setAttribute('aria-pressed','true');chosen=f;});wrap.appendChild(button);});parent.appendChild(wrap);},comprova(){return chosen?eq(chosen,base):null;}};
  }
  window.Fraccions={genera:level=>operation(level)};
  window.FraccionsGrafiques={genera:level=>level==='facil'?(Math.random()<0.6?identify(level):equivalent()):level==='mitja'?(Math.random()<0.5?operation(level,true):equivalent()):operation(level,true)};
  document.addEventListener('DOMContentLoaded',()=>{
    const titles={operacions:'Operacions amb fraccions',grafiques:'Fraccions gràfiques',problemes:'Problemes de comprensió'};
    let mode='',round=null,current=null,scored=false,checked=false;
    const message=(text,ok=false)=>{$('missatge').textContent=text;$('missatge').className=text?(ok?'correcte':'incorrecte'):'';};
    $('missatge').setAttribute('role','status');$('missatge').setAttribute('aria-live','polite');
    function show(id){['menu','album','joc'].forEach(name=>$(name).classList.toggle('ocult',name!==id));if(id==='album')mostraCromos();}
    function start(){round={level:$('dificultat').value,index:1,total:5,hits:0,errors:0,done:false};$('dificultat').disabled=true;show('joc');generate();}
    function retry(){if(!round||round.done)return;checked=false;message('Torna-ho a intentar. Pots corregir la mateixa resposta.',true);$('comprovar').disabled=false;$('revisar').hidden=true;$('seguent').hidden=true;}
    function generate(){
      scored=false;checked=false;message('');const area=$('exercici');area.replaceChildren();
      current=(mode==='operacions'?window.Fraccions:mode==='grafiques'?window.FraccionsGrafiques:window.ProblemesComprensio).genera(round.level);
      const heading=document.createElement('p');heading.id='enunciat';const progress=document.createElement('span');progress.textContent=`Exercici ${round.index} de ${round.total}`;heading.append(progress,document.createElement('br'));maths(heading,current.enunciat);area.appendChild(heading);current.render(area);
      const actions=document.createElement('div');actions.className='accions-exercici';
      const check=document.createElement('button');check.id='comprovar';check.type='button';check.textContent='Comprova';check.addEventListener('click',verify);
      const again=document.createElement('button');again.id='revisar';again.type='button';again.textContent='Tornar a intentar-ho';again.hidden=true;again.addEventListener('click',retry);
      const next=document.createElement('button');next.id='seguent';next.type='button';next.textContent=round.index===round.total?'Veure resultats':'Següent exercici';next.hidden=true;next.addEventListener('click',()=>{if(!checked)return;if(round.index===round.total)finish();else{round.index++;generate();}});
      actions.append(check,again,next);area.appendChild(actions);
    }
    function verify(){
      if(!current||!round||round.done||checked)return;
      if(mode==='problemes') {
        const fields=$('p-final')?[$('p-final')]:[$('p-rn'),$('p-rd')];
        if(fields.some(e=>!e)){message('Primer comprova el plantejament del problema.');return;}
        if(fields.some(e=>e.value.trim()===''||!Number.isSafeInteger(Number(e.value))||Number(e.value)<0)||$('p-rd')&&Number($('p-rd').value)<=0){message('Completa el resultat amb enters i un denominador més gran que zero.');return;}
      }
      const ok=current.comprova();if(ok===null||ok===undefined){message('Completa la resposta: tria una opció o escriu numerador i denominador vàlids.');return;}
      const first=!scored;if(first){scored=true;if(ok)round.hits++;else round.errors++;}
      checked=true;$('comprovar').disabled=true;$('revisar').hidden=Boolean(ok);$('seguent').hidden=false;
      message(ok?(first?'Molt bé! Has encertat.':'Molt bé! Ara és correcte. El primer intent es manté a la puntuació.'):'Encara no és correcte. Prem «Tornar a intentar-ho» per corregir-ho, o continua.',Boolean(ok));
    }
    function prize(level,hits){return level==='facil'?(hits===5?1:0):level==='mitja'?(hits===5?2:hits>=3?1:0):(hits===5?3:hits>=3?1:0);}
    function finish(){
      if(round.done)return;round.done=true;$('dificultat').disabled=false;message('');const area=$('exercici');area.replaceChildren();
      const heading=document.createElement('h3');heading.textContent=`Has acabat la ronda: ${round.hits} de 5 encerts al primer intent`;area.appendChild(heading);
      const won=[];let failed=false;const target=prize(round.level,round.hits);
      for(let i=0;i<target;i++){try{const id=desbloquejaCromoPerEncert();if(id===null)break;won.push(id);}catch(error){failed=true;break;}}
      const result=document.createElement('p');result.textContent=failed?'No s’han pogut desar tots els premis.':won.length?`Has guanyat ${won.length} ${won.length===1?'cromo':'cromos'}!`:target?'Ja tens tots els cromos!':'Continua practicant per guanyar cromos.';area.appendChild(result);
      if(won.length){const grid=document.createElement('div');grid.className='graella-cromos-guanyats';won.forEach(id=>{const c=window.CROMOS_ANIMALS.CROMOS.find(x=>x.id===id);if(!c)return;const cat=window.CROMOS_ANIMALS.CATEGORIES.find(x=>x.id===c.categoria);if(!cat)return;const card=document.createElement('button');card.type='button';card.className='cromo-tapat';card.setAttribute('aria-label',`Descobreix el cromo ${id}`);card.setAttribute('aria-expanded','false');const label=document.createElement('span');label.textContent=`Cromo ${id} · toca per descobrir`;card.append(creaVisualCromo(c,cat,false),label);card.addEventListener('click',()=>{card.classList.add('destapat');card.setAttribute('aria-expanded','true');const name=document.createElement('span');name.textContent=`Cromo ${id} · ${c.nom||'Desbloquejat'}`;card.setAttribute('aria-label',name.textContent);card.replaceChildren(creaVisualCromo(c,cat,true),name);},{once:true});grid.appendChild(card);});area.appendChild(grid);}
      [['Jugar una altra ronda',start],['Veure l’àlbum de cromos',()=>show('album')],['Tornar al menú',()=>show('menu')]].forEach(([label,fn])=>{const button=document.createElement('button');button.type='button';button.textContent=label;button.addEventListener('click',fn);area.appendChild(button);});
    }
    try{const saved=localStorage.getItem('mates-de-4rt-dificultat');if(['facil','mitja','dificil'].includes(saved))$('dificultat').value=saved;}catch(error){}
    $('dificultat').addEventListener('change',()=>{try{localStorage.setItem('mates-de-4rt-dificultat',$('dificultat').value);}catch(error){}});
    document.querySelectorAll('.mode').forEach(button=>button.addEventListener('click',()=>{mode=button.dataset.mode;$('titol-mode').textContent=titles[mode];start();}));
    $('obrir-album').addEventListener('click',()=>show('album'));$('tornar-album').addEventListener('click',()=>show('menu'));$('tornar').addEventListener('click',()=>{$('dificultat').disabled=false;show('menu');});
    $('nou').hidden=true;show('menu');
  });
})();
