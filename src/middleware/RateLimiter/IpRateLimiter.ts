import {RateLimiter, RateLimiterInterface} from './RateLimiter';

class IpRateLimiter extends RateLimiter implements RateLimiterInterface {

}

let ipRateLimiter: IpRateLimiter = null;

export async function createIpRateLimiter(request, response, next) {
    if(!ipRateLimiter) {
        const IP_RATE_LIMITER_LIMIT: number = (process.env.IP_RATE_LIMITER_LIMIT || 100) as number;

        ipRateLimiter = new IpRateLimiter({
            max_window_request_count: IP_RATE_LIMITER_LIMIT
        });
    }

    return await ipRateLimiter.init(request, response, next);
}
