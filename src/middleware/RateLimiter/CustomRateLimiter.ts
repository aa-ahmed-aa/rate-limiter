import {RateLimiter, RateLimiterInterface} from './RateLimiter';

const requestsDatabase = [
    {url: '/apis/route1', limit: 1},
    {url: '/apis/route2', limit: 5},
    {url: '/apis/route3', limit: 10},
    {url: '/apis/route4', limit: 15},
    {url: '/apis/route5', limit: 20}
];

class CustomRateLimiter extends RateLimiter implements RateLimiterInterface {
    trackByField(request) {
        return `ip:${request.ip}:${request.url}`;
    }

    getRequestsLimit(request) {
        const requestData = requestsDatabase.find(item => {
           return request.originalUrl === item.url;
        });

        if(!requestData) {
            throw new Error(`i can't find this route to ratelimit`);
        }

        return requestData.limit;

    }
}

let tokenRateLimiter: CustomRateLimiter = null;

export async function createCustomRateLimiter(request, response, next) {
    if(!tokenRateLimiter) {
        tokenRateLimiter = new CustomRateLimiter();
    }

    return await tokenRateLimiter.init(request, response, next);
}
