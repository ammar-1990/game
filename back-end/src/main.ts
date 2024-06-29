import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';
import { ServerOptions } from 'socket.io';

class SocketIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions): any {
    options = {
      ...options,
      cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    };
    const server = super.createIOServer(port, options);
    return server;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new SocketIoAdapter(app));
  await app.listen(4000);
}
bootstrap();
