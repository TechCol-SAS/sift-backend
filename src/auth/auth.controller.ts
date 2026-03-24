import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';

import { SignUpDto } from 'src/user/dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }
}
