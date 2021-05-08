import { IsNotEmpty, IsString } from "class-validator";
import { Request } from "express";
import * as jwt from "jsonwebtoken";
import { Authorized, BadRequestError, CurrentUser, Get, JsonController, QueryParams, Req } from "routing-controllers";
import { asetex } from "../db/redis";
import { User } from "../models/User";

export const jwt_secret_key = "sNVPqVWfTN35JRSMF2MDDS4PgdCSkdXZQR3ry6K0QkCoD4woCpqBjxkvDd3ndKh";
export const jwt_expiry_sec = 60;
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
            { expiresIn: `${jwt_expiry_sec * 1000}`, issuer: "fieldassist.com", });
        return { uid: uid, token: token };
    }

    @Get('/logout')
    @Authorized()
    async doLogout(@Req() request: Request, @CurrentUser({ required: true }) user: User) {
        await asetex(user.authToken, jwt_expiry_sec, user.authToken);
        //redisClient.lpush('token', user.authToken);
        return "Successfully logged out!";
    }
}