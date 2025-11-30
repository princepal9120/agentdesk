// WebSocket client for real-time updates

import { io, Socket } from 'socket.io-client';
import type { WebSocketEventPayload } from '@/types/models';
import {
    WS_URL,
    WS_RECONNECTION_ATTEMPTS,
    WS_RECONNECTION_DELAY,
} from '../utils/constants';

type EventCallback = (data: any) => void;

class WebSocketClient {
    private socket: Socket | null = null;
    private eventCallbacks: Map<string, Set<EventCallback>> = new Map();
    private isConnected = false;

    /**
     * Connect to WebSocket server
     */
    connect(token: string): void {
        if (this.socket?.connected) {
            console.log('WebSocket already connected');
            return;
        }

        this.socket = io(WS_URL, {
            auth: {
                token,
            },
            reconnection: true,
            reconnectionDelay: WS_RECONNECTION_DELAY,
            reconnectionAttempts: WS_RECONNECTION_ATTEMPTS,
            transports: ['websocket', 'polling'],
        });

        this.setupEventListeners();
    }

    /**
     * Setup default event listeners
     */
    private setupEventListeners(): void {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('WebSocket connected');
            this.isConnected = true;
        });

        this.socket.on('disconnect', (reason) => {
            console.log('WebSocket disconnected:', reason);
            this.isConnected = false;
        });

        this.socket.on('error', (error) => {
            console.error('WebSocket error:', error);
        });

        this.socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
        });

        // Listen for all appointment events
        this.socket.on('appointment:created', (data) => {
            this.emit('appointment:created', data);
        });

        this.socket.on('appointment:updated', (data) => {
            this.emit('appointment:updated', data);
        });

        this.socket.on('appointment:cancelled', (data) => {
            this.emit('appointment:cancelled', data);
        });

        // Listen for all call events
        this.socket.on('call:incoming', (data) => {
            this.emit('call:incoming', data);
        });

        this.socket.on('call:completed', (data) => {
            this.emit('call:completed', data);
        });
    }

    /**
     * Subscribe to an event
     */
    on(event: string, callback: EventCallback): () => void {
        if (!this.eventCallbacks.has(event)) {
            this.eventCallbacks.set(event, new Set());
        }

        this.eventCallbacks.get(event)!.add(callback);

        // Return unsubscribe function
        return () => {
            this.off(event, callback);
        };
    }

    /**
     * Unsubscribe from an event
     */
    off(event: string, callback?: EventCallback): void {
        if (!callback) {
            // Remove all callbacks for this event
            this.eventCallbacks.delete(event);
            return;
        }

        const callbacks = this.eventCallbacks.get(event);
        if (callbacks) {
            callbacks.delete(callback);
            if (callbacks.size === 0) {
                this.eventCallbacks.delete(event);
            }
        }
    }

    /**
     * Emit event to all subscribed callbacks
     */
    private emit(event: string, data: any): void {
        const callbacks = this.eventCallbacks.get(event);
        if (callbacks) {
            callbacks.forEach((callback) => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in WebSocket callback for ${event}:`, error);
                }
            });
        }
    }

    /**
     * Send message to server
     */
    send(event: string, data: any): void {
        if (!this.socket || !this.isConnected) {
            console.warn('WebSocket not connected, cannot send message');
            return;
        }

        this.socket.emit(event, data);
    }

    /**
     * Disconnect from WebSocket server
     */
    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
            this.eventCallbacks.clear();
            console.log('WebSocket disconnected');
        }
    }

    /**
     * Check if WebSocket is connected
     */
    get connected(): boolean {
        return this.isConnected;
    }
}

// Export singleton instance
export const wsClient = new WebSocketClient();
