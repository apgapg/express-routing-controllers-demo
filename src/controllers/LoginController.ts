import { IsNotEmpty, IsString } from "class-validator";
import { Request } from "express";
import * as jwt from "jsonwebtoken";
import { Authorized, BadRequestError, CurrentUser, Get, JsonController, QueryParams, Req } from "routing-controllers";
import { Service } from "typedi";
import { jwt_secret_key, jwt_expiry_sec } from "../constants/constants";
import { User } from "../models/User";
import { RedisService } from "../services/RedisService";


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
@Service()
export class LoginController {

    constructor(private redisService: RedisService) {
        this.redisService = redisService;
    }

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
        if (this.redisService.getRedisClient()) {
            await this.redisService.getAsyncSetEx(user.authToken, jwt_expiry_sec, user.authToken);
        }
        //redisClient.lpush('token', user.authToken);
        return "Successfully logged out!";
    }
}