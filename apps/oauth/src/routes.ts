import * as express from 'express';

const router = express.Router();
import * as bodyParser from 'body-parser';
import * as oauthController from './controllers/oauth.controller';

const parse = bodyParser.urlencoded({ extended: false });

function setNoCache(req, res, next) {
  res.set('Pragma', 'no-cache');
  res.set('Cache-Control', 'no-cache, no-store');
  next();
}

router.get('/health', (req, res) => {
    res.status(200).send('OK');
});

router.get('/interaction/:uid', setNoCache, oauthController.startInteraction);

router.post('/interaction/:uid/login', setNoCache, parse, oauthController.login );

router.post('/interaction/:uid/confirm', setNoCache, parse, oauthController.confirm);

router.get('/interaction/:uid/abort', setNoCache, oauthController.abort);

// the following are set from the oidc library in the controller service
// registration API
// revocation API
// auth API

export default router;
