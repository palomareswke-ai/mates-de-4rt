import json, os, time
from pathlib import Path
import xml.etree.ElementTree as ET
import requests

root=Path('assets/cromos')
catalog_path=root/'cataleg.json'
js_path=Path('js/cromos-animals.js')
catalog=json.loads(catalog_path.read_text(encoding='utf-8'))
assert len(catalog['CROMOS'])==250, 'Cal completar primer la importació dels cromos'
old_js=js_path.read_text(encoding='utf-8')
marker='window.CROMOS_ANIMALS = '
assert marker in old_js, 'Format de catàleg inesperat'
prefix,rest=old_js.split(marker,1)
old_payload,tail=rest.split(';\n',1)
json.loads(old_payload)
session=requests.Session()
session.headers['User-Agent']='MatesDe4rtOpenMojiImporter/1.0 (https://github.com/palomareswke-ai/mates-de-4rt)'
def get(url):
    for attempt in range(4):
        try:
            response=session.get(url,timeout=40)
            response.raise_for_status()
            return response
        except requests.RequestException:
            if attempt==3: raise
            time.sleep(2**attempt)

commit=get('https://api.github.com/repos/hfg-gmuend/openmoji/commits/master').json()['sha']
base=f'https://raw.githubusercontent.com/hfg-gmuend/openmoji/{commit}/'
license_text=get(base+'LICENSE.txt').text
assert 'Attribution-ShareAlike' in license_text or 'BY-SA' in license_text
specs=[('mamifers','1F981','Mamífers','terrestres','#fff7ed'),('aus','1F426','Aus','','#eff6ff'),('reptils','1F422','Rèptils','i amfibis','#f0fdf4'),('aquatics','1F41F','Animals','aquàtics','#ecfeff'),('insectes','1F98B','Insectes','i invertebrats','#faf5ff')]
files={};credits={}
for group,code,title,subtitle,color in specs:
    raw=get(base+f'color/svg/{code}.svg').content
    icon=ET.fromstring(raw)
    assert icon.tag.endswith('svg') and icon.get('viewBox')
    viewbox=icon.get('viewBox')
    ns='http://www.w3.org/2000/svg'
    ET.register_namespace('',ns)
    tag=lambda name:'{'+ns+'}'+name
    cover=ET.Element(tag('svg'),{'width':'480','height':'300','viewBox':'0 0 480 300','role':'img','aria-label':title+' '+subtitle+' · Per descobrir'})
    ET.SubElement(cover,tag('title')).text=title+' '+subtitle+' · Per descobrir'
    ET.SubElement(cover,tag('metadata')).text=f'OpenMoji – HfG Schwäbisch Gmünd i col·laboradors. CC BY-SA 4.0. https://creativecommons.org/licenses/by-sa/4.0/ . Adaptació: composició amb fons, títol i etiqueta. Original: https://github.com/hfg-gmuend/openmoji/blob/{commit}/color/svg/{code}.svg'
    ET.SubElement(cover,tag('rect'),{'width':'480','height':'300','rx':'20','fill':color})
    icon.set('x','155');icon.set('y','8');icon.set('width','170');icon.set('height','170');icon.set('viewBox',viewbox);cover.append(icon)
    for y,value,size in [('207',title,'25'),('238',subtitle,'23'),('278','PER DESCOBRIR','17')]:
        ET.SubElement(cover,tag('text'),{'x':'240','y':y,'text-anchor':'middle','font-family':'sans-serif','font-size':size,'fill':'#172554'}).text=value
    dest=root/'caratules'/f'{group}.svg'
    files[dest]=ET.tostring(cover,encoding='unicode')
    files[root/'openmoji'/f'{code}.svg']=raw.decode('utf-8')
    credits[group]={'autor':'OpenMoji – HfG Schwäbisch Gmünd i col·laboradors','licencia':'CC BY-SA 4.0','url':'https://creativecommons.org/licenses/by-sa/4.0/','font':f'https://github.com/hfg-gmuend/openmoji/blob/{commit}/color/svg/{code}.svg','canvis':'Composició amb fons, nom de categoria i etiqueta Per descobrir','imatge':dest.as_posix(),'commit':commit}

for category in catalog['CATEGORIES']:
    category['imatge']=credits[category['id']]['imatge']
payload={**catalog,'CARATEULES':{c['id']:c['imatge'] for c in catalog['CATEGORIES']}}
tail=tail.replace('Les caràtules reutilitzen la primera foto disponible de cada categoria.','Les caràtules són il·lustracions d’OpenMoji.')
start='/* OPENMOJI_CREDITS_START */'
if start in tail: tail=tail.split(start,1)[0]
tail+='''
/* OPENMOJI_CREDITS_START */
document.addEventListener('DOMContentLoaded',()=>{
  const target=document.querySelector('footer.credits details') || document.querySelector('footer.credits');
  if(!target)return;
  const p=document.createElement('p');
  p.append(document.createTextNode('Il·lustracions de les caràtules: OpenMoji – HfG Schwäbisch Gmünd i col·laboradors. Adaptades amb fons, categoria i etiqueta. '));
  const source=document.createElement('a');source.href='https://openmoji.org/';source.textContent='OpenMoji';p.appendChild(source);
  p.append(document.createTextNode(' · '));
  const license=document.createElement('a');license.href='https://creativecommons.org/licenses/by-sa/4.0/';license.textContent='CC BY-SA 4.0';p.appendChild(license);target.appendChild(p);
});
'''
files[js_path]=prefix+marker+json.dumps(payload,ensure_ascii=False,separators=(',',':'))+';\n'+tail
files[catalog_path]=json.dumps(catalog,ensure_ascii=False,indent=2)
files[root/'caratules-credits.json']=json.dumps(credits,ensure_ascii=False,indent=2)
files[root/'openmoji'/'LICENSE.txt']=license_text
report_path=root/'informe.json'
if report_path.exists():
    report=json.loads(report_path.read_text(encoding='utf-8'));report['caratules']=5;report['tipus_caratules']='OpenMoji CC BY-SA 4.0';files[report_path]=json.dumps(report,ensure_ascii=False,indent=2)
assert len(credits)==5
for path,content in files.items():
    path.parent.mkdir(parents=True,exist_ok=True);path.write_text(content,encoding='utf-8')
summary=f'5/5 caràtules OpenMoji desades localment. Revisió: {commit}. Les fotos individuals i els identificadors no s’han modificat.'
print(summary)
if os.environ.get('GITHUB_STEP_SUMMARY'):
    with open(os.environ['GITHUB_STEP_SUMMARY'],'a',encoding='utf-8') as out:out.write(summary+'\n')
