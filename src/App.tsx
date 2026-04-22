import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';

export default function App() {
  return (
    <div className="bg-static min-h-screen text-white flex flex-col items-center py-6 md:py-10 cursor-crosshair overflow-x-hidden border-[10px] border-[#00ffff] selection:bg-[#ff00ff] selection:text-black">
      <header className="mb-8 text-center z-10 w-full max-w-5xl flex flex-col md:flex-row justify-between items-center border-b-[6px] border-[#ff00ff] pb-6 px-6 bg-black/80 relative screen-tear">
        <h1 className="font-pixel text-3xl md:text-5xl uppercase tracking-tighter text-[#00ffff] glitch" data-text="FATAL_ERROR">
          FATAL_ERROR
        </h1>
        <div className="text-xl md:text-2xl text-black bg-[#00ffff] px-4 py-2 font-pixel uppercase mt-4 md:mt-0 shadow-[4px_4px_0_#ff00ff]">
          SYS_REBOOT
        </div>
      </header>
      
      <main className="w-full max-w-6xl flex gap-8 z-10 flex-col lg:flex-row items-stretch px-6">
        <aside className="raw-border p-6 w-full lg:w-[380px] bg-black flex flex-col justify-start shrink-0">
          <MusicPlayer />
        </aside>
        
        <section className="raw-border-alt p-6 w-full flex-1 bg-[#050505] flex items-center justify-center">
          <SnakeGame />
        </section>
      </main>
    </div>
  );
}
