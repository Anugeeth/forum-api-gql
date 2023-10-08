import 'dotenv/config'
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy, LocalStrategy } from './auth.strategy';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from 'src/users/entities/roles.entity';


@Module({
  imports: [PassportModule, UsersModule,
    JwtModule.register({
      signOptions: {
        expiresIn: '1h'
      },
      secret: process.env.JWT_SECRET
    }),

    TypeOrmModule.forFeature([Roles])
  ],
  providers: [AuthService ,AuthResolver, LocalStrategy, JwtStrategy],
})
export class AuthModule { }
