import { Express } from "express";
import * as jwt from "jsonwebtoken";
import 'reflect-metadata';
import { Action, createExpressServer, useContainer } from 'routing-controllers';
import { Container } from "typedi";
import { jwt_secret_key } from "./constants/constants";
import { LoginController } from "./controllers/LoginController";
import { UserController } from './controllers/UserController';
import { ErrorMiddleware } from './middlewares/ErrorMiddleware';
import { User } from './models/User';
import { RedisService } from "./services/RedisService";

// its important to set container before any operation you do with routing-controllers,
// including importing controllers
useContainer(Container);

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

                try {
                    const redisService = Container.get(RedisService);
                    if (redisService) {
                        const cachedToken = await redisService.getAsyncGet(bearerToken);
                        if (cachedToken) {
                            return false;
                        }
                    }
                } catch (error) {
                    console.log(error);
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
