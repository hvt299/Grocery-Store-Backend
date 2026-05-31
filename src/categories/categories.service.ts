import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    private eventsGateway: EventsGateway,
  ) { }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const createdCategory = new this.categoryModel(createCategoryDto);
    const result = await createdCategory.save();
    this.eventsGateway.emitDataChange('category_changed', result);
    return result;
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find({ isDeleted: { $ne: true } }).sort({ name: 1 }).exec();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findOne({ _id: id, isDeleted: { $ne: true } }).exec();
    if (!category) throw new NotFoundException(`Không tìm thấy danh mục #${id}`);
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const updatedCategory = await this.categoryModel
      .findOneAndUpdate({ _id: id, isDeleted: { $ne: true } }, updateCategoryDto, { returnDocument: 'after' })
      .exec();
    if (!updatedCategory) throw new NotFoundException(`Không tìm thấy danh mục #${id}`);
    this.eventsGateway.emitDataChange('category_changed', updatedCategory);
    return updatedCategory;
  }

  async remove(id: string): Promise<Category> {
    const deletedCategory = await this.categoryModel
      .findByIdAndUpdate(id, { isDeleted: true }, { returnDocument: 'after' })
      .exec();
    if (!deletedCategory) throw new NotFoundException(`Không tìm thấy danh mục #${id}`);
    this.eventsGateway.emitDataChange('category_changed', deletedCategory);
    return deletedCategory;
  }
}