import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ProfileSchema = new Schema(
  {
    id: String,
    type: String,
    '@context': String,
    description: String,
    url: String,
    email: String,
    name: String,
    image: String
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Profile', ProfileSchema);
