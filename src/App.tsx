import React, { useRef } from 'react';
import { SnakeBoard } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { AudioLines } from 'lucide-react';
import { useMusicPlayer } from './hooks/useMusicPlayer';

export default function App() {
  const musicPlayerState = useMusicPlayer();

  const handleGameStart = () => {
    if (!musicPlayerState.isPlaying) {
      musicPlayerState.togglePlay();
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#e2e8f0] flex flex-col font-sans selection:bg-cyan-500/30 overflow-hidden">
      <div className="flex h-full w-full max-w-7xl mx-auto p-4 md:p-6 gap-6 flex-col lg:flex-row">
        
        <aside className="w-full lg:w-72 flex flex-col gap-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
              <AudioLines className="text-black" size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight uppercase">Neon Synth</h1>
          </div>
          <MusicPlayer {...musicPlayerState} />
        </aside>

        <main className="flex-1 flex flex-col gap-6 w-full">
          <SnakeBoard onStartMusic={handleGameStart} />
        </main>
        
      </div>
    </div>
  );
}
