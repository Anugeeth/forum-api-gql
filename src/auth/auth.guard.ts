import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";
import { Injectable, ExecutionContext, CanActivate } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "./entities/role.enum";
import { IS_PUBLIC_KEY } from "./types/auth.decorator";


@Injectable()
export class GqlAuthGuard extends AuthGuard('local') {
    constructor() {
        super();
    }
    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context)
        const req = ctx.getContext();
        req.body = ctx.getArgs().loginInput;
        return req;
    }
}

@Injectable() // change it to add socket io and gql sub
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    // initializing the request object from the GqlExecutionContext
    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context)
        return ctx.getContext().req;

    }

    // disabling on public endpoints
    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }
        return super.canActivate(context);
    }
}


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    private matchRoles(requiredRoles: any, userRoles: any) {
        return requiredRoles.some((role) => userRoles.includes(role));
    }

    canActivate(context: ExecutionContext): boolean {
        const ctx = GqlExecutionContext.create(context)
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
            ctx.getHandler(),
            ctx.getClass()
        ]);

        if (!requiredRoles) return true;

        let user = ctx.getContext().req.user;

        return this.matchRoles(requiredRoles, user.roles);
    }
}

