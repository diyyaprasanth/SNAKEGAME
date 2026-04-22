import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'CORRUPTED.WAV',
    artist: 'SYS.ADMIN',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 2,
    title: 'MALWARE_PULSE',
    artist: 'UNKNOWN_ORG',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 3,
    title: 'GRID_LEAK',
    artist: 'KERNEL_PANIC',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(TRACKS[currentTrackIndex].url);
      audioRef.current.volume = 0.5;
    }

    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = TRACKS[currentTrackIndex].url;
      audioRef.current.muted = isMuted;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
      }
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.error("Playback failed:", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
    }
  };

  const currentTrack = TRACKS[currentTrackIndex];

  return (
    <div className="w-full flex-col flex gap-6 font-term">
      <div className="uppercase font-pixel text-[#ff00ff] text-xl border-b-[4px] border-[#00ffff] pb-2 mb-2 blink">AUDIO_STREAM_</div>
      
      {/* Current Track Playback Display */}
      <div className="flex flex-col gap-4 p-4 border-[4px] border-[#00ffff] bg-black relative">
        <div className="absolute top-0 right-0 w-6 h-6 bg-[#ff00ff] animate-pulse"></div>
        
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-[#ff00ff] border-4 border-black flex items-center justify-center shrink-0">
            <Music className={`w-10 h-10 text-black ${isPlaying && !isMuted ? 'animate-bounce' : ''}`} />
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <p className="text-xl font-bold text-[#00ffff] truncate font-pixel text-shadow-glitch leading-tight mb-2">{currentTrack.title}</p>
            <p className="text-xl text-white truncate uppercase">{currentTrack.artist}</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full mt-4">
          <div className="flex justify-between text-lg text-[#00ffff] font-pixel mb-2 uppercase">
            <span>MEM</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div 
            className="h-6 w-full bg-black border-2 border-[#ff00ff] cursor-pointer"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-[#00ffff] transition-all duration-100 ease-linear shadow-[0_0_15px_#00ffff]"
              style={{ width: `${progress || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-stretch gap-3 mt-2">
        <button 
          onClick={handlePrev}
          className="p-3 border-[4px] border-[#ff00ff] bg-black text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black focus:outline-none transition-none"
        >
          <SkipBack className="w-8 h-8" />
        </button>
        
        <button 
          onClick={handlePlayPause}
          className="p-4 border-[4px] border-[#00ffff] bg-[#00ffff] text-black hover:bg-black hover:text-[#00ffff] focus:outline-none transition-none flex-1 flex justify-center shadow-[6px_6px_0_#ff00ff] group"
        >
          {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-2 group-hover:block" />}
        </button>
        
        <button 
          onClick={handleNext}
          className="p-3 border-[4px] border-[#ff00ff] bg-black text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black focus:outline-none transition-none"
        >
          <SkipForward className="w-8 h-8" />
        </button>

        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="p-3 border-[4px] border-[#00ffff] bg-black text-[#00ffff] hover:bg-[#00ffff] hover:text-black focus:outline-none transition-none ml-2"
        >
          {isMuted ? <VolumeX className="w-8 h-8" /> : <Volume2 className="w-8 h-8" />}
        </button>
      </div>
    </div>
  );
}
