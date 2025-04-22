// scripts/import-cities.js
const { PrismaClient } = require('@prisma/client');
const citiesData = require('./data/brazilian-cities-names.json'); // Novo arquivo de dados

const prisma = new PrismaClient();

async function main() {
  try {
    const brasil = await prisma.country.findUnique({
      where: {
        name: 'Brasil',
      },
    });

    if (brasil) {
      for (const cityName of citiesData) {
        await prisma.city.create({
          data: {
            name: cityName,
            slug: cityName.toLowerCase().replace(/ /g, '-'),
            countryId: brasil.id,
          },
        });
        console.log(`Cidade "${cityName}" importada.`);
      }
    } else {
      console.error('País "Brasil" não encontrado no banco de dados.');
    }
  } catch (error) {
    console.error('Erro ao importar cidades:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();