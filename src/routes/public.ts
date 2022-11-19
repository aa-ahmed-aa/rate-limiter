import Router from 'express';
import { createIpRateLimiter } from "../middleware/RateLimiter/IpRateLimiter";

const router = Router();

router.get('/public', createIpRateLimiter, async (req, res) => {
    return await res.status(200).send('Public page welcome');
});

export = router;
