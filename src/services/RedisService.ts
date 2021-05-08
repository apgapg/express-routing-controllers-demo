// import { Service } from "typedi";
// import * as redis from "redis";
// import { promisify } from "util";

// export class RedisService {
//     private redisClient: redis.RedisClient;

//     constructor() {
//         this.redisClient = redis.createClient();
//     }

//     getAsyncSetEx = () => promisify(this.redisClient.setex).bind(this.redisClient);
//     getAsyncGet = () => promisify(this.redisClient.get).bind(this.redisClient);
// }