import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { BufferMemory } from 'langchain/memory';
import { AppointmentTools } from '../tools/appointment.tools';
import { PrismaService } from '@app/database';

export interface AgentResponse {
    output: string;
    intermediateSteps?: any[];
    toolCalls?: any[];
}

export interface AgentContext {
    conversationId: string;
    practiceId?: string;
    userId?: string;
    metadata?: Record<string, any>;
}

@Injectable()
export class AgentService {
    private readonly logger = new Logger(AgentService.name);
    private llm: ChatOpenAI;
    private agentExecutors: Map<string, AgentExecutor> = new Map();

    constructor(
        private configService: ConfigService,
        private appointmentTools: AppointmentTools,
        private prisma: PrismaService,
    ) {
        this.llm = new ChatOpenAI({
            modelName: this.configService.get<string>('OPENAI_MODEL', 'gpt-4-turbo-preview'),
            temperature: 0.7,
            openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
        });
    }

    async createAgent(context: AgentContext): Promise<AgentExecutor> {
        // Get AI script configuration
        let systemPrompt = this.getDefaultSystemPrompt();

        if (context.practiceId) {
            const aiScript = await this.prisma.aIScript.findFirst({
                where: {
                    practiceId: context.practiceId,
                    isActive: true,
                    isDefault: true,
                },
            });

            if (aiScript) {
                systemPrompt = aiScript.systemPrompt;
            }
        }

        // Create prompt template
        const prompt = ChatPromptTemplate.fromMessages([
            ['system', systemPrompt],
            new MessagesPlaceholder('chat_history'),
            ['human', '{input}'],
            new MessagesPlaceholder('agent_scratchpad'),
        ]);

        // Get tools
        const tools = this.appointmentTools.getAllTools();

        // Create agent
        const agent = await createOpenAIFunctionsAgent({
            llm: this.llm,
            tools,
            prompt,
        });

        // Create memory
        const memory = new BufferMemory({
            memoryKey: 'chat_history',
            returnMessages: true,
        });

        // Create executor
        const executor = new AgentExecutor({
            agent,
            tools,
            memory,
            verbose: this.configService.get<string>('NODE_ENV') === 'development',
            maxIterations: 5,
        });

        // Cache executor
        this.agentExecutors.set(context.conversationId, executor);

        return executor;
    }

    async processMessage(
        conversationId: string,
        message: string,
        context: AgentContext,
    ): Promise<AgentResponse> {
        try {
            // Get or create agent executor
            let executor = this.agentExecutors.get(conversationId);

            if (!executor) {
                executor = await this.createAgent(context);
            }

            // Execute agent
            const result = await executor.invoke({
                input: message,
            });

            this.logger.debug(`Agent response for ${conversationId}:`, result);

            return {
                output: result.output,
                intermediateSteps: result.intermediateSteps,
            };
        } catch (error) {
            this.logger.error('Agent processing error:', error);
            throw error;
        }
    }

    async clearAgentMemory(conversationId: string): Promise<void> {
        this.agentExecutors.delete(conversationId);
    }

    private getDefaultSystemPrompt(): string {
        return `You are a helpful and professional medical office receptionist AI assistant. Your role is to:

1. Greet callers warmly and professionally
2. Help patients schedule, reschedule, or cancel appointments
3. Answer questions about appointment availability
4. Collect necessary patient information (name, phone, email, reason for visit)
5. Confirm appointment details clearly
6. Handle common inquiries about office hours, location, and services

Guidelines:
- Be empathetic, patient, and friendly
- Speak clearly and concisely
- Confirm important details by repeating them back
- If you don't know something, offer to transfer to a staff member
- Protect patient privacy and follow HIPAA guidelines
- For urgent medical issues, advise calling 911 or going to the ER
- Always confirm appointment details before booking

When booking appointments:
1. Ask for the patient's full name
2. Ask for their phone number
3. Ask for their preferred date and time
4. Check availability using the check_availability tool
5. Offer available time slots
6. Confirm the appointment details
7. Book the appointment using the book_appointment tool
8. Provide a confirmation with date, time, and provider

Remember: You are representing a healthcare practice. Maintain professionalism at all times.`;
    }

    async getConversationHistory(conversationId: string): Promise<any[]> {
        const messages = await this.prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'asc' },
        });

        return messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.createdAt,
        }));
    }

    async saveMessage(
        conversationId: string,
        role: 'USER' | 'ASSISTANT' | 'SYSTEM',
        content: string,
        metadata?: any,
    ): Promise<void> {
        await this.prisma.message.create({
            data: {
                conversationId,
                role,
                content,
                metadata,
            },
        });
    }
}
