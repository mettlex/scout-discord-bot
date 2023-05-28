import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

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
}
