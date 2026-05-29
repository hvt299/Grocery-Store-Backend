import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @ApiOperation({ summary: 'Thêm sản phẩm mới' })
  @ApiResponse({ status: 201, description: 'Đã thêm thành công.' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Cảnh báo hàng sắp hết (Tồn kho < 5)' })
  findLowStock() {
    return this.productsService.findLowStock();
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả sản phẩm (Có phân trang, tìm kiếm)' })
  findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  @Get('upload-signature')
  @ApiOperation({ summary: 'Cấp chữ ký số để upload ảnh lên Cloudinary' })
  getUploadSignature() {
    return this.productsService.getUploadSignature();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin 1 sản phẩm' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật sản phẩm' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa mềm sản phẩm' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}