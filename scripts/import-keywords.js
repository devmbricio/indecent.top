// scripts/import-keywords.js
const { PrismaClient } = require('@prisma/client');
const keywordsData = require('./data/keywords.json'); // Assumindo um arquivo JSON

const prisma = new PrismaClient();

async function main() {
  try {
    for (const keywordInfo of keywordsData) {
      let city = null;
      if (keywordInfo.city) {
        city = await prisma.city.findFirst({
          where: {
            slug: keywordInfo.city.toLowerCase().replace(/ /g, '-'),
          },
          include: {
            country: true,
          },
        });
      }

      let country = null;
      if (keywordInfo.country && !city) { // Se a palavra-chave for a nível de país e não de cidade
        country = await prisma.country.findUnique({
          where: {
            slug: keywordInfo.country.toLowerCase().replace(/ /g, '-'),
          },
        });
      }

      await prisma.keyword.create({
        data: {
          value: keywordInfo.value,
          slug: keywordInfo.value.toLowerCase().replace(/ /g, '-'),
          cityId: city?.id,
          countryId: country?.id,
        },
      });
      console.log(`Palavra-chave "${keywordInfo.value}" importada.`);
    }
  } catch (error) {
    console.error('Erro ao importar palavras-chave:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();