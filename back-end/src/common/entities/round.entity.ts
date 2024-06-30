import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Prediction } from './prediction.entity';
import { Player } from './player.entity';

@Entity()
export class Round {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  multiplier: number;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => Prediction, (prediction) => prediction.round)
  predictions: Prediction[];

  @OneToMany(() => Player, (player) => player.round)
  players: Player[];
}
