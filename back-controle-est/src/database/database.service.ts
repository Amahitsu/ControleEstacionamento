import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Client } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private client: Client;

  async onModuleInit() {
    this.client = new Client({
      user: 'default',
      host: 'ep-muddy-surf-a4s805zo-pooler.us-east-1.aws.neon.tech',
      database: 'verceldb', // 
      password: 'HjcnsQC38kfO',
      port: 5432,
      ssl: { rejectUnauthorized: false },           
    });

    await this.client.connect();
    console.log('Conectado ao PostgreSQL!');
  }

  async query(query: string, params?: any[]) {
    return this.client.query(query, params);
  }

  async onModuleDestroy() {
    await this.client.end();
    console.log('Desconectado do PostgreSQL');
  }
}
