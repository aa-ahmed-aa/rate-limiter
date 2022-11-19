export function AuthMiddleware(req, res, next) {
    const authToken = process.env.AUTH_TOKEN;

    if(!req.headers['auth_token'] || req.headers['auth_token'] !== authToken) {
        return res.status(401).send('Unauthorized please use correct token!!!');
    }

    next()
}
