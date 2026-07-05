import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

@ApiTags('products')
@ApiBearerAuth()
@UseGuards(PermissionsGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Permissions('products.create')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `product-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  create(@Body() createDto: any, @UploadedFile() file?: Express.Multer.File) {
    const dto = this.mapAndValidateProductDto(createDto, file);
    return this.productsService.create(dto);
  }

  @Get()
  @Permissions('products.read')
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('isActive') isActive?: string,
    @Query('lowStock') lowStock?: string,
  ) {
    return this.productsService.findAll({ page, limit, search, category, isActive, lowStock });
  }

  @Get(':id')
  @Permissions('products.read')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @Permissions('products.update')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `product-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  update(@Param('id') id: string, @Body() updateDto: any, @UploadedFile() file?: Express.Multer.File) {
    const dto = this.mapAndValidateProductDto(updateDto, file);
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('products.delete')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  private mapAndValidateProductDto(body: any, file?: Express.Multer.File): any {
    const dto: any = { ...body };
    if (file) {
      dto.image = `uploads/${file.filename}`;
    } else if (!dto.image) {
      dto.image = 'uploads/placeholder.png';
    }

    if (body.unitPrice !== undefined) {
      dto.sellingPrice = Number(body.unitPrice);
    }

    if (body.stockQuantity !== undefined) {
      dto.stockQuantity = Number(body.stockQuantity);
    }

    if (body.purchasePrice !== undefined) {
      dto.purchasePrice = Number(body.purchasePrice);
    } else {
      dto.purchasePrice = dto.purchasePrice || 0;
    }

    // Convert isActive if it's sent as a string from FormData
    if (body.isActive !== undefined) {
      dto.isActive = body.isActive === 'true' || body.isActive === true;
    }

    return dto;
  }
}
