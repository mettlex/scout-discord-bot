import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryColumn({
    type: "varchar",
    nullable: false,
  })
  discordId: string;

  @Column({
    type: "boolean",
    nullable: false,
    default: false,
  })
  isEligible: boolean;

  @Column({
    type: "double",
    nullable: false,
    default: 0,
  })
  walletBalance: number;

  @CreateDateColumn({ nullable: true, default: null })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true, default: null })
  updatedAt: Date;
}
