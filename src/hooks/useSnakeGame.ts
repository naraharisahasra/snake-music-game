import { useState, useEffect, useCallback, useRef } from 'react';

export type Point = { x: number; y: number };
export type Direction = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SPEED = 180;
const MIN_SPEED = 50;
const SPEED_DECREMENT = 5;

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = { x: 0, y: -1 }; // Moving UP

export function useSnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const directionRef = useRef(direction);
  directionRef.current = direction;

  // Prevent multiple direction changes in a single tick
  const allowDirectionChange = useRef(true);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
    allowDirectionChange.current = true;
  };

  const tick = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + directionRef.current.x,
        y: head.y + directionRef.current.y,
      };

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (
        prevSnake.some(
          (segment) => segment.x === newHead.x && segment.y === newHead.y
        )
      ) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setSpeed((s) => Math.max(MIN_SPEED, s - SPEED_DECREMENT));
        setFood(generateFood(newSnake));
        // We don't pop the tail, so it grows
      } else {
        newSnake.pop(); // Remove tail
      }

      allowDirectionChange.current = true;
      return newSnake;
    });
  }, [gameOver, isPaused, food, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }

      if (!allowDirectionChange.current) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (directionRef.current.y !== 1) {
            setDirection({ x: 0, y: -1 });
            allowDirectionChange.current = false;
          }
          break;
        case 'ArrowDown':
        case 's':
          if (directionRef.current.y !== -1) {
            setDirection({ x: 0, y: 1 });
            allowDirectionChange.current = false;
          }
          break;
        case 'ArrowLeft':
        case 'a':
          if (directionRef.current.x !== 1) {
            setDirection({ x: -1, y: 0 });
            allowDirectionChange.current = false;
          }
          break;
        case 'ArrowRight':
        case 'd':
          if (directionRef.current.x !== -1) {
            setDirection({ x: 1, y: 0 });
            allowDirectionChange.current = false;
          }
          break;
        case ' ':
        case 'Escape':
          setIsPaused((p) => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const interval = setInterval(tick, speed);
    return () => clearInterval(interval);
  }, [tick, speed]);

  return {
    snake,
    food,
    score,
    gameOver,
    isPaused,
    setIsPaused,
    resetGame,
    gridSize: GRID_SIZE,
  };
}
