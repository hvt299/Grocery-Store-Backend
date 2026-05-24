import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsMongoId, Min } from 'class-validator';

export class CreateProductDto {
    @ApiPropertyOptional({ description: 'ID của danh mục', example: '64d...abc' })
    @IsOptional()
    @IsMongoId({ message: 'categoryId phải là một ObjectId hợp lệ' })
    categoryId?: string;

    @ApiProperty({ description: 'Tên sản phẩm', example: 'Snack Oishi' })
    @IsString()
    @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
    name!: string;

    @ApiPropertyOptional({ description: 'Đơn vị tính', example: 'Gói', default: 'Cái' })
    @IsOptional()
    @IsString()
    unit?: string;

    @ApiPropertyOptional({ description: 'Giá bán', example: 5000, default: 0 })
    @IsOptional()
    @IsNumber()
    @Min(0, { message: 'Giá bán không được âm' })
    price?: number;

    @ApiPropertyOptional({ description: 'Giá vốn', example: 4000, default: 0 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    costPrice?: number;

    @ApiPropertyOptional({ description: 'Số lượng tồn kho', example: 100, default: 0 })
    @IsOptional()
    @IsNumber()
    stock?: number;

    @ApiPropertyOptional({ description: 'URL ảnh sản phẩm' })
    @IsOptional()
    @IsString()
    imageUrl?: string;
}