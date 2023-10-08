import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, FindOptionsWhere, FindOptionsRelations } from 'typeorm';
import { Post } from '../entities/post.entity';
import { UpdatePostInput } from '../dto/update-post.input';


@Injectable()
export class PostService {
  constructor(@InjectRepository(Post) private readonly postRepository: Repository<Post>
  ) { }

  async createPost(title: string, content: string, categoryId: number, authorId: number): Promise<Post> {
    const post = this.postRepository.create({
      title,
      content,
      categoryId,
      authorId
    });

    return this.postRepository.save(post);
  }

  async createComment(title: string, content: string, parentId: number, authorId: number): Promise<Post> {

    const comment = this.postRepository.create({
      title,
      content,
      authorId,
      parentId
    });

    return this.postRepository.save(comment);
  }

  async updatePost(updatePostInput: UpdatePostInput, userId: number): Promise<Post> {
    const post = await this.postRepository.findOneBy({ id: updatePostInput.id });

    if (!post) {
      throw new NotFoundException(`Post with ID ${updatePostInput.id} not found`);
    }

    if (post.authorId !== userId) {
      throw new UnauthorizedException(`You do not have permission to update this post`);
    }

    Object.assign(post, updatePostInput.content);

    return this.postRepository.save(post);
  }

  async findOneById(id: number): Promise<Post | undefined> {
    let post = await this.postRepository.findOne({
      where: {
        id
      },
      relations: {
        comments: true,
        author: true,
        category: true
      }
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post
  }

  async findAll(
    where: FindOptionsWhere<Post> = { parent: IsNull() },
    relations: FindOptionsRelations<Post> = {
      author: true,
      category: true
    }
  ): Promise<Post[]> {
    return this.postRepository.find({
      where,
      relations
    });
  }

  async deletePost(id: number, userId: number): Promise<Post> {
    const post = await this.postRepository.findOneBy({ id });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // if (post.author.id !== userId) {
    //   throw new UnauthorizedException(`You do not have permission to delete this post`);
    // }
    return this.postRepository.remove(post);
  }
}
