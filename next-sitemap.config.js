const { PrismaClient } = require('@prisma/client');

// Inicializa o Prisma
const prisma = new PrismaClient();

/** @type {import('next-sitemap').IConfig} */
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
    const locations = await prisma.post.findMany({
      select: { city: true, country: true },
      distinct: ['city', 'country'],
      where: {
        city: { not: null },
        country: { not: null },
      },
    });

    const locationPaths = await Promise.all(
      locations.map(async ({ city, country }) => {
        if (!city || !country) return undefined;

        const slugCity = city.toLowerCase().replace(/\s+/g, '-');
        const slugCountry = country.toLowerCase().replace(/\s+/g, '-');

        return config.transform(config, `/acompanhantes/${slugCountry}/${slugCity}`);
      })
    );

    const fixedPaths = await Promise.all([
      config.transform(config, '/'),
      config.transform(config, '/compras'),
    ]);

    return [...fixedPaths, ...locationPaths].filter(Boolean);
  },
};

module.exports = config;
*/


/* tsx
import { IConfig, ISitemapField } from 'next-sitemap';
import prisma from './lib/prisma';

const config: IConfig = {
  siteUrl: 'https://www.indecent.top',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  outDir: './public',
  changefreq: 'daily',
  priority: 0.7,
  exclude: [
    './public, ./api/, ./login, ./signup, ./redirect',
  ],
  alternateRefs: [],

  transform: async (config, path): Promise<ISitemapField | undefined> => {
    if (!path) return undefined; // Retornamos `undefined` ao invés de `null`
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    };
  },

  additionalPaths: async (config): Promise<ISitemapField[]> => {
    // 🔹 Busca todas as cidades e países únicos no banco de dados
    const locations = await prisma.post.findMany({
      select: { city: true, country: true },
      distinct: ['city', 'country'],
      where: {
        city: { not: null },
        country: { not: null },
      },
    });

    // 🔹 Constrói as URLs corretamente
    const locationPaths = await Promise.all(
      locations.map(async ({ city, country }) => {
        if (!city || !country) return undefined; // Usa `undefined` ao invés de `null`

        const slugCity = city.toLowerCase().replace(/\s+/g, '-'); // Slug amigável
        const slugCountry = country.toLowerCase().replace(/\s+/g, '-');

        return config.transform(config, `/acompanhantes/${slugCountry}/${slugCity}`);
      })
    );

    // 🔹 Caminhos fixos adicionais
    const fixedPaths = await Promise.all([
      config.transform(config, '/'),
      config.transform(config, '/compras'),
    ]);

    // 🔹 Filtra `undefined` antes de retornar
    return [...fixedPaths, ...locationPaths].filter((path): path is ISitemapField => path !== undefined);
  },
};

export default config;

*/

/*
@type {import('next-sitemap').IConfig} 
import { IConfig, ISitemapField } from 'next-sitemap';
import { fetchPosts } from './lib/data'; // Caminho relativo direto para evitar erros de resolução
import { id } from 'ethers/lib/utils';

// Define o tipo para os posts retornados pela função fetchPosts
interface Post {
  id: string;
  slug?: string;
}

const config: IConfig = {
  siteUrl: 'https://indecent.top',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  outDir: './public',
  changefreq: 'daily',
  priority: 0.7,
  exclude: [],
  alternateRefs: [],

  // Transforma cada caminho individual em um formato apropriado
  transform: async (config, path): Promise<ISitemapField> => ({
    loc: path,
    changefreq: config.changefreq,
    priority: config.priority,
    lastmod: new Date().toISOString(),
  }),

  // Define caminhos adicionais para o sitemap
  additionalPaths: async (config): Promise<ISitemapField[]> => {
    // Obtém os posts do banco de dados ou API
    const userPosts = await fetchPosts("free"); // Busca apenas posts gratuitos


    // Mapeia os posts do usuário para URLs dinâmicas
    const postPaths = await Promise.all(
      userPosts.map(async (post) => {
        const slug = post.id || post.id; // Use slug if available, fallback to ID
        return config.transform(config, `/painel/(.)p/${id}`);
      })
    );

    // Define as tags e critérios de ordenação
    const tags = [
      'conteudo-adulto',
      'hentai',
      'amador',
      'plataforma-de-afiliados',
      'criadores-de-conteúdo',
      'live-ao-vivo',
      'acompanhantes',
      'OnlyFans brasileiro',
      'www.onlyfans.com',
      'onlyfans',
      'www.privacy.com',
      'privacy',
      'xvideos',
      'www.xvideos.com',
      'socaseiras',
      'www.socadseiras.com.br',
      'lésbica',
      'milf',
      'cosplay',
      'femdom',
      'dominição',
      'inversão-de-papéis',
      'casal bi',
      'sexo',
      'putaria',
      'swing',
      'intimidades-caseiras',
      'troca-de-casais',
    ];
    const sorts = ['views', 'recent', 'popular'];

    // Cria URLs dinâmicas baseadas nas tags e critérios
    const dynamicPaths = await Promise.all(
      sorts.flatMap((sort) =>
        tags.map((tag) =>
          config.transform(config, `/tags/${sort}/${tag}`)
        )
      )
    );

    // Define caminhos fixos adicionais
   // Transform fixed paths into valid paths
   const fixedPaths: (ISitemapField | undefined)[] = await Promise.all([
    config.transform(config, '/'),
    config.transform(config, '/compras'),
  ]);

  // Combine all paths and filter undefined values
  return [...fixedPaths, ...postPaths].filter((path): path is ISitemapField => !!path);
},
};

export default config;
*/


