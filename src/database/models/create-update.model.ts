import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class CreateUpdateModel {
  @CreateDateColumn({ type: 'timestamp', precision: 0 })
  created: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 0 })
  updated: Date;
}
