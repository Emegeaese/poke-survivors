/* ============ changelog.js — novedades del juego ============
 * Lo que ve la gente en el botón "Novedades": cambios de juego y fallos arreglados.
 * La fecha más nueva, arriba. Apartados: new = lo nuevo · chg = cambios · fix = arreglos.
 * Cada línea en español y en inglés. (Base: la de JPTER78, sin lo de sus servidores.)
 */
G.CHANGELOG = [
  { d: "2026-10-14", title: ["Versión de los amigos: intercambios y repetidos","Friends version: trades and duplicates"], new: [
    ["Subir de nivel como en Pokémon Survivors: panel más estrecho, \"X subió a Nv N\", carta elegida con borde rojo (flechas + Intro o 1-3), etiqueta ¡NUEVO! y la receta de evolución (movimiento + objeto de tipo). Nuevas Poké Balls por el mapa con premio sorpresa: baya, imán, bomba, monedas, experiencia u objeto.",
     "Level-up like Pokémon Survivors: narrower panel, \"X grew to Lv N\", red border on the chosen card (arrows + Enter or 1-3), NEW! tag and the evolution recipe (move + type item). New Poké Balls on the map with a surprise prize: berry, magnet, bomb, coins, XP or an item."],
    ["Gritos de cada Pokémon (al elegirlo, al empezar, al evolucionar, jefes, gacha y huevos; se bajan de PokeAPI y usan el volumen de Efectos). Golpes con destello de impacto, sacudida del enemigo y animación de daño; cambio de mapa con fundido suave; clima más visible (sol con resplandor, lluvia con relámpagos, bruma y arena en movimiento).",
     "Pokémon cries (on pick, run start, evolution, bosses, gacha and eggs; fetched from PokeAPI, use the Effects volume). Impact flashes, enemy shake and hurt animation; smooth map-change fade; more visible weather (glowing sun, rain with lightning, drifting fog and sand)."],
    ["Objetos de tipo (Carbón, Agua Mística, Semilla Milagro, Pañuelo Seda...): +10% de daño por nivel a los movimientos de ese tipo. Un movimiento al nivel máximo evoluciona si llevas el objeto de su tipo (en Poderes acumulados). El retrato de la tarjeta de combate ya no se mueve.",
     "Type items (Charcoal, Mystic Water, Miracle Seed, Silk Scarf...): +10% damage per level to moves of that type. A max-level move evolves if you carry its type item (Stacked powers). The battle card portrait no longer animates."],
    ["Tu Pokémon evoluciona durante la partida: 1.ª evolución al nivel 10, 2.ª al 24 y 3.ª al 40. Toma los stats del nuevo Pokémon, se cura un poco y en cooperativo tus amigos te ven cambiar.",
     "Your Pokémon evolves during the run: 1st evolution at level 10, 2nd at 24 and 3rd at 40. It takes the new Pokémon's stats, heals a bit, and in co-op your friends see you change."],
    ["Colección con tarjetas: cada Pokémon muestra sus tipos y el panel \"Inspeccionar\" enseña estadísticas, el Impulso (Espacio) y todos los movimientos que puede aprender.",
     "Collection cards: each Pokémon shows its types and the Inspect panel lists stats, the Dash (Space) and every move it can learn."],
    ["Las mejoras (Mejoras) ahora valen para todos tus Pokémon, juegues con el que juegues. Lo que tenías por Pokémon se junta: te quedas con el nivel más alto de cada mejora. El Veto también es para todos.",
     "Upgrades now apply to all your Pokémon, whichever you play with. What you had per Pokémon is merged: you keep the highest level of each upgrade. The Ban list is for everyone too."],
    ["Dificultad: Normal, Difícil y Pesadilla (en el menú, bajo tu compañero). Difícil: enemigos con 1,4× de vida, 1,45× de daño, 1,25× de cantidad y 1,1× de velocidad, +25% de monedas. Pesadilla: 1,8× de vida, 2× de daño, 1,5× de cantidad, 1,2× de velocidad, curas la mitad y +60% de monedas. En grupo manda la del anfitrión. Sólo la Normal sube al ranking.",
     "Difficulty: Normal, Hard and Nightmare (in the menu, below your partner). Hard: enemies with 1.4x HP, 1.45x damage, 1.25x amount and 1.1x speed, +25% coins. Nightmare: 1.8x HP, 2x damage, 1.5x amount, 1.2x speed, you heal half as much and +60% coins. In a group the host's setting applies. Only Normal counts for the leaderboard."],
    ["Pausa con tus poderes y objetos (con su nivel) y tus estadísticas, como en Pokémon Survivors. La vida de tu Pokémon y la de tus compañeros sale debajo de ellos; los enemigos normales ya no llevan barra, sólo los jefes.",
     "Pause screen with your powers and items (with their level) and your stats, like in Pokémon Survivors. Your Pokémon's HP and your teammates' HP show under them; regular enemies no longer have a bar, only bosses do."],
    ["Poderes acumulados (como en Pokémon Survivors): todos tus poderes atacan a la vez (hasta 6) y los objetos tienen nivel (hasta 6, nivel 1-5). Salen en las cartas de subir de nivel: uno nuevo o +1 nivel; los de cofres y jefes se suman solos. Tus poderes y objetos se ven arriba a la izquierda. Con más poderes, cada uno pega algo menos para mantener el equilibrio. El premio del legendario de la grieta pasa a ser una subida de nivel extra. Se puede volver al modo clásico en Ajustes > Poderes.",
     "Stacked powers (like in Pokémon Survivors): all your powers attack at once (up to 6) and items have levels (up to 6, level 1-5). They show up in the level-up cards: a new one or +1 level; chest and boss items are added automatically. Your powers and items show at the top left. With more powers, each hits slightly less to keep the balance. The rift legendary reward becomes an extra level-up. You can go back to classic mode in Settings > Powers."],
    ["Impulso (barra espaciadora): un dash corto con invulnerabilidad, una estela que daña y una explosión al final. Se recarga en 8 s (menos con Reflejos, mínimo 4 s) y su recarga sale junto a tus poderes. En móvil, toca su botón.",
     "Dash (space bar): a short dash with invulnerability, a damaging trail and an explosion at the end. It recharges in 8 s (less with Reflexes, minimum 4 s) and its cooldown shows next to your powers. On mobile, tap its button."],
    ["Fondos de color del tipo detrás de cada Pokémon (menú, colección, gacha y huevos), gemas de experiencia pixel art de 4 tamaños que dan un saltito antes de volar hacia ti.",
     "Type-colored backgrounds behind every Pokémon (menu, collection, gacha and eggs) and pixel-art XP gems in 4 sizes that hop before flying to you."],
    ["Mundo más claro y plano, como en Pokémon Survivors: verdes suaves, caminos de tierra más pequeños y números de daño con letra pixel y contorno. Nueva opción en Ajustes > Zoom de la cámara: Cerca (sprites grandes) o Lejos (sprites a la mitad y el doble de mapa a la vista; salen más enemigos).",
     "Lighter, flatter world, like Pokémon Survivors: soft greens, smaller dirt paths and damage numbers in a pixel font with an outline. New option in Settings > Camera zoom: Near (big sprites) or Far (half-size sprites and twice as much map in view; more enemies spawn)."],
    ["Interfaz estilo Game Boy Advance (basada en Pokémon Survivors): paneles claros con doble marco, letras Press Start 2P y VT323, selección con ▶ rojo, barras de dos tonos y HUD a juego. Se puede volver al estilo clásico en Ajustes > Estilo de la interfaz.",
     "Game Boy Advance-style interface (inspired by Pokémon Survivors): light panels with a double frame, Press Start 2P and VT323 fonts, red ▶ selection, two-tone bars and a matching HUD. You can go back to the classic style in Settings > Interface style."],
    ["HUD estilo Pokémon en ordenador: caja de combate abajo a la izquierda con retrato, nombre, nivel y barra de PS, y huecos de poderes cuadrados.",
     "Pokémon-style HUD on computers: a battle box at the bottom left with portrait, name, level and HP bar, and square power slots."],
    ["Píxel perfecto: en ordenador el mundo se dibuja a baja resolución y se amplía a un múltiplo entero, así todos los píxeles miden lo mismo (como en los juegos clásicos). Se puede cambiar en Ajustes > Píxel perfecto.",
     "Pixel perfect: on computers the world is drawn at low resolution and scaled up by a whole number, so every pixel is the same size (like classic games). You can change it in Settings > Pixel perfect."],
    ["Huevos: caen de jefes, cofres con candado y legendarios de las grietas (hasta 2 por partida; el primero es seguro). Van a la incubadora (3 espacios) y eclosionan con los pasos que andas jugando: 2.000, 4.000 u 8.000 según el tipo. Sale cualquiera de tus Pokémon según la rareza del huevo, y 1 de cada 100 es shiny. Los repetidos quedan como copias.",
     "Eggs: they drop from bosses, locked chests and rift legendaries (up to 2 per run; the first one is guaranteed). They go into the incubator (3 slots) and hatch with the steps you walk while playing: 2,000, 4,000 or 8,000 depending on the type. Any of your Pokémon can come out, depending on the egg rarity, and 1 in 100 is shiny. Duplicates stay as copies."],
    ["Intercambios: en Amigos > Intercambiar das un Pokémon (normal o shiny) y recibes otro, siempre uno por uno. Los dos tenéis que aceptar.",
     "Trades: in Friends > Trade you give one Pokémon (normal or shiny) and get another, always one for one. Both players must accept."],
    ["Los repetidos del gacha ya no se convierten en monedas: quedan como copias (×2, ×3...). En la ficha puedes venderlas (nunca la última) o guardarlas para intercambiar.",
     "Gacha duplicates are no longer turned into coins: they stay as copies (x2, x3...). In the details you can sell them (never the last one) or keep them to trade."],
    ["Cooperativo: si caes, ves la cámara de un compañero vivo (Tab, E o un clic para cambiar).",
     "Co-op: if you fall, you watch a living teammate (Tab, E or a click to switch)."],
    ["Números pixelados nuevos, hechos para que el 2 y el 5 no se confundan.",
     "New pixel-art digits, made so 2 and 5 are never mistaken."]
  ], fix: [
    ["Jugar en dos aparatos (PC y móvil) ya no hace perder monedas ni tickets: se suma lo ganado en los dos, y al volver tras un rato se trae lo del otro aparato.",
     "Playing on two devices (PC and phone) no longer loses coins or tickets: what you earn on both is added up, and when you come back after a while it brings in what the other device earned."],
    ["Cooperativo: un compañero que pierde la conexión ya no se queda \"vivo y quieto\" en tu pantalla ni frena el final de la partida.",
     "Co-op: a teammate who loses connection no longer stays \"alive and standing still\" on your screen or holds up the end of the run."],
    ["Cooperativo: un parpadeo de internet ya no te saca de la sala durante la partida.",
     "Co-op: a network blip no longer drops you from the room during a run."]
  ] },
  { d: "2026-10-14", title: ["Botones del móvil y arreglos del cooperativo","Mobile buttons and co-op fixes"], new: [
    ["Móvil: ya puedes colocar los botones donde quieras. En Ajustes > Controles > Colocar los botones arrastras los ataques (con el objeto), la pausa y el joystick, que ahora también puede ser fijo en vez de aparecer donde pones el dedo.",
     "Mobile: you can now place the buttons wherever you want. In Settings > Controls > Place the buttons, drag the attacks (with the item), the pause button and the joystick, which can now also be fixed instead of appearing where you put your finger."]
  ], fix: [
    ["Cooperativo: la partida ya no se queda parada con cada uno esperando a que el otro elija. Un objeto y las cartas de nivel ya no se tapan, y si la conexión pierde un aviso se arregla solo.",
     "Co-op: the game no longer freezes with each player waiting for the other to choose. An item and the level-up cards no longer cover each other, and if the connection drops a message it fixes itself."],
    ["Cooperativo: al volver de una grieta, quien no era el anfitrión ya ve a todos los enemigos (antes algunos eran invisibles y sólo se veían sus ataques).",
     "Co-op: after coming back from a rift, players who are not the host can see every enemy again (some used to be invisible, with only their attacks showing)."],
    ["Amigos: si tu móvil u ordenador tiene la hora (o la zona horaria) mal puesta, tus amigos ya no salen siempre desconectados y sus invitaciones te llegan.",
     "Friends: if your phone or computer has the wrong time (or time zone), your friends no longer always show as offline and their invitations reach you."],
    ["Los avisos grandes de la partida (un Gholdengo cerca, una marea...) ya salen siempre centrados.",
     "Big in-game announcements (a nearby Gholdengo, a swarm...) are always centered now."]
  ] },
  { d: "2026-10-13", title: ["La Sentencia de Arceus","The Judgment of Arceus"], new: [
    ["La Sentencia de Arceus: al llegar al minuto 30, Arceus baja del cielo y te lleva a las Ruinas del Juicio. Es invencible, te persigue cada vez más deprisa y lanza pilares de luz, rayos y ondas; si te toca, te quita casi media vida. Cada 5 segundos acude un legendario con el doble de vida y de daño que el anterior. ¿Cuánto aguantarás?",
     "The Judgment of Arceus: at minute 30, Arceus descends from the sky and takes you to the Ruins of Judgment. It is invincible, chases you faster and faster and casts pillars of light, beams and shockwaves; if it touches you, you lose almost half your HP. Every 5 seconds a legendary joins, each with twice the HP and damage of the previous one. How long can you last?"],
    ["Tres logros nuevos: La Sentencia (llega al minuto 30), Ante el Creador (aguanta 1 minuto ante Arceus) y Desafío divino (derrota a 3 legendarios ante Arceus en una partida).",
     "Three new achievements: The Judgment (reach minute 30), Before the Creator (survive 1 minute against Arceus) and Divine challenge (defeat 3 legendaries against Arceus in a single run)."],
    ["Música nueva para la pelea contra Arceus.",
     "New music for the fight against Arceus."]
  ], chg: [
    ["El ranking histórico empieza de cero: ahora que las partidas acaban ante Arceus, las marcas de antes ya no se podrían alcanzar. Las tablas de hoy, de la semana y del mes siguen igual.",
     "The all-time leaderboard starts from scratch: now that runs end against Arceus, older records could no longer be reached. The daily, weekly and monthly boards are unchanged."],
    ["Desde el minuto 28 ya no se abren grietas, para que la Sentencia no te pille dentro de una.",
     "Rifts no longer open from minute 28 on, so the Judgment does not catch you inside one."],
    ["Se han quitado del ranking las marcas de más de 35 minutos: con la Sentencia de Arceus ya no son posibles.",
     "Records over 35 minutes have been removed from the leaderboard: with the Judgment of Arceus they are no longer possible."]
  ], fix: [
    ["Las tiradas del gacha, los Pokémon nuevos y los premios se guardan en la nube al momento. Si abriste el juego en otro aparato o navegador y te faltaba algo, vuelve a abrirlo donde lo conseguiste: se recupera solo.",
     "Gacha pulls, new Pokémon and rewards are saved to the cloud right away. If you opened the game on another device or browser and something was missing, open it again where you got it: it comes back on its own."]
  ] },
  { d: "2026-10-12", title: ["Tiempo extra y grietas con menos azar","Overtime and less random rifts"], new: [
    ["El juego se actualiza solo cuando sale una versión nueva: si estás en el menú, a los 5 segundos; si estás jugando, al acabar la partida (sin perder nada).",
     "The game now updates itself when a new version is out: within 5 seconds if you are in the menu, or after your run if you are playing (without losing anything)."],
    ["Botón de Novedades (esta ventana) con todos los cambios del juego.",
     "A \"What's new\" button (this window) with every change to the game."],
    ["Números más fáciles de leer: el 2, el 5 y el 8 ya no se confunden.",
     "Easier to read numbers: 2, 5 and 8 no longer look alike."],
    ["Elige la versión normal o shiny de tu compañero desde el menú principal, debajo de él.",
     "Pick the normal or shiny version of your partner right from the main menu, under it."],
    ["Mejoras nuevas para cada Pokémon: Golpe Crítico (+3 % de críticos por nivel, que hacen x1,5 de daño), Cambio de cartas (+1 cambio de las cartas de nivel por run) y Veto (bloquea movimientos para que no te salgan en las cartas; se eligen en Mejoras).",
     "New upgrades for each Pokémon: Critical Hit (+3% critical chance per level, crits deal x1.5 damage), Card reroll (+1 level-up card reroll per run) and Ban (block moves so they never show up in your cards; pick them in Upgrades)."],
    ["Atajos de movimientos (en Mejoras, para cada Pokémon): elige qué movimiento va siempre en cada hueco, por ejemplo Confusión siempre en el 1, para la memoria muscular.",
     "Move shortcuts (in Upgrades, for each Pokémon): choose which move always goes in each slot, for example Confusion always on 1, for muscle memory."]
  ], chg: [
    ["Avalancha hace menos daño (21 en vez de 26): derrotaba casi el doble que la media de los movimientos.",
     "Rock Slide deals less damage (21 instead of 26): it defeated almost twice as many as the average move."],
    ["Los cambios de cartas de nivel ya no se ganan venciendo jefes: tienes 1 gratis por run y el resto se compra en Mejoras.",
     "Level-up card rerolls are no longer earned by defeating bosses: you get 1 free per run and can buy more in Upgrades."],
    ["Los legendarios de grieta ya no dan siempre tickets x10: dan uno la mitad de las veces (antes daban 2 siempre y salían demasiados).",
     "Rift legendaries no longer always drop x10 tickets: they drop one half of the time (they used to always drop 2, which was too many)."],
    ["Cooperativo: si vuestras redes no consiguen conectar entre sí, la sala lo avisa y lo reintenta sola, en vez de jugar a tirones por un servidor lento.",
     "Co-op: if your networks cannot connect to each other, the room says so and keeps retrying, instead of playing laggy through a slow server."],
    ["Gacha: los shiny ya no salen repetidos. Si te toca uno que ya tienes, sale otro de la misma rareza que te falte.",
     "Gacha: shinies no longer come out as duplicates. If you roll one you already have, you get another of the same rarity that you are missing."],
    ["Grietas con menos azar: cada vez que no sale una, la siguiente es más probable (como mucho 2,5 minutos sin grieta).",
     "Less random rifts: every time one does not show up, the next one is more likely (at most 2.5 minutes without a rift)."],
    ["Los legendarios que aún no has vencido salen 4 veces más en las grietas.",
     "Legendaries you have not beaten yet show up 4 times as often in rifts."],
    ["Los curanderos curan más cuanto más fuerte pegas, pero cada vez menos y con un tope (como mucho el 2,5x).",
     "Healers heal more the harder you hit, but with diminishing returns and a cap (2.5x at most)."],
    ["Ataques cuerpo a cuerpo más fuertes: mientras llevas uno activo recibes un 25 % menos de daño, llegan un 25 % más lejos y hacen un 20 % más de daño.",
     "Stronger melee attacks: while one is active you take 25% less damage, and they reach 25% further and deal 20% more damage."],
    ["Cooperativo: al elegir con qué objeto quedarte, la partida se para para todos (antes seguía y te pegaban mientras elegías).",
     "Co-op: choosing which held item to keep now pauses the run for everyone (it used to keep going and you got hit while choosing)."],
    ["Cooperativo: mientras alguien elige una fusión, la partida se para para todos.",
     "Co-op: while someone is choosing a fusion, the run pauses for everyone."],
    ["Cooperativo: si el anfitrión cambia de pestaña o se le para el juego, la partida se pausa para todos hasta que vuelva.",
     "Co-op: if the host switches tabs or their game stalls, the run pauses for everyone until they are back."]
  ], fix: [
    ["iPhone (Safari y Chrome): a veces no se podía cambiar de movimiento tocando los iconos, sobre todo con el otro dedo en el joystick. Además los botones quedan por encima de la barra de inicio.",
     "iPhone (Safari and Chrome): sometimes you could not switch moves by tapping the icons, especially with your other finger on the joystick. Buttons also sit above the home bar now."],
    ["En las partidas de más de 84 minutos la pantalla se quedaba en negro, el juego se paraba o empezabas a subir de nivel sin fin. Ya puedes jugar todo lo que aguantes.",
     "In runs longer than 84 minutes the screen went black, the game froze or you kept levelling up forever. Now you can play for as long as you survive."],
    ["Cooperativo: si el anfitrión cambiaba de pestaña, los enemigos se quedaban quietos y los demás jugaban con ventaja.",
     "Co-op: if the host switched tabs, enemies stood still and everyone else got a free advantage."],
    ["iPhone: mantener el dedo en el joystick sacaba \"Copiar / Seleccionar todo\".",
     "iPhone: holding your finger on the joystick brought up \"Copy / Select all\"."],
    ["iPhone: a veces no salía la pantalla completa. Ahora el botón explica cómo tenerla (Compartir y \"Añadir a pantalla de inicio\").",
     "iPhone: fullscreen sometimes did not show up. Now the button explains how to get it (Share and \"Add to Home Screen\")."]
  ] },
  { d: "2026-10-11", title: ["Vínculos","Bonds"], new: [
    ["Vínculos: al vencer a un legendario fusionas movimientos que se lanzan a la vez desde un solo hueco (hasta 4).",
     "Bonds: defeating a legendary lets you fuse moves that fire at the same time from a single slot (up to 4)."],
    ["Botón para cambiar las cartas de subir de nivel.",
     "A button to reroll the level-up cards."]
  ], chg: [
    ["Más grietas.",
     "More rifts."],
    ["Movimientos psíquicos y curanderos más flojos.",
     "Weaker psychic moves and healers."],
    ["Las mejoras de las cartas de nivel (velocidad, recarga, experiencia, imán, coraza y potencia) tienen un tope de veces.",
     "Level-up card upgrades (speed, cooldown, experience, magnet, armor and power) can only be taken a limited number of times."],
    ["En el móvil, la ficha del Pokémon sale al lado; entrar es más rápido y el gacha x10 se puede cerrar.",
     "On mobile, the Pokémon details show alongside; logging in is faster and the x10 gacha can be closed."]
  ], fix: [
    ["Pantalla negra en partidas de más de una hora por llenarse la memoria de imágenes.",
     "Black screen in runs longer than an hour because image memory filled up."],
    ["Los tickets se perdían si se cerraba la pestaña antes de acabar la partida: ahora se guardan al cogerlos.",
     "Tickets were lost if the tab closed before the run ended: now they are saved as soon as you pick them up."],
    ["Una mejora comprada justo después de guardar se cobraba y no se apuntaba.",
     "An upgrade bought right after saving was charged but not applied."],
    ["El juego se quedaba congelado para siempre si algo fallaba a mitad de partida.",
     "The game froze forever if something went wrong mid-run."]
  ] },
  { d: "2026-10-10", title: ["Más reto","More challenge"], new: [
    ["Jefes y legendarios con 4 ataques avisados que se enfurecen a media vida.",
     "Bosses and legendaries with 4 telegraphed attacks that get enraged at half health."],
    ["12 movimientos nuevos y 8 formas de atacar nuevas: bumerán, cadena, minas, meteoros, torreta, embestida, rastro y abanico.",
     "12 new moves and 8 new ways to attack: boomerang, chain, mines, meteors, turret, dash, trail and spray."],
    ["Eventos a mitad de partida (hordas de un tipo, hora dorada, Pokémon perdidos) y Meowth y Gholdengo que huyen cargados de monedas.",
     "Mid-run events (single-type hordes, golden hour, lost Pokémon) and Meowth and Gholdengo running away loaded with coins."],
    ["Estatuas para los Pokémon grandes.",
     "Statues for big Pokémon."]
  ], chg: [
    ["Más difícil: menos enemigos pero más duros.",
     "Harder: fewer but tougher enemies."],
    ["Subir de nivel es más lento, los tickets son más raros y los jefes dan ticket x10 una de cada tres veces.",
     "Levelling up is slower, tickets are rarer and bosses drop a x10 ticket one time in three."],
    ["Carga más rápida.",
     "Faster loading."]
  ], fix: [
    ["Los enemigos rezagados desaparecían delante de ti: ahora sólo fuera de la vista.",
     "Straggling enemies vanished in front of you: now only off-screen."],
    ["Los menús y pantallas se montaban encima de la barra de arriba.",
     "Menus and screens overlapped the top bar."]
  ] },
  { d: "2026-10-09", title: ["Móvil e inglés","Mobile and English"], new: [
    ["Se puede jugar en móvil y tablet con joystick táctil, e instalar como app.",
     "Play on phones and tablets with a touch joystick, and install it as an app."],
    ["El juego, en español y en inglés.",
     "The game in English and Spanish."],
    ["Pantalla de ajustes con calidad gráfica automática.",
     "Settings screen with automatic graphics quality."]
  ], chg: [
    ["Menos enemigos en pantalla pero más fuertes.",
     "Fewer but stronger enemies on screen."],
    ["Gigadrenado pasa a ser Hierba Lazo (ya no cura).",
     "Giga Drain becomes Grass Knot (no more healing)."]
  ] },
  { d: "2026-10-08", title: ["Misiones, grietas y cooperativo","Missions, rifts and co-op"], new: [
    ["Misiones diarias y semanales, logros con medallas y títulos, y perfil público.",
     "Daily and weekly missions, achievements with medals and titles, and a public profile."],
    ["Objetos equipables, evoluciones de movimientos y enemigos que curan, protegen, invocan o explotan.",
     "Held items, move evolutions and enemies that heal, shield, summon or explode."],
    ["Grietas que llevan a 18 arenas legendarias, una por tipo, y clima que cambia la batalla.",
     "Rifts leading to 18 legendary arenas, one per type, and weather that changes the fight."],
    ["Mejoras para cada Pokémon, gacha tragaperras con tickets y tabla de tipos.",
     "Upgrades for each Pokémon, a slot-machine ticket gacha and a type chart."]
  ], chg: [
    ["Cámara más lejos y enemigos que rodean los obstáculos.",
     "Camera further out and enemies that walk around obstacles."]
  ] },
  { d: "2026-10-07", title: ["Primera versión","First version"], new: [
    ["Primera versión pública de PokéSurvivor.",
     "First public version of PokéSurvivor."]
  ] }
];
