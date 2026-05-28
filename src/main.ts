import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Grocery Store API')
    .setDescription(
      'Tài liệu API cho hệ thống quản lý cửa hàng (NestJS + MongoDB)',
    )
    .setVersion('1.0')
    .addTag('Categories', 'Quản lý danh mục')
    .addTag('Products', 'Quản lý kho hàng')
    .addTag('Invoices', 'Quản lý hóa đơn & bán hàng')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3001);

  console.log(
    `Server is running on: http://localhost:${process.env.PORT ?? 3001}`,
  );

  console.log(
    `Swagger Docs available at: http://localhost:${process.env.PORT ?? 3001
    }/api/docs`,
  );
}

bootstrap();
