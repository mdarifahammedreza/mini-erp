import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Sale } from './schemas/sale.schema';
import { Product } from '../products/schemas/product.schema';
import { Customer } from '../customers/schemas/customer.schema';
import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()
export class SalesService {
  constructor(
    @InjectModel(Sale.name) private readonly saleModel: Model<Sale>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(Customer.name) private readonly customerModel: Model<Customer>,
    @InjectConnection() private readonly connection: Connection,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createDto: CreateSaleDto, userId: string): Promise<Sale> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const customer = await this.customerModel.findById(createDto.customer).session(session).exec();
      if (!customer || !customer.isActive) {
        throw new BadRequestException('Customer not found or inactive');
      }

      const saleItems = [];
      let grandTotal = 0;

      for (const item of createDto.items) {
        const product = await this.productModel.findById(item.product).session(session).exec();
        if (!product || !product.isActive) {
          throw new BadRequestException(`Product with ID ${item.product} not found or inactive`);
        }

        if (product.stockQuantity < item.quantity) {
          throw new BadRequestException(`Insufficient stock for product: ${product.name}. Requested: ${item.quantity}, Available: ${product.stockQuantity}`);
        }

        const lineTotal = product.sellingPrice * item.quantity;
        grandTotal += lineTotal;

        saleItems.push({
          product: product._id,
          productName: product.name,
          productSku: product.sku,
          unitPrice: product.sellingPrice,
          quantity: item.quantity,
          lineTotal,
        });
      }

      for (const item of createDto.items) {
        const updatedProduct = await this.productModel.findByIdAndUpdate(
          item.product,
          { $inc: { stockQuantity: -item.quantity } },
          { new: true, session },
        ).exec();

        if (updatedProduct && updatedProduct.stockQuantity < 5) {
          this.eventEmitter.emit('stock.low', {
            productId: updatedProduct._id.toString(),
            sku: updatedProduct.sku,
            name: updatedProduct.name,
            stockQuantity: updatedProduct.stockQuantity,
          });
        }
      }

      const invoiceNumber = await this.generateInvoiceNumber(session);
      const saleDate = createDto.saleDate ? new Date(createDto.saleDate) : new Date();

      const newSaleDocs = await this.saleModel.create(
        [
          {
            invoiceNumber,
            customer: customer._id as any,
            createdBy: userId as any,
            items: saleItems,
            grandTotal,
            notes: createDto.notes || '',
            saleDate,
          },
        ],
        { session },
      );
      const newSale = newSaleDocs[0] as any;

      await session.commitTransaction();

      const populatedSale = await this.findOne(newSale._id.toString());
      this.eventEmitter.emit('sale.created', populatedSale);

      return populatedSale;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async findAll(queryOptions: any = {}): Promise<any> {
    const { page = 1, limit = 10, search, customer, createdBy, startDate, endDate } = queryOptions;
    const filter: Record<string, any> = {};

    if (search) {
      filter.$or = [
        { invoiceNumber: new RegExp(search, 'i') },
        { notes: new RegExp(search, 'i') },
      ];
    }

    if (customer) {
      filter.customer = customer;
    }

    if (createdBy) {
      filter.createdBy = createdBy;
    }

    if (startDate || endDate) {
      filter.saleDate = {};
      if (startDate) {
        filter.saleDate.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.saleDate.$lte = new Date(endDate);
      }
    }

    return (this.saleModel as any).paginate({
      filter,
      page: Number(page),
      limit: Number(limit),
      populate: ['customer', 'createdBy'],
      sort: '-saleDate',
    });
  }

  async findOne(id: string): Promise<Sale> {
    const sale = await this.saleModel.findById(id).populate(['customer', 'createdBy']).exec();
    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }
    return sale;
  }

  async remove(id: string): Promise<Sale> {
    const sale = await this.saleModel.findById(id).exec();
    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }
    await (sale as any).softDelete();
    return sale;
  }

  private async generateInvoiceNumber(session: any): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const count = await this.saleModel.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    }).session(session).exec();

    const sequentialStr = String(count + 1).padStart(4, '0');
    return `INV-${dateStr}-${sequentialStr}`;
  }
}
