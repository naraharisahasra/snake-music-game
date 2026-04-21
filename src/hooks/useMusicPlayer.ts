import { useState, useRef, useEffect } from 'react';

export const TRACKS = [
  { id: 1, title: 'Cyber Pulse', artist: 'Neon Generator', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Grid Runner', artist: 'Neon Generator', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Synthetic Horizon', artist: 'Neon Generator', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' }
];

export function useMusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio(TRACKS[currentTrackIndex].src);
    audioRef.current.volume = volume;
    
    const handleEnded = () => {
      skipNext();
    };
    audioRef.current.addEventListener('ended', handleEnded);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (audioRef.current.src !== TRACKS[currentTrackIndex].src) {
        audioRef.current.src = TRACKS[currentTrackIndex].src;
        if (isPlaying) {
          audioRef.current.play().catch(e => console.log('Audio play error:', e));
        }
      }
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.log('Audio play error:', e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const skipNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };
  
  const skipPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  return {
    currentTrack: TRACKS[currentTrackIndex],
    isPlaying,
    togglePlay,
    skipNext,
    skipPrev,
    volume,
    setVolume
  };
}
