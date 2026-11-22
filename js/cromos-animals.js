"use strict";
window.CROMOS_ANIMALS = (() => {
  function portada(a,b,color) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="300" viewBox="0 0 480 300"><rect width="480" height="300" rx="24" fill="${color}"/><text x="240" y="130" text-anchor="middle" fill="white" font-family="sans-serif" font-size="32">${a}</text><text x="240" y="175" text-anchor="middle" fill="white" font-family="sans-serif" font-size="30">${b}</text><text x="240" y="240" text-anchor="middle" fill="white" font-family="sans-serif" font-size="20">Àlbum de cromos</text></svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
  const CARATEULES = { mamifers: portada('Mamífers','terrestres','#92400e'), aus: portada('Aus','','#0369a1'), reptils: portada('Rèptils','i amfibis','#3f6212'), aquatics: portada('Animals','aquàtics','#0f766e'), insectes: portada('Insectes','i invertebrats','#6b21a8') };
  const CATEGORIES = [
    {id:'mamifers',nom:'Mamífers terrestres',imatge:CARATEULES.mamifers},
    {id:'aus',nom:'Aus',imatge:CARATEULES.aus},
    {id:'reptils',nom:'Rèptils i amfibis',imatge:CARATEULES.reptils},
    {id:'aquatics',nom:'Animals aquàtics',imatge:CARATEULES.aquatics},
    {id:'insectes',nom:'Insectes i invertebrats',imatge:CARATEULES.insectes}
  ];
  const MAMIFERS = [
    ['Lleó','Panthera leo'],['Elefant africà','Loxodonta africana'],['Girafa','Giraffa'],['Zebra de plana','Equus quagga'],['Tigre','Panthera tigris'],
    ['Lleopard','Panthera pardus'],['Guepard','Acinonyx jubatus'],['Jaguar','Panthera onca'],['Puma','Puma concolor'],['Lleopard de les neus','Panthera uncia'],
    ['Linx ibèric','Lynx pardinus'],['Gat salvatge europeu','Felis silvestris'],['Llop gris','Canis lupus'],['Guineu roja','Vulpes vulpes'],['Guineu àrtica','Vulpes lagopus'],
    ['Ós bru','Ursus arctos'],['Ós polar','Ursus maritimus'],['Panda gegant','Ailuropoda melanoleuca'],['Panda vermell','Ailurus fulgens'],['Ós rentador','Procyon lotor'],
    ['Suricata','Suricata suricatta'],['Hiena tacada','Crocuta crocuta'],['Rinoceront blanc','Ceratotherium simum'],['Hipopòtam','Hippopotamus amphibius'],['Tapir de Malàisia','Tapirus indicus'],
    ['Bisó americà','Bison bison'],['Búfal africà','Syncerus caffer'],['Iac','Bos grunniens'],['Cérvol comú','Cervus elaphus'],['Ren','Rangifer tarandus'],
    ['Ant','Alces alces'],['Cabirol','Capreolus capreolus'],['Daina','Dama dama'],['Isard','Rupicapra pyrenaica'],['Cabra salvatge ibèrica','Capra pyrenaica'],
    ['Dromedari','Camelus dromedarius'],['Camell bactrià','Camelus bactrianus'],['Llama','Lama glama'],['Alpaca','Vicugna pacos'],['Cangur roig','Osphranter rufus'],
    ['Coala','Phascolarctos cinereus'],['Uombat comú','Vombatus ursinus'],['Goril·la occidental','Gorilla gorilla'],['Ximpanzé','Pan troglodytes'],['Orangutan de Borneo','Pongo pygmaeus'],
    ['Lèmur de cua anellada','Lemur catta'],['Esquirol vermell','Sciurus vulgaris'],['Eriçó europeu','Erinaceus europaeus'],['Conill europeu','Oryctolagus cuniculus'],['Senglar','Sus scrofa']
  ];
  const CROMOS = [];
  CATEGORIES.forEach((categoria, index) => {
    for(let numero=1;numero<=50;numero++) {
      const dades = index === 0 ? MAMIFERS[numero-1] : null;
      CROMOS.push({id:index*50+numero,categoria:categoria.id,numero,nom:dades ? dades[0] : null,especie:dades ? dades[1] : null,imatge:null,credit:null});
    }
  });
  return {CATEGORIES,CROMOS,CARATEULES};
})();

