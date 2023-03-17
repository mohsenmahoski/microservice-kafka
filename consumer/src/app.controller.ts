import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  private fibonacci (n: number){
    return n < 1 ? 0 : n <= 2 ? 1 : this.fibonacci(n - 1) + this.fibonacci(n - 2);
  };

  @MessagePattern('fibo')
  getFibonacci(@Payload() message: { num: number }) {
    const { num } = message;
    return this.fibonacci(num);
  }
}
