import dotenv from 'dotenv';
dotenv.config();
import mongoAdapter from './adapters/mongodb';
import app from './app';

const PORT = process.env.PORT || 5000;

if (process.env.MONGODB_URI) {
    mongoAdapter.connect();
}

const server = app.listen(PORT, () => {
    // tslint:disable-next-line: no-console
    console.log('Express server listening on port ' + PORT);
});

export default server;
