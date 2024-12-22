import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware{
    use(req: Request, res: Response, next: NextFunction) {
        console.log(`Estas ejecuntado un método ${req.method} en la ruta ${req.path} en la fecha ${new Date().toLocaleString()}`);
        next();
    }
}  

export function loggerGlobal(req: Request, res: Response, next: NextFunction) {
    console.log(`Estas ejecuntado un método ${req.method} en la ruta ${req.path} en la fecha ${new Date().toLocaleString()}`);
    next();
}

