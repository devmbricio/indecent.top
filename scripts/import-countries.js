// scripts/import-countries.js
const { PrismaClient } = require('@prisma/client');
const countriesData = require('./data/countries.json'); // Assumindo um arquivo JSON

const prisma = new PrismaClient();

async function main() {
  try {
    for (const country of countriesData) {
      await prisma.country.create({
        data: {
          name: country.name,
          slug: country.name.toLowerCase().replace(/ /g, '-'), // Gere um slug
        },
      });
      console.log(`País "${country.name}" importado.`);
    }
  } catch (error) {
    console.error('Erro ao importar países:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();