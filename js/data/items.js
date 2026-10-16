/* ============ items.js — objetos con nivel ============
 * Dos formas de jugar (Ajustes > Poderes):
 *   Acumulados  hasta 6 objetos a la vez, cada uno con nivel 1-5. Salen en las cartas de
 *               subir de nivel (nuevo, o +1 nivel) y en cofres y jefes (suben su nivel).
 *   Clásico     UNO por run (nivel 3): si encuentras otro, eliges con cuál quedarte.
 *
 * Cada objeto da, según su nivel L (1-5):
 *   fx(L)    { atk, cd, spd, xp, coin }  multiplicadores
 *            { def, regen }              sumas (reducción de daño; vida/s como fracción de la máxima)
 *   desc(L)  texto del efecto a ese nivel
 * Los que reaccionan a algo (golpe mortal, daño hecho, golpes cuerpo a cuerpo...)
 * los mira el jugador con pl.itemLv(id): el nivel se lee con arrays (n: [L1..L5]).
 *
 * Idea de los objetos con nivel tomada de "Pokémon Survivors" (pedrobarretto, MIT).
 */
G.Items = (() => {
  const MAX_LEVEL = 5, MAX_ITEMS = 6, CLASSIC_LEVEL = 3;
  const at = (arr, L) => arr[G.U.clamp(L, 1, MAX_LEVEL) - 1];
  const pct = v => Math.round((v - 1) * 100) + '%';

  const LIST = [
    { id: 'leftovers', name: 'Restos', regen: [0.008, 0.011, 0.015, 0.019, 0.023],
      desc: L => `Recuperas un ${(at([0.8, 1.1, 1.5, 1.9, 2.3], L)).toString().replace('.', ',')}% de tu vida por segundo.`,
      fx: L => ({ regen: at([0.008, 0.011, 0.015, 0.019, 0.023], L) }) },
    { id: 'choiceband', name: 'Cinta Elección',
      desc: L => `+${pct(at([1.30, 1.35, 1.40, 1.45, 1.50], L))} de daño` + (L === CLASSIC_LEVEL ? ' (y no puedes cambiar de movimiento).' : '.'),
      fx: L => ({ atk: at([1.30, 1.35, 1.40, 1.45, 1.50], L) }) },
    { id: 'quickclaw', name: 'Garra Rápida',
      desc: L => `-${Math.round((1 - at([0.88, 0.84, 0.80, 0.77, 0.74], L)) * 100)}% de recarga en todos tus movimientos.`,
      fx: L => ({ cd: at([0.88, 0.84, 0.80, 0.77, 0.74], L) }) },
    { id: 'focussash', name: 'Banda Focus', sec: [90, 75, 60, 45, 30],
      desc: L => `Un golpe que te dejaría KO te deja con 1 de vida (cada ${at([90, 75, 60, 45, 30], L)} s).`, fx: () => ({}) },
    { id: 'shellbell', name: 'Cascabel Concha', heal: [0.02, 0.03, 0.04, 0.05, 0.06],
      desc: L => `Recuperas vida con el daño que haces (${Math.round(at([0.02, 0.03, 0.04, 0.05, 0.06], L) * 100)}%).`, fx: () => ({}) },
    { id: 'amuletcoin', name: 'Moneda Amuleto',
      desc: L => `+${pct(at([1.3, 1.4, 1.5, 1.6, 1.7], L))} de Pokémonedas al acabar la run.`,
      fx: L => ({ coin: at([1.3, 1.4, 1.5, 1.6, 1.7], L) }) },
    { id: 'luckyegg', name: 'Huevo Suerte',
      desc: L => `+${pct(at([1.15, 1.22, 1.30, 1.38, 1.46], L))} de experiencia.`,
      fx: L => ({ xp: at([1.15, 1.22, 1.30, 1.38, 1.46], L) }) },
    { id: 'lifeorb', name: 'Vidasfera',
      desc: L => `+${pct(at([1.15, 1.22, 1.30, 1.38, 1.46], L))} de daño, pero cada ataque te quita un poco de vida.`,
      fx: L => ({ atk: at([1.15, 1.22, 1.30, 1.38, 1.46], L) }) },
    { id: 'choicescarf', name: 'Pañuelo Elección',
      desc: L => `+${pct(at([1.20, 1.27, 1.35, 1.43, 1.50], L))} de velocidad.`,
      fx: L => ({ spd: at([1.20, 1.27, 1.35, 1.43, 1.50], L) }) },
    { id: 'rockyhelmet', name: 'Casco Dentado', thorn: [0.6, 0.8, 1.0, 1.2, 1.4],
      desc: L => `Los que te golpean cuerpo a cuerpo reciben daño (×${at([0.6, 0.8, 1.0, 1.2, 1.4], L).toString().replace('.', ',')}).`, fx: () => ({}) },
    { id: 'assaultvest', name: 'Chaleco Asalto',
      desc: L => `+${Math.round(at([0.10, 0.15, 0.20, 0.25, 0.30], L) * 100)}% de reducción de daño recibido.`,
      fx: L => ({ def: at([0.10, 0.15, 0.20, 0.25, 0.30], L) }) }
  ];
  // Objetos de tipo (+10 % de daño por nivel a los movimientos de ese tipo). Además, un movimiento
  // al nivel máximo evoluciona si llevas el objeto de su tipo (ver systems/levelup.js).
  const TYPE_ITEMS = [
    ['silkscarf', 'Pañuelo Seda', 'normal'], ['charcoal', 'Carbón', 'fire'], ['mysticwater', 'Agua Mística', 'water'],
    ['miracleseed', 'Semilla Milagro', 'grass'], ['magnet', 'Imán', 'electric'], ['nevermeltice', 'Hielo Eterno', 'ice'],
    ['blackbelt', 'Cinturón Negro', 'fighting'], ['poisonbarb', 'Flecha Venenosa', 'poison'], ['softsand', 'Arena Fina', 'ground'],
    ['sharpbeak', 'Pico Afilado', 'flying'], ['twistedspoon', 'Cuchara Torcida', 'psychic'], ['silverpowder', 'Polvo Plata', 'bug'],
    ['hardstone', 'Piedra Dura', 'rock'], ['spelltag', 'Hechizo', 'ghost'], ['dragonfang', 'Colmillo Dragón', 'dragon'],
    ['blackglasses', 'Gafas de Sol', 'dark'], ['metalcoat', 'Revest. Metálico', 'steel'], ['fairyfeather', 'Pluma Hada', 'fairy']
  ];
  const TYPE_ITEM = {};     // tipo -> id del objeto
  for (const [id, name, type] of TYPE_ITEMS) {
    TYPE_ITEM[type] = id;
    LIST.push({ id, name, type, bonus: L => 0.10 * L,
      desc: L => `+${L * 10}% de daño a los movimientos de tipo ${G.U.TYPE_NAME[type]}. Con un movimiento ${G.U.TYPE_NAME[type]} al máximo, lo evoluciona.`,
      fx: () => ({}) });
  }
  const BY = {};
  for (const it of LIST) BY[it.id] = it;

  /** Uno al azar, distinto del que ya llevas (modo clásico). */
  function roll(except) {
    const classic = G.Settings.get('powers') === 'classic';
    const pool = LIST.filter(i => i.id !== except && (!i.type || !classic));
    return G.U.pick(pool).id;
  }

  /** Valor de un dato por nivel (focussash.sec, shellbell.heal, rockyhelmet.thorn). */
  function val(id, key, L) { return at(BY[id][key], L); }

  return { LIST, BY, TYPE_ITEM, roll, val, MAX_LEVEL, MAX_ITEMS, CLASSIC_LEVEL };
})();
