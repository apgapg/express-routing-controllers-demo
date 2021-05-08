import 'reflect-metadata'
import { Action, createExpressServer, UnauthorizedError } from 'routing-controllers';
import { UserController } from './controllers/UserController';
import { ErrorMiddleware } from './middlewares/ErrorMiddleware';
import { User } from './models/User';
import { Express } from "express";
import { jwt_secret_key, LoginController } from "./controllers/LoginController";
import * as jwt from "jsonwebtoken";
import { TokenExpiredError } from "jsonwebtoken";
import * as redis from "redis";
import { promisify } from "util";

export const redisClient = redis.createClient();

const app: Express = createExpressServer({
    cors: true,
    routePrefix: '/api',
    controllers: [LoginController, UserController],
    middlewares: [ErrorMiddleware],
    authorizationChecker: async (action: Action, roles: string[]) => {
        try {
            const bearerHeader = action.request.headers['authorization'];
            if (bearerHeader) {
                const bearer = bearerHeader.split(' ');
                const bearerToken = bearer[1];

                const decodedToken: any = jwt.verify(bearerToken, jwt_secret_key,);

                const aget = promisify(redisClient.get).bind(redisClient);
                const cachedToken = await aget(bearerToken);
                if (cachedToken) {
                    return false;
                }

                // const alrange = promisify(redisClient.lrange).bind(redisClient);
                // const tokenList = await alrange('token', 0, -1);
                // if (tokenList.indexOf(bearerToken) > -1) {
                //     return false;
                // }

                action.request.user = new User(decodedToken.name, decodedToken.name, decodedToken.uid, bearerToken);
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    },
    currentUserChecker: (action) => {
        return action.request.user;
    },
    validation: {
        stopAtFirstError: true,
    },
    defaultErrorHandler: false,
})
app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
})