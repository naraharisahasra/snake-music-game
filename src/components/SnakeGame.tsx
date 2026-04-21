import React from 'react';
import { useSnakeGame } from '../hooks/useSnakeGame';
import { Play, RotateCcw } from 'lucide-react';

export function SnakeBoard({ onStartMusic }: { onStartMusic?: () => void }) {
  const { snake, food, score, gameOver, isPaused, resetGame, setIsPaused, gridSize } = useSnakeGame();

  const handleStart = () => {
    if (onStartMusic) onStartMusic();
    if (gameOver) {
      resetGame();
    } else {
      setIsPaused(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Score Header */}
      <div className="flex justify-between items-end mb-6">
        <div className="flex gap-8">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Session Score</span>
            <span className="text-3xl font-bold mono neon-text-cyan">{score.toString().padStart(5, '0')}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Multiplier</span>
            <span className="text-3xl font-bold mono neon-text-pink">
              x{(1 + (score / 100) * 0.1).toFixed(1)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-medium">
          <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-zinc-500' : 'bg-green-500 animate-pulse'}`}></div>
          <span>{isPaused ? 'ENGINE PAUSED' : 'ENGINE STABLE'}</span>
        </div>
      </div>

      <div className="flex-1 min-h-[400px] w-full max-w-[600px] mx-auto aspect-square neon-border rounded-3xl bg-black relative overflow-hidden game-grid">
        {/* Render Food */}
        <div 
          className="absolute food"
          style={{
            width: `${100 / gridSize}%`,
            height: `${100 / gridSize}%`,
            left: `${(food.x / gridSize) * 100}%`,
            top: `${(food.y / gridSize) * 100}%`,
            margin: `${(100 / gridSize) * 0.1}%` /* slight inner padding to separate food visually */
          }}
        />

        {/* Render Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className="absolute snake-segment rounded-sm transition-all duration-75"
              style={{
                width: `${100 / gridSize}%`,
                height: `${100 / gridSize}%`,
                left: `${(segment.x / gridSize) * 100}%`,
                top: `${(segment.y / gridSize) * 100}%`,
                transform: isHead ? 'scale(1.1)' : 'scale(0.95)',
                borderColor: isHead ? '#67e8f9' : 'rgba(255,255,255,0.2)'
              }}
            />
          );
        })}

        {/* Overlays */}
        {(isPaused || gameOver) && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            {gameOver ? (
              <>
                <h2 className="text-4xl font-bold text-fuchsia-500 mb-2 neon-text-pink uppercase tracking-widest">Game Over</h2>
                <p className="text-zinc-300 mono mb-6">FINAL LOG: {score.toString().padStart(5, '0')}</p>
                <button 
                  onClick={resetGame}
                  className="flex items-center gap-2 px-8 py-4 bg-transparent border border-fuchsia-500 text-fuchsia-500 hover:bg-fuchsia-500 hover:text-black font-bold uppercase tracking-widest rounded-full transition-all hover:scale-105 active:scale-95"
                >
                  <RotateCcw size={20} />
                  Restart Engine
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handleStart}
                  className="flex items-center gap-2 px-8 py-4 bg-cyan-500 text-black shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:bg-cyan-400 font-bold uppercase tracking-widest rounded-full transition-transform hover:scale-105 active:scale-95"
                >
                  <Play fill="currentColor" size={20} />
                  Start Engine
                </button>
                <div className="mt-8 text-zinc-500 mono text-xs flex gap-4 uppercase">
                  <span>WASD / Arrows to move</span>
                  <span>Space to pause</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
