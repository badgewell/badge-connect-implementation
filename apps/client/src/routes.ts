import * as express from 'express';
import * as registerController from './controllers/register.controller';
import {generateProfile} from './controllers/generateProfile';

const router = express.Router();

router.get('/health', (req, res) => {
    res.status(200).send('Done');
});
router.get('/reg' , registerController.register);
router.get('/profile' , generateProfile);

export default router;
