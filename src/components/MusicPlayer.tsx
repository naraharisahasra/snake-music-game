import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { TRACKS } from '../hooks/useMusicPlayer';

export function MusicPlayer({ currentTrack, isPlaying, togglePlay, skipNext, skipPrev, volume, setVolume }: any) {
  return (
    <div className="neon-border bg-zinc-900/50 rounded-2xl p-5 flex-1 flex flex-col">
      <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Now Playing</div>
      
      <div className="aspect-square w-full rounded-lg bg-zinc-800 relative overflow-hidden mb-4 group">
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/40 to-pink-900/40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-32 h-32 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 ${isPlaying ? 'animate-spin' : ''}`}></div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold truncate">{currentTrack.title}</h2>
        <p className="text-sm text-cyan-400 font-medium">{currentTrack.artist}</p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Visualizer bar */}
        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div className="w-2/3 h-full bg-cyan-500 shadow-[0_0_8px_#22d3ee]"></div>
        </div>
        
        <div className="flex items-center justify-between px-2">
          <button onClick={skipPrev} className="text-zinc-400 hover:text-white transition-colors">
            <SkipBack size={20} />
          </button>
          <button onClick={togglePlay} className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform">
            {isPlaying ? <Pause fill="currentColor" size={20} /> : <Play fill="currentColor" size={20} className="ml-1" />}
          </button>
          <button onClick={skipNext} className="text-zinc-400 hover:text-white transition-colors">
            <SkipForward size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
