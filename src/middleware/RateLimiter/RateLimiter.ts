import moment from 'moment';
import {getFromCache, putToCache} from '../../utils/redis';

declare type RateLimiterOptions = {
    window_size_in_seconds?: number,
    max_window_request_count: number,
};

export declare interface RateLimiterInterface {
    init(request, response, next);
    trackByField(request: any);
}

export class RateLimiter implements RateLimiterInterface{
    private window_size_in_seconds = 60 * 60;
    private max_window_request_count = 100;

    constructor(options: RateLimiterOptions) {
        this.window_size_in_seconds = options.window_size_in_seconds ?? this.window_size_in_seconds;
        this.max_window_request_count = options.max_window_request_count ?? this.max_window_request_count;
    }

    async init(request, response, next) {
        try {
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

                if(this.isValidWindow(latestWindow) && latestWindow.requestCount >= this.max_window_request_count) {
                    return response.status(429).send(
                        `You have exceeded the ${this.max_window_request_count} requests / hrs limit! you can try again ${
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
}
