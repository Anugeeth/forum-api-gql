import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { Repository } from 'typeorm';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOptionsRelations } from 'typeorm';
import { Roles } from './entities/roles.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }

  async create(createUserInput: CreateUserInput) {
    const user = this.userRepository.create(createUserInput)
    return this.userRepository.save(user);
  }

  async findAll() {
    return this.userRepository.find({
      relations: {
        roles: true
      }
    });
  }

  async findOne(username: string, relations?: FindOptionsRelations<User>) {
    const user = await this.userRepository.findOne({
      where: {
        username
      },
      relations
    });
    if (!user)
      throw new NotFoundException("User not found")

    return user
  }

  async update(updateUserInput: UpdateUserInput) {

    let user = await this.userRepository.update(updateUserInput.id, {
      roles: [updateUserInput.role]
    })

    return user

  }

  async updateRoles(userId: number, role: Roles) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new Error(`User with ID ${userId} not found.`);
    }

    user.roles = [...user.roles, role];

    await this.userRepository.save(user);

    return user;
  }


}
