import moment from 'moment';
import {getFromCache, putToCache} from '../../utils/redis';

declare type RateLimiterOptions = {
    window_size_in_seconds?: number,
};

export declare interface RateLimiterInterface {
    init(request, response, next);
    trackByField(request: any);
    getRequestsLimit(request): Promise<number>;
}

const DEFAULT_REQUESTS_WINDOW_LIMIT = 100;

export class RateLimiter implements RateLimiterInterface{
    private window_size_in_seconds = 60 * 60;

    async init(request, response, next) {
        try {
            const requestsLimit = await this.getRequestsLimit(request);
            const trackRequestBy = this.trackByField(request);

            const buckets = await getFromCache(trackRequestBy);
            const currentRequestTime = moment();

            if (buckets === null) {
                let newRecord = [];
                let requestLog = {
                    startWindowTimestamp: currentRequestTime.unix(),
                    requestCount: 1,
                };
                newRecord.push(requestLog);
                await putToCache(trackRequestBy, newRecord);
                return next();
            } else {
                let latestWindow = buckets[buckets.length - 1];

                if(this.isValidWindow(latestWindow) && latestWindow.requestCount >= requestsLimit) {
                    return response.status(429).send(
                        `You have exceeded the ${requestsLimit} requests / hr limit! you can try again ${
                            currentRequestTime.add(( (latestWindow.startWindowTimestamp + this.window_size_in_seconds) - currentRequestTime.unix()), 'seconds').format('h:mm:ss A')
                        }`
                    );
                }

                if(this.isValidWindow(latestWindow)) {
                    latestWindow.requestCount++;
                    buckets[buckets.length - 1] = latestWindow;
                } else {
                    buckets.push({
                        startWindowTimestamp: currentRequestTime.unix(),
                        requestCount: 1,
                    })
                }


                await putToCache(trackRequestBy, buckets)
                return next();
            }

        } catch (error) {
            next(error);
        }
    }

    isValidWindow(timeWindow) {
        return moment().unix() >= timeWindow.startWindowTimestamp &&
            moment().unix() < timeWindow.startWindowTimestamp + this.window_size_in_seconds
        ;
    }

    trackByField(request: any) {
        return `ip_${request.ip}`;
    }

    async getRequestsLimit(request): Promise<number> {
        return DEFAULT_REQUESTS_WINDOW_LIMIT;
    }
}
