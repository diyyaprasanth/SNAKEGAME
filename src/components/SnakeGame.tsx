import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
type Point = { x: number; y: number };

const INITIAL_SNAKE = [ { x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 } ];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 120;

const getRandomFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    const onSnake = snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
    if (!onSnake) break;
  }
  return newFood;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFood(getRandomFood(INITIAL_SNAKE));
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setNextDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setHasStarted(false);
    setFood(getRandomFood(INITIAL_SNAKE));
    containerRef.current?.focus();
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.target instanceof HTMLButtonElement || e.target instanceof HTMLInputElement) {
        return;
      }

      const isArrowKey = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key);
      if (isArrowKey) {
        e.preventDefault();
      }

      if (e.key === ' ' && hasStarted && !gameOver) {
        setIsPaused(p => !p);
        return;
      }

      if (!hasStarted && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        setHasStarted(true);
      }

      if (isPaused || gameOver) return;

      const { key } = e;
      setNextDirection((prevDir) => {
        if (key === 'ArrowUp' && prevDir.y !== 1) return { x: 0, y: -1 };
        if (key === 'ArrowDown' && prevDir.y !== -1) return { x: 0, y: 1 };
        if (key === 'ArrowLeft' && prevDir.x !== 1) return { x: -1, y: 0 };
        if (key === 'ArrowRight' && prevDir.x !== -1) return { x: 1, y: 0 };
        return prevDir;
      });
    },
    [isPaused, gameOver, hasStarted]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (gameOver || isPaused || !hasStarted) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        setDirection(nextDirection);
        
        const newHead = {
          x: head.x + nextDirection.x,
          y: head.y + nextDirection.y,
        };

        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE ||
          prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(getRandomFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(40, INITIAL_SPEED - Math.floor(score / 50) * 10);
    const intervalId = setInterval(moveSnake, speed);

    return () => clearInterval(intervalId);
  }, [snake, direction, nextDirection, food, gameOver, isPaused, score, hasStarted]);

  return (
    <div className="flex flex-col items-center w-full font-term">
      <div className="mb-6 flex w-full max-w-[450px] justify-between items-end border-b-[6px] border-[#ff00ff] pb-4 px-2 bg-black text-[#00ffff]">
        <div className="flex flex-col items-start gap-2">
           <span className="text-xl font-bold uppercase bg-[#ff00ff] text-black px-2 py-1">EXE</span>
           <span className="text-2xl md:text-3xl font-pixel uppercase glitch text-shadow-glitch" data-text="SNAKE_VICTIM">SNAKE_VICTIM</span>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-lg uppercase text-[#ff00ff]">FRAG_COUNT</span>
          <span className="text-3xl font-pixel text-[#00ffff] bg-black px-3 py-1 border-[4px] border-[#00ffff] shadow-[4px_4px_0_#ff00ff]">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      <div 
        ref={containerRef}
        tabIndex={0}
        className="relative z-10 w-full max-w-[450px] aspect-square border-[8px] border-[#00ffff] bg-[#050510] overflow-hidden outline-none pointer-events-auto"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Draw Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={isHead ? 'bg-[#ff00ff] border-2 border-white relative z-10' : 'bg-[#00ffff] border border-black z-[5]'}
              style={{
                gridColumnStart: segment.x + 1,
                gridRowStart: segment.y + 1,
              }}
            >
              {isHead && (
                <div className="absolute inset-0 bg-white/30 mix-blend-overlay"></div>
              )}
            </div>
          );
        })}

        {/* Draw Food */}
        <div
          className="bg-white border-4 border-[#ff00ff] animate-pulse z-[5]"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
        />

        {/* Overlays */}
        {(!hasStarted || gameOver || isPaused) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
            {!hasStarted && !gameOver && (
              <div className="text-center p-8 border-[6px] border-[#00ffff] bg-black shadow-[8px_8px_0_#ff00ff]">
                <p className="text-[#ff00ff] text-xl font-pixel uppercase mb-6 blink">WAITING_FOR_INPUT</p>
                <p className="text-white text-2xl uppercase font-term">PRESS ARROW KEYS TO INIT</p>
              </div>
            )}
            
            {isPaused && hasStarted && !gameOver && (
              <div className="text-center p-8 border-[6px] border-[#ff00ff] bg-black shadow-[8px_8px_0_#00ffff]">
                <p className="text-[#00ffff] text-3xl font-pixel uppercase glitch" data-text="FROZEN">FROZEN</p>
              </div>
            )}

            {gameOver && (
              <div className="text-center p-8 bg-black border-[8px] border-[#ff00ff] screen-tear shadow-[10px_10px_0_#00ffff]">
                <h3 className="text-[#00ffff] text-4xl font-pixel mb-6 uppercase glitch text-shadow-glitch" data-text="TERMINATED">TERMINATED</h3>
                <p className="text-white text-3xl mb-8 font-term uppercase">FINAL FRAGS: <span className="text-[#ff00ff] font-pixel bg-white/10 px-2">{score.toString().padStart(4, '0')}</span></p>
                <button 
                  onClick={resetGame}
                  className="px-8 py-4 border-[6px] border-[#00ffff] bg-[#ff00ff] text-black font-pixel text-xl uppercase hover:bg-[#00ffff] focus:outline-none transition-none shadow-[8px_8px_0_white] cursor-pointer"
                >
                  RECONNECT
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Control Hints */}
      <div className="mt-8 flex flex-wrap gap-6 w-full max-w-[450px] justify-between text-[#00ffff] bg-black p-4 border-[4px] border-[#ff00ff]">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-[#ff00ff] text-black font-pixel text-sm">ARROWS</span>
          <span className="text-2xl uppercase font-bold">VECTOR</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-[#ff00ff] text-black font-pixel text-sm">SPACE</span>
          <span className="text-2xl uppercase font-bold">HALT</span>
        </div>
      </div>
    </div>
  );
}
