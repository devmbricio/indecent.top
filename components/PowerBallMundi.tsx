    "use client";

    import { useEffect, useState } from "react";

    interface PowerballResult {
        drawDate: string;
        winningNumbers: number[];   
        powerballNumber: number;
        powerPlay?: string;
    }

    interface UserCredits {
        credits: number;
    }

    interface BetResponse {
        success: boolean;
        message?: string;
        updatedCredits?: number;
    }

    interface PowerballMundiProps {
        isInlineAd?: boolean;
    }

    interface JackpotInfo {
        estimatedJackpot: string;
        cashValue: string;
        nextDrawDate: string;
    }

    export default function PowerballMundi({ isInlineAd = false }: PowerballMundiProps) {
        const [credits, setCredits] = useState<number | null>(null);
        const [error, setError] = useState<string>("");
        const [mainNumbers, setMainNumbers] = useState<number[]>([]);
        const [powerballNumber, setPowerballNumber] = useState<number | null>(null);
        const [quantity, setQuantity] = useState<number>(1);
        const [betting, setBetting] = useState<boolean>(false);
        const [latestResult, setLatestResult] = useState<PowerballResult | null>(null);
        const [fetchingResults, setFetchingResults] = useState<boolean>(false);
        const [jackpotInfo, setJackpotInfo] = useState<JackpotInfo | null>(null);
        const [fetchingJackpot, setFetchingJackpot] = useState<boolean>(false);
        const [pastResults, setPastResults] = useState<PowerballResult[]>([]);
        const [fetchingPastResults, setFetchingPastResults] = useState<boolean>(false);

        useEffect(() => {
            const fetchPastResults = async () => {
                setFetchingPastResults(true);
                try {
                    const res = await fetch(`/api/powerball/past-results?limit=5`);
                    if (!res.ok) {
                        const data = await res.json();
                        throw new Error(data?.error || "Erro ao buscar resultados anteriores");
                    }
                    const data: PowerballResult[] = await res.json();
                    setPastResults(data);
                } catch (err: any) {
                    setError("Erro ao buscar resultados anteriores");
                    console.error("Erro ao buscar resultados anteriores:", err);
                    setPastResults([]);
                } finally {
                    setFetchingPastResults(false);
                }
            };

            fetchPastResults();
        }, []);

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
                    const res = await fetch("/api/powerball/latest-results");
                    if (!res.ok) {
                        const data = await res.json();
                        throw new Error(data?.error || "Erro ao buscar resultados");
                    }
                    const data: PowerballResult = await res.json();
                    setLatestResult(data);
                } catch (err: any) {
                    setError("Erro ao buscar últimos resultados");
                    console.error("Erro ao buscar últimos resultados:", err);
                    setLatestResult(null);
                } finally {
                    setFetchingResults(false);
                }
            };

            fetchLatestResults();
        }, []);

        useEffect(() => {
            const fetchJackpotInfo = async () => {
                setFetchingJackpot(true);
                try {
                    const res = await fetch("/api/powerball/jackpot-info");
                    if (!res.ok) {
                        const data = await res.json();
                        throw new Error(data?.error || "Erro ao buscar informações do jackpot");
                    }
                    const data: JackpotInfo = await res.json();
                    setJackpotInfo(data);
                } catch (err: any) {
                    setError("Erro ao buscar informações do jackpot");
                    console.error("Erro ao buscar informações do jackpot:", err);
                    setJackpotInfo(null);
                } finally {
                    setFetchingJackpot(false);
                }
            };

            fetchJackpotInfo();
        }, []);

        useEffect(() => {
            const fetchPastResults = async () => {
                setFetchingPastResults(true);
                try {
                    const res = await fetch("/api/powerball/latest-results?limit=5"); // Buscar os últimos 5 sorteios
                    if (!res.ok) {
                        const data = await res.json();
                        throw new Error(data?.error || "Erro ao buscar resultados anteriores");
                    }
                    const data: PowerballResult[] = await res.json();
                    setPastResults(data);
                } catch (err: any) {
                    setError("Erro ao buscar resultados anteriores");
                    console.error("Erro ao buscar resultados anteriores:", err);
                    setPastResults([]);
                } finally {
                    setFetchingPastResults(false);
                }
            };

            fetchPastResults();
        }, []);

        useEffect(() => {
            const fetchPastResults = async () => {
                setFetchingPastResults(true);
                try {
                    const res = await fetch(`/api/powerball/past-results?limit=5`); // Buscar os últimos 5 sorteios salvos
                    if (!res.ok) {
                        const data = await res.json();
                        throw new Error(data?.error || "Erro ao buscar resultados anteriores");
                    }
                    const data: PowerballResult[] = await res.json();
                    setPastResults(data);
                } catch (err: any) {
                    setError("Erro ao buscar resultados anteriores");
                    console.error("Erro ao buscar resultados anteriores:", err);
                    setPastResults([]);
                } finally {
                    setFetchingPastResults(false);
                }
            };
        
            fetchPastResults();
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
            <div className="bg-center bg-cover" style={{ backgroundImage: "url('/powerball.png')" }}>
                <div className={`flex flex-col items-center p-4 bg-black/50  ${isInlineAd ? 'rounded-md shadow-sm p-4' : ''}`}>
                    <h1 className="text-2xl font-bold mb-4">Powerball</h1>

                    {error && <div className="text-red-500 mb-2">{error}</div>}

                    {credits !== null ? (
                        <div className="mb-4 text-lg"> Créditos: {credits}</div>
                    ) : (
                        <div className="mb-4 text-lg">Carregando créditos...</div>
                    )}

                    {jackpotInfo && (
                        <div className="mb-4 text-center">
                            <h2 className="font-semibold text-lg">Próximo Sorteio ({jackpotInfo.nextDrawDate.split(',')[0]}):</h2>
                            <p className="text-xl font-bold text-green-500">Jackpot Estimado: {jackpotInfo.estimatedJackpot}</p>
                            <p className="text-md">Valor em Dinheiro: {jackpotInfo.cashValue}</p>
                        </div>
                    )}

                    <div className="mb-4">
                        <h2 className="font-semibold mb-2">Escolha 5 números principais (1-69):</h2>
                        <div className="grid grid-cols-8 gap-1">
                            {mainNumberOptions.map((num) => (
                                <button
                                    key={num}
                                    onClick={() => handleMainNumberSelect(num)}
                                    className={`w-8 h-8 rounded-full text-sm flex items-center justify-center ${
                                        mainNumbers.includes(num) ? "bg-blue-500 text-white" : "bg-gray-200 border text-gray-700"
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
                                        powerballNumber === num ? "bg-red-500 text-white" : "bg-gray-200 border text-gray-700"
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
                        ) : latestResult ? (
                            <div>
                                <p>Data do Sorteio: {new Date(latestResult.drawDate).toLocaleDateString()}</p>
                                <p>Números: {latestResult.winningNumbers.join(" ")} <span className="font-bold text-red-500">PB: {latestResult.powerballNumber}</span></p>
                                {latestResult.powerPlay && (
                                    <p>Power Play: {latestResult.powerPlay}</p>
                                )}
                            </div>
                        ) : (
                            <p>{error ? "Erro ao buscar últimos resultados." : "Nenhum resultado disponível."}</p>
                        )}
                    </div>

                    <div className="mt-8 border-t pt-4 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-2">Sorteios Anteriores</h2>
                        {fetchingPastResults ? (
                            <p>Carregando sorteios anteriores...</p>
                        ) : pastResults.length > 0 ? (
                            <ul>
                                {pastResults.map((result) => (
                                    <li key={result.drawDate} className="mb-2">
                                        Data: {new Date(result.drawDate).toLocaleDateString()} - Números: {result.winningNumbers.join(" ")} PB: <span className="font-bold text-red-500">{result.powerballNumber}</span> {result.powerPlay && `(Power Play: ${result.powerPlay})`}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>{error ? "Erro ao buscar sorteios anteriores." : "Nenhum sorteio anterior disponível."}</p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

/*
"use client";

import { useEffect, useState } from "react";

interface PowerballResult {
    drawDate: string;
    winningNumbers: number[];
    powerballNumber: number;
    powerPlay?: string;
}

interface UserCredits {
    credits: number;
}

interface BetResponse {
    success: boolean;
    message?: string;
    updatedCredits?: number;
}

interface PowerballMundiProps {
    isInlineAd?: boolean;
}

interface JackpotInfo {
    estimatedJackpot: string;
    cashValue: string;
    nextDrawDate: string;
}

export default function PowerballMundi({ isInlineAd = false }: PowerballMundiProps) {
    const [credits, setCredits] = useState<number | null>(null);
    const [error, setError] = useState<string>("");
    const [mainNumbers, setMainNumbers] = useState<number[]>([]);
    const [powerballNumber, setPowerballNumber] = useState<number | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [betting, setBetting] = useState<boolean>(false);
    const [latestResult, setLatestResult] = useState<PowerballResult | null>(null);
    const [fetchingResults, setFetchingResults] = useState<boolean>(false);
    const [jackpotInfo, setJackpotInfo] = useState<JackpotInfo | null>(null);
    const [fetchingJackpot, setFetchingJackpot] = useState<boolean>(false);
    const [pastResults, setPastResults] = useState<PowerballResult[]>([]);
    const [fetchingPastResults, setFetchingPastResults] = useState<boolean>(false);
    

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
                const res = await fetch("/api/powerball/latest-results");
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data?.error || "Erro ao buscar resultados");
                }
                const data: PowerballResult = await res.json();
                setLatestResult(data);
            } catch (err: any) {
                setError("Erro ao buscar últimos resultados");
                console.error("Erro ao buscar últimos resultados:", err);
                setLatestResult(null);
            } finally {
                setFetchingResults(false);
            }
        };

        fetchLatestResults();
    }, []);

    useEffect(() => {
        const fetchJackpotInfo = async () => {
            setFetchingJackpot(true);
            try {
                const res = await fetch("/api/powerball/jackpot-info");
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data?.error || "Erro ao buscar informações do jackpot");
                }
                const data: JackpotInfo = await res.json();
                setJackpotInfo(data);
            } catch (err: any) {
                setError("Erro ao buscar informações do jackpot");
                console.error("Erro ao buscar informações do jackpot:", err);
                setJackpotInfo(null);
            } finally {
                setFetchingJackpot(false);
            }
        };

        fetchJackpotInfo();
    }, []);

    useEffect(() => {
        const fetchPastResults = async () => {
            setFetchingPastResults(true);
            try {
                const res = await fetch("/api/powerball/past-results?limit=5"); // Buscar os últimos 5 sorteios
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data?.error || "Erro ao buscar resultados anteriores");
                }
                const data: PowerballResult[] = await res.json();
                setPastResults(data);
            } catch (err: any) {
                setError("Erro ao buscar resultados anteriores");
                console.error("Erro ao buscar resultados anteriores:", err);
                setPastResults([]);
            } finally {
                setFetchingPastResults(false);
            }
        };

        fetchPastResults();
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
        <div className="bg-center bg-cover" style={{ backgroundImage: "url('/powerball.png')" }}>
            <div className={`flex flex-col items-center p-4 ${isInlineAd ? 'bg-black/10 rounded-md shadow-sm p-4' : ''}`}>
                <h1 className="text-2xl font-bold mb-4">Powerball</h1>

                {error && <div className="text-red-500 mb-2">{error}</div>}

                {credits !== null ? (
                    <div className="mb-4 text-lg"> Créditos: {credits}</div>
                ) : (
                    <div className="mb-4 text-lg">Carregando créditos...</div>
                )}

                {jackpotInfo && (
                    <div className="mb-4 text-center">
                        <h2 className="font-semibold text-lg">Próximo Sorteio ({jackpotInfo.nextDrawDate.split(',')[0]}):</h2>
                        <p className="text-xl font-bold text-green-500">Jackpot Estimado: {jackpotInfo.estimatedJackpot}</p>
                        <p className="text-md">Valor em Dinheiro: {jackpotInfo.cashValue}</p>
                    </div>
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
                    ) : latestResult ? (
                        <div>
                            <p>Data do Sorteio: {new Date(latestResult.drawDate).toLocaleDateString()}</p>
                            <p>Números: {latestResult.winningNumbers.join(" ")} <span className="font-bold text-red-500">PB: {latestResult.powerballNumber}</span></p>
                            {latestResult.powerPlay && (
                                <p>Power Play: {latestResult.powerPlay}</p>
                            )}
                        </div>
                    ) : (
                        <p>{error ? "Erro ao buscar últimos resultados." : "Nenhum resultado disponível."}</p>
                    )}
                </div>

                <div className="mt-8 border-t pt-4 w-full max-w-md">
                    <h2 className="text-xl font-bold mb-2">Sorteios Anteriores</h2>
                    {fetchingPastResults ? (
                        <p>Carregando sorteios anteriores...</p>
                    ) : pastResults.length > 0 ? (
                        <ul>
                            {pastResults.map((result) => (
                                <li key={result.drawDate} className="mb-2">
                                    Data: {new Date(result.drawDate).toLocaleDateString()} - Números: {result.winningNumbers.join(" ")} PB: <span className="font-bold text-red-500">{result.powerballNumber}</span> {result.powerPlay && `(Power Play: ${result.powerPlay})`}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>{error ? "Erro ao buscar sorteios anteriores." : "Nenhum sorteio anterior disponível."}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

*/