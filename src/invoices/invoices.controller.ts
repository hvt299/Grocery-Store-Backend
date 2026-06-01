import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@ApiTags('Invoices')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) { }

  @Post()
  @ApiOperation({ summary: 'Chốt đơn (Tạo hóa đơn mới)' })
  @ApiResponse({ status: 201, description: 'Đã tạo hóa đơn thành công.' })
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.create(createInvoiceDto);
  }

  @Get('dashboard/analytics')
  @ApiOperation({ summary: 'Lấy toàn bộ chỉ số Thống kê cho Dashboard' })
  getDashboardAnalytics() {
    return this.invoicesService.getDashboardAnalytics();
  }

  @Get()
  @ApiOperation({ summary: 'Lấy lịch sử tất cả hóa đơn (Có phân trang)' })
  findAll(@Query() query: any) {
    return this.invoicesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết 1 hóa đơn' })
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật hóa đơn (Hạn chế dùng)' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công.' })
  update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoicesService.update(id, updateInvoiceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa mềm hóa đơn và hoàn tồn kho' })
  @ApiResponse({ status: 200, description: 'Xóa và hoàn kho thành công.' })
  remove(@Param('id') id: string) {
    return this.invoicesService.remove(id);
  }
}