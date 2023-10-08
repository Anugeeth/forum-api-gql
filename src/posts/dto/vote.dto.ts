import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class UpvoteDto {
    @Field(() => Int)
    postId: number;
}


@InputType()
export class DownvoteDto {
    @Field(() => Int)
    postId: number;
}
