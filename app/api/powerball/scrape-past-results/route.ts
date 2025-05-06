// app/api/powerball/scrape-past-results/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

const POWERBALL_ARCHIVE_URL = "https://www.powerball.com/previous-results";

async function scrapePastPowerballResults(limit: number = 5) {
  try {
    const response = await axios.get(POWERBALL_ARCHIVE_URL);
    const html = response.data;
    const $ = cheerio.load(html);
    const results: any[] = [];
    const rows = $(".previous-results-table tbody tr");

    rows.each((i, row) => {
      if (i < limit) {
        const drawDateText = $(row).find(".draw-date").text().trim();
        const drawDate = new Date(drawDateText);
        const winningNumbers: number[] = [];
        $(row).find(".winning-numbers li").each((_, el) => {
          const numText = $(el).text().trim();
          const num = parseInt(numText, 10);
          if (!isNaN(num)) {
            winningNumbers.push(num);
          }
        });

        const powerballNumberText = $(row).find(".powerball-number").text().trim();
        const powerballNumber = parseInt(powerballNumberText, 10);
        const powerPlayText = $(row).find(".power-play-number").text().trim();
        const powerPlay = powerPlayText ? parseInt(powerPlayText, 10) : undefined;

        results.push({
          drawDate: drawDate.toISOString(),
          winningNumbers,
          powerballNumber,
          powerPlay,
        });
      }
    });

    return results;
  } catch (error: any) {
    console.error("Erro ao raspar resultados anteriores:", error.message);
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : 5;

  const pastResults = await scrapePastPowerballResults(limit);

  return NextResponse.json(pastResults);
}


/*

// pages/api/powerball/scrape-past-results.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import * as cheerio from 'cheerio';

const POWERBALL_ARCHIVE_URL = "https://www.powerball.com/previous-results";

async function scrapePastPowerballResults(limit: number = 5) {
    try {
        const response = await axios.get(POWERBALL_ARCHIVE_URL);
        const html = response.data;
        const $ = cheerio.load(html);
        const results: any[] = [];
        const rows = $('.previous-results-table tbody tr');

        rows.each((i, row) => {
            if (i < limit) {
                const drawDateText = $(row).find('.draw-date').text().trim();
                const drawDate = new Date(drawDateText);
                const winningNumbers: number[] = [];
                $(row).find('.winning-numbers li').each((_, el) => {
                    const numText = $(el).text().trim();
                    const num = parseInt(numText, 10);
                    if (!isNaN(num)) {
                        winningNumbers.push(num);
                    }
                });
                const powerballNumberText = $(row).find('.powerball-number').text().trim();
                const powerballNumber = parseInt(powerballNumberText, 10);
                const powerPlayText = $(row).find('.power-play-number').text().trim();
                const powerPlay = powerPlayText ? parseInt(powerPlayText, 10) : undefined;

                results.push({
                    drawDate: drawDate.toISOString(),
                    winningNumbers,
                    powerballNumber,
                    powerPlay,
                });
            }
        });

        return results;
    } catch (error: any) {
        console.error("Erro ao raspar resultados anteriores:", error.message);
        return [];
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const limit = parseInt(req.query.limit as string || '5', 10);
        const pastResults = await scrapePastPowerballResults(limit);
        res.status(200).json(pastResults);
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
*/