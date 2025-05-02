"use client";

import { useEffect, useState } from "react";

interface PowerballResult {
  drawDate: string;
  winningNumbers: number[];
  powerballNumber: number;
  powerPlay?: number[];
}

interface UserCredits {
  credits: number;
}

interface BetResponse {
  success: boolean;
  message?: string;
  updatedCredits?: number;
}

export default function PowerballApp() {
  const [credits, setCredits] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [mainNumbers, setMainNumbers] = useState<number[]>([]);
  const [powerballNumber, setPowerballNumber] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [betting, setBetting] = useState<boolean>(false);
  const [results, setResults] = useState<PowerballResult | null>(null);
  const [fetchingResults, setFetchingResults] = useState<boolean>(false);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const res = await fetch("/api/user/credits");
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data?.error || "Erro ao buscar créditos");
        }
        const data: UserCredits = await res.json();
        setCredits(data.credits);
      } catch (err: any) {
        setError("Erro ao buscar créditos");
        console.error("Erro ao buscar créditos:", err);
        setCredits(0); // Valor padrão em caso de erro
      }
    };

    fetchCredits();
  }, []);

  useEffect(() => {
    const fetchLatestResults = async () => {
      setFetchingResults(true);
      try {
        const res = await fetch("/api/powerball/results");
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data?.error || "Erro ao buscar resultados");
        }
        const data: PowerballResult = await res.json();
        setResults(data);
      } catch (err: any) {
        setError("Erro ao buscar resultados");
        console.error("Erro ao buscar resultados:", err);
        setResults(null);
      } finally {
        setFetchingResults(false);
      }
    };

    fetchLatestResults();
  }, []);

  const handleMainNumberSelect = (number: number) => {
    if (mainNumbers.includes(number)) {
      setMainNumbers(mainNumbers.filter((num) => num !== number));
    } else if (mainNumbers.length < 5) {
      setMainNumbers([...mainNumbers, number].sort((a, b) => a - b));
    }
  };

  const handlePowerballNumberSelect = (number: number) => {
    setPowerballNumber(number);
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setQuantity(isNaN(value) || value < 1 ? 1 : value);
  };

  const calculateBetCost = () => {
    return quantity * 2; // Custo por aposta (ajuste conforme necessário)
  };

  const canBet = () => {
    return mainNumbers.length === 5 && powerballNumber !== null && credits !== null && credits >= calculateBetCost() && !betting;
  };

  const handlePlaceBet = async () => {
    if (!canBet()) {
      setError("Selecione 5 números principais e 1 Powerball, e tenha créditos suficientes.");
      return;
    }

    setBetting(true);
    setError("");

    try {
      const res = await fetch("/api/powerball/bet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mainNumbers,
          powerballNumber,
          quantity,
        }),
      });

      const data: BetResponse = await res.json();

      if (res.ok && data.success) {
        setCredits(data.updatedCredits || (credits !== null ? credits - calculateBetCost() : 0));
        alert(`Aposta realizada com sucesso! Você jogou ${quantity} vez(es).`);
        setMainNumbers([]);
        setPowerballNumber(null);
        setQuantity(1);
      } else {
        setError(data.message || "Erro ao realizar a aposta.");
      }
    } catch (err: any) {
      setError("Erro ao comunicar com o servidor para apostar.");
      console.error("Erro ao apostar:", err);
    } finally {
      setBetting(false);
    }
  };

  const mainNumberOptions = Array.from({ length: 69 }, (_, i) => i + 1);
  const powerballNumberOptions = Array.from({ length: 26 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Powerball</h1>

      {error && <div className="text-red-500 mb-2">{error}</div>}

      {credits !== null ? (
        <div className="mb-4 text-lg"> Créditos: {credits}</div>
      ) : (
        <div className="mb-4 text-lg">Carregando créditos...</div>
      )}

      <div className="mb-4">
        <h2 className="font-semibold mb-2">Escolha 5 números principais (1-69):</h2>
        <div className="grid grid-cols-8 gap-1">
          {mainNumberOptions.map((num) => (
            <button
              key={num}
              onClick={() => handleMainNumberSelect(num)}
              className={`w-8 h-8 rounded-full text-sm flex items-center justify-center ${
                mainNumbers.includes(num) ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
              disabled={mainNumbers.length >= 5 && !mainNumbers.includes(num)}
            >
              {num}
            </button>
          ))}
        </div>
        {mainNumbers.length > 0 && (
          <p className="mt-1 text-sm">Selecionados: {mainNumbers.join(", ")}</p>
        )}
      </div>

      <div className="mb-4">
        <h2 className="font-semibold mb-2">Escolha 1 número Powerball (1-26):</h2>
        <div className="grid grid-cols-6 gap-1">
          {powerballNumberOptions.map((num) => (
            <button
              key={num}
              onClick={() => handlePowerballNumberSelect(num)}
              className={`w-8 h-8 rounded-full text-sm flex items-center justify-center ${
                powerballNumber === num ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
        {powerballNumber !== null && (
          <p className="mt-1 text-sm">Powerball selecionado: {powerballNumber}</p>
        )}
      </div>

      <div className="mb-4 flex items-center">
        <label htmlFor="quantity" className="mr-2 font-semibold">Quantidade de jogos:</label>
        <input
          type="number"
          id="quantity"
          className="w-16 border rounded-md p-1 text-center"
          value={quantity}
          onChange={handleQuantityChange}
          min="1"
        />
        <p className="ml-2 text-sm">(Custo por jogo: $2)</p>
      </div>

      <button
        onClick={handlePlaceBet}
        className={`px-6 py-2 rounded-md font-semibold ${
          canBet() ? "bg-green-500 text-white hover:bg-green-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        disabled={!canBet() || betting}
      >
        {betting ? "Apostando..." : `Apostar ($${calculateBetCost()})`}
      </button>

      <div className="mt-8 border-t pt-4 w-full max-w-md">
        <h2 className="text-xl font-bold mb-2">Últimos Resultados do Powerball</h2>
        {fetchingResults ? (
          <p>Carregando resultados...</p>
        ) : results ? (
          <div>
            <p>Data do Sorteio: {new Date(results.drawDate).toLocaleDateString()}</p>
            <p>Números: {results.winningNumbers.join(" ")} <span className="font-bold text-red-500">PB: {results.powerballNumber}</span></p>
            {results.powerPlay && (
              <p>Power Play: {results.powerPlay.join(" ")}</p>
            )}
          </div>
        ) : (
          <p>{error ? "Erro ao buscar resultados." : "Nenhum resultado disponível."}</p>
        )}
      </div>
    </div>
  );
}