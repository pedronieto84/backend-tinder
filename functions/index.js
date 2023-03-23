const functions = require("firebase-functions");
const admin = require('firebase-admin');
const app = admin.initializeApp();
const firestore = app.firestore();

 exports.helloWorld = functions.https.onRequest((request, response) => {
   functions.logger.info("Hello logs!", {structuredData: true});
   response.send("Hello from Firebase!");
 });

 exports.get = functions.https.onRequest((request, respose)=>{

    response.send("Funcion tipo get")
 })




 exports.post = functions.https.onRequest( async (request, response)=>{
    const body = request.body
    const miId = body.miId
    const idMeGusta = body.idMeGusta
    const path = `users/${idMeGusta}/leGusto/${miId}` 
    const objetoAInsertar = {
        userId: miId,
        docRef: `users/${miId}`
    }
   try{
      const resultadoSet = await firestore.doc(path).set(objetoAInsertar, { merge: true })
      response.send({resultado: resultadoSet})
   }catch(e){
      response.send(e)
   }
 })