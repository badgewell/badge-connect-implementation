import { client } from '../server';
const ObjectId = require('mongodb').ObjectID;

export type collection =
  | 'wellKnows'
  | 'clients'
  | 'hostProfiles'
  | 'hostProfiles'
  | 'accessTokens'
  | 'state'
  | 'profiles';
/**
 * Save the object to the database
 *
 * @param {*} data
 * @param {collection} collection name
 * @returns
 */
export const saveDB = async (data, collection: collection) => {
  try {
    const db = client.db(process.env.DATABASE_NAME);
    return await db.collection(collection).insertOne(data);
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.error(err);
    throw new Error('can not write on the database');
  }
};
/**
 * Get the item by Id
 *
 * @param {*} id
 * @param {collection} collection
 * @returns
 */
export const getById = async (id, collection: collection) => {
  try {
    const db = client.db(process.env.DATABASE_NAME);
    return await db.collection(collection).findOne({ _id: new ObjectId(id) });
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.error(err);
    throw new Error('can not get by id on the database');
  }
};
/**
 * Get one item by matching on a condition
 *
 * @param {object} condition
 * @param {collection} collection
 * @returns
 */
export const getOneWhere = async (condition: object, collection: collection) => {
  try {
    const db = client.db(process.env.DATABASE_NAME);
    return await db.collection(collection).findOne(condition);
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.error(err);
    throw new Error('can not write on the database');
  }
};

/**
 * Get items by matching on a condition
 *
 * @param {object} condition
 * @param {collection} collection
 * @returns
 */
export const getWhere = async (condition: object, collection: collection) => {
  try {
    const db = client.db(process.env.DATABASE_NAME);
    return await db.collection(collection).find(condition);
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.error(err);
    throw new Error('can not write on the database');
  }
};