import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Prediction } from './prediction.entity';
import { ChatMessage } from './chat-message.entity';

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column({ default: 0 })
  points: number;

  @OneToMany(() => Prediction, (prediction) => prediction.player)
  predictions: Prediction[];

  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.player)
  chatMessages: ChatMessage[];
}