(() => {
  const catalog = window.CROMOS_ANIMALS;
  const usades = new Set();
  const text = html => new DOMParser().parseFromString(String(html || ''),'text/html').body.textContent.trim();
  const segura = url => { try { return new URL(url).protocol === 'https:'; } catch(error) { return false; } };
  async function api(host, params) {
    const url = new URL('https://' + host + '/w/api.php');
    url.search = new URLSearchParams({action:'query',format:'json',formatversion:'2',origin:'*',...params});
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(),15000);
    try {
      const resposta = await fetch(url,{signal:controller.signal,credentials:'omit'});
      if(!resposta.ok) throw new Error('HTTP ' + resposta.status);
      const dades = await resposta.json(); if(dades.error) throw new Error(dades.error.code); return dades.query || {};
    } finally { clearTimeout(timer); }
  }
  function credits(estat) {
    const peu = document.querySelector('footer.credits'); if(!peu) return;
    peu.replaceChildren();
    const details = document.createElement('details');
    const summary = document.createElement('summary'); summary.textContent = 'Crèdits de les imatges'; details.appendChild(summary);
    const nota = document.createElement('p'); nota.textContent = `Portades tipogràfiques creades per a l’app. Fotografies de Wikimedia Commons, redimensionades sense retallar. ${estat}`; details.appendChild(nota);
    const llista = document.createElement('ul'); llista.style.textAlign = 'left';
    catalog.CROMOS.filter(c => c.credit).forEach(c => {
      const item = document.createElement('li');
      item.append(document.createTextNode(`${c.id}. ${c.nom} — ${c.credit.autor}. `));
      const font = document.createElement('a'); font.href = c.credit.font; font.textContent = 'Original'; font.target = '_blank'; font.rel = 'noopener noreferrer'; item.appendChild(font);
      item.append(document.createTextNode(' · '));
      if(segura(c.credit.url)) { const licencia = document.createElement('a'); licencia.href = c.credit.url; licencia.textContent = c.credit.licencia; licencia.target = '_blank'; licencia.rel = 'noopener noreferrer'; item.appendChild(licencia); }
      else item.append(document.createTextNode(c.credit.licencia));
      llista.appendChild(item);
    });
    details.appendChild(llista); peu.appendChild(details);
  }
  async function lot(cromos) {
    const query = await api('en.wikipedia.org',{prop:'pageimages',piprop:'name',pilicense:'free',redirects:'1',titles:cromos.map(c => c.especie).join('|')});
    const aliases = new Map([...(query.normalized || []),...(query.redirects || [])].map(x => [x.from,x.to]));
    function resol(nom) { const visitats = new Set(); while(aliases.has(nom) && !visitats.has(nom)) { visitats.add(nom); nom = aliases.get(nom); } return nom; }
    const pagines = new Map((query.pages || []).map(p => [p.title,p]));
    const fitxers = new Map();
    cromos.forEach(c => { const p = pagines.get(resol(c.especie)); if(p && p.pageimage) fitxers.set(c.id,'File:' + p.pageimage); });
    if(!fitxers.size) return;
    const commons = await api('commons.wikimedia.org',{prop:'imageinfo',iiprop:'url|extmetadata|mime|size',iiurlwidth:'640',titles:[...new Set(fitxers.values())].join('|')});
    const imatges = new Map((commons.pages || []).map(p => [p.title,(p.imageinfo || [])[0]]));
    for(const c of cromos) {
      const info = imatges.get(fitxers.get(c.id)); if(!info) continue;
      const meta = info.extmetadata || {};
      const licencia = text(meta.LicenseShortName && meta.LicenseShortName.value);
      const autor = text(meta.Artist && meta.Artist.value) || text(meta.Credit && meta.Credit.value);
      const url = info.thumburl || info.url;
      if(!/^(CC BY(?:-SA)? [1-4]\.0|CC0(?: 1\.0)?|Public domain)$/i.test(licencia) || !autor || !/^image\/(jpeg|png|webp)$/.test(info.mime || '') || info.width < 200 || info.height < 200 || !segura(url) || !segura(info.descriptionurl) || usades.has(info.url)) continue;
      c.imatge = url; c.credit = {autor,licencia,url:meta.LicenseUrl ? meta.LicenseUrl.value : '',font:info.descriptionurl}; usades.add(info.url);
    }
  }
  document.addEventListener('DOMContentLoaded', async () => {
    credits('Carregant les fotografies dels mamífers…');
    const mamifers = catalog.CROMOS.filter(c => c.categoria === 'mamifers');
    for(let i=0;i<mamifers.length;i+=10) {
      try { await lot(mamifers.slice(i,i+10)); } catch(error) { console.warn('No s’ha pogut carregar un lot de mamífers',error); }
      if(typeof mostraCromos === 'function') mostraCromos();
    }
    const total = mamifers.filter(c => c.imatge).length;
    credits(`${total} de 50 fotografies de mamífers carregades. Les altres categories encara estan pendents.`);
  });
})();
