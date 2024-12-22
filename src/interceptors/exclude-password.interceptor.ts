import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  
  @Injectable()
  export class ExcludePasswordInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        map((data) => {
          if (Array.isArray(data)) {
            
            return data.map((user) => this.excludePassword(user));
          }
          
          return this.excludePassword(data);
        }),
      );
    }
  
    private excludePassword(user: any) {
      if (user && user.password) {
        const { password, ...rest } = user;
        return rest;
      }
      return user;
    }
  }
  