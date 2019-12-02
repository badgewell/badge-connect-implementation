import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AssertionSchema = new Schema(
  {
    id: String,
    type: String,
    '@context': String,
    badge: String,
    image: String,
    verification: new Schema({
      type: String
    }),
    evidence: [
      new Schema({
        id: String,
        type: String
      })
    ],
    narrative: String,
    issuedOn: String,
    expires: String,
    recipient: new Schema({
      salt: String,
      type: String,
      hashed: Boolean,
      identity: String
    })
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Assertion', AssertionSchema);
