import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdatePostInput {

    @Field(() => ID)
    id: number

    @Field()
    content: string
}
