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
    const docRef = firestore.collection('users').doc(idMeGusta).collection('leGusto').doc(miId);
    
    const objetoAInsertar = {
        userId: miId,
        docRef: firestore.collection('users').doc(miId)
    }
   try{
      const resultadoSet = await docRef.set(objetoAInsertar, { merge: true })
      response.send({resultado: resultadoSet})
   }catch(e){
      response.send(e)
   }
 })