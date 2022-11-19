import {RateLimiter, RateLimiterInterface} from './RateLimiter';

class TokenRateLimiter extends RateLimiter implements RateLimiterInterface {
    trackByField(request) {
        return `token_${request.headers['auth_token']}`;
    }
}

let tokenRateLimiter: TokenRateLimiter = null;

export async function createTokenRateLimiter(request, response, next) {
    if(!tokenRateLimiter) {

        const TOKEN_RATE_LIMITER_LIMIT: number = (process.env.TOKEN_RATE_LIMITER_LIMIT || 200) as number;
        tokenRateLimiter = new TokenRateLimiter({
            max_window_request_count: TOKEN_RATE_LIMITER_LIMIT
        });
    }

    return await tokenRateLimiter.init(request, response, next);
}
