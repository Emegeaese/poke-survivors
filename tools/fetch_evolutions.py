"""Baja las cadenas de evolución de PokeAPI y escribe js/data/evolutions.js (una sola vez)."""
import json, re, urllib.request, concurrent.futures as cf
dex = set(int(x) for x in re.findall(r'"dex":(\d+)', open('js/data/pokedex.js', encoding='utf8').read()))
def get(u):
    for _ in range(4):
        try: return json.load(urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'}), timeout=30))
        except Exception: pass
    return None
def sid(url): return int(url.rstrip('/').split('/')[-1])
chains = {}
def one(i):
    return i, get(f'https://pokeapi.co/api/v2/evolution-chain/{i}/')
with cf.ThreadPoolExecutor(16) as ex:
    for i, c in ex.map(one, range(1, 560)):
        if c: chains[i] = c['chain']
evo = {}
def walk(node):
    a = sid(node['species']['url'])
    for ch in node['evolves_to']:
        b = sid(ch['species']['url'])
        d = ch['evolution_details'][0] if ch['evolution_details'] else {}
        lv = d.get('min_level')
        if a in dex and b in dex:
            evo.setdefault(a, []).append([b, lv or 0])
        walk(ch)
for c in chains.values(): walk(c)
out = '/* GENERADO por tools/fetch_evolutions.py — a quién evoluciona cada Pokémon: [dex, nivel original o 0] */\nG.EVO_DATA = ' + json.dumps({str(k): v for k, v in sorted(evo.items())}, separators=(',', ':')) + ';\n'
open('js/data/evolutions.js', 'w', encoding='utf8').write(out)
print(len(chains), 'cadenas', len(evo), 'con evolución')
