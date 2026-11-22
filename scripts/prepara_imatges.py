import hashlib, html, io, json, os, re, shutil, time
from pathlib import Path
from html.parser import HTMLParser
import requests
from PIL import Image, ImageOps

ROOT = Path('assets/cromos')
ROOT.mkdir(parents=True, exist_ok=True)
SESSION = requests.Session()
SESSION.headers['User-Agent'] = 'MatesDe4rtImageImporter/1.0 (https://github.com/palomareswke-ai/mates-de-4rt; educational image import)'
CATEGORIES = [('mamifers','Mamífers terrestres'),('aus','Aus'),('reptils','Rèptils i amfibis'),('aquatics','Animals aquàtics'),('insectes','Insectes i invertebrats')]
DADES = {
'mamifers': '''Lleó|Panthera leo
Elefant africà|Loxodonta africana
Girafa|Giraffa
Zebra de plana|Equus quagga
Tigre|Panthera tigris
Lleopard|Panthera pardus
Guepard|Acinonyx jubatus
Jaguar|Panthera onca
Puma|Puma concolor
Lleopard de les neus|Panthera uncia
Linx ibèric|Lynx pardinus
Gat salvatge europeu|Felis silvestris
Llop gris|Canis lupus
Guineu roja|Vulpes vulpes
Guineu àrtica|Vulpes lagopus
Ós bru|Ursus arctos
Ós polar|Ursus maritimus
Panda gegant|Ailuropoda melanoleuca
Panda vermell|Ailurus fulgens
Ós rentador|Procyon lotor
Suricata|Suricata suricatta
Hiena tacada|Crocuta crocuta
Rinoceront blanc|Ceratotherium simum
Hipopòtam|Hippopotamus amphibius
Tapir de Malàisia|Tapirus indicus
Bisó americà|Bison bison
Búfal africà|Syncerus caffer
Iac|Bos grunniens
Cérvol comú|Cervus elaphus
Ren|Rangifer tarandus
Ant|Alces alces
Cabirol|Capreolus capreolus
Daina|Dama dama
Isard|Rupicapra pyrenaica
Cabra salvatge ibèrica|Capra pyrenaica
Dromedari|Camelus dromedarius
Camell bactrià|Camelus bactrianus
Llama|Lama glama
Alpaca|Vicugna pacos
Cangur roig|Osphranter rufus
Coala|Phascolarctos cinereus
Uombat comú|Vombatus ursinus
Goril·la occidental|Gorilla gorilla
Ximpanzé|Pan troglodytes
Orangutan de Borneo|Pongo pygmaeus
Lèmur de cua anellada|Lemur catta
Esquirol vermell|Sciurus vulgaris
Eriçó europeu|Erinaceus europaeus
Conill europeu|Oryctolagus cuniculus
Senglar|Sus scrofa''',
'aus': '''House sparrow
European robin
Common blackbird
Great tit
Eurasian blue tit
European goldfinch
Common chaffinch
Barn swallow
Common swift
Common house martin
Eurasian magpie
Carrion crow
Common raven
Eurasian jay
Common wood pigeon
Rock dove
Eurasian collared dove
European green woodpecker
Great spotted woodpecker
Eurasian hoopoe
Common kingfisher
European bee-eater
White stork
Grey heron
Little egret
Greater flamingo
Mallard
Mute swan
Greylag goose
Great crested grebe
Great cormorant
Yellow-legged gull
Atlantic puffin
Emperor penguin
Common ostrich
Emu
Southern cassowary
Indian peafowl
Wild turkey
Common pheasant
Red-legged partridge
Common quail
Golden eagle
Peregrine falcon
Common kestrel
Barn owl
Eurasian eagle-owl
Snowy owl
Scarlet macaw
Keel-billed toucan''',
'reptils': '''Nile crocodile
American alligator
Gharial
Spectacled caiman
Komodo dragon
Green iguana
Marine iguana
Common chameleon
Panther chameleon
Veiled chameleon
Leopard gecko
Tokay gecko
Moorish gecko
Central bearded dragon
Frilled lizard
Blue-tongued skink
Sand lizard
Ocellated lizard
European green lizard
Slow worm
Gila monster
Tuatara
Hermann's tortoise
Greek tortoise
Galápagos tortoise
Aldabra giant tortoise
European pond turtle
Red-eared slider
Common snapping turtle
Mata mata
Ball python
Burmese python
Boa constrictor
Green anaconda
King cobra
Corn snake
Grass snake
Vipera aspis
Common European adder
California kingsnake
Fire salamander
Iberian ribbed newt
Great crested newt
Axolotl
Common frog
European tree frog
Common toad
Natterjack toad
Red-eyed tree frog
Golden poison frog''',
'aquatics': '''Common bottlenose dolphin
Orca
Humpback whale
Blue whale
Sperm whale
Beluga whale
Narwhal
West Indian manatee
Dugong
Walrus
Harbor seal
California sea lion
Sea otter
Great white shark
Whale shark
Scalloped hammerhead
Tiger shark
Reef manta ray
Spotted eagle ray
Ocean sunfish
Atlantic bluefin tuna
Swordfish
Atlantic salmon
Brown trout
European eel
Common carp
Goldfish
Ocellaris clownfish
Paracanthurus
Yellow tang
Copperband butterflyfish
Emperor angelfish
Mandarinfish
Spotted seahorse
Weedy seadragon
Red lionfish
Spotted trunkfish
Long-spine porcupinefish
Napoleon wrasse
Giant grouper
Great barracuda
Atlantic cod
European seabass
Gilthead seabream
Northern pike
Wels catfish
Arapaima
Green sea turtle
Hawksbill sea turtle
Leatherback sea turtle''',
'insectes': '''Monarch butterfly
Papilio machaon
Vanessa atalanta
Aglais io
Gonepteryx rhamni
Pieris brassicae
Morpho menelaus
Attacus atlas
Acherontia atropos
Actias luna
Western honey bee
Buff-tailed bumblebee
European hornet
Polistes dominula
Messor barbarus
Oecophylla smaragdina
Seven-spot ladybird
Lucanus cervus
Dynastes hercules
Oryctes nasicornis
Scarabaeus sacer
Goliathus goliatus
Anax imperator
Calopteryx splendens
Mantis religiosa
Gryllus campestris
Tettigonia viridissima
Locusta migratoria
Carausius morosus
Phyllium philippinicum
Cicada orni
Pyrrhocoris apterus
Chrysoperla carnea
Forficula auricularia
Brachypelma hamorii
Argiope bruennichi
Araneus diadematus
Pandinus imperator
Helix pomatia
Cornu aspersum
Lumbricus terrestris
Armadillidium vulgare
Octopus vulgaris
Sepia officinalis
Nautilus pompilius
Homarus gammarus
Cancer pagurus
Asterias rubens
Aurelia aurita
Paracentrotus lividus'''
}

