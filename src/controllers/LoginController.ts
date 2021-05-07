import { Authorized, BadRequestError, CurrentUser, Get, JsonController, QueryParams, Req } from "routing-controllers";
import { Request } from "express";
import * as jwt from "jsonwebtoken";
import { IsNotEmpty, IsString } from "class-validator";
import { redisClient } from "../index";
import { User } from "../models/User";

export const jwt_secret_key = "sNVPqVWfTN35JRSMF2MDDS4PgdCSkdXZQR3ry6K0QkCoD4woCpqBjxkvDd3ndKh";

class RegisterUserQuery {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    constructor(name: string, password: string) {
        this.name = name;
        this.password = password;
    }
}

@JsonController('/v1/login')
export class LoginController {
    @Get('/register')
    doRegister(@Req() request: Request, @QueryParams() query: RegisterUserQuery) {
        const dbName = "Ayush";
        const dbPassword = "123";
        if (query.name != dbName || query.password != dbPassword) {
            throw new BadRequestError('Invalid credentials');
        }
        const uid = "sample-uid";
        const token = jwt.sign({ uid: uid, name: query.name, role: 'admin' },
            jwt_secret_key,
            { expiresIn: "600000", issuer: "fieldassist.com", });
        return { uid: uid, token: token };
    }

    @Get('/logout')
    @Authorized()
    doLogout(@Req() request: Request, @CurrentUser({ required: true }) user: User) {
        redisClient.lpush('token', user.authToken);
        return "Successfully logged out!";
    }
}