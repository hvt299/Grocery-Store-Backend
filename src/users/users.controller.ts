import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('register')
  @ApiOperation({ summary: 'Tạo tài khoản (Dùng để khởi tạo Admin ban đầu)' })
  @ApiResponse({ status: 201, description: 'Đã tạo tài khoản thành công.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}