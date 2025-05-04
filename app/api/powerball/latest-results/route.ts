// pages/api/powerball/latest-results.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const latestResult = await prisma.powerballResult.findFirst({
        orderBy: { drawDate: 'desc' },
      });

      if (latestResult) {
        res.status(200).json({
          drawDate: latestResult.drawDate.toISOString(),
          winningNumbers: latestResult.winningNumbers,
          powerballNumber: latestResult.powerballNumber,
          powerPlay: latestResult.powerPlay,
        });
      } else {
        res.status(404).json({ error: 'Nenhum resultado disponível.' });
      }
    } catch (error) {
      console.error('Erro ao buscar os últimos resultados:', error);
      res.status(500).json({ error: 'Erro ao buscar os últimos resultados.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}