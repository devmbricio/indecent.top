
"use client";
import { useEffect, useState } from "react";
import Reel from "./Reel"; // ou ajuste o caminho se estiver em outro lugar
import confetti from "canvas-confetti";

export default function JackpotMachine({ isInlineAd = false }: { isInlineAd?: boolean }) {

  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number[]>([0, 1, 2, 3, 4]); // inicial fixo
  const [prize, setPrize] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [credits, setCredits] = useState<number | null>(null);
  const [dailyWins, setDailyWins] = useState(0);
  const [jackpotTotal, setJackpotTotal] = useState<number>(0);
  const [spinCount, setSpinCount] = useState(1);

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

  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    const index = Math.floor(Math.random() * 13) + 1; // 1 a 13
    setBgImage(`/` + index + `.png`);
  }, []);

  const spin = async () => {
    if (!credits || credits < spinCount) {
      setError("Créditos insuficientes");
      return;
    }

    setSpinning(true);
    setError("");
    setPrize(null);

    let totalPrize = 0;
    let finalResult = result;

    for (let i = 0; i < spinCount; i++) {
      try {
        const res = await fetch("/api/bet/spin", { method: "POST" });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Erro ao rodar máquina");

        finalResult = data.result;
        setResult(finalResult);
        setPrize(data.prize);
        setCredits(data.updatedCredits);
        setJackpotTotal(data.jackpotTotal || 0);
        totalPrize += data.dailyWins || 0;

        // ✅ Dispara confete aqui, com base no resultado da rodada
    if (data.prize > 0 || data.isJackpot) {
      dispararConfete();
    }

        await new Promise((r) => setTimeout(r, 500));
      } catch (err: any) {
        setError(err.message);
        break;
      }
    }

    setDailyWins((prev) => prev + totalPrize);

    
  function dispararConfete() {
    const duration = 1.5 * 1000;
    const end = Date.now() + duration;
  
    const colors = ["#e0b43d", "#ffffff", "#a3291a", "#00cc88"];
  
    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
  
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }
    
  
    setTimeout(() => {
      setSpinning(false); // permite rodar de novo após os rolos pararem
    }, 2500);
  };

  

  return (
<div
  className={`flex flex-col lg:flex-row gap-0 mt-0 p-2 max-w-4xl mx-auto items-center justify-center 
    rounded-md w-full h-[100vh] relative overflow-hidden ${isInlineAd ? "cursor-pointer" : ""}`}
  onClick={isInlineAd ? spin : undefined}
  style={{
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
<div className="flex flex-col gap-2 w-full lg:w-84">
        <div className="bg-black/70 p-4 rounded-lg shadow-md">
        {jackpotTotal > 0 && (
          <div className="bg-[#e0b43d] p-4 rounded-lg shadow mb-2">
            🏆 Prêmio:{" "}
            <strong className="text-yellow-800">
            $  {Math.floor(jackpotTotal)} 
            </strong>
          </div>
        )}
          <h2 className="text-lg font-semibold mb-2">💸 Seus ganhos hoje</h2>
          <p className="text-3xl font-bold text-green-700"> $ {dailyWins} </p>
          <p className="text-sm text-gray-500 mt-1">* Acumulado nesta sessão</p>
        </div>
        
      <div className="bg-black/70 flex-1 text-center space-y-4 rounded-md p-1">
        <div className="text-2xl font-bold">
          🎰 💰 Créditos: {credits !== null ? credits : "Carregando..."}
        </div>

        <div className="flex justify-center space-x-2 w-200 h-200">
          {result.map((value, i) => (
            <Reel
              key={i}
              finalIndex={value}
              spinning={spinning}
              delay={i * 300}
            />
          ))}
        </div>

        <div className="mt-4">
          <label className="block mb-1 font-semibold">Rodadas:</label>
          <select
            className="p-2 border rounded-md"
            value={spinCount}
            onChange={(e) => setSpinCount(parseInt(e.target.value))}
          >
            {Array.from({ length: 20 }, (_, i) => i + 1).map((val) => (
              <option key={val} value={val}>
                {val}x
              </option>
            ))}
          </select>
        </div>

        {!isInlineAd && (
  <button
    onClick={spin}
    disabled={spinning || credits === null || credits < spinCount}
    className="mt-4 px-6 py-3 bg-purple-700 text-white rounded-lg disabled:opacity-50"
  >
    {spinning ? "Rodando..." : `Puxar alavanca (${spinCount}x)`}
  </button>
)}


        {error && <div className="text-red-500">{error}</div>}
        {prize !== null && prize > 0 && (
  <div className="bg-#e0b43d[] border border-green-400 text-green-800 px-4 py-3 rounded-lg shadow-md flex flex-col items-center animate-pulse transition-all duration-500">
    <div className="text-4xl mb-2">🎉💰✨</div>
    <div className="text-xl font-bold">
      Você ganhou <span className="text-yellow-800">{prize}</span> crédito{prize === 1 ? "" : "s"}!
    </div>
    <div className="text-lg mt-1">Parabéns! 🤑🔥</div>
  </div>
        )}
      </div>

      

        
      </div>
    </div>
  );
}


/*
"use client";
import { useEffect, useState } from "react";
import Reel from "./Reel"; // ou ajuste o caminho se estiver em outro lugar
import confetti from "canvas-confetti";

export default function JackpotMachine({ isInlineAd = false }: { isInlineAd?: boolean }) {

  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number[]>([0, 1, 2, 3, 4]); // inicial fixo
  const [prize, setPrize] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [credits, setCredits] = useState<number | null>(null);
  const [dailyWins, setDailyWins] = useState(0);
  const [jackpotTotal, setJackpotTotal] = useState<number>(0);
  const [spinCount, setSpinCount] = useState(1);

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

  const spin = async () => {
    if (!credits || credits < spinCount) {
      setError("Créditos insuficientes");
      return;
    }

    setSpinning(true);
    setError("");
    setPrize(null);

    let totalPrize = 0;
    let finalResult = result;

    for (let i = 0; i < spinCount; i++) {
      try {
        const res = await fetch("/api/bet/spin", { method: "POST" });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Erro ao rodar máquina");

        finalResult = data.result;
        setResult(finalResult);
        setPrize(data.prize);
        setCredits(data.updatedCredits);
        setJackpotTotal(data.jackpotTotal || 0);
        totalPrize += data.dailyWins || 0;

        // ✅ Dispara confete aqui, com base no resultado da rodada
    if (data.prize > 0 || data.isJackpot) {
      dispararConfete();
    }

        await new Promise((r) => setTimeout(r, 500));
      } catch (err: any) {
        setError(err.message);
        break;
      }
    }

    setDailyWins((prev) => prev + totalPrize);

    
  function dispararConfete() {
    const duration = 1.5 * 1000;
    const end = Date.now() + duration;
  
    const colors = ["#e0b43d", "#ffffff", "#a3291a", "#00cc88"];
  
    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
  
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }
    
  
    setTimeout(() => {
      setSpinning(false); // permite rodar de novo após os rolos pararem
    }, 2500);
  };

  

  return (
<div
  className={`flex flex-col lg:flex-row gap-8 mt-10 p-4 max-w-4xl mx-auto w-full h-[100vh] 
    bg-gradient-to-t from-yellow-100 via-yellow-300 to-red-600 
    ${isInlineAd ? "cursor-pointer" : ""}`}
  onClick={isInlineAd ? spin : undefined}
>
<div className="flex flex-col gap-4 w-full lg:w-64">
        <div className="bg-black/10 p-4 rounded-lg shadow-md">
        {jackpotTotal > 0 && (
          <div className="bg-[#e0b43d] p-4 rounded-lg shadow mb-2">
            🏆 Prêmio:{" "}
            <strong className="text-yellow-800">
            $  {Math.floor(jackpotTotal)} 
            </strong>
          </div>
        )}
          <h2 className="text-lg font-semibold mb-2">💸 Seus ganhos hoje</h2>
          <p className="text-3xl font-bold text-green-700"> $ {dailyWins} </p>
          <p className="text-sm text-gray-500 mt-1">* Acumulado nesta sessão</p>
        </div>
        
      <div className="flex-1 text-center space-y-4">
        <div className="text-2xl font-bold">
          🎰 Créditos: {credits !== null ? credits : "Carregando..."}
        </div>

        <div className="flex justify-center space-x-2 w-200 h-200">
          {result.map((value, i) => (
            <Reel
              key={i}
              finalIndex={value}
              spinning={spinning}
              delay={i * 300}
            />
          ))}
        </div>

        <div className="mt-4">
          <label className="block mb-1 font-semibold">Rodadas:</label>
          <select
            className="p-2 border rounded-md"
            value={spinCount}
            onChange={(e) => setSpinCount(parseInt(e.target.value))}
          >
            {Array.from({ length: 20 }, (_, i) => i + 1).map((val) => (
              <option key={val} value={val}>
                {val}x
              </option>
            ))}
          </select>
        </div>

        {!isInlineAd && (
  <button
    onClick={spin}
    disabled={spinning || credits === null || credits < spinCount}
    className="mt-4 px-6 py-3 bg-purple-700 text-white rounded-lg disabled:opacity-50"
  >
    {spinning ? "Rodando..." : `Puxar alavanca (${spinCount}x)`}
  </button>
)}


        {error && <div className="text-red-500">{error}</div>}
        {prize !== null && prize > 0 && (
  <div className="bg-#e0b43d[] border border-green-400 text-green-800 px-4 py-3 rounded-lg shadow-md flex flex-col items-center animate-pulse transition-all duration-500">
    <div className="text-4xl mb-2">🎉💰✨</div>
    <div className="text-xl font-bold">
      Você ganhou <span className="text-yellow-800">{prize}</span> crédito{prize === 1 ? "" : "s"}!
    </div>
    <div className="text-lg mt-1">Parabéns! 🤑🔥</div>
  </div>
        )}
      </div>

      

        
      </div>
    </div>
  );
}
*/

/*
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const IMAGE_COUNT = 13;

function getImage(index: number) {
  return `/${index + 1}.png`; // As imagens devem estar em /public/1.png até /public/13.png
}

function Reel({
  index,
  spinning,
  result,
}: {
  index: number;
  spinning: boolean;
  result: number | null;
}) {
  const [visibleIndex, setVisibleIndex] = useState<number>(
    Math.floor(Math.random() * IMAGE_COUNT)
  );

  useEffect(() => {
    if (spinning) {
      let spinInterval = setInterval(() => {
        setVisibleIndex((prev) => (prev + 1) % IMAGE_COUNT);
      }, 50);

      // Para em tempos diferentes por rolo (efeito visual)
      setTimeout(() => {
        clearInterval(spinInterval);
        if (result !== null) setVisibleIndex(result);
      }, 1200 + index * 250);

      return () => clearInterval(spinInterval);
    }
  }, [spinning, result, index]);


  return (
    <div className="w-20 h-20 border-4 border-purple-600 rounded-xl bg-black flex items-center justify-center overflow-hidden">
      <Image
        src={getImage(visibleIndex)}
        alt={`img-${visibleIndex + 1}`}
        width={25}
        height={25}
        className="w-full h-full object-contain"
      />
    </div>
  );
}

export default function JackpotMachine() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number[] | null>(null);
  const [prize, setPrize] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [credits, setCredits] = useState<number | null>(null);
  const [dailyWins, setDailyWins] = useState(0);
  const [jackpotTotal, setJackpotTotal] = useState<number>(0);
  const [spinCount, setSpinCount] = useState(1);

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

  const spin = async () => {
    if (!credits || credits < spinCount) {
      setError("Créditos insuficientes");
      return;
    }

    setSpinning(true);
    setError("");
    setResult(null);
    setPrize(null);

    let totalPrize = 0;

    for (let i = 0; i < spinCount; i++) {
      try {
        const res = await fetch("/api/bet/spin", { method: "POST" });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Erro ao rodar máquina");

        setResult(data.result);
        setPrize(data.prize);
        setCredits(data.updatedCredits);
        setJackpotTotal(data.jackpotTotal || 0);
        totalPrize += data.dailyWins || 0;

        await new Promise((r) => setTimeout(r, 500)); // pausa entre rodadas
      } catch (err: any) {
        setError(err.message);
        break;
      }
    }

    setDailyWins((prev) => prev + totalPrize);
    setSpinning(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 mt-10 p-6 max-w-4xl mx-auto">
 
      <div className="flex-1 text-center space-y-4">
        <div className="text-2xl font-bold">
          🎰 Créditos: {credits !== null ? credits : "Carregando..."}
        </div>

        <div className="flex justify-center space-x-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <Reel
              key={i}
              index={i}
              spinning={spinning}
              result={result ? result[i] : null}
            />
          ))}
        </div>

       
        <div className="mt-4">
          <label className="block mb-1 font-semibold">Rodadas:</label>
          <select
            className="p-2 border rounded-md"
            value={spinCount}
            onChange={(e) => setSpinCount(parseInt(e.target.value))}
          >
            {Array.from({ length: 20 }, (_, i) => i + 1).map((val) => (
              <option key={val} value={val}>
                {val}x
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={spin}
          disabled={spinning || credits === null || credits < spinCount}
          className="mt-4 px-6 py-3 bg-purple-700 text-white rounded-lg disabled:opacity-50"
        >
          {spinning ? "Rodando..." : `Puxar alavanca (${spinCount}x)`}
        </button>

        {error && <div className="text-red-500">{error}</div>}
        {prize !== null && prize > 0 && (
          <div className="text-green-600 font-bold text-xl">
            Você ganhou {prize} crédito{prize === 1 ? "" : "s"}!
          </div>
        )}
      </div>

    
      <div className="flex flex-col gap-4 w-full lg:w-64">
        <div className="bg-black/10 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">💸 Seus ganhos hoje</h2>
          <p className="text-3xl font-bold text-green-700">{dailyWins} créditos</p>
          <p className="text-sm text-gray-500 mt-1">* Acumulado nesta sessão</p>
        </div>

        {jackpotTotal > 0 && (
          <div className="bg-yellow-100 p-4 rounded-lg shadow">
            🏆 Jackpot atual:{" "}
            <strong className="text-yellow-800">
              {Math.floor(jackpotTotal)} créditos
            </strong>
          </div>
        )}
      </div>
    </div>
  );
}


*/
