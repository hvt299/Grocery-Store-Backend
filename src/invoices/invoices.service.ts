import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice, InvoiceDocument } from './schemas/invoice.schema';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    private eventsGateway: EventsGateway,
  ) { }

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const createdInvoice = new this.invoiceModel(createInvoiceDto);
    const result = await createdInvoice.save();

    this.eventsGateway.emitDataChange('invoice_added', result);
    return result;
  }

  async findAll(): Promise<Invoice[]> {
    return this.invoiceModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Invoice> {
    const invoice = await this.invoiceModel.findById(id).exec();
    if (!invoice) throw new NotFoundException(`Không tìm thấy hóa đơn #${id}`);
    return invoice;
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
    const updatedInvoice = await this.invoiceModel
      .findByIdAndUpdate(id, updateInvoiceDto, { new: true })
      .exec();
    if (!updatedInvoice) throw new NotFoundException(`Không tìm thấy hóa đơn #${id}`);

    this.eventsGateway.emitDataChange('invoice_changed', updatedInvoice);
    return updatedInvoice;
  }

  async remove(id: string): Promise<Invoice> {
    const deletedInvoice = await this.invoiceModel.findByIdAndDelete(id).exec();
    if (!deletedInvoice) throw new NotFoundException(`Không tìm thấy hóa đơn #${id}`);

    this.eventsGateway.emitDataChange('invoice_changed', deletedInvoice);
    return deletedInvoice;
  }
}