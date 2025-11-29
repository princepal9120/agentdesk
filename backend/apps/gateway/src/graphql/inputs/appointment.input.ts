import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateAppointmentInput {
    @Field()
    providerId: string;

    @Field()
    practiceId: string;

    @Field()
    startTime: Date;

    @Field()
    endTime: Date;

    @Field({ nullable: true })
    notes?: string;
}
