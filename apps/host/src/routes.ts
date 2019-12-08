import * as express from 'express';

import * as Manifest from './controllers/manifest.controller';
import * as Profile from './controllers/profile.controller';
import * as Assertion from './controllers/assertion.controller';
import verifyToken from './utils/verifyToken';

const router = express.Router();

router.get('/health', (req, res) => res.status(200).send());
router.get('/.well-known/badgeconnect.json', Manifest.wellKnown);

// Assertion
router.post(
  '/assertion',
  verifyToken,
  Assertion.validateCreateAssertion,
  Assertion.createAssertion
);

router.get('/assertion', verifyToken, Assertion.findAssertions);

// Profile
router.post(
  '/profile',
  verifyToken,
  Profile.validateCreateProfile,
  Profile.createProfile
);
router.get('/profile', verifyToken, Profile.findProfile);

export default router;
