import { Controller, Get, Post, Put, Delete } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { IUser, UserService } from '../service/user';
import { Request, Response, NextFunction} from 'express';
import TYPES from '../constant/types';

@injectable()
@Controller('/api/user')
export class UserController {

  constructor(@inject(TYPES.UserService) private userService: UserService) { }

  @Get('/')
  public  async getUsers(response: Response, next : NextFunction): Promise< any> {
    return await this.userService.getUsers();

  }

  @Get('/:id')
  public async getUser(request: Request): Promise<IUser> {
    return await this.userService.getUser(request.params.id);
  }

  @Post('/')
  public async newUser(request: Request): Promise<IUser> {
    return await this.userService.newUser(request.body);
  }

  @Put('/:id')
  public async updateUser(request: Request): Promise<IUser> {
    return await this.userService.updateUser(request.params.id, request.body.name, request.body.email);
  }

  @Delete('/:id')
  public  async deleteUser(request: Request) {
   await this.userService.deleteUser(request.params.id);
  }
}
