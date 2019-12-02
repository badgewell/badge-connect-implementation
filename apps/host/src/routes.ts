import * as express from 'express';

import * as Manifest from './controllers/manifest.controller';
import * as Assertion from './controllers/assertion.controller';

const router = express.Router();

router.get('/health', (req, res) => res.status(200).send());
router.get('/.well-known/badgeconnect.json', Manifest.wellKnown);

// Assertion
router.post(
  '/assertion',
  Assertion.validateCreateAssertion,
  Assertion.createAssertion
);

router.get('/assertion', Assertion.findAssertions);

export default router;
