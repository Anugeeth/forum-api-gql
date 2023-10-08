import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreatePostInput {

    @IsNotEmpty({ message: 'Title should not be empty' })
    @IsString({ message: 'Title should be a string' })
    @MaxLength(255, { message: 'Title should not exceed 255 characters' })  
    @Field()
    title: string;

    @IsNotEmpty({ message: 'Content should not be empty' })
    @IsString({ message: 'Content should be a string' })
    @Field()
    content: string;

    @Field((type) => Int)
    categoryId: number;
}


@InputType()
export class CreatePostCommentInput extends PartialType(CreatePostInput){
    @Field()
    title: string;

    @Field()
    content: string;

    @Field((type) => Int)
    parentId: number;
}


