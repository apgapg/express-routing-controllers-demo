import 'reflect-metadata'
import { Action, createExpressServer } from 'routing-controllers';
import { UserController } from './controllers/UserController';
import { ErrorMiddleware } from './middlewares/ErrorMiddleware';
import { User } from './models/User';
import { Express } from "express";

const app: Express = createExpressServer({
    cors: true,
    routePrefix: '/api',
    controllers: [UserController],
    middlewares: [ErrorMiddleware],
    authorizationChecker: (action: Action, roles: string[]) => {
        return true;
    },
    currentUserChecker: (action) => {
        return new User("Ayush", "Gupta");
    },
    validation: {
        stopAtFirstError: true,
    },
    defaultErrorHandler: false,
})
app.use((req, response, next) => {
    response.status(404);
    response.send("404 not found");
})
app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
})