import { InputType, Field, Int } from "@nestjs/graphql";
import { Role } from "../entities/role.enum";



@InputType()
export class SetroleInput {
  @Field(() => Int)
  id: number;

  @Field()
  role: Role;
}