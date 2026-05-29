import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Product } from '../../products/schemas/product.schema';

export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema({ _id: false })
export class InvoiceItem {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null })
    productId: Product;

    @Prop({ required: true })
    productName: string;

    @Prop()
    unit: string;

    @Prop({ required: true, default: 1 })
    quantity: number;

    @Prop({ required: true })
    price: number;
}
const InvoiceItemSchema = SchemaFactory.createForClass(InvoiceItem);

@Schema({ timestamps: true })
export class Invoice {
    @Prop({ required: true, default: 0 })
    totalAmount: number;

    @Prop({ default: 'Cash', enum: ['Cash', 'Transfer', 'Card'] })
    paymentMethod: string;

    @Prop()
    note: string;

    @Prop({ type: [InvoiceItemSchema], default: [] })
    items: InvoiceItem[];
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);