import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LoginInput {
    @Field()
    email: string;

    @Field()
    password: string;
}

@InputType()
export class SignupInput {
    @Field()
    email: string;

    @Field()
    password: string;

    @Field()
    firstName: string;

    @Field()
    lastName: string;
}
