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

/*
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const keywords =[
  { "value": "Acompanhantes" },
  { "value": "Garotas de Programa" },
  { "value": "Prostitutas" },
  { "value": "Escorts" },
  { "value": "Putas" },
  { "value": "Job" },
  { "value": "Acompanhantes-Job" },
  { "value": "modelos-Job" },
  { "value": "Profissionais-do-job" },
  { "value": "Profissionais-do-Sexo" },
  { "value": "Trabalhadoras-do- Sexo" },
  { "value": "Sex-Workers" },
  { "value": "Atrizes-Adultas" },
  { "value": "Modelos-Eróticas" },
  { "value": "Massagistas-Sensuais" },
  { "value": "Massagem-Erótica" },
  { "value": "Encontros-Casuais" },
  { "value": "Sexo-Casual" },
  { "value": "Programas" },
  { "value": "Serviços-Sexuais" },
  { "value": "Acompanhantes-de-Luxo" },
  { "value": "Escorts-de-Luxo" },
  { "value": "Garotas-de-Programa-VIP" },
  { "value": "fatalmodel-Job" },
  { "value": "onlyfans-Job" },
  { "value": "Prostitutas-VIP" },
  { "value": "Acompanhantes-Independentes" },
  { "value": "Escorts Independentes" },
  { "value": "Garotas de Programa Independentes" },
  { "value": "Prostitutas Independentes" },
  { "value": "Onde-encontrar-acompanhantes" },
  { "value": "Onde-encontrar-garotas-de-programa" },
  { "value": "Onde-encontrar-prostitutas" },
  { "value": "Onde-encontrar-escorts" },
  { "value": "Telefones-de-acompanhantes" },
  { "value": "Contatos-de-garotas-de-programa" },
  { "value": "WhatsApp-acompanhantes" },
  { "value": "WhatsApp-garotas-de-programa" },
  { "value": "Fotos-de-acompanhantes" },
  { "value": "Fotos-de-garotas-de-programa" },
  { "value": "Vídeos-de-acompanhantes" },
  { "value": "Vídeos-de-garotas-de-programa" },
  { "value": "Preços-de-acompanhantes" },
  { "value": "Valores-de-programas" },
  { "value": "Tarifas-de-acompanhantes" },
  { "value": "Anúncios-de-acompanhantes" },
  { "value": "Classificados-de-acompanhantes" },
  { "value": "Acompanhantes-xvideos" },
  { "value": "Acompanhantes-olyfans" },
  { "value": "Acompanhantes-fatalmodel" },
  { "value": "Sites-de-acompanhantes" },
  { "value": "Agências-de-acompanhantes" },
  { "value": "Book-de-acompanhantes" },
  { "value": "Perfis-de-acompanhantes" },
  { "value": "Mulheres-de-programa" },
  { "value": "Homens-de-programa" },
  { "value": "Swing" },
  { "value": "Travestis" },
  { "value": "Transsexuais" },
  { "value": "Shemales" },
  { "value": "Gays" },
  { "value": "Lésbicas" },
  { "value": "Bissexuais" },
  { "value": "Serviços-para-casais" },
  { "value": "Fetiches" },
  { "value": "BDSM" },
  { "value": "Dominação" },
  { "value": "Submissão" },
  { "value": "Roleplay" },
  { "value": "Striptease" },
  { "value": "Lap dance" },
  { "value": "Nuru-massage" },
  { "value": "Happy-ending-massage" },
  { "value": "Acompanhantes-24-horas" },
  { "value": "Programas-noturnos" },
  { "value": "Encontros-discretos" },
  { "value": "Sigilo-absoluto" },
  { "value": "Hot-girls" },
  { "value": "Sexy-escorts" },
  { "value": "Beautiful-companions" },
  { "value": "Call-girls" },
  { "value": "Hookers" },
  { "value": "Adult-entertainment" },
  { "value": "Erotic-services" },
  { "value": "Sexual-encounters" },
  { "value": "Online-dating" },
  { "value": "Adult-dating" },
  { "value": "Sex-dating" },
  { "value": "Local-escorts" },
  { "value": "Nearby-prostitutes" },
  { "value": "Find-escorts" },
  { "value": "Look-for-prostitutes" },
  { "value": "Directory-of-escorts" },
  { "value": "List-of-prostitutes" },
  { "value": "Reviews-of-escorts" },
  { "value": "Testimonials-of-prostitutes" },
  { "value": "Safety-tips-for-escorts" },
  { "value": "Guide-to-hiring-prostitutes" },
  { "value": "Legalidade-da-prostituição" },
  { "value": "Direitos-das-profissionais-do-sexo" },
  { "value": "Saúde-sexual" },
  { "value": "Prevenção-de-DSTs" },
  { "value": "Camisinha" },
  { "value": "Sexo-seguro" },
  { "value": "Bem-estar-sexual" }
];

// 🔧 Função para gerar slug URL-friendly
const slugify = (str) => {
  return str
    .normalize("NFD")                   // separa acentos das letras
    .replace(/[\u0300-\u036f]/g, "")   // remove acentos
    .toLowerCase()
    .replace(/\s+/g, '-')              // substitui espaços por hífen
    .replace(/[^a-z0-9-]/g, '')        // remove tudo que não é letra, número ou hífen
    .replace(/--+/g, '-')              // evita múltiplos hífens seguidos
    .replace(/^-+|-+$/g, '');          // remove hífens no início/fim
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
          include: {
            cities: true,
          },
        }),
      ]);

      console.log(`[SITEMAP] Usuários encontrados: ${users.length}`);
      console.log(`[SITEMAP] Países carregados: ${countries.length}`);

      // 🔹 URLs de perfil de usuário
      const userProfilePaths = await Promise.all(
        users
          .filter(user => user.username)
          .map(user => config.transform(config, `/perfil/${user.username}`))
      );

      // 🔹 URLs /acompanhantes/{pais}/{cidade} para cada keyword
// 🔹 URLs /{keyword}/{pais}/{cidade}
const keywordPaths = [];

for (const kw of keywords) {
  const keywordSlug = slugify(kw.value); // ← transforma a keyword em slug
  for (const country of countries) {
    for (const city of country.cities) {
      const slugCountry = slugify(country.slug || country.name);
      const slugCity = slugify(city.slug || city.name);
      const path = `/${keywordSlug}/${slugCity}/${slugCountry}`; // ← aqui usamos o slug da keyword
      keywordPaths.push(await config.transform(config, path));
    }
  }
}


      console.log(`[SITEMAP] URLs geradas para keywords: ${keywordPaths.length}`);

      // 🔹 Páginas fixas
      const fixedPaths = await Promise.all([
        config.transform(config, '/'),
        config.transform(config, '/compras'),
      ]);

      return [...fixedPaths, ...userProfilePaths, ...keywordPaths];
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
