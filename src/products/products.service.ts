import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schemas/product.schema';
import { EventsGateway } from '../events/events.gateway';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private eventsGateway: EventsGateway,
  ) { }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    const result = await createdProduct.save();
    this.eventsGateway.emitDataChange('product_changed', result);
    return result;
  }

  async findAll(query: any = {}): Promise<any> {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 50;
    const skip = (page - 1) * limit;

    const filter: any = { isDeleted: { $ne: true } };

    if (query.search) {
      filter.name = { $regex: query.search, $options: 'i' };
    }

    if (query.categoryId) {
      filter.categoryId = query.categoryId;
    }

    const [data, total] = await Promise.all([
      this.productModel
        .find(filter)
        .populate('categoryId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.productModel.countDocuments(filter)
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findLowStock(): Promise<Product[]> {
    return this.productModel
      .find({ isDeleted: { $ne: true }, stock: { $lt: 5 } })
      .populate('categoryId', 'name')
      .sort({ stock: 1 })
      .exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel
      .findOne({ _id: id, isDeleted: { $ne: true } })
      .populate('categoryId', 'name')
      .exec();
    if (!product) throw new NotFoundException(`Không tìm thấy sản phẩm #${id}`);
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const updatedProduct = await this.productModel
      .findOneAndUpdate({ _id: id, isDeleted: { $ne: true } }, updateProductDto, { new: true })
      .exec();
    if (!updatedProduct) throw new NotFoundException(`Không tìm thấy sản phẩm #${id}`);
    this.eventsGateway.emitDataChange('product_changed', updatedProduct);
    return updatedProduct;
  }

  async remove(id: string): Promise<Product> {
    const deletedProduct = await this.productModel
      .findByIdAndUpdate(id, { isDeleted: true }, { new: true })
      .exec();
    if (!deletedProduct) throw new NotFoundException(`Không tìm thấy sản phẩm #${id}`);
    this.eventsGateway.emitDataChange('product_changed', deletedProduct);
    return deletedProduct;
  }

  getUploadSignature() {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Thiếu cấu hình Cloudinary trong file .env của Backend!');
    }

    const signature = cloudinary.utils.api_sign_request(
      { timestamp },
      apiSecret
    );

    return {
      timestamp,
      signature,
      apiKey,
      cloudName
    };
  }
}