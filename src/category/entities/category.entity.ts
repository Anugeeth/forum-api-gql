import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Post } from '../../posts/entities/post.entity';

@ObjectType({description : "category entity"})
@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    @Field((type) => Int)
    id: number;

    @Column({ unique: true })
    @Field()
    name: string;

    @OneToMany(() => Post, (post) => post.category)
    @Field((type) => [Post])
    posts: Post[];

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    @Field()
    created_at: Date;
}
