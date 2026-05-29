import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Category } from '../../categories/schemas/category.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null })
    categoryId: Category;

    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ default: 'Cái' })
    unit: string;

    @Prop({ default: 0 })
    price: number;

    @Prop({ default: 0 })
    costPrice: number;

    @Prop({ default: 0 })
    stock: number;

    @Prop({ default: null })
    imageUrl: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);