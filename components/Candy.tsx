
"use client";

import { useDrag, useDrop } from 'react-dnd';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';

// Definindo tipos para o item arrastado
interface DraggedItem {
  index: number;
  src: string;
}

// Tipo para as propriedades coletadas do drag
interface CollectedProps {
  isDragging: boolean;
}

const ItemTypes = {
  CANDY: 'candy',
} as const;

interface CandyProps {
  src: string;
  index: number;
  onDrop: (fromIndex: number, toIndex: number) => void;
}

export default function Candy({ src, index, onDrop }: CandyProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Configuração do drag com tipagem completa
  const [{ isDragging }, drag] = useDrag<DraggedItem, void, CollectedProps>(() => ({
    type: ItemTypes.CANDY,
    item: { index, src },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Configuração do drop com tipagem completa
  const [, drop] = useDrop<DraggedItem, void, unknown>(() => ({
    accept: ItemTypes.CANDY,
    drop: (item) => {
      if (item.index !== index) {
        onDrop(item.index, index);
      }
    },
    hover: (item, monitor) => {
      if (!ref.current) return;
      // Lógica adicional de hover pode ser adicionada aqui
    },
  }));

  // Conecta as refs do drag e drop
  useEffect(() => {
    drag(drop(ref));
  }, [drag, drop]);

  const fallback = "/candy-fallback.png";

  return (
    <motion.div
      ref={ref}
      layout
      className="candy-item"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileTap={{ scale: 0.95 }} // Feedback visual ao tocar
    >
      <Image
        src={src || fallback}
        alt={`candy-${index}`}
        width={40}
        height={40}
        className="candy-image"
        draggable={false}
        priority={index < 10} // Prioriza carregamento dos primeiros itens
      />
    </motion.div>
  );
}

/*
"use client";

import { useDrag, useDrop } from 'react-dnd';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';

// Definindo tipos para o item arrastado
interface DraggedItem {
  index: number;
  src: string;
}

// Tipo para as propriedades coletadas do drag
interface CollectedProps {
  isDragging: boolean;
}

const ItemTypes = {
  CANDY: 'candy',
} as const;

interface CandyProps {
  src: string;
  index: number;
  onDrop: (fromIndex: number, toIndex: number) => void;
}

export default function Candy({ src, index, onDrop }: CandyProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Configuração do drag com tipagem completa
  const [{ isDragging }, drag] = useDrag<DraggedItem, void, CollectedProps>(() => ({
    type: ItemTypes.CANDY,
    item: { index, src },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Configuração do drop com tipagem completa
  const [, drop] = useDrop<DraggedItem, void, unknown>(() => ({
    accept: ItemTypes.CANDY,
    drop: (item) => {
      if (item.index !== index) {
        onDrop(item.index, index);
      }
    },
    hover: (item, monitor) => {
      if (!ref.current) return;
      // Lógica adicional de hover pode ser adicionada aqui
    },
  }));

  // Conecta as refs do drag e drop
  useEffect(() => {
    drag(drop(ref));
  }, [drag, drop]);

  const fallback = "/candy-fallback.png";

  return (
    <motion.div
      ref={ref}
      layout
      className="candy-item"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileTap={{ scale: 0.95 }} // Feedback visual ao tocar
    >
      <Image
        src={src || fallback}
        alt={`candy-${index}`}
        width={40}
        height={40}
        className="candy-image"
        draggable={false}
        priority={index < 10} // Prioriza carregamento dos primeiros itens
      />
    </motion.div>
  );
}
*/


/*
"use client";

import { useDrag, useDrop } from 'react-dnd';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';

// Definindo tipos para o item arrastado
interface DraggedItem {
  index: number;
  src: string;
}

// Tipo para as propriedades coletadas do drag
interface CollectedProps {
  isDragging: boolean;
}

const ItemTypes = {
  CANDY: 'candy',
} as const;

interface CandyProps {
  src: string;
  index: number;
  onDrop: (fromIndex: number, toIndex: number) => void;
}

export default function Candy({ src, index, onDrop }: CandyProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Configuração do drag com tipagem completa
  const [{ isDragging }, drag] = useDrag<DraggedItem, void, CollectedProps>(() => ({
    type: ItemTypes.CANDY,
    item: { index, src },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Configuração do drop com tipagem completa
  const [, drop] = useDrop<DraggedItem, void, unknown>(() => ({
    accept: ItemTypes.CANDY,
    drop: (item) => {
      if (item.index !== index) {
        onDrop(item.index, index);
      }
    },
    hover: (item, monitor) => {
      if (!ref.current) return;
      // Lógica adicional de hover pode ser adicionada aqui
    },
  }));

  // Conecta as refs do drag e drop
  useEffect(() => {
    drag(drop(ref));
  }, [drag, drop]);

  const fallback = "/candy-fallback.png";

  return (
    <motion.div
      ref={ref}
      layout
      className="candy-item"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileTap={{ scale: 0.95 }} // Feedback visual ao tocar
    >
      <Image
        src={src || fallback}
        alt={`candy-${index}`}
        width={40}
        height={40}
        className="candy-image"
        draggable={false}
        priority={index < 10} // Prioriza carregamento dos primeiros itens
      />
    </motion.div>
  );
}
  */


/*
"use client";

import { useDrag, useDrop } from 'react-dnd';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRef } from 'react';

const ItemTypes = {
  CANDY: 'candy',
};

export default function Candy({
  src,
  index,
  onDrop,
}: {
  src: string;
  index: number;
  onDrop: (fromIndex: number, toIndex: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CANDY,
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: ItemTypes.CANDY,
    drop: (item: { index: number }) => {
      if (item.index !== index) {
        onDrop(item.index, index);
      }
    },
  }));

  // Conecta as refs do drag e drop ao elemento
  drag(drop(ref));

  const fallback = "/candy-fallback.png";

  return (
    <motion.div
      ref={ref}
      layout
      className="w-10 h-10 border border-white bg-[#e0b43d] rounded-md select-none touch-none"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Image
        src={src || fallback}
        alt={`candy-${index}`}
        width={40}
        height={40}
        className="object-contain w-full h-full pointer-events-none"
        draggable={false}
      />
    </motion.div>
  );
}
*/