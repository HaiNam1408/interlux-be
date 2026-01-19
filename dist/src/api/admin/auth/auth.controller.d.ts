import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import ApiResponse from 'src/global/api.response';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<ApiResponse<any>>;
    logout(user: any): Promise<ApiResponse<any>>;
}