/*


/** @type {import('next-sitemap').IConfig} 
const config = {
  siteUrl: 'https://indecent.top',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  outDir: './public',
  changefreq: 'daily',
  priority: 0.7,
  exclude: [],
  alternateRefs: [],

  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    };
  },

  additionalPaths: async (config) => {
    const { fetchPosts } = require('/lib/data'); // Caminho relativo

    // Fetch posts from your database or API
    const userPosts = await fetchPosts();

    const postPaths = userPosts.map((post) => {
      const slug = post.slug || post.id; // Use slug if available, fallback to ID
      return `/painel/(.)p/${id}`;
    });

    // Tags e critérios de ordenação
    const tags = [
      "conteudo-adulto",
      "hentai",
      "amador",
      "plataforma-de-afiliados",
      "criadores-de-conteúdo",
      "live-ao-vivo",
      "acompanhantes",
      "OnlyFans brasileiro",
      "www.onlyfans.com",
      "onlyfans",
      "www.privacy.com",
      "privacy",
      "xvideos",
      "www.xvideos.com",
      "socaseiras",
      "www.socadseiras.com.br",
      "lésbica",
      "milf",
      "cosplay",
      "femdom",
      "dominição",
      "inversão-de-papéis",
      "lcasal bi",
      "lésbica",
      "sexo",
      "putaria",
      "swing",
      "intimidades-caseiras",
      "troca-de-casais",
    ];
    const sorts = ["views", "recent", "popular"];
    const dynamicPaths = sorts.flatMap((sort) =>
      tags.map((tag) => `/tags/${sort}/${tag}`)
    );

    // Inclui rotas adicionais fixas e dinâmicas
    const fixedPaths = [
      await config.transform(config, '/'),
      await config.transform(config, '/compras'),
    ];

    // Combina rotas fixas, dinâmicas e de posts de usuários
    return [
      ...fixedPaths,
      ...dynamicPaths.map((path) => config.transform(config, path)),
      ...postPaths.map((path) => config.transform(config, path)),
    ];
  },
};

module.exports = config;
*/

/*
/** @type {import('next-sitemap').IConfig} 
const config = {
  siteUrl: 'https://indecent.top',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  outDir: './public',
  changefreq: 'daily',
  priority: 0.7,
  exclude: [], // Caso tenha rotas que queira excluir
  alternateRefs: [],

  // Transform padrão para todas as rotas
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    };
  },

  // Adicionando rotas dinâmicas
  additionalPaths: async (config) => {
    // Tags e critérios de ordenação
    const tags = ["conteudo-adulto", 
  "hentai", 
  "amador", 
  "plataforma-de-afiliados",  
  "criadores-de-conteúdo", 
  "live-ao-vivo", "acompanhantes", 
  "OnlyFans brasileiro", 
  "www.onlyfans.com",   
  "onlyfans",   
  "www.privacy.com",  
  "privacy",  
  "xvideos", 
  "www.xvideos.com", 
  "socaseiras", 
  "www.socadseiras.com.br",  
  "lésbica",
  "milf",
  "cosplay",
  "femdom",
  "dominição",
  "inversão-de-papéis",
  "lcasal bi",
  "lésbica",
  "sexo",
  "putaria",
  "swing",
  "intimidades-caseiras",
  "troca-de-casais"];
    const sorts = ["views", "recent", "popular"];
    const dynamicPaths = sorts.flatMap((sort) =>
      tags.map((tag) => `/tags/${sort}/${tag}`)
    );

    // Inclui rotas adicionais fixas e dinâmicas
    const fixedPaths = [
      await config.transform(config, '/'),
      await config.transform(config, '/compras'),
    ];

    // Combina rotas fixas com as dinâmicas
    return [
      ...fixedPaths,
      ...dynamicPaths.map((path) =>
        config.transform(config, path)
      ),
    ];
  },
};

module.exports = config;
*/
