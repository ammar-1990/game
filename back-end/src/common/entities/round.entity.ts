import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Prediction } from './prediction.entity';

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
}
