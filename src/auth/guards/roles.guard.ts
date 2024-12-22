import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      'roles',
      [context.getHandler(),
      context.getClass()]
    );
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    const valid = requiredRoles.some((role) => user.roles.includes(role));

    if (!valid) {
      throw new ForbiddenException('You do not have the necessary permissions to access this resource. Yo are not an Admin. Go away!');
    }
    return valid;
  }
}
