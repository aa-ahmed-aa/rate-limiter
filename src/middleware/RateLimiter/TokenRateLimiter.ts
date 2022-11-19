import {RateLimiter, RateLimiterInterface} from './RateLimiter';

class TokenRateLimiter extends RateLimiter implements RateLimiterInterface {
    trackByField(request) {
        return `token_${request.headers['auth_token']}`;
    }

    getRequestsLimit(): number {
        return (process.env.TOKEN_RATE_LIMITER_LIMIT || 200) as number;
    }
}

let tokenRateLimiter: TokenRateLimiter = null;

export async function createTokenRateLimiter(request, response, next) {
    if(!tokenRateLimiter) {
        tokenRateLimiter = new TokenRateLimiter();
    }

    return await tokenRateLimiter.init(request, response, next);
}
