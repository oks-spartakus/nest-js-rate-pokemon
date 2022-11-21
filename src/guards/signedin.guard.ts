import { CanActivate, ExecutionContext } from '@nestjs/common';

export class SignedInGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    console.log('===================>waaaaaaaaaat?');
    const request = context.switchToHttp().getRequest();
    console.log('request==================>', request.session);
    console.log('request==================>', request.currentUser);

    return !!request.session.userId;
  }
}
