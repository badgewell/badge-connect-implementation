import * as admin from 'firebase-admin';

let serviceAccount = require('../../badgewell-badge-connect.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

const upsert = async (collection , data) => {
    try {
        const collectionRef = db.collection(collection).doc(data);
    } catch (e) {
        console.log(e);
    }
}

const find = async (collection:any , id) => {
    try {
        const collectionRef = db.collection(collection)
                                .where('id' , '==' , id)
                                .where('payload' , '==' , 1)
                                .limit(1);
        const data = await collectionRef.get();
        if(!data){
            return undefined;
        }
        return data.docs

    } catch (e) {
        return e;
    }
}

const findByUserCode = async (collection , userCode) => {
    try {
        const collectionRef = db.collection(collection)
                                .where('payload.userCode' , '==' , userCode)
                                .where('payload' , '==' , 1)
                                .limit(1);
        const data = await collectionRef.get();
        if(!data){
            return undefined;
        }
        return data.docs

    } catch (e) {
        return e;
    }
}

const findByUid = async (collection , id) => {
    try {
        const collectionRef = db.collection(collection)
                                .where('payload.id' , '==' , id)
                                .where('payload' , '==' , 1)
                                .limit(1);
        const data = await collectionRef.get();
        if(!data){
            return undefined;
        }
        return data.docs

    } catch (e) {
        return e;
    }
}

// const destroy = async (collection , id) => {
//     try {
//         const collectionRef = db.collection(collection)
//                                 .where('id' , '==' , id)
                        
//         const data = await collectionRef.;
//         if(!data){
//             return undefined;
//         }
//         return data.docs

//     } catch (e) {
//         return e;
//     }
// }