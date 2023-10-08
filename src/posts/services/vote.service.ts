import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { Vote, VoteType } from '../entities/vote.entity';


/*

Injected the repositories (instead of injecting services to the controller) here 
as the external repositories(post) are required (to be updated)

*/


@Injectable()
export class VoteService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(Vote)
        private readonly voteRepository: Repository<Vote>,
    ) { }

    async votePost(postId: number, userId: number, voteType: VoteType): Promise<Post> {
        const post = await this.postRepository.findOneBy({ id: postId });

        if (!post) {
            throw new NotFoundException(`Post not found`);
        }

        let existingVote = await this.voteRepository.findOne({
            where: { postId , userId },
            relations: {
                post: true,
                user: true
            }
        });

        if (existingVote) {

            if (existingVote.type === VoteType.Upvote && voteType === VoteType.Downvote) {
                post.upvotes--;
                await this.voteRepository.remove(existingVote);

            }
            else if (existingVote.type === VoteType.Downvote && voteType === VoteType.Upvote) {

                post.downvotes--;
                existingVote.type = VoteType.Upvote;
                await this.voteRepository.save(existingVote);
                post.upvotes++;

            }
            else if (existingVote.type === VoteType.Upvote && voteType === VoteType.Upvote) {

                post.upvotes--;
                await this.voteRepository.remove(existingVote);

            }
            else if (existingVote.type === VoteType.Downvote && voteType === VoteType.Downvote) {

                post.downvotes--;
                await this.voteRepository.remove(existingVote);
            }
        } else {

            if (voteType === VoteType.Upvote) {
                post.upvotes++;
            } else {
                post.downvotes++;
            }
            const newVote = this.voteRepository.create({ userId, postId, type: voteType });
            await this.voteRepository.save(newVote);
        }

        return this.postRepository.save(post);
    }
}
