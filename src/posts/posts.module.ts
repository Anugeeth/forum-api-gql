import { Module } from '@nestjs/common';
import { PostService } from './services/post.service';
import { PostResolver } from './posts.resolver';
import { Post } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from 'src/category/category.module';
import { VoteService } from './services/vote.service';
import { Vote } from './entities/vote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Vote]), CategoryModule],
  providers: [PostResolver, PostService, VoteService],
})
export class PostsModule { }
