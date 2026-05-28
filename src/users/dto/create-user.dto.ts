import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ description: 'Tên đăng nhập', example: 'admin' })
    @IsString()
    @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
    username: string;

    @ApiProperty({
        description: 'Mật khẩu (ít nhất 8 ký tự, 1 hoa, 1 thường, 1 số, 1 ký tự đặc biệt)',
        example: 'Admin@123'
    })
    @IsString()
    @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
        message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt'
    })
    password: string;

    @ApiPropertyOptional({ description: 'Quyền hạn', enum: ['ADMIN', 'CASHIER'], default: 'CASHIER' })
    @IsOptional()
    @IsEnum(['ADMIN', 'CASHIER'])
    role?: string;
}