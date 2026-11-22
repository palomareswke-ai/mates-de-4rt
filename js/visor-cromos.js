"use strict";
(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const visor=document.createElement('dialog');visor.id='visor-cromos';visor.setAttribute('aria-labelledby','visor-cromo-nom');
    const tanca=document.createElement('button');tanca.type='button';tanca.className='visor-tanca';tanca.textContent='Tanca';
    const nom=document.createElement('p');nom.id='visor-cromo-nom';nom.className='visor-nom';
    const foto=document.createElement('img');foto.className='visor-foto';
    const ajuda=document.createElement('p');ajuda.className='visor-ajuda';ajuda.textContent='Toca la imatge per tancar-la.';
    const info=document.createElement('section');info.className='fitxa-animal';info.setAttribute('aria-label','Fitxa de l’animal');info.setAttribute('aria-live','polite');
    visor.append(tanca,nom,foto,ajuda,info);document.body.appendChild(visor);
    let origen=null,actiu=null,carrega=null;
    function dades(){
      if(!carrega) carrega=fetch('assets/cromos/fitxes.json').then(r=>{if(!r.ok)throw new Error('Fitxes no disponibles');return r.json();}).catch(error=>{carrega=null;throw error;});
      return carrega;
    }
    function link(parent,label,url){try{if(new URL(url).protocol!=='https:')return;}catch(error){return;}const a=document.createElement('a');a.textContent=label;a.href=url;a.target='_blank';a.rel='noopener noreferrer';parent.appendChild(a);}
    async function fitxa(c){
      info.replaceChildren();const waiting=document.createElement('p');waiting.textContent='Carregant la fitxa…';info.appendChild(waiting);
      try{
        const data=await dades();if(!visor.open||actiu!==c.id)return;info.replaceChildren();
        const f=data.animals&&data.animals[c.especie];
        const title=document.createElement('h3');title.textContent='Coneix aquest animal';info.appendChild(title);
        if(!f){const p=document.createElement('p');p.textContent='Informació pendent de verificar. Encara no s’han incorporat dades contrastades de pes, mides, longevitat, distribució, població ni conservació per a aquest animal.';info.appendChild(p);return;}
        const sci=document.createElement('p');sci.textContent=f.nomCientific||c.especie||'';info.appendChild(sci);
        const dl=document.createElement('dl');
        [['Pes del mascle',f.pesMascle],['Pes de la femella',f.pesFemella],['Mides del mascle',f.midesMascle],['Mides de la femella',f.midesFemella],['Sobre les mides',f.midesNota],['Anys de vida aproximats',f.vida],['On viu',f.zones],['Hàbitat',f.habitat]].forEach(([label,value])=>{const dt=document.createElement('dt');dt.textContent=label;const dd=document.createElement('dd');dd.textContent=value||'Dada pendent de verificar';dl.append(dt,dd);});info.appendChild(dl);
        const pop=f.poblacio;const state=f.conservacio||{};
        const labels={CR:'En perill crític',EN:'En perill',VU:'Vulnerable',NT:'Gairebé amenaçat',LC:'Preocupació menor',DD:'Dades insuficients',NE:'No avaluat',EW:'Extint en estat salvatge',EX:'Extint'};
        const box=document.createElement('div');box.className=['CR','EN','EW','EX'].includes(state.codi)?'fitxa-perill':state.codi==='VU'?'fitxa-vulnerable':'fitxa-estat';
        const status=document.createElement('p');status.textContent=state.codi?(labels[state.codi]||'Estat no verificat')+' ('+state.codi+')':'Estat de conservació pendent de verificar';box.appendChild(status);
        if(state.ambit){const p=document.createElement('p');p.textContent=state.ambit;box.appendChild(p);}
        const population=document.createElement('p');population.textContent=pop&&pop.text?`Població estimada: ${pop.text}${pop.unitat?' '+pop.unitat:''}. Any de l’estimació: ${pop.any||'no indicat'}. ${pop.ambit||''}.`:'No s’ha incorporat una estimació de població verificada; això no vol dir que no n’hi hagi.';box.appendChild(population);info.appendChild(box);
        const note=document.createElement('p');note.textContent=`Consulta de les fonts: ${data.consulta||'no indicada'}. La data de consulta no és l’any del cens. Les mides són orientatives i varien entre individus.`;info.appendChild(note);
        const sources=document.createElement('details');sources.className='fitxa-fonts';const summary=document.createElement('summary');summary.textContent='Fonts de la informació';sources.appendChild(summary);
        (f.fonts||[]).forEach(source=>{const p=document.createElement('p');link(p,source.nom,source.url);sources.appendChild(p);});info.appendChild(sources);
      }catch(error){if(visor.open&&actiu===c.id){info.textContent='No s’ha pogut carregar la fitxa. Tanca i torna a obrir el cromo per provar-ho de nou.';}}
    }
    function tancar(){if(visor.open)visor.close();}
    tanca.addEventListener('click',tancar);foto.addEventListener('click',tancar);
    visor.addEventListener('click',event=>{if(event.target===visor)tancar();});
    visor.addEventListener('close',()=>{document.documentElement.classList.remove('visor-cromos-obert');actiu=null;foto.removeAttribute('src');if(origen&&origen.isConnected)origen.focus({preventScroll:true});origen=null;});
    foto.addEventListener('error',()=>{ajuda.textContent='No s’ha pogut carregar la imatge. Prem Tanca per tornar.';});
    function cromoDe(img){
      if(!img||!img.matches('img')||!img.complete||!img.naturalWidth||!window.CROMOS_ANIMALS)return null;
      const reward=img.closest('.cromo-tapat');if(reward&&!reward.classList.contains('destapat'))return null;if(!reward&&!img.closest('#coleccio-cromos'))return null;
      return window.CROMOS_ANIMALS.CROMOS.find(c=>{if(!c.imatge)return false;try{return new URL(c.imatge,document.baseURI).href===img.src&&obtenirCromosDesbloquejats().includes(c.id);}catch(error){return false;}})||null;
    }
    function obrir(img){const c=cromoDe(img);if(!c||visor.open)return;origen=img.closest('button')||img;actiu=c.id;nom.textContent=`Cromo ${c.id} · ${c.nom||''}`;foto.alt=c.nom||`Cromo ${c.id}`;ajuda.textContent='Toca la imatge per tancar-la.';foto.src=c.imatge;visor.showModal();visor.scrollTop=0;document.documentElement.classList.add('visor-cromos-obert');fitxa(c);}
    document.addEventListener('click',event=>{if(event.target instanceof HTMLImageElement&&!visor.contains(event.target))obrir(event.target);},true);
    document.addEventListener('keydown',event=>{if((event.key==='Enter'||event.key===' ')&&event.target instanceof HTMLImageElement&&cromoDe(event.target)){event.preventDefault();obrir(event.target);}});
    function prepara(img){if(!cromoDe(img))return;img.dataset.ampliable='true';img.title='Toca per ampliar';if(!img.closest('button')){img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label',`Amplia: ${img.alt}`);img.setAttribute('aria-haspopup','dialog');}}
    function actualitza(){document.querySelectorAll('#coleccio-cromos img, .cromo-tapat.destapat img').forEach(prepara);}
    document.addEventListener('load',event=>{if(event.target instanceof HTMLImageElement)prepara(event.target);},true);
    const observer=new MutationObserver(actualitza);['coleccio-cromos','exercici'].forEach(id=>{const el=document.getElementById(id);if(el)observer.observe(el,{childList:true,subtree:true});});actualitza();
  });
})();
