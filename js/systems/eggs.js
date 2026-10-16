/* ============ eggs.js — huevos: caen jugando, eclosionan caminando ============
 * Idea tomada de "Pokémon Survivors" (pedrobarretto, MIT), adaptada a este juego:
 *
 *   - Caen de jefes (15 %), cofres con candado (10 %) y legendarios de grieta (40 %),
 *     como mucho 2 por partida. El primer huevo de tu vida es seguro.
 *   - Hay 3 espacios en la incubadora. Si está llena, el huevo se cambia por monedas.
 *   - Eclosionan con PASOS: distancia caminada (16 px = 1 paso). Al acabar cada
 *     partida, todos los huevos de la incubadora suman los pasos de esa partida
 *     (los encontrados durante la partida, sólo los pasos desde que los encontraste).
 *   - Salen de tus 966 Pokémon, según la rareza que da cada tipo de huevo; los que
 *     aún no tienes pesan el triple. Un repetido queda como copia (se vende o se
 *     intercambia, igual que los del gacha). 1 de cada 100 sale shiny.
 *
 * En la partida: save.eggs = [{ id, tier, steps }]; save.eggGone = { id: fecha }
 * (para que una fusión de partidas no devuelva un huevo ya abierto).
 */
G.Eggs = (() => {
  const TIERS = [
    { id: 'common', name: 'Común', total: 2000, refund: 100, color: '#8fd18a', rar: [[1, 60], [2, 40]] },
    { id: 'rare',   name: 'Raro',  total: 4000, refund: 250, color: '#4f8fd6', rar: [[2, 30], [3, 50], [4, 20]] },
    { id: 'ultra',  name: 'Épico', total: 8000, refund: 600, color: '#b06be0', rar: [[3, 20], [4, 50], [5, 30]] }
  ];
  // Probabilidad de que caiga un huevo y peso de cada tipo (común, raro, épico).
  const SOURCES = {
    boss:  { p: 0.15, w: [70, 25, 5] },
    chest: { p: 0.10, w: [85, 15, 0] },
    rift:  { p: 0.40, w: [0, 65, 35] }
  };
  const SLOTS = 3, PER_RUN = 2, STEP_PX = 16, SHINY_ODDS = 0.01, NEW_WEIGHT = 3, MAX_KEPT = 12;

  let runFound = 0;        // huevos encontrados en esta partida
  let walked = 0;          // píxeles andados en esta partida

  const save = () => G.DB.save;
  const total = e => TIERS[e.tier].total;
  const isReady = e => (e.steps || 0) >= total(e);
  const newId = () => 'e' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  function weighted(list, w) {
    const sum = list.reduce((a, x) => a + w(x), 0);
    let r = Math.random() * sum;
    for (const x of list) { r -= w(x); if (r <= 0) return x; }
    return list[list.length - 1];
  }

  /** Empieza una partida: se pone a cero la distancia (y se limpian marcas de una partida cortada). */
  function startRun() {
    runFound = 0; walked = 0;
    const s = save();
    if (s && s.eggs) for (const e of s.eggs) delete e.w0;
  }

  /** Suma distancia andada (la llama la partida cada fotograma). */
  function walk(px) { if (px > 0 && px < 150) walked += px; }

  /**
   * Lanza el dado de un huevo en `source` ('boss' | 'chest' | 'rift').
   * Devuelve el huevo si ha caído (o null).
   */
  function roll(source) {
    const s = save(), src = SOURCES[source];
    if (!s || !src || runFound >= PER_RUN) return null;
    const lucky = !(s.stats.eggsFound > 0) && !(s.eggs && s.eggs.length);   // el primero de tu vida es seguro
    if (!lucky && Math.random() >= src.p) return null;
    const tier = TIERS.indexOf(weighted(TIERS, t => src.w[TIERS.indexOf(t)]));
    return give(tier);
  }

  function give(tier) {
    const s = save();
    s.eggs = s.eggs || [];
    runFound++;
    s.stats.eggsFound = (s.stats.eggsFound || 0) + 1;
    const t = TIERS[tier];
    if (s.eggs.length >= SLOTS) {
      // Incubadora llena: el huevo se cambia por monedas.
      s.coins += t.refund;
      G.Spawner.say('¡Huevo ' + t.name.toLowerCase() + '! Incubadora llena: +' + t.refund + ' monedas', 3.2, true);
      G.Audio.sfx('coin');
      G.DB.commit(true);
      return null;
    }
    const egg = { id: newId(), tier, steps: 0, w0: walked };
    s.eggs.push(egg);
    G.Spawner.say('¡Has encontrado un huevo ' + t.name.toLowerCase() + '!', 3.4, true);
    G.Audio.sfx('shinyGet');
    G.DB.commit(true);
    return egg;
  }

  /** Al acabar la partida: los pasos andados caen en los huevos de la incubadora. */
  function endRun() {
    const s = save();
    const steps = Math.floor(walked / STEP_PX);
    let ready = 0;
    if (s) {
      s.stats.steps = (s.stats.steps || 0) + steps;
      for (const e of s.eggs || []) {
        const mine = e.w0 != null ? Math.max(0, Math.floor((walked - e.w0) / STEP_PX)) : steps;
        delete e.w0;
        e.steps = Math.min(total(e), (e.steps || 0) + mine);
        if (isReady(e)) ready++;
      }
    }
    return { steps, ready, found: runFound };
  }

  /** Resumen para el menú: cuántos huevos hay y cuántos están listos. */
  function summary() {
    const s = save(), list = (s && s.eggs) || [];
    return { n: list.length, ready: list.filter(isReady).length };
  }

  /** Qué Pokémon sale de un huevo de este tipo. */
  function pick(tier) {
    const s = save();
    const rar = weighted(TIERS[tier].rar, r => r[1])[0];
    const pool = G.DEX.filter(p => p.rarity === rar);
    return weighted(pool, p => (s.owned[p.dex] ? 1 : NEW_WEIGHT));
  }

  /** Abre el huevo número `i` (si está listo). Devuelve { dex, shiny, isNew, copies, rarity } o null. */
  function hatch(i) {
    const s = save(), e = s && s.eggs && s.eggs[i];
    if (!e || !isReady(e)) return null;
    const mon = pick(e.tier);
    const shiny = G.Sprites.hasShiny(mon.dex) && Math.random() < SHINY_ODDS;
    const isNew = !G.DB.copies(s, mon.dex, shiny);
    const copies = G.DB.addCopy(s, mon.dex, shiny, 'egg');
    s.eggs.splice(i, 1);
    s.eggGone = s.eggGone || {};
    s.eggGone[e.id] = Date.now();
    s.stats.hatched = (s.stats.hatched || 0) + 1;
    if (shiny) s.stats.shinies = (s.stats.shinies || 0) + 1;
    G.DB.commit(true);
    return { dex: mon.dex, shiny, isNew, copies, rarity: mon.rarity, tier: e.tier };
  }

  return { TIERS, SLOTS, PER_RUN, STEP_PX, MAX_KEPT, startRun, walk, roll, endRun, summary, hatch, isReady, total,
           get runFound() { return runFound; }, get walked() { return walked; } };
})();
