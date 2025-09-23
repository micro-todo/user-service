import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.login')
  login(@Payload() body: { email: string; password: string }) {
    return this.authService.login(body);
  }

  @MessagePattern('auth.register')
  register(@Payload() body: { email: string; password: string }) {
    return this.authService.register(body);
  }
}
