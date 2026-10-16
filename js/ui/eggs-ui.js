/* ============ eggs-ui.js — la incubadora y la eclosión ============
 * Reglas y datos en systems/eggs.js. Aquí: los 3 espacios con su progreso, el
 * huevo agitándose al abrirlo y la tarjeta del Pokémon que sale.
 */
G.EggsUI = (() => {
  const $ = G.UI.$;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let busy = false;

  // ---------------- el huevo, dibujado desde un mapa de caracteres ----------------
  // k contorno · w cáscara · s sombra · m manchas · h brillo
  const SHAPE = [
    '.....kkkk.....',
    '....kwwwwk....',
    '...kwhwwwsk...',
    '...kwhwwwsk...',
    '..kwwwwwwwsk..',
    '..kwwwwwwwsk..',
    '.kwwwwwwwwwsk.',
    '.kwwwwwwwwwsk.',
    '.kwwwwwwwwwsk.',
    '.kwwwwwwwwwsk.',
    '.kwwwwwwwwwsk.',
    '.kwwwwwwwwwsk.',
    '..kwwwwwwwsk..',
    '..kwwwwwwwsk..',
    '...kwwwwwsk...',
    '....kssssk....',
    '.....kkkk.....'
  ];
  // Manchas de cada tipo: [columna, fila, ancho]
  const SPOTS = [
    [[4, 6, 2], [8, 9, 2], [5, 12, 3]],                                   // común: tres manchas
    [[3, 5, 8], [3, 8, 8], [3, 11, 8]],                                   // raro: rayas
    [[6, 4, 2], [4, 7, 2], [8, 7, 2], [6, 10, 2], [3, 12, 2], [9, 12, 2]] // épico: motas
  ];
  const SHELL = [['#f6efd8', '#d9cba0'], ['#d9ecff', '#a7c6ea'], ['#f5e2ff', '#c9a6e8']];
  // Grietas según el avance (filas, columnas): se van añadiendo
  const CRACKS = [[[7, 5], [8, 6], [8, 7]], [[9, 8], [10, 7], [10, 9], [11, 8]], [[5, 9], [4, 10], [5, 11], [6, 10]]];

  function eggCanvas(tier, scale, crack = 0) {
    const w = SHAPE[0].length, h = SHAPE.length;
    const cv = document.createElement('canvas');
    cv.width = w * scale; cv.height = h * scale;
    cv.className = 'egg-cv';
    const ctx = cv.getContext('2d');
    const T = G.Eggs.TIERS[tier];
    const pal = { k: '#1b1528', w: SHELL[tier][0], s: SHELL[tier][1], h: '#ffffff', m: T.color };
    const cell = (x, y, c) => { ctx.fillStyle = c; ctx.fillRect(x * scale, y * scale, scale, scale); };
    SHAPE.forEach((row, y) => [...row].forEach((ch, x) => { if (ch !== '.') cell(x, y, pal[ch]); }));
    for (const [x, y, n] of SPOTS[tier]) for (let i = 0; i < n; i++) if (SHAPE[y][x + i] === 'w') cell(x + i, y, pal.m);
    for (let c = 0; c < crack && c < CRACKS.length; c++) for (const [y, x] of CRACKS[c]) cell(x, y, pal.k);
    return cv;
  }

  function init() {
    $('eggs-close').onclick = () => G.MenuUI.open();
    $('egg-ok').onclick = () => { $('egg-fx').classList.add('hidden'); busy = false; render(); };
  }

  function open() {
    G.UI.show('scr-eggs', true);
    render();
  }

  const fmt = n => n.toLocaleString('es');

  function render() {
    const s = G.DB.save, list = s.eggs || [];
    const box = $('eggs-slots');
    box.innerHTML = '';
    const slots = Math.max(G.Eggs.SLOTS, list.length);
    for (let i = 0; i < slots; i++) {
      const e = list[i], el = document.createElement('div');
      el.className = 'egg-slot' + (e ? '' : ' empty');
      if (!e) {
        el.innerHTML = '<div class="egg-empty"></div><div class="sub">Vacío</div>';
        box.appendChild(el);
        continue;
      }
      const T = G.Eggs.TIERS[e.tier], tot = G.Eggs.total(e), ready = G.Eggs.isReady(e);
      const f = Math.min(1, (e.steps || 0) / tot);
      el.classList.toggle('ready', ready);
      el.appendChild(eggCanvas(e.tier, 5, f >= 0.9 ? 3 : f >= 0.6 ? 2 : f >= 0.3 ? 1 : 0));
      el.insertAdjacentHTML('beforeend', `
        <b style="color:${T.color}">Huevo ${esc(T.name.toLowerCase())}</b>
        <div class="bar"><i style="width:${Math.round(f * 100)}%"></i></div>
        <div class="sub">${fmt(e.steps || 0)} / ${fmt(tot)} pasos</div>`);
      const b = document.createElement('button');
      b.className = 'btn small ' + (ready ? 'gold' : '');
      b.textContent = ready ? '¡Abrir!' : 'En camino';
      b.disabled = !ready;
      b.dataset.sfx = 'none';
      b.onclick = () => hatch(i);
      el.appendChild(b);
      box.appendChild(el);
    }
    const st = s.stats || {};
    $('eggs-info').innerHTML =
      `Los huevos eclosionan con los <b>pasos</b> que das jugando (16 px = 1 paso): se suman al acabar cada partida.<br>
       Caen de <b>jefes</b>, <b>cofres con candado</b> y <b>legendarios de las grietas</b> (como mucho ${G.Eggs.PER_RUN} por partida).
       Los repetidos quedan como copias que puedes vender o intercambiar.`;
    $('eggs-stats').textContent = `Huevos encontrados: ${st.eggsFound || 0} · abiertos: ${st.hatched || 0} · pasos totales: ${fmt(st.steps || 0)}`;
  }

  const wait = ms => new Promise(r => setTimeout(r, ms));

  /** Abre el huevo `i`: se agita, se agrieta y sale el Pokémon. */
  async function hatch(i) {
    if (busy) return;
    const e = G.DB.save.eggs[i];
    if (!e) return;
    busy = true;
    const res = G.Eggs.hatch(i);
    if (!res) { busy = false; return; }
    const fx = $('egg-fx'), stage = $('egg-stage'), card = $('egg-card');
    card.innerHTML = '';
    card.classList.add('hidden');
    $('egg-ok').classList.add('hidden');
    stage.innerHTML = '';
    stage.className = 'egg-stage';
    fx.classList.remove('hidden');
    let crack = 0;
    for (const step of [0, 1, 2, 3]) {
      stage.innerHTML = '';
      const cv = eggCanvas(e.tier, 10, crack);
      cv.classList.add('shake' + Math.min(3, step + 1));
      stage.appendChild(cv);
      G.Audio.sfx('select');
      await wait(520);
      crack++;
    }
    // Destello y aparece el Pokémon.
    stage.classList.add('flash');
    G.Audio.sfx('burst', { rarity: res.rarity });
    await wait(260);
    stage.innerHTML = '';
    stage.classList.remove('flash');
    const mon = G.DEX_BY[res.dex];
    card.className = 'pcard r' + res.rarity + (res.shiny ? ' shiny' : '');
    card.style.setProperty('--rc', res.shiny ? '#9ae6ff' : G.Gacha.RARITY_COLOR[res.rarity]);
    card.style.setProperty('--stage-c', G.U.TYPE_COLOR[mon.types[0]]);
    card.innerHTML = `<div class="stars">${G.UI.stars(res.rarity, 24)}</div>`;
    card.appendChild(G.UI.spriteCanvas(res.dex, 150, 140, { lively: true, scale: 2, shiny: res.shiny }));
    const tag = res.isNew ? `<span class="new">${res.shiny ? '¡SHINY NUEVO!' : '¡NUEVO!'}</span>` : `Repetido ×${res.copies} · guardado`;
    card.insertAdjacentHTML('beforeend', `<b>${res.shiny ? G.Icons.html('shiny', 12) + ' ' : ''}${esc(mon.name)}</b><div class="tag">${tag}</div>`);
    card.classList.remove('hidden');
    G.Audio.sfx('reveal', { rarity: res.rarity });
    setTimeout(() => G.Audio.cry(res.dex, { force: true }), 250);
    $('egg-ok').classList.remove('hidden');
    G.UI.refreshCoins();
  }

  return { init, open, render, eggCanvas };
})();
