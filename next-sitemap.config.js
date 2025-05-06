const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const keywords1 =[
  { "value": "Acompanhantes" },
  { "value": "Garotas-de-Programa" },
];

const slugify = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const config = {
  siteUrl: 'https://www.indecent.top',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  outDir: './public',
  changefreq: 'daily',
  priority: 1.0,

  exclude: [
    '/api/*',
    '/login',
    '/signup',
    '/redirect',
    '/robots',
    '/sitemap',
  ],

  transform: async (config, path) => ({
    loc: path,
    changefreq: config.changefreq,
    priority: config.priority,
    lastmod: new Date().toISOString(),
  }),

  additionalPaths: async (config) => {
    try {
      const [users, countries] = await Promise.all([
        prisma.user.findMany({
          select: { username: true },
          where: { username: { not: null } },
        }),
        prisma.country.findMany({
          include: { cities: true },
        }),
      ]);

      console.log(`[SITEMAP] Usuários encontrados: ${users.length}`);
      console.log(`[SITEMAP] Países carregados: ${countries.length}`);

      const userProfilePaths = await Promise.all(
        users
          .filter(user => user.username)
          .map(user => config.transform(config, `/perfil/${user.username}`))
      );

      // 🔹 Para armazenar todos os paths
      const allKeywordPaths = [];

      // 🔹 Função para gerar URLs para cada lista
      const generateKeywordPaths = async (keywords, siteFolder) => {
        const paths = [];
        for (const kw of keywords) {
          const keywordSlug = slugify(kw.value);
          for (const country of countries) {
            for (const city of country.cities) {
              const slugCountry = slugify(country.slug || country.name);
              const slugCity = slugify(city.slug || city.name);
              const path = `/${keywordSlug}/${slugCity}/${slugCountry}`;
              paths.push(await config.transform(config, path));
            }
          }
        }
        return paths;
      };

      // 🔹 Gerar para cada grupo (site1, site2, ..., site10)
      const keywordGroups = [
        { keywords: keywords1, /*folder:  keywords1*/ },
      ];

      for (const group of keywordGroups) {
        const paths = await generateKeywordPaths(group.keywords, group.folder);
        allKeywordPaths.push(...paths);
        console.log(`[SITEMAP] URLs geradas para ${group.folder}: ${paths.length}`);
      }

      // 🔹 Páginas fixas
      const fixedPaths = await Promise.all([
        config.transform(config, '/'),
        config.transform(config, '/compras'),
      ]);

      return [...fixedPaths, ...userProfilePaths, ...allKeywordPaths];
    } catch (error) {
      console.error("❌ Erro ao gerar paths do sitemap:", error);
      return [];
    } finally {
      await prisma.$disconnect();
    }
  },
};

module.exports = config;

/*
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const keywords1 =[
  { "value": "Acompanhantes" },
  { "value": "Garotas-de-Programa" },
];
const keywords2 =[
];
const keywords3 =[
];
const keywords4 =[
];
const keywords5 =[
];
const keywords6 =[
];
const keywords7 =[
];
const keywords8 =[
];
const keywords9 =[
];
const keywords10 =[
];

const slugify = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const config = {
  siteUrl: 'https://www.indecent.top',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  outDir: './public',
  changefreq: 'daily',
  priority: 1.0,

  exclude: [
    '/api/*',
    '/login',
    '/signup',
    '/redirect',
    '/robots',
    '/sitemap',
  ],

  transform: async (config, path) => ({
    loc: path,
    changefreq: config.changefreq,
    priority: config.priority,
    lastmod: new Date().toISOString(),
  }),

  additionalPaths: async (config) => {
    try {
      const [users, countries] = await Promise.all([
        prisma.user.findMany({
          select: { username: true },
          where: { username: { not: null } },
        }),
        prisma.country.findMany({
          include: { cities: true },
        }),
      ]);

      console.log(`[SITEMAP] Usuários encontrados: ${users.length}`);
      console.log(`[SITEMAP] Países carregados: ${countries.length}`);

      const userProfilePaths = await Promise.all(
        users
          .filter(user => user.username)
          .map(user => config.transform(config, `/perfil/${user.username}`))
      );

      // 🔹 Para armazenar todos os paths
      const allKeywordPaths = [];

      // 🔹 Função para gerar URLs para cada lista
      const generateKeywordPaths = async (keywords, siteFolder) => {
        const paths = [];
        for (const kw of keywords) {
          const keywordSlug = slugify(kw.value);
          for (const country of countries) {
            for (const city of country.cities) {
              const slugCountry = slugify(country.slug || country.name);
              const slugCity = slugify(city.slug || city.name);
              const path = `/${siteFolder}/${keywordSlug}/${slugCity}/${slugCountry}`;
              paths.push(await config.transform(config, path));
            }
          }
        }
        return paths;
      };

      // 🔹 Gerar para cada grupo (site1, site2, ..., site10)
      const keywordGroups = [
        { keywords: keywords1, folder: 'page1' },
        { keywords: keywords2, folder: 'page2' },
        { keywords: keywords3, folder: 'page3' },
        { keywords: keywords4, folder: 'page4' },
        { keywords: keywords5, folder: 'page5' },
        { keywords: keywords6, folder: 'site6' },
        { keywords: keywords7, folder: 'site7' },
        { keywords: keywords8, folder: 'site8' },
        { keywords: keywords9, folder: 'site9' },
        { keywords: keywords10, folder: 'site10' },
      ];

      for (const group of keywordGroups) {
        const paths = await generateKeywordPaths(group.keywords, group.folder);
        allKeywordPaths.push(...paths);
        console.log(`[SITEMAP] URLs geradas para ${group.folder}: ${paths.length}`);
      }

      // 🔹 Páginas fixas
      const fixedPaths = await Promise.all([
        config.transform(config, '/'),
        config.transform(config, '/compras'),
      ]);

      return [...fixedPaths, ...userProfilePaths, ...allKeywordPaths];
    } catch (error) {
      console.error("❌ Erro ao gerar paths do sitemap:", error);
      return [];
    } finally {
      await prisma.$disconnect();
    }
  },
};

module.exports = config;
*/

