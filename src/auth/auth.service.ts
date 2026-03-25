import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { UserService } from 'src/user/user.service';

import { SignUpDto } from 'src/user/dto/signup.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

import { IJwtPayload } from './interfaces/payload.interface';
import { IJwtTokens } from './interfaces/jwt-tokens.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  private readonly saltOrRounds = 10;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async signUp(signUpDto: SignUpDto) {
    const { email, password } = signUpDto;

    try {
      const user = await this.userService.findByTerm(email);

      if (user) throw new BadRequestException('El usuario ya existe');

      const hashedPassword = await bcrypt.hash(password, this.saltOrRounds);

      const newUser = await this.userService.create({
        ...signUpDto,
        password: hashedPassword,
      });

      const {
        id,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        password: _password,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        refreshToken: _refreshToken,
        ...restUser
      } = newUser;

      const payload: IJwtPayload = {
        id: id,
        email: email,
      };

      const jwtTokens: IJwtTokens = await this.generateTokens(payload);

      return {
        message: 'Usuario creado exitosamente',
        user: {
          ...restUser,
          tokens: {
            accessToken: jwtTokens.accessToken,
            refreshToken: jwtTokens.refreshToken,
          },
        },
      };
    } catch (error) {
      this.logger.error(error);

      if (error instanceof BadRequestException) throw error;

      throw new InternalServerErrorException(
        'Error interno del servidor, por favor revisa los logs',
      );
    }
  }

  public async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    try {
      const payload: IJwtPayload =
        await this.jwtService.verifyAsync(refreshToken);

      const user = await this.userService.findByTerm(payload.id);

      if (!user) throw new UnauthorizedException();

      const isRefreshTokenValid = await bcrypt.compare(
        refreshToken,
        user.refreshToken!,
      );

      if (!isRefreshTokenValid) throw new UnauthorizedException();

      const newPayload: IJwtPayload = {
        id: user.id,
        email: user.email,
      };

      const newJwtTokens = await this.generateTokens(newPayload);

      return {
        message: 'Tokens actualizados exitosamente',
        tokens: {
          accessToken: newJwtTokens.accessToken,
          refreshToken: newJwtTokens.refreshToken,
        },
      };
    } catch (error) {
      this.logger.error(error);

      if (error instanceof UnauthorizedException) throw error;

      throw new InternalServerErrorException(
        'Error interno del servidor, por favor revisa los logs',
      );
    }
  }

  private async generateTokens(payload: IJwtPayload): Promise<IJwtTokens> {
    const hashedRefreshToken = await bcrypt.hash(payload.id, this.saltOrRounds);

    await this.userService.updateRefreshToken(payload.id, hashedRefreshToken);

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '4h',
      }),
    };
  }
}
