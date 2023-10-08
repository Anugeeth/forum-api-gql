import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { UseGuards } from '@nestjs/common';
import { LoginResponse } from './dto/login-response';
import { LoginInput } from './dto/login-input';
import { GqlAuthGuard } from './auth.guard';
import { User } from '../users/entities/user.entity';
import { Public } from './types/auth.decorator';
import { SignupInput } from './dto/signup-input';
import { Roles } from './roles.decorator';
import { Role } from './entities/role.enum';
import { SetroleInput } from './dto/setrole-input';

@Resolver(() => Auth)
export class AuthResolver {
    constructor(private readonly authService: AuthService) { }

    @Mutation(() => LoginResponse)
    @Public()
    @UseGuards(GqlAuthGuard)
    login(@Args('loginInput') loginInput: LoginInput, @Context() context) {
      return this.authService.login(context.user)
    }


    @Mutation(() => User)
    @Public()
    signup(@Args('signupInput') signupInput: SignupInput){
      return this.authService.signup(signupInput)
    }

    @Mutation(()=> User)
    @Roles(Role.ADMIN)
    setRole(@Args('setRoleInput') setroleInput : SetroleInput){
      return this.authService.setRole(setroleInput)
    }

}
