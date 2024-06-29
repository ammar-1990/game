import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { Player } from '../common/entities/player.entity';
import { Round } from '../common/entities/round.entity';
import { Prediction } from '../common/entities/prediction.entity';
import { ChatMessage } from '../common/entities/chat-message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Player, Round, Prediction, ChatMessage])],
  providers: [GameGateway, GameService],
})
export class GameModule {}
