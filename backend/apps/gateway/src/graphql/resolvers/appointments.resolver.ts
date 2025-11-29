import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Inject, UseGuards, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICE_NAMES, CurrentUser } from '@app/common';
import { firstValueFrom } from 'rxjs';
import { Appointment } from '../models/appointment.model';
import { CreateAppointmentInput } from '../inputs/appointment.input';
import { GqlAuthGuard } from '../guards/gql-auth.guard';
import { User } from '../models/auth.model';

@Resolver(() => Appointment)
@UseGuards(GqlAuthGuard)
export class AppointmentsResolver implements OnModuleInit {
    constructor(
        @Inject(SERVICE_NAMES.APPOINTMENTS) private appointmentsClient: ClientProxy,
    ) { }

    onModuleInit() {
        this.appointmentsClient.connect();
    }

    @Query(() => [Appointment])
    async appointments(@CurrentUser() user: User): Promise<Appointment[]> {
        return await firstValueFrom(
            this.appointmentsClient.send('appointments.findAll', { userId: user.id })
        );
    }

    @Query(() => Appointment)
    async appointment(
        @Args('id', { type: () => ID }) id: string,
        @CurrentUser() user: User
    ): Promise<Appointment> {
        return await firstValueFrom(
            this.appointmentsClient.send('appointments.findOne', { id, userId: user.id })
        );
    }

    @Mutation(() => Appointment)
    async createAppointment(
        @Args('input') input: CreateAppointmentInput,
        @CurrentUser() user: User
    ): Promise<Appointment> {
        return await firstValueFrom(
            this.appointmentsClient.send('appointments.create', { ...input, userId: user.id })
        );
    }
}
