import axios from 'axios';
import * as cheerio from 'cheerio';

const POWERBALL_URL = "https://www.powerball.com/";

export async function scrapePowerballResultsWithPrizes() {
    try {
        const response = await axios.get(POWERBALL_URL);
        // Axios lança um erro automaticamente para status fora de 2xx
        // Não precisamos de response.raise_for_status()
        const html = response.data;
        const $ = cheerio.load(html);

        const drawDateElement = $('.draw-date');
        const drawDateText = drawDateElement.text().trim().split(': ')[1];
        const drawDate = new Date(drawDateText);

        const winningNumbersElement = $('.winning-numbers');
        const winningNumbersText = winningNumbersElement.text().trim().split(' ');
        const winningNumbers = winningNumbersText.map(Number).filter(num => !isNaN(num));

        const powerballNumberElement = $('.powerball-number');
        const powerballNumber = parseInt(powerballNumberElement.text().trim(), 10);

        const powerPlayElement = $('.power-play-number');
        const powerPlayText = powerPlayElement.text().trim();
        const powerPlay = powerPlayText.split(' ').map(Number).filter(num => !isNaN(num));

        const prizeTable = $('.prize-payout'); // Exemplo de seletor da tabela de prêmios
        const prizes: any[] = [];

        prizeTable.find('tr').each((i, row) => {
            if (i > 0) { // Ignorar cabeçalho
                const cols = $(row).find('td');
                if (cols.length >= 3) {
                    const match = $(cols[0]).text().trim();
                    const prize = $(cols[1]).text().trim();
                    const powerPlayPrize = $(cols[2]).text().trim();
                    prizes.push({ match, prize, powerPlayPrize });
                }
            }
        });

        return {
            drawDate: drawDate.toISOString(),
            winningNumbers,
            powerballNumber,
            powerPlay: powerPlay.length > 0 ? powerPlay : undefined,
            prizes
        };

    } catch (error: any) {
        console.error("Erro ao raspar resultados com prêmios:", error.message);
        return null;
    }
}

// Exemplo de uso (em um arquivo separado ou dentro de uma API route)
// scrapePowerballResultsWithPrizes().then(results => console.log(results));