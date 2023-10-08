import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn , Unique } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Post } from './post.entity';

export enum VoteType {
    Upvote = 'upvote',
    Downvote = 'downvote',
}

@Entity()
@Unique(["postId", "userId"])
export class Vote {

    @PrimaryGeneratedColumn() 
    id: number;

    @Column({ type: 'enum', enum: VoteType })
    type: VoteType;

    @ManyToOne(() => User)
    user: User;

    @Column()
    userId: number

    @ManyToOne(() => Post)
    post: Post;

    @Column()
    postId: number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at: Date;

}
