import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import User from './entities/user.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Busca un usuario por un término que puede ser UUID o email
   * @param term - Término de búsqueda (UUID del usuario o email)
   * @returns Usuario encontrado o null si no existe
   */
  public async findByTerm(term: string) {
    let user: User | null = null;

    switch (true) {
      case isUUID(term):
        user = await this.userRepository.findOneBy({ id: term });
        break;
      default:
        user = await this.userRepository.findOneBy({ email: term });
    }

    return user;
  }

  /**
   * Crea un nuevo usuario en la base de datos
   * @param user - Datos del usuario a crear
   * @returns Usuario creado con todos sus datos
   */
  public async create(user: User) {
    return this.userRepository.save(user);
  }

  /**
   * Actualiza el refresh token de un usuario
   * @param id - UUID del usuario
   * @param refreshToken - Nuevo refresh token hasheado o null para removerlo
   * @returns Resultado de la operación de actualización
   */
  public async updateRefreshToken(id: string, refreshToken: string | null) {
    return this.userRepository.update(id, { refreshToken: refreshToken });
  }
}
