import dotenv from 'dotenv';
dotenv.config();
import {MongoClient} from 'mongodb';
import app from './app';

const PORT = process.env.PORT || 9000;

let client;

if (process.env.MONGODB_URI) {
    (async () => {
        try {
            client = await MongoClient.connect(process.env.MONGODB_URI, {
                useUnifiedTopology: true,
            });
            // console.log('Connected to database');
        } catch (e) {
            // tslint:disable-next-line:no-console
            console.log(e);
        }
    })();
}

const server = app.listen(PORT, () => {
    // tslint:disable-next-line: no-console
    console.log('Express server listening on port ' + PORT);
});

export {
    client,
    server,
};
