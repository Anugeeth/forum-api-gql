import { User } from 'src/users/entities/user.entity';
import { CreatePostInput } from './create-post.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class PostResponse extends PartialType(CreatePostInput) {


}
