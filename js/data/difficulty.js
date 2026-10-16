/* ============ difficulty.js — dificultad: Normal, Difícil, Pesadilla ============
 * Multiplicadores sobre la partida base (idea y valores de "Pokémon Survivors", MIT):
 *   hp      vida de los enemigos (también los jefes)
 *   dmg     daño que recibes
 *   spawn   enemigos por segundo y cuántos puede haber a la vez
 *   speed   velocidad de los enemigos normales (los jefes no)
 *   ramp    cuánto se endurece la partida con los minutos
 *   heal    lo que curas (bayas, regeneración...)
 *   coins   Pokémonedas al acabar (ganas más cuanto más difícil)
 * En grupo manda la del anfitrión. Sólo la Normal sube al ranking.
 */
G.Difficulty = (() => {
  const LEVELS = {
    normal:    { id: 'normal',    name: 'Normal',   color: '#58b858', hp: 1,   dmg: 1,    spawn: 1,    speed: 1,   ramp: 1,    heal: 1,   coins: 1,    blurb: 'La partida tal como se pensó.' },
    hard:      { id: 'hard',      name: 'Difícil',  color: '#f08030', hp: 1.4, dmg: 1.45, spawn: 1.25, speed: 1.1, ramp: 1.12, heal: 1,   coins: 1.25, blurb: 'Enemigos más duros, rápidos y numerosos. +25% de monedas.' },
    nightmare: { id: 'nightmare', name: 'Pesadilla', color: '#a040c8', hp: 1.8, dmg: 2,    spawn: 1.5,  speed: 1.2, ramp: 1.25, heal: 0.5, coins: 1.6,  blurb: 'Casi imposible, y curas la mitad. +60% de monedas.' }
  };
  const IDS = ['normal', 'hard', 'nightmare'];
  let run = 'normal';

  const parse = v => (LEVELS[v] ? v : 'normal');

  return {
    LEVELS, IDS, parse,
    /** La que has elegido para la próxima partida. */
    get chosen() { return parse(G.Settings.get('difficulty')); },
    /** La de la partida en curso. */
    get id() { return run; },
    get cur() { return LEVELS[run]; },
    /** Al empezar una partida (en grupo, la del anfitrión). */
    begin(id) { run = parse(id || G.Settings.get('difficulty')); }
  };
})();
