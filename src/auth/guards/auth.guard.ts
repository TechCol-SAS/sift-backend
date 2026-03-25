import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

import { Request } from 'express';

import { IJwtPayload } from '../interfaces/payload.interface';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';

/**
 * Guard de autenticación que protege las rutas de la aplicación
 * Verifica que el usuario tenga un token JWT válido en el header Authorization
 * Las rutas marcadas con el decorador @Public() son accesibles sin autenticación
 */
@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  /**
   * Determina si la ruta actual puede ser activada
   * Verifica si la ruta es pública o si el usuario tiene un token válido
   * @param context - Contexto de ejecución de NestJS que contiene información de la solicitud
   * @returns true si el usuario está autenticado o la ruta es pública, de lo contrario lanza una excepción
   * @throws {UnauthorizedException} Si no se proporciona token o el token es inválido
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException();

    try {
      const payload: IJwtPayload = await this.jwtService.verifyAsync(token);

      request['user'] = payload;

      console.log(request['user']);
    } catch (error) {
      this.logger.error(error);

      throw new UnauthorizedException(
        'Error interno del servidor, por favor revisa los logs',
      );
    }
    return true;
  }

  /**
   * Extrae el token JWT del header Authorization de la solicitud
   * @param request - Objeto de solicitud HTTP de Express
   * @returns Token JWT si existe y es del tipo Bearer, undefined en caso contrario
   * @private
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
