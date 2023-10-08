import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';


export const CurrentUser = createParamDecorator((data, context: ExecutionContext) => {
    let ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req.user
});
