import { Injectable } from '@nestjs/common';
import { Player } from '../common/entities/player.entity';
import { Prediction } from '../common/entities/prediction.entity';
import { Round } from '../common/entities/round.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMessage } from 'src/common/entities/chat-message.entity';

@Injectable()
export class GameService {
  private multiplier: number = 1;
  private players: Player[] = [];
  private messages: ChatMessage[] = [];
  private rounds: Round[] = [];
  private currentRound: Round | null = null;

  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    @InjectRepository(Prediction)
    private predictionRepository: Repository<Prediction>,
    @InjectRepository(Round)
    private roundRepository: Repository<Round>,
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
  ) {}
  addPlayer(name: string, id: string): Player {
    const player = new Player();
    player.name = name;
    player.id = id;
    player.points = 1000;
    this.players.push(player);
    return player;
  }

  getPlayers(): Player[] {
    return this.players;
  }

  addMessage(content: string, senderId: string): void {
    const player = this.players.find((p) => p.id === senderId);
    if (player) {
      const message = new ChatMessage();
      message.content = content;
      message.timestamp = new Date();
      message.player = player;

      this.messages.push(message);
    }
  }

  getGameState() {
    return {
      players: this.players,
      round: this.currentRound,
    };
  }

  startRound(): void {
    // Start a new round
  }

  makePrediction(playerId: string, prediction: number): void {
    // Handle player prediction
  }

  updateMultiplier(): void {
    // Update multiplier value
  }

  calculatePoints(): void {
    // Calculate points based on predictions
  }

  generateAutoPlayers(): void {
    // Generate auto-players
  }
}
