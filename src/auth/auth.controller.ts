import {
  Body,
  Controller,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { UserLoginDTO, UserRegisterDTO } from '@/common/dto/user';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //register
  @Post('/register')
  async register(@Body() user: UserRegisterDTO) {
    return this.authService.register(user);
  }

  //login
  @Post('/login')
  async login(@Body() user: UserLoginDTO, @Res() response: Response) {
    const result = await this.authService.login(user);
    if (!result?.token) {
      throw new UnauthorizedException('Invalid credentials');
    }
    response.cookie('session-token', result.token, {
      maxAge: 24 * 60 * 60 * 1000, // For example, 1 day
      sameSite: 'none',
      secure: true,
    });
    return response.send(result);
  }
}
