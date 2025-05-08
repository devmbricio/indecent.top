// server/cron-jobs.ts
import cron from 'node-cron';
import axios from 'axios';

const SCRAPE_API_URL = 'https://indecent.top/api/powerball/admin/scrape-and-save-past'; // Ajuste a URL se necessário

// Executar a raspagem e o salvamento todos os dias à meia-noite (exemplo)
cron.schedule('0 0 * * *', async () => {
    console.log('Executando a tarefa de raspagem dos resultados anteriores...');
    try {
        const response = await axios.post(SCRAPE_API_URL);
        console.log('Tarefa de raspagem concluída:', response.data);
    } catch (error: any) {
        console.error('Erro ao executar a tarefa de raspagem:', error.message);
    }
});

console.log('Tarefas agendadas.');