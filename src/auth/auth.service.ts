import { Injectable } from '@nestjs/common';
import { SignUpDto } from 'src/user/dto/signup.dto';

@Injectable()
export class AuthService {
  constructor() {}

  public signUp(signUpDto: SignUpDto) {
    return {
      message: 'User created successfully',
      data: signUpDto,
    };
  }
}