/*
const { PrismaClient } = require('@prisma/client');

// Inicializa o Prisma
const prisma = new PrismaClient();

/** @type {import('next-sitemap').IConfig}
const config = {
  siteUrl: 'https://www.indecent.top',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  outDir: './public',
  changefreq: 'daily',
  priority: 0.7,

  // 🔹 Excluir URLs que não devem ser indexadas
  exclude: [
    '/api/*',      // Exclui todas as rotas da API
    '/login',      // Exclui a página de login
    '/signup',     // Exclui a página de cadastro
    '/redirect',   // Exclui a página de redirecionamento
    '/robots',     // Exclui o arquivo robots.txt
    '/sitemap',    // Evita que o próprio sitemap seja listado no sitemap
  ],

  alternateRefs: [],

  transform: async (config, path) => ({
    loc: path,
    changefreq: config.changefreq,
    priority: config.priority,
    lastmod: new Date().toISOString(),
  }),

  additionalPaths: async (config) => {
    try {
      // 🔹 Busca todos os usernames dos usuários cadastrados
      const users = await prisma.user.findMany({
        select: { username: true },
        where: {
          username: { not: null }, // Garante que username não seja nulo
        },
      });

      console.log(`[SITEMAP] Usuários encontrados: ${users.length}`);

      // 🔹 Gera as URLs de perfil e resolve as Promises corretamente
      const userProfilePaths = await Promise.all(
        users
          .filter(user => user.username) // Remove valores nulos/vazios
          .map(async (user) => await config.transform(config, `/${user.username}`))
      );

      console.log(`[SITEMAP] Perfis gerados:`, userProfilePaths);

      // 🔹 Busca todas as cidades e países únicos no banco de dados
      const locations = await prisma.post.findMany({
        select: { city: true, country: true },
        distinct: ['city', 'country'],
        where: {
          city: { not: null },
          country: { not: null },
        },
      });

      console.log(`[SITEMAP] Cidades encontradas: ${locations.length}`);

      // 🔹 Gera as URLs dinâmicas de acompanhantes e resolve as Promises corretamente
      const locationPaths = await Promise.all(
        locations
          .filter(({ city, country }) => city && country) // Evita valores nulos
          .map(async ({ city, country }) => {
            const slugCity = city.toLowerCase().replace(/\s+/g, '-');
            const slugCountry = country.toLowerCase().replace(/\s+/g, '-');
            return await config.transform(config, `/acompanhantes/${slugCountry}/${slugCity}`);
          })
      );

      console.log(`[SITEMAP] URLs de acompanhantes geradas:`, locationPaths);

      // 🔹 Caminhos fixos adicionais
      const fixedPaths = await Promise.all([
        config.transform(config, '/'),
        config.transform(config, '/compras'),
      ]);

      // 🔹 Retorna todas as URLs, filtrando valores `undefined`
      return [...fixedPaths, ...locationPaths, ...userProfilePaths].filter(Boolean);
    } catch (error) {
      console.error("Erro ao buscar dados para o sitemap:", error);
      return [];
    } finally {
      await prisma.$disconnect(); // Fecha a conexão do Prisma
    }
  },
};

module.exports = config;
*/