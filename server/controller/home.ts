import { Controller, Get } from 'inversify-express-utils';
import { injectable } from 'inversify';
import { Request, Response, NextFunction} from 'express';

@injectable()
@Controller('/')
export class HomeController {
  @Get('/')
  public get(): string {
    return 'Home sweet home';
  }

}