import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

  
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header not found');
    }


    const [bearer, token] = authorizationHeader.split(' ');

    if (bearer !== 'Bearer' || !token || token === 'null') {
      throw new UnauthorizedException('Invalid or missing token');
    }

    try {
      const secret = process.env.JWT_SECRET;
      const user = this.jwtService.verify(token, { secret }); 


      user.exp = new Date(user.exp * 1000);
      user.iat = new Date(user.iat * 1000);


      user.roles = user.isAdmin ? ['admin'] : ['user'];


      request.user = user;

      return true;
    } catch (error) {

      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
