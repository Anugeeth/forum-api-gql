import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { Roles } from './roles.entity';

@Entity()
@ObjectType()
export class User {
    @PrimaryGeneratedColumn()
    @Field((type) => Int)
    id: number;

    @Column({ unique: true })
    @Field()
    username: string;

    @Column({})
    password: string;

    @OneToMany(() => Post, (post) => post.author)
    @Field((type) => [Post])
    posts: Post[];

    @ManyToMany(() => Roles )
    @JoinTable({ name: "user_role" })
    @Field((type) => [Roles])
    roles: Roles[];

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    @Field()
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    @Field()
    updated_at: Date;

}
