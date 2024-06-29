import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Player } from './player.entity';

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  timestamp: Date;

  @ManyToOne(() => Player, (player) => player.chatMessages)
  player: Player;
}
