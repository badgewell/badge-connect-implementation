import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

try {
  mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log(
    'Success connecting to mongodb server...',
    process.env.DATABASE_URL + '/' + process.env.DATABASE_NAME
  );
} catch (error) {
  console.log(error);
}

export default mongoose;
