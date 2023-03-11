import { Controller, Get } from '@nestjs/common';
import { fibonacci } from './util';

@Controller()
export class AppController {
  @Get('/fibonacci')
  async getFibo() {
    return fibonacci(40);
  }
}
