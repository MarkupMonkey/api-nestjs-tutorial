import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe(
    //può eliminare ciò che non vogliamo venga inserito(dati indesiderati)   
    //eliminando i dati che non sono definiti nel nostro DTO
    { whitelist: true, }
  ));
  await app.listen(3333);
}
bootstrap();
