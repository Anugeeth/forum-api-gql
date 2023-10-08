import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent, Subscription } from '@nestjs/graphql';
import { Post } from './entities/post.entity';
import { PostService } from './services/post.service';
import { CreatePostCommentInput, CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { CurrentUser } from 'src/users/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { VoteService } from './services/vote.service';
import { DownvoteDto, UpvoteDto } from './dto/vote.dto';
import { VoteType } from './entities/vote.entity';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/entities/role.enum';
import { PubSub } from 'graphql-subscriptions';
import { RedisService } from '@songkeys/nestjs-redis';
import Redis from 'ioredis';


const pubSub = new PubSub();


@Resolver((of) => Post)
export class PostResolver {

  private readonly redis: Redis;

  constructor(
    private readonly postService: PostService,
    private readonly voteService: VoteService,
    private readonly redisService: RedisService,

  ) {
    this.redis = this.redisService.getClient();
  }


  // Query to retrieve a single post by ID

  @Roles(Role.ADMIN, Role.USER)
  @Query(returns => Post, { name: 'getPost' })
  async getPost(@Args('id', { type: () => ID }) id: string): Promise<Post> {

    const cacheKey = `post:${id}`;
    const cachedPost = await this.redis.get(cacheKey);

    if (cachedPost) {
      console.log("from cache")
      return JSON.parse(cachedPost)
    }

    let post = await this.postService.findOneById(Number(id));
    if (post) {
      await this.redis.setex(cacheKey, 60, JSON.stringify(post));
    }

    return post
  }

  // Query to retrieve a list of all posts

  @Roles(Role.ADMIN, Role.USER)
  @Query(returns => [Post], { name: 'getPosts' })
  async getPosts(): Promise<Post[]> {
    return this.postService.findAll();
  }

  // Mutation to create a new post

  @Roles(Role.ADMIN, Role.USER)
  @Mutation(returns => Post, { name: 'createPost' })
  async createPost(@CurrentUser() user: User, @Args('input') input: CreatePostInput): Promise<Post> {
    return this.postService.createPost(input.title, input.content, input.categoryId, user.id);
  }

  // Mutation to create a new comment on a post

  @Roles(Role.ADMIN, Role.USER)
  @Mutation(returns => Post, { name: 'createComment' })
  async createComment(@CurrentUser() user: User, @Args('input') input: CreatePostCommentInput): Promise<Post> {

    let comment = await this.postService.createComment(input.title, input.content, input.parentId, user.id);
    let post = await this.postService.findOneById(input.parentId)
    pubSub.publish('listenComments', { post });

    return comment;
  }

  // Mutation to update an existing post

  @Roles(Role.USER)
  @Mutation(returns => Post, { name: 'updatePost' })
  async updatePost(@CurrentUser() user: User, @Args('input') input: UpdatePostInput): Promise<Post> {
    return this.postService.updatePost(input , user.id);
  }

  // Mutation to delete a post (Admin role required)

  @Roles(Role.ADMIN)
  @Mutation(returns => Boolean, { name: 'deletePost' })
  async deletePost(@CurrentUser() user: User, @Args('id', { type: () => ID }) id: number): Promise<Post> {
    return this.postService.deletePost(id, user.id);
  }

  // Mutation to upvote a post

  @Roles(Role.ADMIN, Role.USER)
  @Mutation(() => Post)
  async upvote(@CurrentUser() _user: User, @Args('upvoteInput') input: UpvoteDto): Promise<Post> {
    return this.voteService.votePost(input.postId, _user.id, VoteType.Upvote);
  }

  // Mutation to downvote a post

  @Roles(Role.ADMIN, Role.USER)
  @Mutation(() => Post)
  async downvote(@CurrentUser() user: User, @Args('downvoteInput') input: DownvoteDto): Promise<Post> {
    return this.voteService.votePost(input.postId, user.id, VoteType.Downvote);
  }

  // Resolver field to fetch comments associated with a post

  @ResolveField(returns => Post, { name: 'comments' })
  async comments(@Parent() post: Post): Promise<Post[]> {
    let options = {
      parentId: post.id
    };
    let relations = {
      author: true
    };
    return this.postService.findAll(options, relations)
  }

  // GraphQL subscription to listen for new comments on a post

  @Roles(Role.ADMIN, Role.USER)
  @Subscription((returns) => Post, {
    resolve: value => value.post,
    filter: (payload, variables) => payload.post.id == variables.postId
  })
  listenComment(@Args('postId', { type: () => ID }) postId: number) {
    return pubSub.asyncIterator('listenComments');
  }
}
