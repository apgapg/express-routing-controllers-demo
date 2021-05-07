import { Request } from 'express';
import {
    Authorized,
    Body,
    CurrentUser,
    Delete,
    Get,
    InternalServerError,
    JsonController,
    Param,
    Post,
    Put,
    Req
} from 'routing-controllers';
import { User } from '../models/User';
import { UserDetails } from '../models/UserDetails';

@JsonController('/v1/users')
@Authorized()
export class UserController {
    @Get('/')
    getAll(@Req() request: Request, @CurrentUser({ required: true }) user: User) {
        return { "endpoint": request.url, "name": user.getName() };
    }

    @Post('/test')
    getAll1(@Req() request: Request, @CurrentUser({ required: true }) user: User) {
        throw new InternalServerError('Not found');
    }

    @Get('/:id')
    getOne(@Param('id') id: number) {
        return 'This action returns user #' + id;
    }

    @Post('/')
    post(@Body() userDetails: UserDetails) {
        console.log(userDetails.age);
        return userDetails;
    }

    @Put('/:id')
    put(@Param('id') id: number, @Body() user: any) {
        return 'Updating a user...';
    }

    @Delete('/:id')
    remove(@Param('id') id: number) {
        return 'Removing user...';
    }
}