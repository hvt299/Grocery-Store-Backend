import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CreateInvoiceItemDto {
    @ApiPropertyOptional({ description: 'ID sản phẩm gốc' })
    @IsOptional()
    @IsMongoId()
    productId?: string;

    @ApiProperty({ description: 'Tên sản phẩm lúc bán' })
    @IsString()
    @IsNotEmpty()
    productName: string;

    @ApiPropertyOptional({ description: 'Đơn vị tính' })
    @IsOptional()
    @IsString()
    unit?: string;

    @ApiProperty({ description: 'Số lượng' })
    @IsNumber()
    @Min(1)
    quantity: number;

    @ApiProperty({ description: 'Giá bán tại thời điểm đó' })
    @IsNumber()
    @Min(0)
    price: number;
}

export class CreateInvoiceDto {
    @ApiProperty({ description: 'Tổng tiền hóa đơn', example: 150000 })
    @IsNumber()
    @Min(0)
    totalAmount: number;

    @ApiPropertyOptional({ description: 'Phương thức thanh toán', enum: ['Cash', 'Transfer', 'Card'], default: 'Cash' })
    @IsOptional()
    @IsEnum(['Cash', 'Transfer', 'Card'])
    paymentMethod?: string;

    @ApiPropertyOptional({ description: 'Ghi chú thêm' })
    @IsOptional()
    @IsString()
    note?: string;

    @ApiProperty({ description: 'Danh sách món hàng', type: [CreateInvoiceItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateInvoiceItemDto)
    items: CreateInvoiceItemDto[];
}