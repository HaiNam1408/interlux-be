import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
export declare class ExceptionInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, handler: CallHandler): any;
}
