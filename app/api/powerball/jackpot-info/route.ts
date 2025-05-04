// pages/api/powerball/jackpot-info.ts
import type { NextApiRequest, NextApiResponse } from 'next';

// Função simulada para buscar informações do jackpot
async function fetchJackpotData() {
    try {
        // Aqui você faria a chamada real para a sua fonte de dados do jackpot
        await new Promise(resolve => setTimeout(resolve, 500)); // Simula um delay
        return {
            estimatedJackpot: "$450 Milhões",
            cashValue: "$220 Milhões",
            nextDrawDate: "Sábado, 6 de Maio de 2025",
        };
    } catch (error) {
        console.error("Erro ao buscar dados do jackpot:", error);
        throw new Error("Falha ao obter informações do jackpot.");
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const jackpotData = await fetchJackpotData();
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(jackpotData);
        } catch (error: any) {
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}