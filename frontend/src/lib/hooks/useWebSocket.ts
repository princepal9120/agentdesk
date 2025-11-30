// Custom React hook for WebSocket connection

import { useEffect, useRef } from 'react';
import { wsClient } from '../websocket/client';
import { useAuthStore } from '@/stores/authStore';
import { getAuthToken } from '../api/client';

type EventCallback = (data: any) => void;

export function useWebSocket() {
    const { isAuthenticated } = useAuthStore();
    const isConnectedRef = useRef(false);

    useEffect(() => {
        const token = getAuthToken();

        // Connect if authenticated and not already connected
        if (isAuthenticated && token && !isConnectedRef.current) {
            wsClient.connect(token);
            isConnectedRef.current = true;
        }

        // Disconnect when component unmounts or user logs out
        return () => {
            if (!isAuthenticated && isConnectedRef.current) {
                wsClient.disconnect();
                isConnectedRef.current = false;
            }
        };
    }, [isAuthenticated]);

    return {
        isConnected: wsClient.connected,
        on: wsClient.on.bind(wsClient),
        off: wsClient.off.bind(wsClient),
        send: wsClient.send.bind(wsClient),
    };
}

/**
 * Hook to subscribe to specific WebSocket event
 */
export function useWebSocketEvent(
    event: string,
    callback: EventCallback,
    deps: React.DependencyList = []
) {
    const { on, off } = useWebSocket();

    useEffect(() => {
        const unsubscribe = on(event, callback);

        return () => {
            unsubscribe();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [event, ...deps]);
}
