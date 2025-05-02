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
  const [credits, setCredits] = useState<number | null>(null); // Usar null para o estado inicial de carregamento
  const [timer, setTimer] = useState(0);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [challengeAccepted, setChallengeAccepted] = useState(false);
  const backend = isMobile ? TouchBackend : HTML5Backend;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const res = await fetch("/api/user/credits");
        const data = await res.json();
        setCredits(data.credits);
      } catch (err) {
        setError("Erro ao buscar créditos");
      }
    };

    fetchCredits();
  }, []);

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
        setCredits(c => (c !== null ? c + current.credits : current.credits));
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
    if (credits === null || credits < 1) return;
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
        setCredits(c => (c !== null ? c + result.credits : result.credits));
        confetti();
      }
      setCredits(c => (c !== null ? c - 1 : 0));
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
          🎯 Pontos: {score} | 💰 Créditos: {credits !== null ? credits : "Carregando..."} | ⏱️ {timer}s
        </div>
        {error && <div className="text-red-500">{error}</div>}
        {!challengeAccepted && (
          <button
            className="mt-2 px-4 py-1 bg-green-600 text-white rounded shadow"
            onClick={startChallenge}
            disabled={credits === null} // Desabilitar o botão enquanto os créditos estão carregando
          >
            {credits === null ? "Carregando..." : `Iniciar Desafio ${challengeIndex + 1}`}
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
*/