class Plain(HTMLParser):
    def __init__(self): super().__init__(); self.parts=[]
    def handle_data(self,data): self.parts.append(data)
def plain(value):
    p=Plain(); p.feed(str(value or '')); return html.unescape(' '.join(p.parts)).strip()
def get(url, **kwargs):
    for attempt in range(4):
        try:
            time.sleep(0.6)
            response=SESSION.get(url, timeout=(15,60), **kwargs)
            if response.status_code in (429,500,502,503,504):
                time.sleep(min(60,5*2**attempt)); continue
            response.raise_for_status(); return response
        except requests.RequestException:
            if attempt==3: raise
            time.sleep(3*2**attempt)
    raise RuntimeError('Servidor no disponible')
def api(host, **params):
    data=get('https://'+host+'/w/api.php',params={'action':'query','format':'json','formatversion':2,'maxlag':5,**params}).json()
    if 'error' in data: raise RuntimeError(str(data['error']))
    return data.get('query',{})
def write_json(path,data):
    path.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
def safe_url(url): return isinstance(url,str) and url.startswith('https://')

entries=[]
for group,_ in CATEGORIES:
    lines=DADES[group].strip().splitlines()
    assert len(lines)==50,(group,len(lines))
    for number,line in enumerate(lines,1):
        bits=line.split('|',1)
        entries.append({'id':len(entries)+1,'categoria':group,'numero':number,'nom':bits[0],'especie':bits[-1],'imatge':None,'credit':None})
