// Cargo librerias necesarias
const functions = require("firebase-functions");
const admin = require('firebase-admin'); 
// Inicializo la aplicación
const app = admin.initializeApp(); 
// Instancio el modulo que me permitirá interactuar con firestore
const firestore = app.firestore();


// Función que recibe posts
exports.post = functions.https.onRequest( async (request, response)=>{
   // Cojo el body de la petición
   const body = request.body
   // Extraigo mi id
   const miId = body.miId
   // Extraigo la id de quien me gusta
   const idMeGusta = body.idMeGusta
   // Preparo la ruta 
   const path = `users/${idMeGusta}/leGusto/${miId}` 
   // Preparo el objeto a insertar
   const objetoAInsertar = {
       userId: miId,
       docRef: firestore.collection('users').doc(miId)
   }
   // Intento insertar en la base de datos el objeto
  try{
     const resultadoSet = await firestore.doc(path).set(objetoAInsertar, { merge: true })
     // Devuelvo esta respuesta a quien me hizo la petición
     response.send({resultado: resultadoSet})
  }catch(e){
     // Si hay un error devuelvo el error
     response.send(e)
  }
})

 exports.helloWorld = functions.https.onRequest((request, response) => {
   functions.logger.info("Hello logs!", {structuredData: true});
   response.send("Hello from Firebase!");
 });

 exports.get = functions.https.onRequest((request, respose)=>{

    response.send("Funcion tipo get")
 })





