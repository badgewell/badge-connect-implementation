import { client } from '../server';

export const saveDB = async (response , collection) =>{
    try {
        const db = client.db('BadgeConnect');
        const wellKnownCollection = db.collection(collection);
        await wellKnownCollection.insertOne(response);

    } catch (e) {
        // tslint:disable-next-line:no-console
        console.log(e);
    }
};
