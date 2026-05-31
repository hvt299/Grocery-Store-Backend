import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice, InvoiceDocument } from './schemas/invoice.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private eventsGateway: EventsGateway,
  ) { }

  async create(createInvoiceDto: any): Promise<Invoice> {
    let totalCost = 0;
    const processedItems: any[] = [];

    for (const item of createInvoiceDto.items) {
      const product = await this.productModel.findById(item.productId);

      if (!product || product.isDeleted) {
        throw new BadRequestException(`Sản phẩm ${item.productName} không tồn tại hoặc đã ngừng bán!`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(`Kho không đủ! ${product.name} chỉ còn ${product.stock} ${product.unit}.`);
      }

      const currentCostPrice = product.costPrice || 0;
      totalCost += currentCostPrice * item.quantity;

      processedItems.push({
        ...item,
        costPrice: currentCostPrice
      });

      product.stock -= item.quantity;
      await product.save();

      this.eventsGateway.emitDataChange('product_changed', product);
    }

    const invoiceData = {
      ...createInvoiceDto,
      items: processedItems,
      totalCost: totalCost,
    };

    const createdInvoice = new this.invoiceModel(invoiceData);
    const result = await createdInvoice.save();

    this.eventsGateway.emitDataChange('invoice_added', result);
    return result;
  }

  async getDashboardAnalytics(): Promise<any> {
    const vnTimeStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" });
    const nowVN = new Date(vnTimeStr);

    const startOfToday = new Date(Date.UTC(nowVN.getFullYear(), nowVN.getMonth(), nowVN.getDate(), -7, 0, 0, 0));
    const startOfMonth = new Date(Date.UTC(nowVN.getFullYear(), nowVN.getMonth(), 1, -7, 0, 0, 0));

    const sevenDaysAgo = new Date(startOfToday);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const thirtyDaysAgo = new Date(startOfToday);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

    const analytics = await this.invoiceModel.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      {
        $facet: {
          today: [
            { $match: { createdAt: { $gte: startOfToday } } },
            { $group: { _id: null, revenue: { $sum: '$totalAmount' }, cost: { $sum: '$totalCost' }, orders: { $sum: 1 } } }
          ],
          month: [
            { $match: { createdAt: { $gte: startOfMonth } } },
            { $group: { _id: null, revenue: { $sum: '$totalAmount' }, cost: { $sum: '$totalCost' }, orders: { $sum: 1 } } }
          ],
          topProducts: [
            { $match: { createdAt: { $gte: startOfMonth } } },
            { $unwind: '$items' },
            {
              $group: {
                _id: '$items.productId',
                name: { $first: '$items.productName' },
                totalQuantity: { $sum: '$items.quantity' },
                totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
              }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 5 }
          ],
          paymentMethods: [
            { $match: { createdAt: { $gte: startOfMonth } } },
            { $group: { _id: '$paymentMethod', count: { $sum: 1 }, total: { $sum: '$totalAmount' } } }
          ],
          weeklyTrend: [
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
              $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: '+07:00' } },
                revenue: { $sum: '$totalAmount' },
                profit: { $sum: { $subtract: ['$totalAmount', '$totalCost'] } }
              }
            },
            { $sort: { _id: 1 } }
          ]
        }
      }
    ]);

    const result = analytics[0];

    const summary = {
      today: result.today[0] || { revenue: 0, cost: 0, orders: 0 },
      month: result.month[0] || { revenue: 0, cost: 0, orders: 0 }
    };
    summary.today.profit = summary.today.revenue - summary.today.cost;
    summary.month.profit = summary.month.revenue - summary.month.cost;

    const soldProductIds = await this.invoiceModel.distinct('items.productId', {
      createdAt: { $gte: thirtyDaysAgo },
      isDeleted: { $ne: true }
    });

    const deadStock = await this.productModel.find({
      _id: { $nin: soldProductIds as any[] },
      stock: { $gt: 0 },
      isDeleted: { $ne: true }
    }).select('name stock price').limit(10).exec();

    return {
      summary,
      topProducts: result.topProducts,
      paymentMethods: result.paymentMethods,
      weeklyTrend: result.weeklyTrend,
      deadStock
    };
  }

  async findAll(query: any = {}): Promise<any> {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const filter: any = { isDeleted: { $ne: true } };

    const [data, total] = await Promise.all([
      this.invoiceModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.invoiceModel.countDocuments(filter)
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findOne(id: string): Promise<Invoice> {
    const invoice = await this.invoiceModel.findOne({ _id: id, isDeleted: { $ne: true } }).exec();
    if (!invoice) throw new NotFoundException(`Không tìm thấy hóa đơn #${id}`);
    return invoice;
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
    const updatedInvoice = await this.invoiceModel
      .findOneAndUpdate({ _id: id, isDeleted: { $ne: true } }, updateInvoiceDto, { returnDocument: 'after' })
      .exec();
    if (!updatedInvoice) throw new NotFoundException(`Không tìm thấy hóa đơn #${id}`);
    this.eventsGateway.emitDataChange('invoice_changed', updatedInvoice);
    return updatedInvoice;
  }

  async remove(id: string): Promise<Invoice> {
    const invoice = await this.invoiceModel.findById(id).exec();
    if (!invoice) throw new NotFoundException(`Không tìm thấy hóa đơn #${id}`);
    if (invoice.isDeleted) throw new BadRequestException(`Hóa đơn này đã bị xóa từ trước!`);

    for (const item of invoice.items) {
      const product = await this.productModel.findById(item.productId);
      if (product) {
        product.stock += item.quantity;
        await product.save();

        this.eventsGateway.emitDataChange('product_changed', product);
      }
    }

    invoice.isDeleted = true;
    await invoice.save();

    this.eventsGateway.emitDataChange('invoice_changed', invoice);
    return invoice;
  }
}