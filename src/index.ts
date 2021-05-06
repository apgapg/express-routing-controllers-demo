import 'reflect-metadata'
import { Action, createExpressServer, useExpressServer } from 'routing-controllers';
import { UserController } from './controllers/UserController';
import { ErrorMiddleware } from './middlewares/ErrorMiddleware';
import { User } from './models/User';

// const app = express();

// app.get('/', (req, res) => {
//     res.send('Well done!');
// })

const app = createExpressServer({
    cors: true,
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

app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
})