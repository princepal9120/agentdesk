import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class User {
    @Field(() => ID)
    id: string;

    @Field()
    email: string;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field({ nullable: true })
    role?: string;
}

@ObjectType()
export class AuthResponse {
    @Field()
    accessToken: string;

    @Field()
    refreshToken: string;

    @Field(() => User)
    user: User;
}
