/* Auditorias PCM — base de dados partilhada (Cloud Firestore, projeto pcv-ferramentas).
   Fora do claude.ai a app usava o localStorage de cada browser: cada pessoa via só as suas auditorias.
   Este ficheiro fornece window.claude.use('db' | 'user') com a interface que a app já usa,
   ligada ao Firebase. Coleções com o prefixo "pcm_" (não se misturam com as do PCV nem do FLOW).
   Login anónimo; as regras do Firestore só deixam ler/gravar a quem tem sessão. */
(function () {
  if (window.claude && window.claude.use) return;           // dentro do claude.ai usa a base nativa
  var CFG = {
    apiKey: "AIzaSyDXbQYTg5b3oEY9LD1l0uX-yWzha5h7uQ0",
    authDomain: "pcv-ferramentas.firebaseapp.com",
    projectId: "pcv-ferramentas",
    storageBucket: "pcv-ferramentas.firebasestorage.app",
    messagingSenderId: "894420989495",
    appId: "1:894420989495:web:3f3953ef08d870b3b1f1b2"
  };
  var P = "pcm_";
  function loadJs(src) { return new Promise(function (ok, ko) { var s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = function () { ko(new Error("Falhou " + src)); }; document.head.appendChild(s); }); }
  /* o Firestore não aceita listas dentro de listas: cada lista interior vai como {__a:[...]} */
  function enc(v, inArr) {
    if (Array.isArray(v)) { var a = v.map(function (x) { return enc(x, true); }); return inArr ? { __a: a } : a; }
    if (v && typeof v === "object" && !(v instanceof Date)) { var o = {}; Object.keys(v).forEach(function (k) { if (v[k] !== undefined) o[k] = enc(v[k], false); }); return o; }
    return v;
  }
  function dec(v) {
    if (Array.isArray(v)) return v.map(dec);
    if (v && typeof v === "object") { if (Array.isArray(v.__a) && Object.keys(v).length === 1) return v.__a.map(dec); var o = {}; Object.keys(v).forEach(function (k) { o[k] = dec(v[k]); }); return o; }
    return v;
  }
  var ready = null, uid = null;
  function connect() {
    if (ready) return ready;
    ready = loadJs("vendor/firebase-app-compat.js")
      .then(function () { return loadJs("vendor/firebase-auth-compat.js"); })
      .then(function () { return loadJs("vendor/firebase-firestore-compat.js"); })
      .then(function () { firebase.initializeApp(CFG); return firebase.auth().signInAnonymously(); })
      .then(function (cred) {
        uid = cred.user.uid;
        var fs = firebase.firestore(); try { fs.settings({ ignoreUndefinedProperties: true, merge: true }); } catch (e) { }
        var ref = function (path) { var p = path.split("/"); return fs.collection(P + p[0]).doc(p.slice(1).join("_")); };
        var snapDoc = function (s) { return { id: s.id, exists: s.exists, data: function () { return s.exists ? dec(s.data()) : undefined; } }; };
        return {
          collection: function (c) {
            var col = fs.collection(P + c);
            return {
              onSnapshot: function (next, err) { return col.onSnapshot(function (s) { next({ docs: s.docs.map(snapDoc), size: s.size, empty: s.empty }); }, function (e) { if (err) err(e); }); },
              add: function (o) { return col.add(enc(o)).then(function (r) { return { id: r.id }; }); },
              get: function () { return col.get().then(function (s) { return { docs: s.docs.map(snapDoc), size: s.size, empty: s.empty }; }); }
            };
          },
          doc: function (path) {
            var r = ref(path);
            return {
              onSnapshot: function (next, err) { return r.onSnapshot(function (s) { next(snapDoc(s)); }, function (e) { if (err) err(e); }); },
              get: function () { return r.get().then(snapDoc); },
              set: function (o) { return r.set(enc(o)); },
              update: function (o) { return r.update(enc(o)); },
              delete: function () { return r.delete(); }
            };
          }
        };
      });
    return ready;
  }
  var user = {
    id: function () { return connect().then(function () { return uid; }); },
    canEdit: function () { return Promise.resolve(true); }, can: function () { return Promise.resolve(true); },
    profiles: function () { return Promise.resolve({}); }
  };
  window.claude = {
    __standalone: true,   // continua a permitir a leitura de fotos com chave da API (Definições)
    use: function (n) {
      if (n === "db") return connect();
      if (n === "user") return Promise.resolve(user);
      return Promise.resolve(null);
    }
  };
})();
