import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'Đăng nhập để lấy thẻ Token' })
    @ApiResponse({ status: 201, description: 'Thành công, trả về access_token.' })
    @ApiResponse({ status: 401, description: 'Sai tài khoản/mật khẩu.' })
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}