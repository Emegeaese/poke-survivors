/* ============ menu.js — menú principal, colección y mejoras ============ */
G.MenuUI = (() => {
  const $ = G.UI.$;
  const GEN_NAMES = ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Teselia', 'Kalos', 'Alola', 'Galar', 'Paldea'];
  let dexFilter = 'all', dexGen = 1, dexSel = null;

  function init() {
    const ICON = { play: 'ball', dex: 'book', upgrades: 'up', gacha: 'ball4', eggs: 'egg', goals: 'medal3', friends: 'friends', rank: 'trophy', settings: 'gear' };
    document.querySelectorAll('#scr-menu [data-go]').forEach(b => {
      b.insertAdjacentHTML('afterbegin', `<span class="mi-ico">${G.Icons.html(ICON[b.dataset.go], 26)}</span>`);
      b.dataset.sfx = b.dataset.go === 'play' ? 'confirm' : 'click';
      b.onclick = () => {
        const go = b.dataset.go;
        if (go === 'play') { if (G.Social.room) G.LobbyUI.open(); else G.Flow.play(); }
        else if (go === 'dex') openDex();
        else if (go === 'upgrades') openUpgrades();
        else if (go === 'gacha') G.GachaUI.open();
        else if (go === 'eggs') G.EggsUI.open();
        else if (go === 'goals') G.GoalsUI.open();
        else if (go === 'friends') G.FriendsUI.open();
        else if (go === 'rank') G.RankingUI.open();
        else if (go === 'settings') G.SettingsUI.open();
      };
    });
    document.querySelectorAll('[data-back]').forEach(b => { b.onclick = open; });
    G.Social.on(() => { if (G.UI.isOpen('scr-menu')) socialLine(); });
    $('btn-logout').onclick = () => {
      if (G.DB.guest && !confirm('Eres invitado: se perderá todo el progreso. ¿Salir?')) return;
      G.Audio.music(null);
      G.DB.logout().then(() => G.Flow.toLogin());
    };
  }

  // ---------------- menú principal ----------------

  function open() {
    const s = G.DB.save;
    const mon = G.DEX_BY[s.partner];
    const shiny = !!s.partnerShiny && G.DB.ownsShiny(mon.dex);
    G.UI.chrome(true);
    G.UI.show('scr-menu');
    G.Online.show($('menu-online'));
    G.UI.sprite($('menu-partner'), mon.dex, { lively: true, scale: 4, hero: true, shiny });
    $('menu-partner').style.setProperty('--stage-c', shiny ? '#9ae6ff' : G.U.TYPE_COLOR[mon.types[0]]);
    $('menu-partner').classList.toggle('shiny', shiny);
    $('menu-partner-name').innerHTML = mon.name + (shiny ? ' ' + G.Icons.html('shiny', 24) : '');
    $('menu-partner-info').innerHTML = G.UI.typeChips(mon.types) + ' ' + G.UI.stars(mon.rarity);
    // Dificultad de la próxima partida (Normal, Difícil, Pesadilla).
    const dopts = $('menu-diff-opts');
    dopts.innerHTML = '';
    for (const id of G.Difficulty.IDS) {
      const L = G.Difficulty.LEVELS[id], b = document.createElement('button');
      b.className = 'diff-opt' + (id === G.Difficulty.chosen ? ' on' : '');
      b.style.setProperty('--dc', L.color);
      b.textContent = L.name;
      b.onclick = () => { G.Settings.set('difficulty', id); G.Audio.sfx('select'); open(); };
      dopts.appendChild(b);
    }
    $('menu-diff-blurb').textContent = G.Difficulty.LEVELS[G.Difficulty.chosen].blurb + (G.Difficulty.chosen === 'normal' ? '' : ' (No sube al ranking.)');
    // Normal / shiny a mano, aquí mismo (en el móvil no se encontraba en la ficha).
    const seg = $('menu-shiny');
    seg.classList.toggle('hidden', !G.DB.ownsShiny(mon.dex));
    seg.lastChild.innerHTML = G.Icons.html('shiny', 12) + ' Shiny';
    seg.querySelectorAll('button').forEach(b => {
      b.classList.toggle('on', (b.dataset.v === '1') === shiny);
      b.onclick = () => {
        if ((b.dataset.v === '1') === shiny) return;
        s.partnerShiny = b.dataset.v === '1';
        G.DB.commit();
        G.Audio.sfx('confirm');
        open();
      };
    });

    const owned = Object.keys(s.owned).filter(d => G.DEX_BY[d]).length;
    const shinies = Object.keys(s.shiny || {}).length;
    $('menu-dex-count').textContent = `${owned} / ${G.DEX.length}` + (shinies ? ` · ${shinies} shiny` : '');

    const st = s.stats;
    $('menu-stats').innerHTML =
      `Runs <b style="color:#fff">${st.runs}</b> · Mejor tiempo <b style="color:#fff">${G.U.mmss(st.bestTime)}</b><br>` +
      `Mejor nivel <b style="color:#fff">${st.bestLevel}</b> · Derrotados <b style="color:#fff">${st.totalKills.toLocaleString('es')}</b>` +
      (G.DB.guest ? '<br><span style="color:#ffb0b8">Modo invitado: no se guarda</span>' : '');

    socialLine();
    // Premios de misiones por recoger.
    G.Progress.checkAch();
    const pend = G.Progress.pending();
    const eg = G.Eggs.summary();
    $('menu-eggs-sub').textContent = eg.ready ? eg.ready + (eg.ready === 1 ? ' huevo listo para abrir' : ' huevos listos para abrir') : eg.n ? eg.n + (eg.n === 1 ? ' huevo en camino' : ' huevos en camino') : 'Incubadora · se abren caminando';
    $('menu-eggs-sub').classList.toggle('gold', eg.ready > 0);
    $('menu-goals-sub').textContent = pend ? pend + (pend === 1 ? ' premio por recoger' : ' premios por recoger') : 'Misiones, logros y perfil';
    $('menu-goals-sub').classList.toggle('gold', pend > 0);
    // Con cuenta en la nube: amigos en línea, invitaciones y (una vez) el apodo.
    if (G.DB.online && !G.Social.started) {
      G.Social.start().then(r => {
        if (r === 'need-nick' && !G.NickUI.skipped && G.UI.isOpen('scr-menu')) G.NickUI.open();
        socialLine();
      });
    }
    G.InvitePop.refresh();
  }

  /** Texto bajo "Amigos" y "Jugar": quién está en línea, solicitudes, sala. */
  function socialLine() {
    const room = G.Social.room;
    const play = document.querySelector('#scr-menu [data-go=play] small');
    if (play) play.textContent = room ? 'Volver a tu sala (' + room.members.length + '/' + G.Social.MAX_PLAYERS + ')' : 'Entra en la mazmorra';
    const fr = G.Social.friends;
    const on = fr.filter(f => f.status === 'ok' && f.online).length;
    const req = fr.filter(f => f.status === 'in').length;
    const parts = [];
    if (on) parts.push(on + ' en línea');
    if (req) parts.push(req + (req === 1 ? ' solicitud' : ' solicitudes'));
    $('menu-friends-sub').textContent = parts.length ? parts.join(' · ') : 'Juega en grupo, hasta 4';
    $('menu-friends-sub').classList.toggle('gold', req > 0);
  }

  // ---------------- colección ----------------

  function openDex() {
    G.UI.show('scr-dex', true);
    const s = G.DB.save;
    if (dexSel == null) { dexSel = s.partner; dexGen = G.DEX_BY[s.partner].gen; }
    const owned = Object.keys(s.owned).filter(d => G.DEX_BY[d]).length;
    $('dex-total').textContent = `${owned} / ${G.DEX.length}`;

    // Pestañas de generación, con cuántos tienes de cada una.
    const tabs = $('dex-gens');
    tabs.innerHTML = '';
    GEN_NAMES.forEach((name, i) => {
      const g = i + 1;
      const total = G.DEX.filter(p => p.gen === g).length;
      const have = G.DEX.filter(p => p.gen === g && s.owned[p.dex]).length;
      const b = document.createElement('button');
      b.className = 'gen-tab' + (g === dexGen ? ' on' : '');
      b.innerHTML = `<b>${name}</b><small>${have}/${total}</small>`;
      b.onclick = () => { dexGen = g; openDex(); };
      tabs.appendChild(b);
    });

    const F = [['all', 'Todos'], ['own', 'Tengo'], ['miss', 'Me faltan'], ['shiny', 'Shiny'], ['dup', 'Repetidos'],
               ['5', 5], ['4', 4], ['3', 3], ['2', 2], ['1', 1]];
    const fb = $('dex-filters');
    fb.innerHTML = '';
    for (const [k, label] of F) {
      const c = document.createElement('button');
      c.className = 'chip' + (k === dexFilter ? ' on' : '');
      c.innerHTML = k === 'shiny' ? G.Icons.html('shiny', 12) + ' Shiny'
                  : typeof label === 'number' ? G.Icons.rarity(label, 12) + ' ' + G.Gacha.RARITY_NAME[label] : label;
      c.onclick = () => { dexFilter = k; openDex(); };
      fb.appendChild(c);
    }
    // Vender todos los repetidos de golpe (nunca la última copia de cada uno).
    const worth = sellAllValue();
    if (worth.n) {
      const sb = document.createElement('button');
      sb.className = 'btn small gold';
      sb.innerHTML = `Vender ${worth.n} repetidos · <span class="coin"></span> ${worth.coins}`;
      sb.onclick = () => {
        if (!confirm(`¿Vender ${worth.n} copias repetidas por ${worth.coins} monedas? Siempre te quedas con una de cada.`)) return;
        sellAll();
      };
      fb.appendChild(sb);
    }
    renderGrid();
    showDetail(dexSel);
  }

  /** Cuántas copias sobran y cuánto dan. */
  function sellAllValue() {
    const s = G.DB.save;
    let n = 0, coins = 0;
    for (const p of G.DEX) {
      const a = G.DB.sellable(s, p.dex, false), b = G.DB.sellable(s, p.dex, true);
      n += a + b; coins += a * G.Gacha.sellValue(p.rarity, false) + b * G.Gacha.sellValue(p.rarity, true);
    }
    return { n, coins };
  }

  function sellAll() {
    const s = G.DB.save;
    const w = sellAllValue();
    for (const p of G.DEX) {
      for (const sh of [false, true]) {
        for (let k = G.DB.sellable(s, p.dex, sh); k > 0; k--) G.DB.removeCopy(s, p.dex, sh);
      }
    }
    s.coins += w.coins;
    G.DB.commit(true);
    G.Audio.sfx('buy');
    G.UI.refreshCoins();
    G.UI.toast(`Vendidas ${w.n} copias: +${w.coins} monedas`);
    openDex();
  }

  /** Vende `k` copias de una variante. */
  function sellCopies(dex, shiny, k) {
    const s = G.DB.save, p = G.DEX_BY[dex];
    k = Math.min(k, G.DB.sellable(s, dex, shiny));
    if (k <= 0) return;
    for (let i = 0; i < k; i++) G.DB.removeCopy(s, dex, shiny);
    const coins = k * G.Gacha.sellValue(p.rarity, shiny);
    s.coins += coins;
    G.DB.commit(true);
    G.Audio.sfx('buy');
    G.UI.refreshCoins();
    G.UI.toast(`${p.name}${shiny ? ' shiny' : ''}: vendido ×${k} (+${coins} monedas)`);
    openDex();
  }

  function renderGrid() {
    const s = G.DB.save;
    const grid = $('dex-grid');
    grid.innerHTML = '';
    for (const p of G.DEX) {
      if (p.gen !== dexGen) continue;
      const own = !!s.owned[p.dex], sh = !!(s.shiny && s.shiny[p.dex]);
      if (dexFilter === 'own' && !own) continue;
      if (dexFilter === 'miss' && own) continue;
      if (dexFilter === 'shiny' && !sh) continue;
      if (dexFilter === 'dup' && !(G.DB.sellable(s, p.dex, false) || G.DB.sellable(s, p.dex, true))) continue;
      if (/^\d$/.test(dexFilter) && p.rarity !== +dexFilter) continue;

      const cell = document.createElement('div');
      cell.className = 'cell' + (own ? '' : ' locked') + (p.dex === dexSel ? ' on' : '');
      cell.style.setProperty('--stage-c', own ? G.U.TYPE_COLOR[p.types[0]] : '#8a94b8');
      cell.insertAdjacentHTML('beforeend', `<span class="no">${String(p.dex).padStart(3, '0')}</span>`);
      const nN = G.DB.copies(s, p.dex, false), nS = G.DB.copies(s, p.dex, true);
      if (nN > 1 || nS > 1) {
        cell.insertAdjacentHTML('beforeend', `<div class="dups-tags">
          ${nN > 1 ? `<span class="dup-n" title="Copias normales">×${nN}</span>` : ''}
          ${nS > 1 ? `<span class="dup-n sh" title="Copias shiny">${G.Icons.html('shiny', 10)}×${nS}</span>` : ''}</div>`);
      }
      if (p.dex === s.partner) cell.insertAdjacentHTML('beforeend', `<span class="badge-r" title="Compañero">${G.Icons.html('crown', 14)}</span>`);
      else if (sh) cell.insertAdjacentHTML('beforeend', `<span class="badge-r" title="Tienes su shiny">${G.Icons.html('shiny', 12)}</span>`);
      const useShiny = sh && p.dex === s.partner && s.partnerShiny;
      cell.appendChild(G.UI.spriteCanvas(p.dex, 92, 80, { scale: 2, silhouette: !own, shadow: own, shiny: useShiny }));
      cell.insertAdjacentHTML('beforeend', `<b>${own ? p.name : '???'}</b><div class="cell-types">${own ? G.UI.typeChips(p.types) : G.UI.stars(p.rarity, 9)}</div>`);
      cell.onclick = () => {
        dexSel = p.dex;
        grid.querySelectorAll('.cell').forEach(c => c.classList.remove('on'));
        cell.classList.add('on');
        showDetail(p.dex);
      };
      grid.appendChild(cell);
    }
    if (!grid.children.length) grid.innerHTML = '<p class="sub" style="grid-column:1/-1">Ninguno con este filtro.</p>';
  }

  /** Bloque de la ficha: cuántas copias tienes de la variante que ves y cómo venderlas. */
  function copiesBlock(s, dex) {
    const sh = viewShiny, c = G.DB.copies(s, dex, sh), p = G.DEX_BY[dex];
    if (!c) return '';
    const sell = G.DB.sellable(s, dex, sh), v = G.Gacha.sellValue(p.rarity, sh);
    let h = `<div class="dups"><div>Copias${sh ? ' shiny' : ''}: <b class="gold">×${c}</b></div>`;
    if (sell) {
      h += `<div class="row" style="gap:6px;margin-top:6px">
        <button class="btn small" data-sfx="none" data-sell="1">Vender 1 · <span class="coin"></span> ${v}</button>
        ${sell > 1 ? `<button class="btn small" data-sfx="none" data-sell="${sell}">Vender ${sell} · <span class="coin"></span> ${v * sell}</button>` : ''}</div>`;
    } else h += `<div class="sub" style="font-size:13px">Es tu única copia: no se puede vender.</div>`;
    return h + '</div>';
  }

  // Variante que se está viendo en la ficha (normal o shiny).
  let viewShiny = false;

  function showDetail(dex) {
    const s = G.DB.save;
    const p = G.DEX_BY[dex];
    const own = !!s.owned[dex];
    const hasSh = G.DB.ownsShiny(dex);
    const isPartner = dex === s.partner;
    if (!hasSh) viewShiny = false;
    else if (isPartner && dex !== showDetail.last) viewShiny = !!s.partnerShiny;
    showDetail.last = dex;

    const max = { hp: 183, atk: 1.55, spd: 137 };
    const bar = (label, v, m, txt) =>
      `<div class="stat"><span>${label}</span><div class="bar"><i style="width:${Math.min(100, v / m * 100)}%"></i></div><span>${txt}</span></div>`;
    const usingThis = isPartner && (!hasSh || !!s.partnerShiny === viewShiny);

    const box = $('dex-detail');
    // Descripción corta según sus números (como la de la selección del otro juego).
    const blurb = p.atk >= 1.25 ? 'Ofensivo. Más daño, menos vida.' : p.hp >= 110 ? 'Defensivo. Más vida y aguante.' : p.spd >= 118 ? 'Veloz. Llega a todas partes.' : 'Equilibrado. Un poco de todo.';
    const start = G.Moves.BY_ID[G.startMoveOf(dex)];
    const movesList = G.Moves.poolFor(p).map(id => G.Moves.BY_ID[id]);
    const mrow = m => `<div class="move-row${m.id === start.id ? ' start' : ''}">${G.Icons.html('move:' + m.id, 22)}
        <div class="mr-txt"><b>${m.name}</b>${m.id === start.id ? ' <span class="mr-new">Inicial</span>' : ''}<small>${m.desc || ''}</small></div>
        <span class="type" style="background:${G.U.TYPE_COLOR[m.type]}">${G.U.TYPE_NAME[m.type]}</span></div>`;
    box.innerHTML = `
      <div class="insp-h">Inspeccionar</div>
      <div class="insp-top">
        <canvas id="dex-big" class="stage" width="150" height="130"></canvas>
        <div class="insp-id">
          <small>Nº ${String(p.dex).padStart(3, '0')} · ${GEN_NAMES[p.gen - 1]}</small>
          <h3>${own ? p.name : '???'}</h3>
          <div>${own ? G.UI.typeChips(p.types) : ''}</div>
          <div class="insp-blurb" style="color:${G.Gacha.RARITY_COLOR[p.rarity]}">${G.UI.stars(p.rarity, 12)} ${G.Gacha.RARITY_NAME[p.rarity]}</div>
          ${own ? `<p class="insp-blurb2">${blurb}</p>` : ''}
        </div>
      </div>
      ${hasSh ? `<div class="seg">
          <button class="${viewShiny ? '' : 'on'}" data-v="0">Normal</button>
          <button class="${viewShiny ? 'on' : ''}" data-v="1">${G.Icons.html('shiny', 12)} Shiny</button></div>` : ''}
      ${own ? `
        <div class="insp-sec">Estadísticas</div>
        ${bar('Vida', p.hp, max.hp, p.hp)}
        ${bar('Ataque', p.atk, max.atk, '×' + p.atk.toFixed(2))}
        ${bar('Velocidad', p.spd, max.spd, p.spd)}
        <div class="insp-sec">Especial <span>ESPACIO</span></div>
        <div class="move-row">${G.Icons.html('type:' + p.types[0], 22)}
          <div class="mr-txt"><b>Impulso</b><small>Un dash con invulnerabilidad que deja una estela y explota al final.</small></div>
          <span class="type" style="background:${G.U.TYPE_COLOR[p.types[0]]}">${G.U.TYPE_NAME[p.types[0]]}</span></div>
        <div class="insp-sec">Movimientos</div>
        <div class="move-list">${movesList.map(mrow).join('')}</div>
        ${copiesBlock(s, dex)}
        ${usingThis
          ? '<button class="btn confirm" disabled style="width:100%">Es tu compañero</button>'
          : `<button id="dex-pick" class="btn confirm" data-sfx="confirm" style="width:100%">Elegir a ${p.name}${viewShiny ? ' (shiny)' : ''}</button>`}
      ` : `<p class="center" style="color:var(--muted)">Aún no lo tienes.<br>Consíguelo en el banner de <b class="gold">${GEN_NAMES[p.gen - 1]}</b>
            o derrotándolo cuando salga shiny.</p>`}
    `;
    $('dex-big').style.setProperty('--stage-c', !own ? '#5b83d6' : viewShiny ? '#9ae6ff' : G.U.TYPE_COLOR[p.types[0]]);
    $('dex-big').classList.toggle('shiny', own && viewShiny);
    G.UI.sprite($('dex-big'), dex, { lively: own, spin: own, silhouette: !own, scale: 3, hero: true, shiny: own && viewShiny });
    box.querySelectorAll('.seg button').forEach(b => {
      b.onclick = () => { viewShiny = b.dataset.v === '1'; showDetail(dex); };
    });
    box.querySelectorAll('[data-sell]').forEach(b => {
      b.onclick = () => sellCopies(dex, viewShiny, +b.dataset.sell);
    });
    const pick = $('dex-pick');
    if (pick) pick.onclick = () => {
      s.partner = dex;
      s.partnerShiny = hasSh && viewShiny;
      G.DB.commit();
      G.Audio.cry(dex, { force: true });
      G.UI.toast(p.name + (s.partnerShiny ? ' shiny' : '') + ' es ahora tu compañero');
      renderGrid(); showDetail(dex);
    };
  }

  // ---------------- mejoras ----------------

  let upgDex = null;

  function openUpgrades() {
    G.UI.show('scr-upgrades', true);
    const s = G.DB.save;
    upgDex = s.partner;      // las mejoras valen para todos tus Pokémon: se enseña el compañero de adorno
    renderUpgrades();
  }

  function renderUpgrades() {
    const s = G.DB.save;
    const levels = G.DB.upgradesOf(upgDex);
    const mon = G.DEX_BY[upgDex];
    const shiny = upgDex === s.partner && !!s.partnerShiny && G.DB.ownsShiny(upgDex);
    G.UI.sprite($('upg-stage'), upgDex, { lively: true, scale: 2, hero: true, shiny });
    $('upg-stage').style.setProperty('--stage-c', shiny ? '#9ae6ff' : G.U.TYPE_COLOR[mon.types[0]]);
    const box = $('upg-list');
    box.innerHTML = '';
    for (const u of G.Upgrades.LIST) {
      const lvl = levels[u.id] || 0;
      const maxed = lvl >= u.max;
      const cost = maxed ? 0 : G.Upgrades.cost(u.id, lvl);
      const el = document.createElement('div');
      el.className = 'panel upg-item';
      el.innerHTML = `
        <div class="ic">${G.Icons.html(u.icon, 32)}</div>
        <div>
          <b>${u.name}</b> <span style="color:var(--muted);font-size:13px">${u.unit}</span>
          <div class="pips">${Array.from({ length: u.max }, (_, i) => `<i class="${i < lvl ? 'on' : ''}"></i>`).join('')}</div>
        </div>
        <div class="upg-btns">
          ${u.id === 'ban' && lvl > 0 ? `<button class="btn small" data-ban>Elegir (${banList().length}/${lvl})</button>` : ''}
          <button class="btn small ${maxed ? '' : 'gold'}" data-buy data-sfx="none" ${maxed || s.coins < cost ? 'disabled' : ''}>
          ${maxed ? 'Máx.' : `<span class="coin"></span> ${cost}`}</button></div>`;
      if (u.id === 'ban' && lvl > 0) el.querySelector('[data-ban]').onclick = () => { banOpen = !banOpen; renderUpgrades(); };
      el.querySelector('[data-buy]').onclick = () => {
        // Se vuelve a leer todo al pulsar (la partida puede haber cambiado desde que se dibujó).
        const sv = G.DB.save, lv = G.DB.upgradesOf(upgDex), now = lv[u.id] || 0;
        if (now >= u.max) { renderUpgrades(); return; }
        const price = G.Upgrades.cost(u.id, now);
        if (sv.coins < price) { renderUpgrades(); return; }
        sv.coins -= price;
        lv[u.id] = now + 1;
        G.DB.commit(true);
        G.Audio.sfx('buy');
        G.UI.refreshCoins();
        G.UI.toast(`${mon.name} · ${u.name}: nivel ${now + 1}`);
        renderUpgrades();
      };
      box.appendChild(el);
      if (u.id === 'ban' && lvl > 0 && banOpen) box.appendChild(banPicker(lvl));
    }
    if (G.Settings.get('powers') === 'classic') box.appendChild(bindPanel());     // acumulados: no hay huecos que fijar
  }

  // ---------------- atajos: hueco fijo para cada movimiento ----------------
  // save.pbind[dex] = [movimiento del hueco 1, del 2, del 3, del 4] (o null).
  function bindPanel() {
    const s = G.DB.save;
    s.pbind = s.pbind || {};
    const list = s.pbind[upgDex] || [null, null, null, null];
    const mon = G.DEX_BY[upgDex];
    const ids = G.Moves.poolFor(mon).concat([G.startMoveOf(upgDex)]).filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => G.Moves.BY_ID[a].name.localeCompare(G.Moves.BY_ID[b].name, 'es'));
    const el = document.createElement('div');
    el.className = 'panel bind-panel';
    el.innerHTML = `<b>Atajos de movimientos</b>
      <p class="sub" style="margin:2px 0 8px">Elige qué movimiento va siempre en cada hueco (teclas 1-4 o los iconos de abajo), para la memoria muscular. Si aún no tienes tantos movimientos, va al hueco más cercano.</p>
      <div class="bind-slots">${[0, 1, 2, 3].map(i => `<label class="bind-slot"><span>${i + 1}</span>
        <select class="field" data-slot="${i}"><option value="">Libre</option>${ids.map(id =>
          `<option value="${id}" ${list[i] === id ? 'selected' : ''}>${G.Moves.BY_ID[id].name}</option>`).join('')}</select></label>`).join('')}</div>`;
    el.querySelectorAll('select[data-slot]').forEach(sel => {
      sel.onchange = () => {
        const l = (s.pbind[upgDex] || [null, null, null, null]).slice(0, 4);
        while (l.length < 4) l.push(null);
        const i = +sel.dataset.slot, id = sel.value || null;
        // Un movimiento sólo puede estar en un hueco.
        for (let j = 0; j < 4; j++) if (id && l[j] === id) l[j] = null;
        l[i] = id;
        s.pbind[upgDex] = l;
        G.DB.commit();
        G.Audio.sfx('select');
        renderUpgrades();
      };
    });
    return el;
  }

  // ---------------- veto: movimientos bloqueados ----------------
  // Lista por Pokémon en save.pban[dex]; con N niveles de Veto, N movimientos.
  let banOpen = false;
  function banList() {
    const s = G.DB.save;
    return s.gban || (s.gban = []);
  }
  function banPicker(max) {
    const mon = G.DEX_BY[upgDex];
    const start = G.startMoveOf(upgDex);
    const ids = G.Moves.poolFor(mon).filter(id => id !== start)
      .sort((a, b) => G.Moves.BY_ID[a].name.localeCompare(G.Moves.BY_ID[b].name, 'es'));
    const list = banList();
    const el = document.createElement('div');
    el.className = 'panel ban-picker';
    el.innerHTML = `<p class="sub" style="margin:0 0 8px">Toca los movimientos que no quieres que te salgan en las cartas (${list.length}/${max}). El movimiento de inicio no se puede vetar.</p>
      <div class="ban-moves">${ids.map(id => { const d = G.Moves.BY_ID[id]; const on = list.includes(id);
        return `<button class="chip ${on ? 'on ban' : ''}" data-id="${id}">${G.Icons.html('move:' + id, 16)} ${d.name}${on ? ' ' + G.Icons.html('ban', 14) : ''}</button>`; }).join('')}</div>`;
    el.querySelectorAll('[data-id]').forEach(b => {
      b.onclick = () => {
        const l = banList(), id = b.dataset.id, i = l.indexOf(id);
        if (i >= 0) l.splice(i, 1);
        else if (l.length >= max) { G.UI.toast('Ya tienes ' + max + ' vetados: quita uno primero'); return; }
        else l.push(id);
        G.DB.commit();
        G.Audio.sfx('select');
        renderUpgrades();
      };
    });
    return el;
  }

  return { init, open, GEN_NAMES };
})();
