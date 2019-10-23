import * as express from 'express';

import * as manifest from './controllers/manifest';

const router = express.Router();

router.get('/health', (req, res) => {
    res.status(200).send();
});

router.get('/.well-known/badgeconnect.json', manifest.wellKnown);

export default router;
