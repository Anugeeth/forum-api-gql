import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';

@ObjectType({ description: "Post object" })
@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    @Field((type) => Int)
    id: number;

    @Column()
    @Field()
    title: string;

    @Column('text')
    @Field()
    content: string;

    @Column({ default: 0 })
    @Field((type) => Int)
    upvotes?: number;

    @Column({ default: 0 })
    @Field((type) => Int)
    downvotes?: number;


    @ManyToOne(() => User, (user) => user.posts)
    @Field((type) => User)
    author: User;

    @Column()
    authorId: number


    @ManyToOne(() => Category, (category) => category.posts)
    @Field((type) => Category)
    category: Category;

    @Column({ nullable: true })
    categoryId: number


    @OneToMany(() => Post, (comment) => comment.parent, { cascade: true })
    @JoinColumn({ name: 'parentId' })
    @Field((type) => [Post])
    comments: Post[];

    @ManyToOne(() => Post, (parent) => parent.comments, { onDelete: 'CASCADE' })
    @Field((type) => Post, { nullable: true })
    parent: Post;

    @Column({ nullable: true })
    parentId: number


    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    @Field()
    created_at: Date;


    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    @Field()
    updated_at: Date;

}
