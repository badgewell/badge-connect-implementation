/* eslint-disable max-classes-per-file */

// npm i mongodb@^3.0.0
import snakeCase from 'lodash/snakeCase';
import { MongoClient } from 'mongodb'; // eslint-disable-line import/no-unresolved

let DB;

class MongoAdapter {
  // This is not part of the required or supported API, all initialization should happen before
  // you pass the adapter to `new Provider`
  public static async connect() {
    const connection = await MongoClient.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    DB = connection.db(process.env.DATABASE_NAME);
  }
  public name: any;
  constructor(name: any) {
    this.name = snakeCase(name);
  }

  // NOTE: the payload for Session model may contain client_id as keys, make sure you do not use
  //   dots (".") in your client_id value charset.
  public async upsert(id, payload, expiresIn) {
    let expiresAt;

    if (expiresIn) {
      expiresAt = new Date(Date.now() + expiresIn * 1000);
    }

    await DB.collection(this.name).updateOne(
      { id },
      { $set: { payload, ...(expiresAt ? { expiresAt } : undefined) } },
      { upsert: true }
    );
  }

  public async find(id) {
    const result = await DB.collection(this.name)
      .find({ id }, { payload: 1 })
      .limit(1)
      .next();

    if (!result) {
      return undefined;
    }
    return result.payload;
  }

  public async findByUserCode(userCode) {
    const result = await DB.collection(this.name)
      .find({ 'payload.userCode': userCode }, { payload: 1 })
      .limit(1)
      .next();

    if (!result) {
      return undefined;
    }
    return result.payload;
  }

  public async findByUid(uid) {
    const result = await DB.collection(this.name)
      .find({ 'payload.uid': uid }, { payload: 1 })
      .limit(1)
      .next();

    if (!result) {
      return undefined;
    }
    return result.payload;
  }

  public async destroy(id) {
    await DB.collection(this.name).deleteOne({ id });
  }

  public async revokeByGrantId(grantId) {
    await DB.collection(this.name).deleteMany({ 'payload.grantId': grantId });
  }

  public async consume(id) {
    await DB.collection(this.name).findOneAndUpdate(
      { id },
      { $set: { 'payload.consumed': Math.floor(Date.now() / 1000) } }
    );
  }
}

export default MongoAdapter;
