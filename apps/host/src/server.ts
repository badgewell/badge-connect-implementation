import mongoAdapter from '../../oauth/src/adapters/mongodb';
import app from './app';

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () =>
  console.log('Express server listening on port ' + PORT)
);

export default server;
