import { client } from '../server';
const ObjectId = require('mongodb').ObjectID;

export const saveDB = async (data, collection: 'wellKnows' | 'clients') => {
  try {
    const db = client.db(process.env.DATABASE_NAME);
    return await db.collection(collection).insertOne(data);
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.error(err);
    throw new Error('can not write on the database');
  }
};

export const getById = async (id, collection: 'wellKnows' | 'clients') => {
  try {
    const db = client.db(process.env.DATABASE_NAME);
    return await db.collection(collection).findOne({ _id: new ObjectId(id) });
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.error(err);
    throw new Error('can not write on the database');
  }
};
