import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AccessTokenSchema = new Schema(
  {
    id: String,
    expiresAt: Date,
    payload : new Schema({
        iat: Number,
        exp: Number,
        accountId: String,
        calims: new Schema({
            rejected: Array
        }),
        expiresWithSession: Boolean,
        grantId: String,
        gty: String,
        scope: String,
        sessionUid: String,
        kind: String,
        jti: String,
        clientId: String,
    })
})

 export default mongoose.model('access_token', AccessTokenSchema , 'access_token');
