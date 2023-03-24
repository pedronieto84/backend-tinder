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
   console.log('las dos ids son Iguales?', idMeGusta === miId)

   const noMeGusta = body.noMeGusta;

  if (body.tipo === "noMeGusta") {
    
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
    docRef: firestore.collection("users").doc(miId)
  };

  // Logica cuando nos gustamos mutuamente

  if (body.tipo === "nosGustamos") {
    // 1. Primero hay que ponerle nuestros objects en las subcolecciones de nosGustamos
    const path1 = `users/${miId}/nosGustamos/${idMeGusta}`;
    const objetoPath1 = {
      userId: idMeGusta,
      docRef: firestore.collection("users").doc(idMeGusta)
    };


    const path2 = `users/${idMeGusta}/nosGustamos/${miId}`;
    const objetoPath2 = {
      userId: miId,
      docRef: firestore.collection("users").doc(miId)
    };

    // 2. Inserto en cada subcoleccion (mia y suya) nuestros respectivos objects
    await firestore.doc(path1).set(objetoPath1, { merge: true });
    await firestore.doc(path2).set(objetoPath2, { merge: true });

    // 3. Tengo que quitar de mi subcoleccion de legusto a esa persona
    const path3 = `users/${miId}/leGusto/${idMeGusta}`;
    const resultado = await firestore.doc(path3).delete();

    // 4. Crear el chatId y su objeto

    const chatId = concatenarIds(miId, idMeGusta)
    // Defino el elemento que voy a insertar en la colección 
    const chatObject = {
      idsConcatenadas: chatId,
      arrayConversantes: arrayIds
    }

    const res= await firestore.collection('chats').doc(chatId).set(chatObject, {merge: true})

    // Devuelvo esta respuesta a quien me hizo la petición
    return response.send({ resultado: res });
  }


  if( body.tipo === "romperMatch"){
   
    // 1. Elimino toda la conversación

    const chatId = concatenarIds(miId, noMeGusta)
    (await firestore.collection('chats').doc(chatId).collection('messages').listDocuments()).forEach((doc)=>{
      doc.delete()
    })

    // 2. Elimino las dos subcolecciones de "nosGustamos"
     
    const path1 = `users/${miId}/nosGustamos/${noMeGusta}`
    await firestore.doc(path1).delete()

    const path2 = `users/${noMeGusta}/nosGustamos/${miId}`
    await firestore.doc(path2).delete()
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






const concatenarIds = (id1, id2)=>{
  const arrayIds = [ id1, id2 ]
    arrayIds.sort()
    const chatId = `${id1[0]}-${id2[1]}`
    return chatId
}