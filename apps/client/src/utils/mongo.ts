import { MongoClient } from 'mongodb';
const ObjectId = require('mongodb').ObjectID;

export const dbConnection = async () => {
  const connection = await MongoClient.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true
  });
  return connection.db(process.env.DATABASE_NAME);
};

export type collection =
  | 'wellKnows'
  | 'clients'
  | 'hostProfiles'
  | 'hostProfiles'
  | 'accessTokens'
  | 'state'
  | 'profiles'
  | 'assertions';
/**
 * Save the object to the database
 *
 * @param {*} data
 * @param {collection} collection name
 * @returns
 */
export const saveDB = async (data, collection: collection) => {
  try {
    const db = await dbConnection();
    const response = await db.collection(collection).insertOne(data);
    return response;
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
    const db = await dbConnection();
    const response = await db
      .collection(collection)
      .findOne({ _id: new ObjectId(id) });
    return response;
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
export const getOneWhere = async (
  condition: object,
  collection: collection
) => {
  try {
    const db = await dbConnection();
    const response = await db.collection(collection).findOne(condition);
    return response;
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
    const db = await dbConnection();
    const response = await db
      .collection(collection)
      .find(condition)
      .toArray();

    return response;
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.error(err);
    throw new Error('can not write on the database');
  }
};
/**
 * Remove from the database based on the conditions
 *
 * @param {object} condition
 * @param {collection} collection
 * @returns
 */
const remove = async (condition: object, collection: collection) => {
  try {
    const db = await dbConnection();
    const response = await db.collection(collection).remove(condition);

    return response;
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.error(err);
    throw new Error('can not delete on the database');
  }
};

/**
 * Remove an item by Id
 *
 * @param {*} id
 * @param {collection} collection
 * @returns
 */
export const removeById = async (id, collection: collection) => {
  try {
    const db = await dbConnection();
    const response = await db
      .collection(collection)
      .remove({ _id: new ObjectId(id) });
    return response;
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.error(err);
    throw new Error('can not get by id on the database');
  }
};
