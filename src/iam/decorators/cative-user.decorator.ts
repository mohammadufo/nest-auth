import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { REQUEST_USER_KEY } from '../iam.constant';

export const ActiveUser = createParamDecorator(
  (field: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request[REQUEST_USER_KEY];
    return field ? user?.[field] : user;
  },
);
