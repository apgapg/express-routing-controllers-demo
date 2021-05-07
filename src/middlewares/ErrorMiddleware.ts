import { ExpressErrorMiddlewareInterface, Middleware } from "routing-controllers";

@Middleware({ type: 'after' })
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
    error(error: any, request: any, response: any, next: (err?: any) => any): void {
        //throw new Error("Method not implemented.");
        const code = error.httpCode || 500;
        const message = code == 401 ? "User not authorized!" : (error.message || "Some error");
        response.status(code);
        response.send(message);
    }

}