import { InputType, Int, Field } from '@nestjs/graphql';
import { Role } from 'src/auth/entities/role.enum';
import { Roles } from '../entities/roles.entity';

@InputType()
export class CreateUserInput {
  // @Field(()=> Int)
  // id: number;

  @Field()
  username: string;

  @Field()
  password : string;

}
