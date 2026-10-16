"""Genera js/ui/art-moves.js con el arte de iconos de movimientos de Pokemon Survivors (MIT)
leyendo tools/cache/theirs/src/render/art.ts (copia local del repo de pedrobarretto)."""
import re

s = open('tools/cache/theirs/src/render/art.ts', encoding='utf8').read()
names = ("FIREBALL FLAME DROPLET LEAF STAR FIST STEEL_ORB ARROW SHURIKEN JAW ORB HEART NOTE BLADE FIRE_STAR JET TRIANGLE "
         "SPIKE BARBS WISP QUICK CHAIN ICE_SHARD ICICLES BOULDER PILLAR NEEDLE HORN SNOWFLAKE BOLT SPIRAL VINE BLOB WIND "
         "CRACK DRUM SHELL CONE WAVE TORNADO GUNK").split()
out = []
for n in names:
    m = re.search(r"^const %s = (\[.*?\])\s*$" % n, s, re.M)
    if not m:
        m = re.search(r"^const %s = (\[(?:.|\n)*?\n\])" % n, s, re.M)
    assert m, n
    out.append("  const %s = %s;" % (n, m.group(1).replace(' as const', '')))
arrs = "\n".join(out)

body = r"""
  const ICE = { 1: '#3878a8', 2: '#98d8f8', 3: '#d8f0ff', 4: '#ffffff' };
  const STONE = { 1: '#3a2a18', 2: '#a08048', 3: '#d8c080', 4: '#685028' };
  const mk = (r, p) => G.ArtPS.mk(r, p, 14);
  const flip = rows => [...rows].reverse();
  const compose = (w, h, layers) => {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const x = c.getContext('2d');
    for (const [cv, dx, dy] of layers) x.drawImage(cv, dx, dy);
    return c;
  };
  const orb = (a, b, c) => mk(ORB, { 1: a, 2: b, 3: c });
  const T = {
    'tackle': () => mk(FIST, { 1: '#601818', 2: '#c03028', 3: '#f89070' }),
    'quick-attack': () => mk(QUICK, { 1: '#8890b0', 2: '#c8d0e8', 3: '#f0f4ff', 4: '#ffffff' }),
    'ember': () => mk(FIREBALL, { 1: '#a82010', 2: '#e05018', 3: '#f8a030', 4: '#fff0a0' }),
    'flamethrower': () => mk(CONE, { 1: '#a82010', 2: '#f07020', 3: '#f8c040', 4: '#ffffff' }),
    'fire-spin': () => mk(FLAME, { 1: '#c03018', 2: '#f07020', 3: '#f8b830', 4: '#fff8c0' }),
    'heat-wave': () => mk(FIRE_STAR, { 1: '#a01810', 2: '#e85018', 3: '#f8b030', 4: '#fff8d0' }),
    'water-gun': () => mk(DROPLET, { 1: '#2848b0', 2: '#6890f0', 3: '#a8d0f8', 4: '#ffffff' }),
    'bubble': () => mk(SPIRAL, { 1: '#3870e0' }),
    'hydro-pump': () => mk(JET, { 1: '#1838a0', 2: '#4878e8', 3: '#a8d8f8', 4: '#ffffff' }),
    'bubble-beam': () => mk(SHURIKEN, { 1: '#3068d0', 2: '#d0f0ff' }),
    'vine-whip': () => mk(VINE, { 1: '#286020', 2: '#78c850' }),
    'razor-leaf': () => mk(LEAF, { 1: '#285820', 2: '#58b838', 3: '#a8e870' }),
    'leaf-storm': () => { const l = mk(LEAF, { 1: '#205018', 2: '#70d048', 3: '#e0f8a0' }); return compose(16, 16, [[l, 0, 4], [l, 4, 0]]); },
    'giga-drain': () => mk(BLADE, { 1: '#286020', 2: '#78d850', 3: '#f0fff0' }),
    'thunder-shock': () => mk(BOLT, { 1: '#c89000', 2: '#f8e030' }),
    'discharge': () => { const b = mk(BOLT, { 1: '#2890c8', 2: '#e0ffff' }); return compose(15, 13, [[b, 0, 0], [b, 6, 3]]); },
    'thunderbolt': () => mk(CHAIN, { 2: '#fff8a0', 3: '#f8a030' }),
    'confusion': () => orb('#a03068', '#f85888', '#ffd0e8'),
    'psybeam': () => orb('#c04080', '#f888b0', '#ffffff'),
    'psychic': () => orb('#7a2ab0', '#c060f0', '#f0d8ff'),
    'psycho-cut': () => mk(BLADE, { 1: '#a03068', 2: '#f85888', 3: '#ffd0e8' }),
    'sludge': () => mk(BLOB, { 1: '#502060', 2: '#a040a0', 3: '#e0a0f0' }),
    'toxic': () => mk(GUNK, { 1: '#281830', 2: '#6a3a78', 3: '#b878c8', 4: '#88a038' }),
    'poison-sting': () => mk(NEEDLE, { 1: '#502060', 2: '#c060d0', 3: '#ffffff' }),
    'toxic-spikes': () => mk(SPIKE, { 1: '#e0b8f0', 2: '#a040c0', 3: '#502060' }),
    'mud-shot': () => mk(CRACK, { 1: '#704820', 2: '#e0c068' }),
    'bulldoze': () => mk(CRACK, { 1: '#704820', 2: '#e0c068' }),
    'spikes': () => mk(BARBS, { 1: '#f0d8f8', 2: '#b058d0', 3: '#6a2a88', 4: '#88c040' }),
    'bonemerang': () => mk(HORN, { 1: '#585870', 2: '#e8e0c8', 3: '#f8f4e8', 4: '#ffffff' }),
    'gust': () => mk(WIND, { 1: '#e8f0ff' }),
    'aerial-ace': () => mk(TORNADO, { 1: '#7880a8', 2: '#f0f4ff' }),
    'wing-attack': () => mk(WIND, { 1: '#c8d8ff' }),
    'body-slam': () => mk(FIST, { 1: '#584830', 2: '#b0a99f', 3: '#f0ece4' }),
    'karate-chop': () => mk(FIST, { 1: '#601818', 2: '#c03028', 3: '#f89070' }),
    'hyper-voice': () => mk(NOTE, { 1: '#c03018', 2: '#f8b030' }),
    'bug-bite': () => mk([...JAW, ...flip(JAW)], { 1: '#283808', 2: '#a3c43d', 3: '#ffffff' }),
    'bite': () => mk([...JAW, ...flip(JAW)], { 1: '#281820', 2: '#705848', 3: '#ffffff' }),
    'string-shot': () => mk(NEEDLE, { 1: '#587018', 2: '#d8f070', 3: '#ffffff' }),
    'bug-buzz': () => mk(HORN, { 1: '#585870', 2: '#c8c8d8', 3: '#e8e8f0', 4: '#ffffff' }),
    'rock-throw': () => mk(BOULDER, STONE),
    'rock-slide': () => { const p = mk(PILLAR, STONE); return compose(16, 20, [[p, 0, 0], [p, 5, 3]]); },
    'ice-beam': () => mk(ICE_SHARD, ICE),
    'powder-snow': () => mk(SNOWFLAKE, { 1: '#98d8f8', 2: '#ffffff' }),
    'hail': () => mk(ICICLES, ICE),
    'aura-sphere': () => mk(STEEL_ORB, { 1: '#1838a0', 2: '#4878e8', 3: '#a8d8f8', 4: '#ffffff' }),
    'lick': () => mk(CHAIN, { 2: '#a070d8', 3: '#f0e0ff' }),
    'hex': () => mk(CHAIN, { 2: '#7a6bc4', 3: '#f0e0ff' }),
    'shadow-ball': () => orb('#382068', '#7a6bc4', '#d0c0ff'),
    'night-shade': () => orb('#201830', '#6b5c92', '#c0b0e0'),
    'dark-pulse': () => orb('#181018', '#6b5c52', '#c0a890'),
    'dragon-rage': () => mk(CONE, { 1: '#2a1070', 2: '#7038f8', 3: '#a070f8', 4: '#f0e0ff' }),
    'fairy-wind': () => mk(HEART, { 1: '#a02858', 2: '#f878a8', 3: '#ffffff' }),
    'dazzling-gleam': () => mk(STAR, { 1: '#c88800', 2: '#f8d830', 3: '#fff8c0' }),
    'metal-claw': () => mk(STEEL_ORB, { 1: '#404858', 2: '#8890a8', 3: '#c8d0e0', 4: '#ffffff' }),
    'flash-cannon': () => mk(JET, { 1: '#404858', 2: '#8890a8', 3: '#c8d0e0', 4: '#ffffff' }),
    'meteor-mash': () => mk(BOULDER, { 1: '#404858', 2: '#8890a8', 3: '#c8d0e0', 4: '#586070' }),
    'will-o-wisp': () => mk(WISP, { 1: '#3040a0', 2: '#5870e8', 3: '#a8c0ff', 4: '#ffffff' }),
    'flame-wheel': () => mk(FIREBALL, { 1: '#a82010', 2: '#f07020', 3: '#f8c040', 4: '#ffffff' })
  };
  G.ArtPS.moveIcon = id => (T[id] ? T[id]() : null);
"""

head = """/* ============ art-moves.js - iconos de movimientos con el arte de "Pokémon Survivors" (MIT) ============
 * GENERADO por tools/gen_art_moves.py. Cada movimiento nuestro se empareja con el dibujo más parecido de
 * pedrobarretto/pokemon-survivors. Los que no tienen pareja (potenciadores, Sustituto...) se quedan con
 * nuestro emblema de tipo.
 */
(() => {
"""
open('js/ui/art-moves.js', 'w', encoding='utf8').write(head + arrs + "\n" + body + "})();\n")

