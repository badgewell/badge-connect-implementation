import * as express from 'express';
import * as registerController from './controllers/register.controller';
import * as profileController from './controllers/profile.controller';
import * as callbackController from './controllers/callback.controller';

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).send('Done');
});
router.post('/register', registerController.register);
router.get(
  '/callback/:id',
  callbackController.callback,
  callbackController.getAssertions,
  callbackController.redirect
);
router.get(
  '/profile/:id',
  profileController.get,
  profileController.sendRenderResponse
);
router.get(
  '/profile-json/:id',
  profileController.get,
  profileController.sendJsonResponse
); // For development purposes
router.post('/profile', profileController.generate);
// this will redirect to auth after select client
router.post('/redirect', profileController.redirect);

// router.get('/view', (req, res) => res.render('profile'));

export default router;
