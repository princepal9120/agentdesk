import React, { useState, useCallback } from 'react';
import {
    LiveKitRoom,
    RoomAudioRenderer,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Phone, PhoneOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/services/api';

interface VoiceWidgetProps {
    className?: string;
}

const VoiceWidget: React.FC<VoiceWidgetProps> = ({ className }) => {
    const [token, setToken] = useState<string>("");
    const [serverUrl, setServerUrl] = useState<string>("");
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    const connect = useCallback(async () => {
        setIsConnecting(true);
        try {
            const response = await api.get('/livekit/token');
            setToken(response.data.token);
            setServerUrl(response.data.server_url);
            setIsConnected(true);
        } catch (error) {
            console.error("Failed to connect:", error);
        } finally {
            setIsConnecting(false);
        }
    }, []);

    const disconnect = useCallback(() => {
        setIsConnected(false);
        setToken("");
    }, []);

    if (!isConnected) {
        return (
            <Button
                onClick={connect}
                disabled={isConnecting}
                className={`rounded-full shadow-lg ${className || ''}`}
                size="lg"
            >
                {isConnecting ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                    <Phone className="w-5 h-5 mr-2" />
                )}
                Call Agent
            </Button>
        );
    }

    return (
        <div className={`fixed bottom-4 right-4 z-50 w-80 h-96 bg-background border rounded-xl shadow-2xl overflow-hidden flex flex-col ${className || ''}`}>
            <LiveKitRoom
                token={token}
                serverUrl={serverUrl}
                connect={true}
                data-lk-theme="default"
                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                onDisconnected={disconnect}
            >
                <div className="flex-1 flex items-center justify-center bg-slate-900 text-white p-4">
                    <div className="text-center">
                        <div className="w-24 h-24 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
                            <Phone className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold">Voice Agent</h3>
                        <p className="text-slate-400 text-sm">Connected</p>
                        <RoomAudioRenderer />
                    </div>
                </div>
                <div className="p-4 bg-background border-t">
                    <Button
                        variant="destructive"
                        className="w-full"
                        onClick={disconnect}
                    >
                        <PhoneOff className="w-4 h-4 mr-2" />
                        End Call
                    </Button>
                </div>
            </LiveKitRoom>
        </div>
    );
};

export default VoiceWidget;
