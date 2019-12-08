import * as express from 'express';
import * as registerController from './controllers/register.controller';
import * as callbackController from './controllers/callback.controller';

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).send('Done');
});
router.post('/register', registerController.register);
router.get('/callback/:id', callbackController.callback);

export default router;
