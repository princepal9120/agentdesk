import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Appointment {
    @Field(() => ID)
    id: string;

    @Field()
    userId: string;

    @Field()
    providerId: string;

    @Field()
    practiceId: string;

    @Field()
    startTime: Date;

    @Field()
    endTime: Date;

    @Field()
    status: string;

    @Field({ nullable: true })
    notes?: string;
}
