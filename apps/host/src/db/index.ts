import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

try {
  mongoose.connect(process.env.DATABASE_URL + '/' + process.env.DATABASE_NAME, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });
  console.log('Success connecting to mongodb server...');
} catch (error) {
  console.log(error);
}

export default mongoose;
