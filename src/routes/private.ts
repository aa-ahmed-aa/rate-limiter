import Router from 'express';
import {AuthMiddleware} from "../middleware/AuthMiddleware";
import {createTokenRateLimiter} from "../middleware/RateLimiter/TokenRateLimiter";

const router = Router();

router.get('/private', [
    AuthMiddleware,
    createTokenRateLimiter
], async (req, res) => {
    return res.status(200).send('Private page welcome !');
});

export = router;
