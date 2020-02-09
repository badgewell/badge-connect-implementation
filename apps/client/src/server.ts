import dotenv from 'dotenv';
dotenv.config();

import app from './app';

const PORT = process.env.PORT || 9000;

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const server = app.listen(PORT, () => {
  // tslint:disable-next-line: no-console
  console.log('Express server listening on port ' + PORT);
});

export { server };
