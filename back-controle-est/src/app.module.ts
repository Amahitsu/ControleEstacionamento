import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service'; // Importe o DatabaseService

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, DatabaseService], // Adicione DatabaseService aqui
})
export class AppModule {}
