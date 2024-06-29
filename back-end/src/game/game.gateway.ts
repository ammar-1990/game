import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway()
export class GameGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly gameService: GameService) {}

  @SubscribeMessage('joinGame')
  handleJoinGame(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): void {
    client.join('gameRoom');
    console.log('joined', data);
    const player = this.gameService.addPlayer(data.name, client.id);

    client.emit('joinSuccess', { player });
    this.server.to('gameRoom').emit('playerJoined', data);
    this.server
      .to('gameRoom')
      .emit('gameUpdate', this.gameService.getGameState());
  }

  @SubscribeMessage('makePrediction')
  handleMakePrediction(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): void {
    this.server.to('gameRoom').emit('predictionMade', data);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ): void {
    console.log('message', message);
    const player = this.gameService
      .getPlayers()
      .find((p) => p.id === client.id);
    if (player) {
      const chatMessage = {
        content: message,
        player: {
          id: player.id,
          name: player.name,
          points: player.points,
        },
        timestamp: new Date(),
      };
      this.server.to('gameRoom').emit('chatMessage', chatMessage);
    }
  }
}
