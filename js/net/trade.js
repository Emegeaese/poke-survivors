/* ============ trade.js — intercambio de Pokémon entre amigos (uno por uno) ============
 * Sólo con cuenta en la nube. Un documento por pareja de amigos:
 *
 *   trades/{uidMenor_uidMayor}
 *     users  [uidMenor, uidMayor]
 *     names  { uid: apodo }
 *     c      cuándo se creó (ms); distingue un intercambio de otro con la misma pareja
 *     o      { uid: { dex, sh } }   lo que ofrece cada uno
 *     ok     { uid: firma }         aceptado: la firma describe lo que se acepta,
 *                                   así que si alguien cambia su oferta ya no vale
 *     done   { uid: true }          ya aplicado en la partida de ese jugador
 *     at     última modificación
 *
 * Las reglas sólo dejan escribir a cada uno SU parte, así que el cambio se
 * hace en dos mitades: cuando los dos han aceptado la misma firma, cada
 * cliente quita lo suyo y añade lo del otro en su propia partida y escribe
 * `done`. La clave (c + firma) se apunta en la partida (save.tx) para no
 * aplicarlo dos veces aunque se recargue o se reciba la misma notificación.
 * Cuando los dos han terminado se borra el documento.
 */
G.Trade = (() => {
  let fb = null, uid = null, un = null;
  const docs = new Map();              // otro uid -> { pid, other, users, names, c, o, ok, done }
  const listeners = new Set();
  const fts = () => firebase.firestore.FieldValue.serverTimestamp();
  const del = () => firebase.firestore.FieldValue.delete();
  const pidOf = (a, b) => (a < b ? a + '_' + b : b + '_' + a);
  const emit = () => listeners.forEach(fn => { try { fn(); } catch (e) { console.warn(e); } });
  const offerKey = o => o ? o.dex + (o.sh ? 's' : 'n') : '-';

  /** Lo que se acepta: lo que da el de uid menor > lo que da el mayor. */
  function sigOf(d) {
    const [lo, hi] = d.users;
    return offerKey(d.o && d.o[lo]) + '>' + offerKey(d.o && d.o[hi]);
  }

  function start(fbObj, myUid) {
    if (un) return;
    fb = fbObj; uid = myUid;
    un = fb.fs.collection('trades').where('users', 'array-contains', uid).onSnapshot(snap => {
      snap.docChanges().forEach(ch => {
        const d = ch.doc.data();
        const other = d.users[0] === uid ? d.users[1] : d.users[0];
        if (ch.type === 'removed') { docs.delete(other); return; }
        const prev = docs.get(other);
        const t = Object.assign({ pid: ch.doc.id, other }, d);
        docs.set(other, t);
        // Una oferta nueva de tu amigo.
        if ((!prev || !(prev.o || {})[other]) && (d.o || {})[other] && !(d.o || {})[uid] && !ch.doc.metadata.hasPendingWrites) {
          G.UI.toast((d.names && d.names[other] || 'Un amigo') + ' te propone un intercambio (Amigos)', 3600);
          G.Audio.sfx('confirm');
        }
        tryApply(t);
        if (Object.keys(t.done || {}).length >= 2) fb.fs.collection('trades').doc(t.pid).delete().catch(() => {});
      });
      emit();
    }, e => console.warn('[Trade]', e.code || e.message));
  }

  function stop() {
    if (un) { un(); un = null; }
    docs.clear(); fb = null; uid = null;
    emit();
  }

  /** ¿Están los dos de acuerdo con la firma actual? */
  function bothOk(t) {
    const sig = sigOf(t);
    return t.users.every(u => t.o && t.o[u] && t.ok && t.ok[u] === sig);
  }

  /** Aplica el intercambio en TU partida (una sola vez). */
  function tryApply(t) {
    if (!bothOk(t) || (t.done && t.done[uid])) return;
    const s = G.DB.save;
    if (!s) return;
    const key = t.c + ':' + sigOf(t);
    s.tx = s.tx || {};
    if (s.tx[t.pid] !== key) {
      const mine = t.o[uid], theirs = t.o[t.other];
      let gave = false;
      if (G.DB.copies(s, mine.dex, !!mine.sh) > 0) gave = G.DB.removeCopy(s, mine.dex, !!mine.sh);
      // Si ya no tienes lo que ofrecías (no debería pasar: está reservado), no recibes nada.
      if (gave) G.DB.addCopy(s, theirs.dex, !!theirs.sh, 'trade');
      s.tx[t.pid] = key;
      G.DB.commit(true);
      const mon = G.DEX_BY[theirs.dex];
      G.UI.toast(gave ? `Intercambio hecho: recibes ${mon ? mon.name : '#' + theirs.dex}${theirs.sh ? ' shiny' : ''}` : 'El intercambio no se pudo completar', 4200);
      G.Audio.sfx(gave ? 'shinyGet' : 'error');
      if (G.UI.refreshCoins) G.UI.refreshCoins();
    }
    fb.fs.collection('trades').doc(t.pid).update({ ['done.' + uid]: true, at: fts() }).catch(e => console.warn('[Trade] done:', e.code || e.message));
  }

  // ---------------- lo que se ofrece ----------------

  const get = other => docs.get(other) || null;

  /** ¿Hay un intercambio en curso con este amigo? */
  function pending(other) {
    const t = docs.get(other);
    return !!t && !(t.done && t.done[uid]);
  }

  /** Cualquier intercambio que espera algo de ti (para el aviso en Amigos). */
  function needsMe() {
    let n = 0;
    for (const t of docs.values()) {
      const theirs = t.o && t.o[t.other], mine = t.o && t.o[uid];
      if (theirs && !(t.ok && t.ok[uid] === sigOf(t))) n++;
    }
    return n;
  }

  /** Lo que has aceptado y aún no se ha completado: no se puede vender ni ofrecer a otro. */
  function isReserved(dex, sh) {
    for (const t of docs.values()) {
      const mine = t.o && t.o[uid];
      if (mine && mine.dex === dex && !!mine.sh === !!sh && t.ok && t.ok[uid] && !(t.done && t.done[uid])) return true;
    }
    return false;
  }

  async function offer(other, dex, sh) {
    if (!fb) return { ok: false, error: 'Sin conexión.' };
    const s = G.DB.save;
    if (G.DB.tradable(s, dex, !!sh) < 1) return { ok: false, error: 'No puedes dar ese Pokémon.' };
    const f = G.Social.friends.find(x => x.uid === other && x.status === 'ok');
    if (!f) return { ok: false, error: 'Sólo puedes intercambiar con tus amigos.' };
    const pid = pidOf(uid, other), ref = fb.fs.collection('trades').doc(pid);
    const cur = docs.get(other);
    try {
      if (cur && !(Object.keys(cur.done || {}).length >= 2)) {
        if (cur.done && cur.done[uid]) return { ok: false, error: 'Espera: el intercambio anterior aún se está cerrando.' };
        await ref.update({ ['o.' + uid]: { dex, sh: !!sh }, ['ok.' + uid]: del(), at: fts() });
      } else {
        if (cur) await ref.delete();
        await ref.set({
          users: uid < other ? [uid, other] : [other, uid],
          names: { [uid]: G.Social.me.name, [other]: f.name },
          c: Date.now(), o: { [uid]: { dex, sh: !!sh } }, ok: {}, done: {}, at: fts()
        });
      }
    } catch (e) { return { ok: false, error: 'No se pudo ofrecer (' + (e.code || 'error') + ').' }; }
    return { ok: true };
  }

  async function accept(other) {
    const t = docs.get(other);
    if (!t || !t.o || !t.o[uid] || !t.o[other]) return { ok: false, error: 'Faltan las ofertas.' };
    const mine = t.o[uid];
    // Lo ya aceptado en otro intercambio no se puede prometer dos veces.
    let promised = 0;
    for (const o of docs.values()) {
      const m = o.o && o.o[uid];
      if (o !== t && m && m.dex === mine.dex && !!m.sh === !!mine.sh && o.ok && o.ok[uid] && !(o.done && o.done[uid])) promised++;
    }
    if (G.DB.tradable(G.DB.save, mine.dex, !!mine.sh) - promised < 1) return { ok: false, error: 'Ya no tienes lo que ofreces (o ya lo has prometido en otro intercambio).' };
    try { await fb.fs.collection('trades').doc(t.pid).update({ ['ok.' + uid]: sigOf(t), at: fts() }); }
    catch (e) { return { ok: false, error: 'No se pudo aceptar (' + (e.code || 'error') + ').' }; }
    return { ok: true };
  }

  /** Retira tu aceptación y borra el intercambio si ya no hay nada pactado. */
  async function cancel(other) {
    const t = docs.get(other);
    if (!t) return { ok: true };
    const ref = fb.fs.collection('trades').doc(t.pid);
    try {
      if (t.done && Object.keys(t.done).length) return { ok: false, error: 'Se está cerrando; espera un momento.' };
      if (t.ok && t.ok[uid]) await ref.update({ ['ok.' + uid]: del(), at: fts() });
      await ref.delete();
    } catch (e) { return { ok: false, error: 'No se pudo cancelar (' + (e.code || 'error') + ').' }; }
    return { ok: true };
  }

  async function removeAll() {
    if (!fb) return;
    const s = await fb.fs.collection('trades').where('users', 'array-contains', uid).get();
    await Promise.all(s.docs.map(d => d.ref.update({ ['ok.' + uid]: del() }).catch(() => {}).then(() => d.ref.delete()).catch(() => {})));
  }

  return {
    start, stop, get, pending, needsMe, isReserved, offer, accept, cancel, removeAll, sigOf, bothOk,
    on(fn) { listeners.add(fn); }
  };
})();
