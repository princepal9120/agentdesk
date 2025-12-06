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
                className={`rounded-full shadow-lg bg-[#2BB59B] hover:bg-[#249A84] text-white ${className || ''}`}
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
        <div className={`fixed bottom-6 right-6 z-50 w-80 bg-white border border-grey-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col ${className || ''}`}>
            <LiveKitRoom
                token={token}
                serverUrl={serverUrl}
                connect={true}
                data-lk-theme="default"
                style={{ height: '400px', display: 'flex', flexDirection: 'column' }}
                onDisconnected={disconnect}
            >
                <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#D7EAFB]/30 to-white p-6">
                    <div className="text-center w-full">
                        <div className="relative w-24 h-24 mx-auto mb-6">
                            <div className="absolute inset-0 bg-[#2BB59B]/20 rounded-full animate-ping" />
                            <div className="relative w-24 h-24 bg-gradient-to-br from-[#2BB59B] to-[#1B5E7A] rounded-full flex items-center justify-center shadow-lg">
                                <Phone className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-grey-900 mb-1">HealthVoice AI</h3>
                        <p className="text-grey-500 text-sm mb-4">Listening...</p>
                        <div className="flex justify-center gap-1 mb-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-1 h-8 bg-[#2BB59B] rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                            ))}
                        </div>
                        <RoomAudioRenderer />
                    </div>
                </div>
                <div className="p-4 bg-white border-t border-grey-100">
                    <Button
                        variant="destructive"
                        className="w-full rounded-xl h-12 text-base font-medium shadow-sm hover:bg-red-600"
                        onClick={disconnect}
                    >
                        <PhoneOff className="w-5 h-5 mr-2" />
                        End Call
                    </Button>
                </div>
            </LiveKitRoom>
        </div>
    );
};

export default VoiceWidget;
