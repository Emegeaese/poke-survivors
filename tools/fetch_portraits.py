"""Baja los retratos (cara, 40x40) de SpriteCollab a assets/pokemon/portrait/ y escribe js/data/portraits.js
con la lista de los que existen. CC BY-NC 4.0, PMDCollab (ver CREDITS.md)."""
import re, os, json, urllib.request, concurrent.futures as cf
dex = sorted(int(x) for x in re.findall(r'"dex":(\d+)', open('js/data/pokedex.js', encoding='utf8').read()))
B = 'https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait/'
def get(u):
    try: return urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'}), timeout=30).read()
    except Exception: return None
def one(d):
    n = '%04d' % d; r = [d, 0, 0]
    for k, u, f in ((1, n + '/Normal.png', n + '.png'), (2, n + '/0000/0001/Normal.png', n + 's.png')):
        out = 'assets/pokemon/portrait/' + f
        b = open(out, 'rb').read() if os.path.exists(out) else get(B + u)
        if b and b[:4] == b'\x89PNG':
            open(out, 'wb').write(b); r[k] = 1
    return r
with cf.ThreadPoolExecutor(16) as ex: res = list(ex.map(one, dex))
n = [d for d, a, s in res if a]; sh = [d for d, a, s in res if s]
open('js/data/portraits.js', 'w', encoding='utf8').write('/* GENERADO por tools/fetch_portraits.py: retratos disponibles */\nG.PORTRAITS = { n: new Set(' + json.dumps(n) + '), s: new Set(' + json.dumps(sh) + ') };\n')
print(len(n), 'normales', len(sh), 'shiny')
