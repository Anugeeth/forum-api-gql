import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Strategy as PassportLocalStrategy } from 'passport-local';
import { ExtractJwt, Strategy as PassportJwtStrategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(PassportLocalStrategy) {
    constructor(private authService: AuthService) {
        super();
    }
    async validate(username: string, password: string) {
        const user = await this.authService.validateUser(username, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }

}

@Injectable()
export class JwtStrategy extends PassportStrategy(PassportJwtStrategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: process.env.JWT_SECRET,
            logging: true
        }) 
    }

    async validate(payload: any) {
        return { id: payload.sub, username: payload.username , roles: payload.roles }
    }
}