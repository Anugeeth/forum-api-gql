import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginInput } from './dto/login-input';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Roles } from 'src/users/entities/roles.entity';
import { SignupInput } from './dto/signup-input';
import { SetroleInput } from './dto/setrole-input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.enum';


@Injectable()
export class AuthService {

  constructor(private userService: UsersService, private jwtService: JwtService,
    @InjectRepository(Roles) private roleRepository: Repository<Roles>

  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username, {
      roles: true
    });


    const valid = await bcrypt.compare(password, user?.password)
    if (user && valid) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }


  async login(user: User) {
    return {
      access_token: await this.jwtService.signAsync({
        username: user.username,
        sub: user.id,
        roles: user.roles.map(item => item.role)
      }),
      user: user
    }
  }

  async signup(signUpInput: SignupInput) {
    const user = await this.userService.findOne(signUpInput.username)

    if (user) {
      throw new Error("User already exists")
    }

    let _user = await this.userService.create({
      ...signUpInput,
      password: await bcrypt.hash(signUpInput.password, 10)
    })

    return this.setRole({ id: _user.id, role: Role.USER }) //each user is preassigned the default role

  }

  async setRole(setroleInput: SetroleInput) {
    let role = await this.roleRepository.findOne({
      where: { role: setroleInput.role },
    })


    return this.userService.updateRoles(setroleInput.id, role)
  }

}
