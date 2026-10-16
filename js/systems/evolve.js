/* ============ evolve.js — tu Pokémon evoluciona durante la partida ============
 * Cadenas en data/evolutions.js (de PokeAPI). Evoluciona al alcanzar ciertos niveles
 * de la partida, sea cual sea su condición original (nivel, piedra, amistad...):
 * 1.ª evolución al nivel 10, 2.ª al 24, 3.ª al 40. Si hay varias ramas (Eevee) sale una al azar.
 * Al evolucionar toma los stats base del nuevo Pokémon (sumando la vida/daño que ya
 * habías ganado), se cura un poco y en cooperativo los demás te ven cambiar.
 * Idea tomada de "Pokémon Survivors" (pedrobarretto, MIT).
 */
G.Evo = (() => {
  const AT = [10, 24, 40];
  let busy = false;

  /** Nivel de la partida al que toca la siguiente evolución (o 0 si ya no tiene). */
  function nextAt(pl) {
    const nx = G.EVO_DATA && G.EVO_DATA[pl.dex];
    return nx && nx.length && (pl.evoCount || 0) < AT.length ? AT[pl.evoCount || 0] : 0;
  }

  /** Cada fotograma: ¿toca evolucionar? */
  function tick(pl) {
    if (busy || pl.dead || pl.remote) return;
    const at = nextAt(pl);
    if (!at || pl.level < at) return;
    const opts = G.EVO_DATA[pl.dex].map(e => e[0]).filter(d => G.DEX_BY[d]);
    if (!opts.length) { pl.evoCount = AT.length; return; }
    busy = true;
    const to = G.U.pick(opts);
    const shiny = pl.shiny && G.Sprites.hasShiny(to);
    Promise.resolve(G.Sprites.preload([to], 8000, shiny)).catch(() => {}).then(() => {
      busy = false;
      if (pl.dead || pl.dex === to) return;
      const from = pl.mon.name;
      apply(pl, to, shiny);
      pl.evoCount = (pl.evoCount || 0) + 1;
      G.Spawner.say('¡' + from + ' evoluciona a ' + pl.mon.name + '!', 3.6, true);
      G.Audio.sfx('levelup');
      G.Audio.cry(to, { vol: 0.8, force: true });
      if (G.Coop.active) G.Coop.evolved(pl, to, shiny);
    });
  }

  /** Cambia el Pokémon de `pl` por `dex` (stats incluidos si es el tuyo). */
  function apply(pl, dex, shiny) {
    const old = pl.mon, mon = G.DEX_BY[dex];
    if (!mon) return;
    pl.mon = mon; pl.dex = dex;
    pl.shiny = !!shiny && G.Sprites.hasShiny(dex);
    pl.anim = new G.Sprites.Animator(dex, 1, pl.shiny);
    pl.r = G.Sprites.bodyRadius(dex);
    pl.bodyH = G.Sprites.bodyHeight(dex);
    if (!pl.remote) {
      pl.baseSpd += mon.spd - old.spd;
      pl.baseAtk += mon.atk - old.atk;
      const gain = Math.max(0, mon.hp - old.hp);
      pl.maxHp += gain;
      pl.hp = Math.min(pl.maxHp, pl.hp + gain + pl.maxHp * 0.25);
    }
    pl.flash = 0.5;
    G.FX.ring(pl.x, pl.y, 10, 110, '#ffffff', 0.8, 6);
  }

  return { tick, apply, nextAt, AT };
})();
