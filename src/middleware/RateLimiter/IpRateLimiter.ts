import {RateLimiter, RateLimiterInterface} from './RateLimiter';

class IpRateLimiter extends RateLimiter implements RateLimiterInterface {
    async getRequestsLimit(request): Promise<number> {
        return (process.env.IP_RATE_LIMITER_LIMIT || 100) as number;
    }
}

let ipRateLimiter: IpRateLimiter = null;

export async function createIpRateLimiter(request, response, next) {
    if(!ipRateLimiter) {
        ipRateLimiter = new IpRateLimiter();
    }

    return await ipRateLimiter.init(request, response, next);
}
