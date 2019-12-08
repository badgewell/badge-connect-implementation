import * as express from 'express';
import * as registerController from './controllers/register.controller';

const router = express.Router();

router.get('/health', (req, res) => {
    res.status(200).send('Done');
});
router.get('/register' , registerController.register);

export default router;
