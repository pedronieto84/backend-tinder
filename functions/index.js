// Cargo librerias necesarias
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// Inicializo la aplicación
const app = admin.initializeApp();
// Instancio el modulo que me permitirá interactuar con firestore
const firestore = app.firestore();

// Función que recibe posts
exports.post = functions.https.onRequest(async (request, response) => {
  // Cojo el body de la petición
  const body = request.body;
  // Extraigo mi id
  const miId = body.miId;
  // Si es un tipo "noMeGusta"
   // Extraigo la id de quien me gusta
   const idMeGusta = body.idMeGusta;

  if (body.tipo === "noMeGusta") {
    const noMeGusta = body.noMeGusta;
    const pathEliminarNoMeGusta = `users/${miId}/leGusto/${noMeGusta}`;
    try {
      const resultadoSetNoMeGusta = await firestore
        .doc(pathEliminarNoMeGusta)
        .delete();
      // Devuelvo esta respuesta a quien me hizo la petición
      response.send({ resultado: resultadoSetNoMeGusta });
    } catch (e) {
      // Si hay un error devuelvo el error
      return response.send(e);
    }
  }
  // Preparo el objeto a insertar
  const objetoAInsertar = {
    userId: miId,
    docRef: firestore.collection("users").doc(miId),
  };

  // Logica cuando nos gustamos mutuamente

  if (body.tipo === "nosGustamos") {
    // Primero hay que ponerle nuestros objects en las subcolecciones de nosGustamos
    const path1 = `users/${miId}/nosGustamos/${idMeGusta}`;
    const path2 = `users/${idMeGusta}/nosGustamos/${miId}`;

    await firestore.doc(path1).set(objetoAInsertar, { merge: true });
    await firestore.doc(path2).set(objetoAInsertar, { merge: true });

    // Tengo que quitar de mi subcoleccion de legusto a esa persona
    const path3 = `users/${miId}/leGusto/${idMeGusta}`;
    const resultado = await firestore.doc(path3).delete();

    // Devuelvo esta respuesta a quien me hizo la petición
    return response.send({ resultado: resultado });
  }

 
  // Preparo la ruta
  const path = `users/${idMeGusta}/leGusto/${miId}`;

  // Intento insertar en la base de datos el objeto
  try {
    const resultadoSet = await firestore
      .doc(path)
      .set(objetoAInsertar, { merge: true });
    // Devuelvo esta respuesta a quien me hizo la petición
    return response.send({ resultado: resultadoSet });
  } catch (e) {
    // Si hay un error devuelvo el error
    return response.send(e);
  }
});

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

exports.get = functions.https.onRequest((request, respose) => {
  response.send("Funcion tipo get");
});
