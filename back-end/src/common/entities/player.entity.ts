import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Prediction } from './prediction.entity';
import { ChatMessage } from './chat-message.entity';
import { Round } from './round.entity';

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column({ default: 0 })
  points: number;

  @ManyToOne(() => Round, (round) => round.players)
  round: Round;

  @OneToMany(() => Prediction, (prediction) => prediction.player)
  predictions: Prediction[];

  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.player)
  chatMessages: ChatMessage[];
}
