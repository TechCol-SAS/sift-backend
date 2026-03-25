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

  public async findByTerm(term: string) {
    let user: User | null;

    switch (true) {
      case isUUID(term):
        user = await this.userRepository.findOneBy({ id: term });
        break;
      default:
        user = await this.userRepository.findOneBy({ email: term });
    }

    return user;
  }

  public async create(user: User) {
    return this.userRepository.save(user);
  }

  public async updateRefreshToken(id: string, refreshToken: string | null) {
    return this.userRepository.update(id, { refreshToken: refreshToken });
  }
}
