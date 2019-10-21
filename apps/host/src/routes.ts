import * as express from 'express';

const router = express.Router();

router.get('/health', (req, res) => {
    res.status(200).send();
});

export default router;
