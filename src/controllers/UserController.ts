import { Request } from 'express';
import { JsonController, Param, Body, Get, Post, Put, Delete, Req, Authorized, CurrentUser, HttpError, NotFoundError, InternalServerError } from 'routing-controllers';
import { User } from '../models/User';
import { UserDetails } from '../models/UserDetails';
@JsonController()
@Authorized()
export class UserController {
    @Get('/users')
    getAll(@Req() request: Request, @CurrentUser({ required: true }) user: User) {
        return { "endpoint": request.url, "name": user.getName() };
    }

    @Post('/users1')
    getAll1(@Req() request: Request, @CurrentUser({ required: true }) user: User) {
        throw new InternalServerError('Not found');
    }

    @Get('/users/:id')
    getOne(@Param('id') id: number) {
        return 'This action returns user #' + id;
    }

    @Post('/users')
    post(@Body() userDetails: UserDetails) {
        console.log(userDetails.age);
        return userDetails;
    }

    @Put('/users/:id')
    put(@Param('id') id: number, @Body() user: any) {
        return 'Updating a user...';
    }

    @Delete('/users/:id')
    remove(@Param('id') id: number) {
        return 'Removing user...';
    }
}