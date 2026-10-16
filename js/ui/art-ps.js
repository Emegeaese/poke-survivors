/* ============ art-ps.js — arte pixel de objetos tomado de "Pokémon Survivors" ============
 * Dibujos de objetos, Poké Ball, baya y monedas de pedrobarretto/pokemon-survivors (MIT,
 * https://github.com/pedrobarretto/pokemon-survivors), escritos como filas de texto con una paleta.
 * G.Icons los usa en lugar de los nuestros cuando existen (mismo nombre).
 */
G.ArtPS = (() => {
  const ICE = { 1: '#3878a8', 2: '#98d8f8', 3: '#d8f0ff', 4: '#ffffff' };
  
  const BERRY = ['....22..', '...22...', '.111111.', '11133111', '11131111', '11111111', '.111111.', '..1111..']
  const POKEBALL = ['..1111..', '.125221.', '12222221', '11144111', '13344331', '13333331', '.133331.', '..1111..']
  const COIN = ['.1111.', '123321', '132221', '122221', '122211', '.1111.']
  const COIN_STACK = ['.11111.', '1233321', '.11111.', '1222221', '.11111.', '1222221', '.11111.']
  const MONEY_BAG = ['.1....1.', '..1111..', '..1221..', '.122221.', '12233221', '12322321', '12233221', '12223221', '.122221.', '..1111..']
  
  const ITEM_ART = {
    muscleBand: [['.111111.', '12222221', '13333331', '12222221', '.111111.'], { 1: '#803010', 2: '#f08030', 3: '#f8c070' }],
    quickClaw: [['.1....1.', '121..121', '.121121.', '..1221..', '..1221..', '.12..21.', '12....21'], { 1: '#204080', 2: '#78b0f8' }],
    wideLens: [['.1111...', '122221..', '123221..', '122221..', '.11111..', '....111.', '.....111', '......11'], { 1: '#404048', 2: '#a8d8f8', 3: '#ffffff' }],
    lightClay: [['.111111.', '12222221', '12322221', '12222221', '12222221', '.111111.'], { 1: '#806838', 2: '#d8c088', 3: '#f8f0d0' }],
    loadedDice: [['11111111', '12222221', '12322321', '12222221', '12232221', '12222221', '12322321', '11111111'], { 1: '#303030', 2: '#f8f8f8', 3: '#c02020' }],
    leftovers: [['....2...', '...2....', '.111111.', '11331111', '13111111', '11111111', '.111111.', '..1..1..'], { 1: '#c83030', 2: '#58a030', 3: '#f8a0a0' }],
    choiceScarf: [['11111111', '12222221', '11111221', '....1221', '....1221', '...12221', '...1..11'], { 1: '#a03060', 2: '#f878b0' }],
    luckyEgg: [['..111..', '.12221.', '1222221', '1232321', '1222221', '1222221', '.12221.', '..111..'], { 1: '#a07850', 2: '#f8f0d8', 3: '#f87878' }],
    dowsingMachine: [['.1....1.', '.1....1.', '..1..1..', '11111111', '12222221', '12333321', '12222221', '11111111'], { 1: '#404858', 2: '#88a0c0', 3: '#78f8a0' }],
    charcoal: [['..111...', '.12221..', '1222321.', '12222221', '.1222221', '..11111.'], { 1: '#101010', 2: '#383838', 3: '#f08030' }],
    mysticWater: [['...1...', '..121..', '.12221.', '1223221', '1222221', '.12221.', '..111..'], { 1: '#2848b0', 2: '#6890f0', 3: '#ffffff' }],
    miracleSeed: [['...2.2.', '....2..', '..111..', '.13331.', '1333331', '.13331.', '..111..'], { 1: '#704818', 2: '#58c838', 3: '#d8a858' }],
    silkScarf: [['11111111', '12222221', '11111221', '....1221', '....1221', '...12221', '...1..11'], { 1: '#9898a8', 2: '#f8f8f8' }],
    poisonBarb: [['......1', '.....11', '....121', '...121.', '..121..', '.121...', '111....'], { 1: '#502060', 2: '#c060d0' }],
    sharpBeak: [['.111....', '12221...', '122221..', '1222221.', '1111111.', '.12221..', '..111...'], { 1: '#806010', 2: '#f8c030' }],
    neverMeltIce: [['...1...', '..121..', '.12321.', '1233421', '1234421', '.12421.', '..121..', '...1...'], ICE],
    hardStone: [['..1111..', '.122221.', '12233221', '12232221', '12222211', '.112211.', '..1111..'], { 1: '#404040', 2: '#888078', 3: '#c8c0b0' }],
    silverPowder: [['.3...3.', '..1.1..', '.12221.', '1222221', '1232221', '1222221', '.11111.'], { 1: '#686878', 2: '#d8d8e8', 3: '#ffffff' }],
    dragonFang: [['1111111', '1333331', '1222221', '.12221.', '.1221..', '..121..', '..11...'], { 1: '#605838', 2: '#f8f0d0', 3: '#a070f8' }],
    magnet: [['33....44', '33....44', '11....11', '11....11', '11....11', '.11..11.', '..1111..'], { 1: '#808088', 3: '#e83030', 4: '#3060e0' }],
    kingsRock: [['3...3...3', '2...2...2', '22.222.22', '222242222', '211111112', '222222222'], { 1: '#c89000', 2: '#f8d830', 3: '#f8f8c0', 4: '#e83838' }],
    toxicOrb: [['..1111..', '.122221.', '12233221', '12322321', '12232321', '12223321', '.122221.', '..1111..'], { 1: '#502060', 2: '#a040c0', 3: '#e0a0f8' }],
    assaultVest: [['.11..11.', '12211221', '12222221', '.122221.', '.123321.', '.122221.', '.111111.'], { 1: '#5a3018', 2: '#c05838', 3: '#f8d058' }],
    metronome: [['...11...', '...14...', '..1241..', '..1421..', '.122421.', '.124221.', '12422221', '11111111'], { 1: '#583010', 2: '#d89040', 4: '#f8f0d0' }],
    powerHerb: [['.2...2..', '232.232.', '.2...2..', '..1.1...', '...1....', '..11....', '.1......'], { 1: '#386820', 2: '#f8f8f8', 3: '#e83838' }],
  }
  
  
  const ITEM_ART_EXTRA = {
    amuletCoin: [['1......1', '.1....1.', '..1111..', '.122221.', '12233221', '12322321', '12233221', '.122221.', '..1111..'], { 1: '#805000', 2: '#f8c830', 3: '#fff8b0' }],
  };
  const PICK = {
    pokeball: [POKEBALL, { 1: '#202028', 2: '#e83838', 3: '#f0f0f0', 4: '#ffffff', 5: '#f8a0a0' }],
    berry: [BERRY, { 1: '#3870d8', 2: '#48a838', 3: '#b8d8ff' }],
    coin: [COIN, { 1: '#a86000', 2: '#f8c830', 3: '#fff8b0' }],
    coinstack: [COIN_STACK, { 1: '#a86000', 2: '#f8c830', 3: '#fff8b0' }],
    moneybag: [MONEY_BAG, { 1: '#583010', 2: '#c88848', 3: '#f8d030' }]
  };
  // Nuestros ids -> los de ellos.
  const ALIAS = {
    leftovers: 'leftovers', choiceband: 'muscleBand', quickclaw: 'quickClaw', luckyegg: 'luckyEgg', choicescarf: 'choiceScarf',
    assaultvest: 'assaultVest', amuletcoin: 'amuletCoin', charcoal: 'charcoal', mysticwater: 'mysticWater', miracleseed: 'miracleSeed',
    silkscarf: 'silkScarf', poisonbarb: 'poisonBarb', sharpbeak: 'sharpBeak', nevermeltice: 'neverMeltIce', hardstone: 'hardStone',
    silverpowder: 'silverPowder', dragonfang: 'dragonFang', magnet: 'magnet'
  };
  const mk = (rows, pal, min = 10) => {
    const w = Math.max(...rows.map(r => r.length)), h = rows.length;
    const sil = document.createElement('canvas'); sil.width = w; sil.height = h;
    const sc = sil.getContext('2d');
    rows.forEach((row, y) => { for (let x = 0; x < row.length; x++) { const c = pal[row[x]]; if (c) { sc.fillStyle = c; sc.fillRect(x, y, 1, 1); } } });
    // contorno de 1 px
    const out = document.createElement('canvas'); out.width = w + 2; out.height = h + 2;
    const o = out.getContext('2d');
    const dark = document.createElement('canvas'); dark.width = w; dark.height = h;
    const dc = dark.getContext('2d'); dc.drawImage(sil, 0, 0); dc.globalCompositeOperation = 'source-in'; dc.fillStyle = '#181818'; dc.fillRect(0, 0, w, h);
    for (const [dx, dy] of [[0, 1], [2, 1], [1, 0], [1, 2]]) o.drawImage(dark, dx, dy);
    o.drawImage(sil, 1, 1);
    // cuadrado, centrado
    const size = Math.max(out.width, out.height, min);
    const sq = document.createElement('canvas'); sq.width = size; sq.height = size;
    sq.getContext('2d').drawImage(out, Math.floor((size - out.width) / 2), Math.floor((size - out.height) / 2));
    return sq;
  };
  const cache = new Map();
  /** Canvas del icono `name`, o null si no es uno de estos. */
  function get(name) {
    if (cache.has(name)) return cache.get(name);
    let cv = null;
    if (name.startsWith('move:')) cv = G.ArtPS.moveIcon ? G.ArtPS.moveIcon(name.slice(5)) : null;
    else if (PICK[name]) cv = mk(PICK[name][0], PICK[name][1]);
    else {
      const k = ALIAS[name], a = k && (ITEM_ART[k] || ITEM_ART_EXTRA[k]);
      if (a) cv = mk(a[0], a[1]);
    }
    cache.set(name, cv);
    return cv;
  }
  return { get, mk };
})();
