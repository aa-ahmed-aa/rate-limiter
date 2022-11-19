import Router from 'express';
import {createCustomRateLimiter} from "../middleware/RateLimiter/CustomRateLimiter";

const router = Router('apis');

router.use('/apis', createCustomRateLimiter);

router.get('/apis/route1', async (req, res) => {
    return await res.status(200).send('route1 page welcome !');
});

router.get('/apis/route2', async (req, res) => {
    return res.status(200).send('route2 page welcome !');
});

router.get('/apis/route3', async (req, res) => {
    return res.status(200).send('route3 page welcome !');
});

router.get('/apis/route4', async (req, res) => {
    return res.status(200).send('route4 page welcome !');
});

router.get('/apis/route5', async (req, res) => {
    return res.status(200).send('route5 page welcome !');
});

export = router;
