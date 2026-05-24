import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({
        description: 'Tên của danh mục',
        example: 'Nước giải khát',
    })
    @IsString()
    @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
    name!: string;
}