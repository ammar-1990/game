import { Injectable } from '@nestjs/common';
import { Player } from '../common/entities/player.entity';
import { Prediction } from '../common/entities/prediction.entity';
import { Round } from '../common/entities/round.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMessage } from 'src/common/entities/chat-message.entity';

@Injectable()
export class GameService {
  private sessions: Map<
    string,
    {
      players: Player[];
      messages: ChatMessage[];
      rounds: Round[];
      currentRound: Round | null;
    }
  > = new Map();

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

  createSession(sessionId: string): void {
    this.sessions.set(sessionId, {
      players: [],
      messages: [],
      rounds: [],
      currentRound: null,
    });
  }

  getSession(sessionId: string) {
    return this.sessions.get(sessionId);
  }

  async addPlayer(
    sessionId: string,
    name: string,
    id: string,
  ): Promise<Player> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const player = new Player();
    player.name = name;
    player.id = id;
    player.points = 1000;
    player.round = session.currentRound;
    player.predictions = [];
    session.players.push(player);
    return player;
  }

  async createRound(sessionId: string): Promise<Round> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const round = new Round();
    round.multiplier = 1.0;
    round.active = true;
    round.id = session.rounds.length + 1;
    round.predictions = [];
    session.currentRound = round;
    session.rounds.push(round);
    return round;
  }

  async addVirtualPlayers(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);

    if (!session || session.players.some((p) => p.id.startsWith('Bot'))) return;

    const virtualPlayers = ['Bot1', 'Bot2', 'Bot3', 'Bot4'];
    const greetings = [
      "Hello, I'm ready!",
      "Let's play!",
      'Good luck to everyone!',
      'Hope I win!',
    ];

    for (const name of virtualPlayers) {
      const player = new Player();
      player.name = name;
      player.id = `${name}-${Math.random().toString(36).substr(2, 9)}`;
      player.points = 1000;
      player.round = session.currentRound;
      player.predictions = [];
      session.players.push(player);

      const randomGreeting =
        greetings[Math.floor(Math.random() * greetings.length)];
      this.addMessage(sessionId, player.id, randomGreeting);
    }
  }

  getPlayers(sessionId: string): Player[] {
    const session = this.sessions.get(sessionId);
    return session ? session.players : [];
  }

  addMessage(sessionId: string, playerId: string, content: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const player = session.players.find((p) => p.id === playerId);
    if (player) {
      const message = new ChatMessage();
      message.content = content;
      message.timestamp = new Date();
      message.player = player;
      session.messages.push(message);
    }
  }

  async getPlayerState(sessionId: string, playerId: string) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const player = session.players.find((p) => p.id === playerId);
    if (!player) return null;

    return {
      id: player.id,
      name: player.name,
      points: player.points,
      predictions: player.predictions.map((prediction) => ({
        pointsPlaced: prediction.pointsPlaced,
        predictedMultiplier: prediction.predictedMultiplier,
        roundId: prediction.round.id,
      })),
    };
  }

  async getGameState(sessionId: string) {
    const session = this.sessions.get(sessionId);

    if (!session) return { players: [], rounds: [], messages: [] };

    const activePlayers = session.players.filter(
      (p) => p.round === session.currentRound,
    );

    console.log('players', activePlayers);

    return {
      players: activePlayers,
      rounds: session.rounds,
      messages: session.messages,
    };
  }

  startRound(): void {
    // Start a new round
  }

  async createPrediction(
    sessionId: string,
    playerId: string,
    points: number,
    multiplier: number,
  ): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const player = session.players.find((p) => p.id === playerId);
    if (player && player.points >= points) {
      const prediction = new Prediction();
      prediction.player = player;
      prediction.pointsPlaced = points;
      prediction.predictedMultiplier = multiplier;
      prediction.round = session.currentRound;
      player.predictions.push(prediction);
      session.currentRound?.predictions.push(prediction);

      player.points -= points;
    }
  }

  async createBotPredictions(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const bots = session.players.filter((p) => p.name.startsWith('Bot'));
    for (const bot of bots) {
      let randomPoints;
      if (bot.points <= 10) {
        randomPoints = bot.points; // Use all remaining points if 10 or fewer
      } else {
        randomPoints = Math.min(
          Math.floor(Math.random() * 100) + 1,
          bot.points,
        );
      }

      const randomMultiplier = parseFloat((Math.random() * 5).toFixed(2));

      const prediction = new Prediction();
      prediction.player = bot;
      prediction.pointsPlaced = randomPoints;
      prediction.predictedMultiplier = randomMultiplier;
      prediction.round = session.currentRound;
      bot.predictions.push(prediction);
      session.currentRound?.predictions.push(prediction);

      // Deduct points from bot
      bot.points -= randomPoints;
    }
  }

  evaluateWinners(sessionId, finalMultiplier) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.players.forEach((player) => {
      const lastPrediction = player.predictions[player.predictions.length - 1];

      if (lastPrediction) {
        lastPrediction.win =
          lastPrediction.predictedMultiplier <= finalMultiplier;

        if (lastPrediction.win) {
          player.points =
            player.points +
            lastPrediction.pointsPlaced +
            lastPrediction.pointsPlaced * lastPrediction.predictedMultiplier;
        }
      }
    });
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
