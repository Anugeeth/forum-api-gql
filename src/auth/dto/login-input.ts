import { InputType, Field } from "@nestjs/graphql";
import { IsUsername } from "../validators/username.validator";
import { IsPassword } from "../validators/password.validator";



@InputType()
export class LoginInput {
    @IsUsername()
    @Field()
    username: string;

    @IsPassword()
    @Field()
    password: string;
}