import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Player } from './player.entity';
import { Round } from './round.entity';

@Entity()
export class Prediction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  predictedMultiplier: number;

  @Column()
  pointsPlaced: number;

  @ManyToOne(() => Player, (player) => player.predictions)
  player: Player;

  @ManyToOne(() => Round, (round) => round.predictions)
  round: Round;
}
