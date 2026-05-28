import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true, trim: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop({ default: 'CASHIER', enum: ['ADMIN', 'CASHIER'] })
    role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);