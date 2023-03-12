import { Controller, Get, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Admin } from '@nestjs/microservices/external/kafka.interface';
import { Kafka } from 'kafkajs';
import { fibonacci } from './util';

@Controller()
export class AppController {
  private admin: Admin;
  constructor(@Inject('FIBO_SERVICE') private client: ClientKafka) {}

  @Get('/fibonacci')
  async getFibo() {
    return fibonacci(40);
  }

  private getFiboResult() {
    return new Promise((resolve) => {
      this.client
        .send('fibo', JSON.stringify({ num: 40 }))
        .subscribe((result: number) => {
          console.log('>>>>>>>>>>>>>>>>>>>>>>>>', result);
          resolve(result);
        });
    });
  }

  @Get('/microservice-fibonacci')
  async getFibonacci() {
    const fibo = await this.getFiboResult();
    return fibo;
  }

  async onModuleInit() {
    this.client.subscribeToResponseOf('fibo');
    const kafka = new Kafka({
      clientId: 'my-app',
      brokers: ['localhost:9092'],
    });
    this.admin = kafka.admin();
    const topics = await this.admin.listTopics();

    const topicList = [];
    if (!topics.includes('fibo')) {
      topicList.push({
        topic: 'fibo',
        numPartitions: 10,
        replicationFactor: 1,
      });
    }

    if (!topics.includes('fibo.reply')) {
      topicList.push({
        topic: 'fibo.reply',
        numPartitions: 10,
        replicationFactor: 1,
      });
    }

    if (topicList.length) {
      await this.admin.createTopics({
        topics: topicList,
      });
    }
  }
}
