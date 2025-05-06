const axios = require('axios');

async function callScrapeAndSave() {
  try {
    const response = await axios.post('http://localhost:3000/api/powerball/admin/scrape-and-save-past');
    console.log('Resposta da rota de raspagem:', response.data);
  } catch (error) {
    console.error('Erro ao chamar a rota de raspagem:', error.message);
  }
}

callScrapeAndSave();