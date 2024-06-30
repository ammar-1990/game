import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';

const simplifyGameState = (gameState) => {
  return {
    players: gameState.players.map((player) => {
      const finalPrediction =
        player.predictions.length > 0
          ? player.predictions[player.predictions.length - 1]
          : null;

      return {
        id: player.id,
        name: player.name,
        points: player.points,
        prediction: finalPrediction
          ? {
              pointsPlaced: finalPrediction.pointsPlaced,
              predictedMultiplier: finalPrediction.predictedMultiplier,
              roundId: finalPrediction.round.id,
            }
          : null,
      };
    }),
    rounds: gameState.rounds.map((round) => ({
      id: round.id,
      multiplier: round.multiplier,
      active: round.active,
    })),
    messages: gameState.messages.map((message) => ({
      content: message.content,
      player: {
        id: message.player.id,
        name: message.player.name,
      },
      timestamp: message.timestamp,
    })),
  };
};
@WebSocketGateway()
export class GameGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly gameService: GameService) {}

  @SubscribeMessage('joinGame')
  async handleJoinGame(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const sessionId = client.id;
    this.gameService.createSession(sessionId);
    client.join(sessionId);

    // Create round
    await this.gameService.createRound(sessionId);

    // Create user
    const player = await this.gameService.addPlayer(
      sessionId,
      data.name,
      client.id,
    );

    // Create bots
    await this.gameService.addVirtualPlayers(sessionId);

    client.emit('joinSuccess', JSON.stringify(player));
    client.emit('playerJoined', JSON.stringify(data));
    const updatedData = await this.gameService.getGameState(sessionId);
    client.emit('gameUpdate', JSON.stringify(updatedData));
  }

  @SubscribeMessage('makePrediction')
  async handleMakePrediction(
    @MessageBody() data: { points: number; multiplier: number; speed: number },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const sessionId = client.id;

    // Create prediction for the user
    await this.gameService.createPrediction(
      sessionId,
      client.id,
      data.points,
      data.multiplier,
    );

    // Create fake predictions for bots
    await this.gameService.createBotPredictions(sessionId);

    // Emit updated game state
    const newState = await this.gameService.getGameState(sessionId);
    // Create prediction for the user

    // Get updated player state
    const playerState = await this.gameService.getPlayerState(
      sessionId,
      client.id,
    );

    //update user state
    client.emit('playerUpdate', JSON.stringify(playerState));
    this.server.to(sessionId).emit('putPrediction', {
      players: newState.players.map((p) => {
        const finalPrediction =
          p.predictions.length > 0
            ? p.predictions[p.predictions.length - 1]
            : null;

        return {
          id: p.id,
          name: p.name,
          points: p.points,
          prediction: finalPrediction
            ? {
                pointsPlaced: finalPrediction.pointsPlaced,
                predictedMultiplier: finalPrediction.predictedMultiplier,
                roundId: finalPrediction.round.id,
              }
            : null,
        };
      }),
    });

    const finalMultiplier = Math.random() * 5; // Generate random multiplier between 0 and 5
    let currentMultiplier = 0;

    // Simulate multiplier increment
    const interval = setInterval(async () => {
      currentMultiplier += 0.01;
      this.server
        .to(sessionId)
        .emit('multiplierUpdate', JSON.stringify(currentMultiplier));

      if (currentMultiplier >= finalMultiplier) {
        clearInterval(interval);

        // Evaluate winners
        this.gameService.evaluateWinners(sessionId, finalMultiplier);

        // Emit final results
        const newState = await this.gameService.getGameState(sessionId);

        // Get updated player state
        const playerState = await this.gameService.getPlayerState(
          sessionId,
          client.id,
        );
        client.emit('playerUpdate', playerState);
        this.server.to(sessionId).emit('roundEnd', simplifyGameState(newState));
      }
    }, 50 / data.speed);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ): void {
    const sessionId = client.id;

    const player = this.gameService
      .getPlayers(sessionId)
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
      this.server
        .to(sessionId)
        .emit('chatMessage', JSON.stringify(chatMessage));
    }
  }
}
