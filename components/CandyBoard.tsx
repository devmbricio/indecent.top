"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState, useCallback, useRef } from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';
import Candy from "./Candy";
import confetti from "canvas-confetti";

export type CandyProps = {
  src: string;
  index: number;
  onDrop?: (fromIndex: number, toIndex: number) => void;
};

const BOARD_WIDTH = 10;
const CANDY_TYPES = [
  "/candy1.png", "/candy2.png", "/candy3.png", "/candy4.png", "/candy5.png",
  "/candy6.png", "/candy7.png", "/candy8.png", "/candy9.png", "/candy10.png"
];

const CANDY_POINTS: Record<string, number> = {
  "/candy1.png": 20,
  "/candy2.png": 15,
  "/candy3.png": 10,
  "/candy4.png": 5,
  "/candy5.png": 25,
  "/candy6.png": 30,
  "/candy7.png": 40,
  "/candy8.png": 50,
  "/candy9.png": 60,
  "/candy10.png": 100,
};

const CHALLENGE_THRESHOLDS = [
  { time: 60, score: 1000, credits: 100 },
  { time: 120, score: 2000, credits: 300 },
  { time: 240, score: 3000, credits: 500 },
  { time: 300, score: 4000, credits: 1000 },
];

export default function CandyBoard({ isInlineAd = false }: { isInlineAd?: boolean }) {
  const [board, setBoard] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [credits, setCredits] = useState(10);
  const [timer, setTimer] = useState(0);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [challengeAccepted, setChallengeAccepted] = useState(false);
  const backend = isMobile ? TouchBackend : HTML5Backend;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const createBoard = useCallback(() => {
    const randomColors = Array.from({ length: BOARD_WIDTH * BOARD_WIDTH }, () => {
      return CANDY_TYPES[Math.floor(Math.random() * CANDY_TYPES.length)];
    });
    setBoard(randomColors);
    setScore(0);
    setTimer(0);
  }, []);

  const startChallenge = useCallback(() => {
    createBoard();
    setChallengeAccepted(true);
    setTimer(0);
    timerRef.current = setInterval(() => {
      setTimer(t => t + 1);
    }, 1000);
  }, [createBoard]);

  useEffect(() => {
    if (!challengeAccepted) return;

    const current = CHALLENGE_THRESHOLDS[challengeIndex];
    if (timer >= current.time) {
      if (score >= current.score) {
        setCredits(c => c + current.credits);
        const next = window.confirm(`Desafio ${challengeIndex + 1} concluído! +${current.credits} créditos. Continuar?`);
        if (next && challengeIndex < CHALLENGE_THRESHOLDS.length - 1) {
          setChallengeIndex(i => i + 1);
          startChallenge();
        } else {
          setChallengeAccepted(false);
          clearInterval(timerRef.current!);
        }
      } else {
        alert("Desafio falhou! Pontuação insuficiente.");
        setChallengeAccepted(false);
        clearInterval(timerRef.current!);
        createBoard();
      }
    }
  }, [timer, challengeAccepted, challengeIndex, score, startChallenge, createBoard]);

  const handleDrop = useCallback((fromIndex: number, toIndex: number) => {
    if (credits < 1) return;
    const validMoves = [
      fromIndex - 1, fromIndex + 1,
      fromIndex - BOARD_WIDTH, fromIndex + BOARD_WIDTH
    ];
    if (!validMoves.includes(toIndex)) return;

    setBoard(prev => {
      const newBoard = [...prev];
      [newBoard[fromIndex], newBoard[toIndex]] = [newBoard[toIndex], newBoard[fromIndex]];
      const result = resolveMatches(newBoard);
      if (result.changed) {
        setScore(s => s + result.points);
        setCredits(c => c + result.credits);
        confetti();
      }
      setCredits(c => c - 1);
      return result.board;
    });
  }, [credits]);

  const resolveMatches = (initialBoard: string[]) => {
    let board = [...initialBoard];
    let totalPoints = 0;
    let totalCredits = 0;
    let changed = false;

    const matchAndScore = () => {
      let matched = false;
      const toClear = new Set<number>();

      for (let i = 0; i < BOARD_WIDTH * BOARD_WIDTH; i++) {
        const row = [i, i + 1, i + 2];
        if (i % BOARD_WIDTH <= BOARD_WIDTH - 3 && row.every(idx => board[idx] === board[i])) {
          row.forEach(idx => toClear.add(idx));
          matched = true;
        }
        const col = [i, i + BOARD_WIDTH, i + BOARD_WIDTH * 2];
        if (i + BOARD_WIDTH * 2 < board.length && col.every(idx => board[idx] === board[i])) {
          col.forEach(idx => toClear.add(idx));
          matched = true;
        }
      }

      toClear.forEach(idx => {
        const points = CANDY_POINTS[board[idx]] ?? 10;
        totalPoints += points;
        totalCredits += 1;
        board[idx] = "";
      });

      return matched;
    };

    while (matchAndScore()) {
      changed = true;
      for (let i = BOARD_WIDTH * (BOARD_WIDTH - 1); i >= 0; i--) {
        if (board[i] === "") {
          let rowAbove = i - BOARD_WIDTH;
          while (rowAbove >= 0 && board[rowAbove] === "") {
            rowAbove -= BOARD_WIDTH;
          }
          board[i] = rowAbove >= 0 ? board[rowAbove] : CANDY_TYPES[Math.floor(Math.random() * CANDY_TYPES.length)];
          if (rowAbove >= 0) board[rowAbove] = "";
        }
      }
    }

    return { board, points: totalPoints, credits: totalCredits, changed };
  };

  useEffect(() => {
    createBoard();
  }, [createBoard]);

  return (
    <DndProvider backend={backend} options={{ enableMouseEvents: true }}>
      <div className="flex flex-col items-center gap-2 p-2">
        <div className="text-white font-semibold p-1">
          🎯 Pontos: {score} | 💰 Créditos: {credits} | ⏱️ {timer}s
        </div>
        {!challengeAccepted && (
          <button
            className="mt-2 px-4 py-1 bg-green-600 text-white rounded shadow"
            onClick={startChallenge}
          >
            Iniciar Desafio {challengeIndex + 1}
          </button>
        )}
        <div className="grid" style={{ gridTemplateColumns: `repeat(${BOARD_WIDTH}, 40px)`, gap: '2px' }}>
          {board.map((candy, i) => (
            <Candy
              key={i}
              index={i}
              src={candy}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}


/*
"use client";

import Image from "next/image";
import { useEffect, useState, useCallback, useRef } from "react";
import Candy from "./Candy";
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';
import confetti from "canvas-confetti";
import { usePreview } from 'react-dnd-preview';
import { DndProvider, useDragLayer } from 'react-dnd';

interface DraggedItem {
  type: string;
  index: number;
  src: string;
}

interface ChallengeThreshold {
  time: number;
  score: number;
  credits: number;
}

const ItemTypes = {
  CANDY: 'candy',
} as const;

const MobilePreview = () => {
  const {
    item,
    itemType,
    isDragging,
    currentOffset,
  } = useDragLayer((monitor) => ({
    item: monitor.getItem() as DraggedItem,
    itemType: monitor.getItemType(),
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getClientOffset(),
  }));

  if (!isDragging || itemType !== ItemTypes.CANDY) return null;

  return (
    <div 
      className="candy-drag-preview"
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 1000,
        left: currentOffset?.x ?? 0,
        top: currentOffset?.y ?? 0,
        transform: 'translate(-50%, -50%)',
        width: '40px',
        height: '40px',
      }}
    >
      {item && (
        <Image
          src={item.src || "/candy-fallback.png"}
          alt="preview"
          width={40}
          height={40}
          className="object-contain w-full h-full"
          priority
        />
      )}
    </div>
  );
};

const BOARD_WIDTH = 9;
const CANDY_TYPES = [
  "/candy1.png",
  "/candy2.png",
  "/candy3.png",
  "/candy4.png",
  "/candy5.png",
  "/candy6.png",
  "/candy7.png",
  "/candy8.png",
  "/candy9.png",
  "/candy10.png",
];

const CANDY_POINTS: Record<string, number> = {
  "/candy1.png": 20,
  "/candy2.png": 15,
  "/candy3.png": 10,
  "/candy4.png": 5,
  "/candy5.png": 25,
  "/candy6.png": 30,
  "/candy7.png": 40,
  "/candy8.png": 50,
  "/candy9.png": 60,
  "/candy10.png": 100,
};

const CHALLENGE_THRESHOLDS: ChallengeThreshold[] = [
  { time: 60, score: 1000, credits: 100 },
  { time: 120, score: 2000, credits: 300 },
  { time: 240, score: 3000, credits: 500 },
  { time: 300, score: 4000, credits: 1000 },
];

const INVALID_INDICES = [
  7, 8, 16, 17, 25, 26, 34, 35, 43, 44, 52, 53, 61, 62, 70, 71,
];

export default function CandyBoard({ isInlineAd = false }: { isInlineAd?: boolean }) {
  const backend = isMobile ? TouchBackend : HTML5Backend;
  const [currentColorArr, setCurrentColorArr] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [credits, setCredits] = useState<number | null>(null);
  const [timer, setTimer] = useState(0);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [challengeAccepted, setChallengeAccepted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const createBoard = useCallback(() => {
    const randomColors = Array.from({ length: BOARD_WIDTH * BOARD_WIDTH }, () => {
      return CANDY_TYPES[Math.floor(Math.random() * CANDY_TYPES.length)];
    });
    setCurrentColorArr(randomColors);
    setScore(0);
    setTimer(0);
    setChallengeAccepted(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const fetchCredits = useCallback(async () => {
    try {
      const res = await fetch("/api/user/credits");
      if (!res.ok) throw new Error("Failed to fetch credits");
      const data = await res.json();
      setCredits(data.credits);
    } catch (err) {
      console.error("Erro ao buscar créditos:", err);
      setCredits(0);
    }
  }, []);

  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 50,
      spread: 100,
      origin: { y: 0.6 },
    });
  }, []);

  const startChallengeTimer = useCallback(() => {
    setChallengeAccepted(true);
    intervalRef.current = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);
  }, []);

  const checkForColumnOfThree = useCallback(() => {
    const newColors = [...currentColorArr];
    let changed = false;

    for (let i = 0; i <= BOARD_WIDTH * (BOARD_WIDTH - 2); i++) {
      const column = [i, i + BOARD_WIDTH, i + BOARD_WIDTH * 2];
      const decidedColor = newColors[i];
      
      if (decidedColor && column.every(index => newColors[index] === decidedColor)) {
        column.forEach(index => newColors[index] = "");
        const pts = CANDY_POINTS[decidedColor] ?? 10;
        setScore(s => s + pts);
        setCredits(c => (c ?? 0) + 1);
        if (pts >= 50) triggerConfetti();
        changed = true;
      }
    }

    if (changed) {
      setCurrentColorArr(newColors);
    }
  }, [currentColorArr, triggerConfetti]);

  const checkForRowOfThree = useCallback(() => {
    const newColors = [...currentColorArr];
    let changed = false;

    for (let i = 0; i < BOARD_WIDTH * BOARD_WIDTH; i++) {
      if (INVALID_INDICES.includes(i)) continue;
      
      const row = [i, i + 1, i + 2];
      const decidedColor = newColors[i];
      
      if (decidedColor && row.every(index => newColors[index] === decidedColor)) {
        row.forEach(index => newColors[index] = "");
        const pts = CANDY_POINTS[decidedColor] ?? 10;
        setScore(s => s + pts);
        setCredits(c => (c ?? 0) + 1);
        if (pts >= 50) triggerConfetti();
        changed = true;
      }
    }

    if (changed) {
      setCurrentColorArr(newColors);
    }
  }, [currentColorArr, triggerConfetti]);

  const moveIntoSquareBelow = useCallback(() => {
    const newColors = [...currentColorArr];
    let changed = false;

    for (let i = 0; i <= BOARD_WIDTH * (BOARD_WIDTH - 2); i++) {
      if (newColors[i + BOARD_WIDTH] === "") {
        newColors[i + BOARD_WIDTH] = newColors[i];
        newColors[i] = "";
        changed = true;
      }
    }

    for (let i = 0; i < BOARD_WIDTH; i++) {
      if (newColors[i] === "") {
        newColors[i] = CANDY_TYPES[Math.floor(Math.random() * CANDY_TYPES.length)];
        changed = true;
      }
    }

    if (changed) {
      setCurrentColorArr(newColors);
    }
  }, [currentColorArr]);

  const handleDrop = useCallback((fromIndex: number, toIndex: number) => {
    if (credits === null || credits < 1) return;
    
    const validMoves = [
      fromIndex - 1,
      fromIndex + 1,
      fromIndex - BOARD_WIDTH,
      fromIndex + BOARD_WIDTH,
    ];
    
    if (!validMoves.includes(toIndex)) return;
    
    const newBoard = [...currentColorArr];
    [newBoard[toIndex], newBoard[fromIndex]] = [newBoard[fromIndex], newBoard[toIndex]];
    setCurrentColorArr(newBoard);
    setCredits(c => (c ?? 0) - 1);
  }, [currentColorArr, credits]);

  // Initialize game
  useEffect(() => {
    createBoard();
    fetchCredits();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [createBoard, fetchCredits]);

  // Game loop
  useEffect(() => {
    const checkChallenge = () => {
      const current = CHALLENGE_THRESHOLDS[challengeIndex];
      
      if (timer >= current.time && score < current.score) {
        alert("Desafio falhou! Seus pontos foram zerados.");
        setScore(0);
        setTimer(0);
        setChallengeAccepted(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      if (score >= current.score && timer <= current.time) {
        const acceptNext = window.confirm(
          `Você completou o desafio de ${current.score} pontos! Deseja continuar para o próximo desafio?`
        );
        
        setCredits(c => (c ?? 0) + current.credits);
        
        if (acceptNext && challengeIndex < CHALLENGE_THRESHOLDS.length - 1) {
          setChallengeIndex(i => i + 1);
          setTimer(0);
        } else {
          setChallengeAccepted(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }
    };

    const gameLoop = setInterval(() => {
      checkForColumnOfThree();
      checkForRowOfThree();
      moveIntoSquareBelow();
      if (challengeAccepted) checkChallenge();
    }, 150);

    return () => clearInterval(gameLoop);
  }, [
    checkForColumnOfThree, 
    checkForRowOfThree, 
    moveIntoSquareBelow, 
    currentColorArr, 
    challengeAccepted, 
    challengeIndex, 
    score, 
    timer
  ]);

  return (
    <DndProvider 
      backend={backend} 
      options={isMobile ? { enableMouseEvents: true, delayTouchStart: 100 } : undefined}
    >
      {isMobile && <MobilePreview />}
      <div className={`candy-board-container ${isInlineAd ? "cursor-pointer" : ""}`}>
        <div className="game-info">
          <div className="score-display">
            ⏱️ {timer}s | 🎮 {score} | 💰 {credits ?? "..."}
          </div>

          {!challengeAccepted && (
            <button
              className="challenge-button"
              onClick={startChallengeTimer}
              disabled={credits === null || credits < 1}
            >
              Desafio {challengeIndex + 1}: {CHALLENGE_THRESHOLDS[challengeIndex].score}pts
            </button>
          )}
        </div>

        <div className="candy-grid flex flex-col lg:flex-row">
          {currentColorArr.map((candy, i) => (
            <Candy
              key={`${i}-${candy}`} // Melhor key para evitar problemas de re-render
              index={i}
              src={candy || "/candy-fallback.png"}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}
*/

/*
"use client";

import Image from "next/image";
import { useEffect, useState, useCallback, useRef } from "react";
import Candy from "./Candy";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import confetti from "canvas-confetti";

const ItemTypes = {
  CANDY: 'candy',
};

const width = 9;
const candyTypes = [
  "/candy1.png",
  "/candy2.png",
  "/candy3.png",
  "/candy4.png",
  "/candy5.png",
  "/candy6.png",
  "/candy7.png",
  "/candy8.png",
  "/candy9.png",
  "/candy10.png",
];

const candyPoints: Record<string, number> = {
  "/candy1.png": 20,
  "/candy2.png": 15,
  "/candy3.png": 10,
  "/candy4.png": 5,
  "/candy5.png": 25,
  "/candy6.png": 30,
  "/candy7.png": 40,
  "/candy8.png": 50,
  "/candy9.png": 60,
  "/candy10.png": 100,
};

const challengeThresholds = [
  { time: 60, score: 1000, credits: 100 },
  { time: 120, score: 2000, credits: 300 },
  { time: 240, score: 3000, credits: 500 },
  { time: 300, score: 4000, credits: 1000 },
];

export default function CandyBoard({ isInlineAd = false }: { isInlineAd?: boolean }) {
  const [currentColorArr, setCurrentColorArr] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [credits, setCredits] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [timer, setTimer] = useState(0);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [challengeAccepted, setChallengeAccepted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const createBoard = useCallback(() => {
    const randomColors = Array.from({ length: width * width }, () => {
      return candyTypes[Math.floor(Math.random() * candyTypes.length)];
    });
    setCurrentColorArr(randomColors);
    setScore(0);
    setTimer(0);
    setChallengeAccepted(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const fetchCredits = useCallback(async () => {
    try {
      const res = await fetch("/api/user/credits");
      const data = await res.json();
      setCredits(data.credits);
    } catch (err) {
      console.error("Erro ao buscar créditos");
    }
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 100,
      origin: { y: 0.6 },
    });
  };

  const startChallengeTimer = () => {
    setChallengeAccepted(true);
    intervalRef.current = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);
  };

  const checkForColumnOfThree = useCallback(() => {
    for (let i = 0; i <= width * (width - 2); i++) {
      const column = [i, i + width, i + width * 2];
      const decidedColor = currentColorArr[i];
      if (
        decidedColor &&
        column.every((index) => currentColorArr[index] === decidedColor)
      ) {
        column.forEach((index) => (currentColorArr[index] = ""));
        const pts = candyPoints[decidedColor] ?? 10;
        setScore((s) => s + pts);
        setCredits((c) => (c ?? 0) + 1);
        if (pts >= 50) triggerConfetti();
      }
    }
  }, [currentColorArr]);

  const checkForRowOfThree = useCallback(() => {
    for (let i = 0; i < width * width; i++) {
      const row = [i, i + 1, i + 2];
      const notValid = [
        7, 8, 16, 17, 25, 26, 34, 35, 43, 44, 52, 53, 61, 62, 70, 71,
      ];
      if (notValid.includes(i)) continue;
      const decidedColor = currentColorArr[i];
      if (
        decidedColor &&
        row.every((index) => currentColorArr[index] === decidedColor)
      ) {
        row.forEach((index) => (currentColorArr[index] = ""));
        const pts = candyPoints[decidedColor] ?? 10;
        setScore((s) => s + pts);
        setCredits((c) => (c ?? 0) + 1);
        if (pts >= 50) triggerConfetti();
      }
    }
  }, [currentColorArr]);

  const moveIntoSquareBelow = useCallback(() => {
    for (let i = 0; i <= width * (width - 2); i++) {
      if (currentColorArr[i + width] === "") {
        currentColorArr[i + width] = currentColorArr[i];
        currentColorArr[i] = "";
      }
    }
    for (let i = 0; i < width; i++) {
      if (currentColorArr[i] === "") {
        currentColorArr[i] = candyTypes[Math.floor(Math.random() * candyTypes.length)];
      }
    }
  }, [currentColorArr]);

  useEffect(() => {
    createBoard();
    fetchCredits();
  }, [createBoard, fetchCredits]);

  useEffect(() => {
    const checkChallenge = () => {
      const current = challengeThresholds[challengeIndex];
      if (timer >= current.time && score < current.score) {
        alert("Desafio falhou! Seus pontos foram zerados.");
        setScore(0);
        setTimer(0);
        setChallengeAccepted(false);
        return;
      }

      if (score >= current.score && timer <= current.time) {
        const acceptNext = confirm(`Você completou o desafio de ${current.score} pontos! Deseja continuar para o próximo desafio?`);
        setCredits((c) => (c ?? 0) + current.credits);
        if (acceptNext) {
          setChallengeIndex((i) => i + 1);
          setTimer(0);
        } else {
          setChallengeAccepted(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }
    };

    const loop = setInterval(() => {
      checkForColumnOfThree();
      checkForRowOfThree();
      moveIntoSquareBelow();
      setCurrentColorArr([...currentColorArr]);
      if (challengeAccepted) checkChallenge();
    }, 150);
    return () => clearInterval(loop);
  }, [checkForColumnOfThree, checkForRowOfThree, moveIntoSquareBelow, currentColorArr, challengeAccepted, challengeIndex, score, timer]);

  const handleDrop = useCallback((fromIndex: number, toIndex: number) => {
    if (credits === null || credits < 1) return;
    
    const validMoves = [
      fromIndex - 1,
      fromIndex + 1,
      fromIndex - width,
      fromIndex + width,
    ];
    
    if (!validMoves.includes(toIndex)) return;
    
    const newBoard = [...currentColorArr];
    const temp = newBoard[toIndex];
    newBoard[toIndex] = newBoard[fromIndex];
    newBoard[fromIndex] = temp;
    setCurrentColorArr(newBoard);
    setCredits((c) => (c ?? 0) - 1);
  }, [currentColorArr, credits]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div   className={`flex flex-col lg:flex-row gap-0 mt-0 p-2 max-w-4xl mx-auto items-center justify-center 
    rounded-md w-full h-[100vh] relative overflow-hidden ${isInlineAd ? "cursor-pointer" : ""}`}>
        <div className="text-lg font-semibold text-white">
          ⏱️ Tempo: {timer}s | 🎮 Pontos: {score} | 💰 Créditos: {credits ?? "..."}
        </div>

        {!challengeAccepted && (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
            onClick={startChallengeTimer}
          >
            Iniciar desafio {challengeIndex + 1}: {challengeThresholds[challengeIndex].score} pontos em {challengeThresholds[challengeIndex].time / 60} min
          </button>
        )}

        <div
          className="grid"
          style={{ gridTemplateColumns: `repeat(${width}, 40px)` }}
        >
         {currentColorArr.map((candy, i) => (
          <Candy
            key={i}
            index={i}
            src={candy || "/candy-fallback.png"}
            onDrop={handleDrop}
          />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}
*/
