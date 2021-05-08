import * as redis from "redis";
import { useContainer } from "routing-controllers";
import Container, { Service } from "typedi";
import { promisify } from "util";

// its important to set container before any operation you do with routing-controllers,
// including importing controllers
useContainer(Container);
@Service()
export class RedisService {

    private redisClient: redis.RedisClient;

    constructor() {
        this.redisClient = redis.createClient();
        this.redisClient.on('error', function (err) {
            console.error(err);
        });
    }

    public getRedisClient(): redis.RedisClient { return this.redisClient; }

    public getAsyncSetEx(v1: string, v2: number, v3: string) {
        const asetex = promisify(this.redisClient.setex).bind(this.redisClient);
        return asetex(v1, v2, v3);
    }

    public getAsyncGet(v1: string): Promise<string | null> {
        const aget = promisify(this.redisClient.get).bind(this.redisClient);
        return aget(v1);
    }


    // getAsyncSetEx = (v1: string, v2: number, v3: string) => promisify(this.redisClient.setex).bind(this.redisClient);
    // public getAsyncGet(v1: string): Promise<string | null> { return promisify(this.redisClient.get).bind(this.redisClient); }
}