import { ExpressErrorMiddlewareInterface, Middleware } from "routing-controllers";

@Middleware({ type: 'after' })
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
    error(error: any, request: any, response: any, next: (err?: any) => any): void {
        //throw new Error("Method not implemented.");
        response.status(error.httpCode || 500);
        response.send(error.message || "Some error");
    }

}