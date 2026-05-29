import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async login(loginDto: LoginDto) {
        const { username, password } = loginDto;

        const user = await this.usersService.findByUsername(username);
        if (!user) {
            throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng!');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng!');
        }

        const payload = { sub: (user as any)._id, role: user.role };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}