assert len(entries)==250 and len({c['id'] for c in entries})==250
old_path=ROOT/'credits.json'
old=json.loads(old_path.read_text(encoding='utf-8')) if old_path.exists() else {}
used=set(); records={}; errors=[]

for c in entries:
    dest=ROOT/c['categoria']/f"{c['id']:03d}.jpg"
    dest.parent.mkdir(parents=True,exist_ok=True)
    cached=old.get(str(c['id']))
    try:
        if cached and cached.get('especie')==c['especie'] and dest.exists() and cached.get('sha256')==hashlib.sha256(dest.read_bytes()).hexdigest() and cached.get('source_image') not in used:
            with Image.open(dest) as test: test.verify()
            c['nom']=cached['nom']; c['imatge']=dest.as_posix(); c['credit']=cached['credit']; records[str(c['id'])]=cached; used.add(cached['source_image']); continue
        q=api('en.wikipedia.org',titles=c['especie'],redirects=1,prop='pageimages|langlinks',piprop='name',pilicense='free',lllang='ca',lllimit=10)
        page=next((p for p in q.get('pages',[]) if 'missing' not in p),{})
        if c['categoria']!='mamifers':
            for link in page.get('langlinks',[]):
                if link.get('lang')=='ca': c['nom']=link.get('title',c['nom'])
        candidates=[]
        if page.get('pageimage'): candidates.append('File:'+page['pageimage'])
        search=api('commons.wikimedia.org',list='search',srsearch='"'+c['especie']+'" filetype:bitmap',srnamespace=6,srlimit=4)
        candidates.extend(p['title'] for p in search.get('search',[]) if p['title'] not in candidates)
        if not candidates: raise RuntimeError('Sense candidats')
        infos=api('commons.wikimedia.org',titles='|'.join(candidates),prop='imageinfo',iiprop='url|extmetadata|mime|size',iiurlwidth=640)
        info_map={p['title']:(p.get('imageinfo') or [None])[0] for p in infos.get('pages',[])}
        success=False
        for title in candidates:
            info=info_map.get(title)
            if not info: continue
            meta=info.get('extmetadata',{})
            val=lambda key: plain(meta.get(key,{}).get('value',''))
            license_name=val('LicenseShortName'); author=val('Artist') or val('Credit')
            license_url=val('LicenseUrl')
            if not re.fullmatch(r'(CC BY(?:-SA)? [1-4]\.[05]|CC0(?: 1\.0)?|Public domain)',license_name,re.I): continue
            if not author or info.get('mime') not in ('image/jpeg','image/png','image/webp') or min(info.get('width',0),info.get('height',0))<200: continue
            if not safe_url(info.get('descriptionurl')) or not safe_url(info.get('thumburl') or info.get('url')) or info['url'] in used: continue
            if license_name.upper().startswith('CC BY') and not safe_url(license_url): continue
            try:
                raw=get(info.get('thumburl') or info['url']).content
                if len(raw)>30_000_000: continue
                with Image.open(io.BytesIO(raw)) as source:
                    source.load(); image=ImageOps.exif_transpose(source).convert('RGB'); image.thumbnail((640,640))
                    if min(image.size)<100: continue
                    image.save(dest,'JPEG',quality=86,optimize=True)
                with Image.open(dest) as check: check.verify()
            except Exception: continue
            credit={'autor':author,'licencia':license_name,'url':license_url,'font':info['descriptionurl'],'titol':val('ObjectName') or title,'canvis':'Redimensionada i convertida a JPEG; sense retallar','avis':val('Attribution'),'copyright':val('Copyright'),'credit_original':val('Credit')}
            c['imatge']=dest.as_posix(); c['credit']=credit; used.add(info['url'])
            records[str(c['id'])]={'nom':c['nom'],'especie':c['especie'],'credit':credit,'source_image':info['url'],'sha256':hashlib.sha256(dest.read_bytes()).hexdigest()}
            success=True; break
        if not success: raise RuntimeError('Cap fotografia descarregable amb llicència admesa')
    except Exception as exc:
        errors.append({'id':c['id'],'animal':c['nom'],'error':str(exc)[:400]})
    print(c['id'],c['nom'],'OK' if c['imatge'] else 'PENDENT',flush=True)
    write_json(ROOT/'credits.json',records)

