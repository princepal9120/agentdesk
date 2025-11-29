import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICE_NAMES } from '@app/common';
import { firstValueFrom } from 'rxjs';
import { AuthResponse, User } from '../models/auth.model';
import { LoginInput, SignupInput } from '../inputs/auth.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../guards/gql-auth.guard';
import { CurrentUser } from '@app/common';

@Resolver(() => User)
export class AuthResolver implements OnModuleInit {
    constructor(
        @Inject(SERVICE_NAMES.AUTH) private authClient: ClientProxy,
    ) { }

    onModuleInit() {
        this.authClient.connect();
    }

    @Mutation(() => AuthResponse)
    async login(@Args('input') input: LoginInput): Promise<AuthResponse> {
        return await firstValueFrom(
            this.authClient.send('auth.login', input)
        );
    }

    @Mutation(() => AuthResponse)
    async signup(@Args('input') input: SignupInput): Promise<AuthResponse> {
        return await firstValueFrom(
            this.authClient.send('auth.signup', input)
        );
    }

    @Query(() => User)
    @UseGuards(GqlAuthGuard)
    async me(@CurrentUser() user: User): Promise<User> {
        return user;
    }
}
