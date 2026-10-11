/* ============ firebase-config.js — conexión con tu proyecto de Firebase ============
 * Pega aquí la configuración de tu app web de Firebase (Consola de Firebase >
 * Configuración del proyecto > Tus apps > SDK setup and configuration > Config).
 * Los pasos completos están en docs/FIREBASE.md.
 *
 * Estos datos NO son secretos: Firebase los diseña para ir en la web. Lo que
 * protege las partidas son las reglas de Firestore (firestore.rules).
 *
 * Si se pone a null, el juego funciona en modo local (sólo en el navegador).
 */
G.FIREBASE_CONFIG = {
  apiKey: 'AIzaSyAACmZtUVozdXcyhO8vSJ9N9KFh0_qSkmA',
  authDomain: 'pokesurvivors.firebaseapp.com',
  projectId: 'pokesurvivors',
  storageBucket: 'pokesurvivors.firebasestorage.app',
  messagingSenderId: '365955449851',
  appId: '1:365955449851:web:8d8072fbe93c5fa257815e',
  databaseURL: 'https://pokesurvivors-default-rtdb.firebaseio.com'
};

/* Ejemplo de cómo debe quedar:
G.FIREBASE_CONFIG = {
  apiKey: 'AIza...',
  authDomain: 'tu-proyecto.firebaseapp.com',
  projectId: 'tu-proyecto',
  storageBucket: 'tu-proyecto.firebasestorage.app',
  messagingSenderId: '1234567890',
  appId: '1:1234567890:web:abc123'
};
*/
