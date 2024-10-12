import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';

@Injectable()
export class AppService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getUsers(): Promise<any> {
    const result = await this.databaseService.query('SELECT * FROM users');
    return result.rows;
  }
}
