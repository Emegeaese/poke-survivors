/* ============ trade-ui.js — pantalla de intercambio con un amigo ============
 * Lógica y reglas en net/trade.js. Aquí se elige qué dar, se ve lo que ofrece
 * el otro y se acepta. Siempre uno por uno.
 */
G.TradeUI = (() => {
  const $ = G.UI.$;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let other = null, shinyTab = false, q = '';

  function init() {
    $('tr-back').onclick = () => G.FriendsUI.open();
    $('tr-accept').onclick = async () => {
      const r = await G.Trade.accept(other);
      if (!r.ok) { G.UI.toast(r.error, 3000); G.Audio.sfx('error'); }
    };
    $('tr-cancel').onclick = async () => {
      const r = await G.Trade.cancel(other);
      G.UI.toast(r.ok ? 'Intercambio cancelado' : r.error, 2600);
      render();
    };
    $('tr-search').oninput = e => { q = e.target.value.trim().toLowerCase(); renderGrid(); };
    document.querySelectorAll('#scr-trade .seg button').forEach(b => {
      b.onclick = () => {
        shinyTab = b.dataset.v === '1';
        document.querySelectorAll('#scr-trade .seg button').forEach(x => x.classList.toggle('on', x === b));
        renderGrid();
      };
    });
    G.Trade.on(() => { if (G.UI.isOpen('scr-trade')) render(); });
  }

  function open(uid) {
    if (!G.DB.online) return;
    other = uid;
    shinyTab = false; q = '';
    $('tr-search').value = '';
    document.querySelectorAll('#scr-trade .seg button').forEach(x => x.classList.toggle('on', x.dataset.v === '0'));
    G.UI.show('scr-trade', true);
    render();
  }

  const friend = () => G.Social.friends.find(f => f.uid === other);

  function slot(box, o, mineSide) {
    box.classList.remove('ok');
    if (!o) {
      box.innerHTML = `<p class="sub">${mineSide ? 'Elige abajo qué das.' : 'Aún no ha elegido.'}</p>`;
      return;
    }
    const p = G.DEX_BY[o.dex];
    box.innerHTML = '';
    box.appendChild(G.UI.spriteCanvas(o.dex, 110, 96, { scale: 2, shiny: !!o.sh, shadow: true }));
    box.insertAdjacentHTML('beforeend', `<b>${o.sh ? G.Icons.html('shiny', 12) + ' ' : ''}${p ? esc(p.name) : '#' + o.dex}</b>${p ? G.UI.stars(p.rarity, 14) : ''}`);
    if (!mineSide) {
      const have = G.DB.copies(G.DB.save, o.dex, !!o.sh);
      box.insertAdjacentHTML('beforeend', `<span class="sub">${have ? 'Ya tienes ×' + have : 'Sería nuevo para ti'}</span>`);
    }
  }

  function render() {
    const f = friend();
    if (!f || f.status !== 'ok') { G.FriendsUI.open(); return; }
    const uid = G.Social.me.uid;
    $('tr-title').textContent = 'Intercambio con ' + f.name;
    $('tr-their-title').textContent = 'Oferta de ' + f.name;
    const t = G.Trade.get(other);
    const mine = t && t.o && t.o[uid], theirs = t && t.o && t.o[other];
    slot($('tr-mine'), mine, true);
    slot($('tr-theirs'), theirs, false);

    const sig = t && mine && theirs ? G.Trade.sigOf(t) : null;
    const myOk = !!(sig && t.ok && t.ok[uid] === sig), theirOk = !!(sig && t.ok && t.ok[other] === sig);
    const closing = !!(t && t.done && Object.keys(t.done).length);
    $('tr-mine').classList.toggle('ok', myOk);
    $('tr-theirs').classList.toggle('ok', theirOk);

    let msg;
    if (closing) msg = 'Cerrando el intercambio…';
    else if (!mine && !theirs) msg = 'Elige un Pokémon para dar. Tu amigo verá tu oferta y elegirá el suyo.';
    else if (mine && !theirs) msg = 'Esperando a que ' + f.name + ' elija qué dar.';
    else if (!mine && theirs) msg = f.name + ' ofrece un Pokémon. Elige qué das a cambio.';
    else if (myOk && theirOk) msg = 'Los dos habéis aceptado…';
    else if (myOk) msg = 'Has aceptado. Esperando a ' + f.name + '.';
    else if (theirOk) msg = f.name + ' ya ha aceptado. Falta tu respuesta.';
    else msg = 'Revisa el cambio y pulsa Aceptar. Si alguien cambia su oferta, hay que volver a aceptar.';
    $('tr-status').textContent = msg;

    $('tr-accept').disabled = !sig || myOk || closing;
    $('tr-accept').classList.toggle('hidden', !sig);
    $('tr-cancel').classList.toggle('hidden', !t);
    $('tr-cancel').disabled = closing;
    renderGrid();
  }

  function renderGrid() {
    const s = G.DB.save, grid = $('tr-grid');
    const t = G.Trade.get(other), uid = G.Social.me.uid;
    const mine = t && t.o && t.o[uid];
    const locked = !!(t && t.done && Object.keys(t.done).length);
    grid.innerHTML = '';
    for (const p of G.DEX) {
      const n = G.DB.tradable(s, p.dex, shinyTab);
      if (n < 1) continue;
      if (q && !p.name.toLowerCase().includes(q) && String(p.dex) !== q) continue;
      const cell = document.createElement('div');
      cell.className = 'cell' + (mine && mine.dex === p.dex && !!mine.sh === shinyTab ? ' on' : '') + (locked ? ' res' : '');
      cell.style.setProperty('--stage-c', G.U.TYPE_COLOR[p.types[0]]);
      cell.insertAdjacentHTML('beforeend', `<span class="no">${String(p.dex).padStart(3, '0')}</span>`);
      if (n > 1) cell.insertAdjacentHTML('beforeend', `<div class="dups-tags"><span class="dup-n${shinyTab ? ' sh' : ''}">${shinyTab ? G.Icons.html('shiny', 10) : ''}×${n}</span></div>`);
      cell.appendChild(G.UI.spriteCanvas(p.dex, 92, 80, { scale: 2, shadow: true, shiny: shinyTab }));
      cell.insertAdjacentHTML('beforeend', `<b>${esc(p.name)}</b>${G.UI.stars(p.rarity, 9)}`);
      cell.onclick = async () => {
        if (locked) return;
        const r = await G.Trade.offer(other, p.dex, shinyTab);
        if (!r.ok) { G.UI.toast(r.error, 3000); G.Audio.sfx('error'); }
        else G.Audio.sfx('click');
      };
      grid.appendChild(cell);
    }
    if (!grid.children.length) {
      grid.innerHTML = `<p class="sub" style="grid-column:1/-1">${shinyTab ? 'No tienes ningún shiny que dar.' : 'No tienes Pokémon que dar con este filtro.'}</p>`;
    }
  }

  return { init, open };
})();
