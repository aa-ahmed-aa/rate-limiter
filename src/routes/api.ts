import {AuthMiddleware} from "../middleware/AuthMiddleware";
import {createTokenRateLimiter} from "../middleware/RateLimiter/TokenRateLimiter";
import {createIpRateLimiter} from "../middleware/RateLimiter/IpRateLimiter";

export = (app) => {
    app.get('/public', createIpRateLimiter, async (req, res) => {
        return await res.status(200).send('Public page welcome');
    });

    app.get('/private', [
        AuthMiddleware,
        createTokenRateLimiter
    ], async (req, res) => {
        return res.status(200).send('Private page welcome !');
    });
}