categories=[]; covers={}
for group,name in CATEGORIES:
    chosen=next((c for c in entries if c['categoria']==group and c['imatge']),None)
    path=ROOT/'caratules'/f'{group}.jpg'; path.parent.mkdir(parents=True,exist_ok=True)
    if chosen:
        shutil.copyfile(chosen['imatge'],path); covers[group]={'cromo':chosen['id'],'credit':chosen['credit']}
    categories.append({'id':group,'nom':name,'imatge':path.as_posix() if chosen else ''})
report={'objectiu_cromos':250,'descarregats':sum(bool(c['imatge']) for c in entries),'caratules':len(covers),'pendents':errors,'noms_sense_traduccio':[c['id'] for c in entries if c['categoria']!='mamifers' and c['nom']==c['especie']]}
write_json(ROOT/'informe.json',report); write_json(ROOT/'caratules-credits.json',covers)
write_json(ROOT/'cataleg.json',{'CATEGORIES':categories,'CROMOS':entries})
if not records: raise RuntimeError('Cap imatge disponible: es conserva el catàleg anterior')
payload={'CATEGORIES':categories,'CROMOS':entries,'CARATEULES':{c['id']:c['imatge'] for c in categories}}
js='"use strict";\nwindow.CROMOS_ANIMALS = '+json.dumps(payload,ensure_ascii=False,separators=(',',':'))+';\n'
js += '''document.addEventListener('DOMContentLoaded', () => {
  const footer=document.querySelector('footer.credits'); if(!footer) return; footer.replaceChildren();
  const details=document.createElement('details'); const summary=document.createElement('summary'); summary.textContent='Crèdits de les imatges'; details.appendChild(summary);
  const intro=document.createElement('p'); intro.textContent='Fotografies de Wikimedia Commons guardades a la mateixa app. Redimensionades i convertides a JPEG, sense retallar. Les caràtules reutilitzen la primera foto disponible de cada categoria.'; details.appendChild(intro);
  const list=document.createElement('ul'); list.style.textAlign='left';
  window.CROMOS_ANIMALS.CROMOS.filter(c=>c.credit).forEach(c=>{
    const item=document.createElement('li'); const credit=c.credit;
    item.append(document.createTextNode(`${c.id}. ${c.nom} — ${credit.titol}. ${credit.autor}. ${credit.avis || ''} ${credit.copyright || ''} ${credit.credit_original || ''} `));
    const source=document.createElement('a'); source.href=credit.font; source.textContent='Original'; source.target='_blank'; source.rel='noopener noreferrer'; item.appendChild(source); item.append(document.createTextNode(' · '));
    if(credit.url && credit.url.startsWith('https://')) {const link=document.createElement('a'); link.href=credit.url; link.textContent=credit.licencia; item.appendChild(link);} else item.append(document.createTextNode(credit.licencia));
    item.append(document.createTextNode(' · '+credit.canvis)); list.appendChild(item);
  }); details.appendChild(list); footer.appendChild(details);
});
'''
Path('js/cromos-animals.js').write_text(js,encoding='utf-8')
summary=f"## Imatges locals\n\n{report['descarregats']}/250 cromos i {len(covers)}/5 caràtules.\n\nPendents: {len(errors)}. Consulta assets/cromos/informe.json.\n"
if os.environ.get('GITHUB_STEP_SUMMARY'):
    with open(os.environ['GITHUB_STEP_SUMMARY'],'a',encoding='utf-8') as f: f.write(summary)
print(summary)
