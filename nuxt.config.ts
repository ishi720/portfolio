import { PAGE_PATHS } from './constants'

export default defineNuxtConfig({
  ssr: true,
  app: {
    baseURL: '/',
    head: {
      htmlAttrs: { lang: 'ja' },
      titleTemplate: '%s | ishi720 Portfolio',
      title: 'ishi720 Portfolio',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/images/favicon.ico' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Poppins:wght@400;500;600;700&display=swap' }
      ]
    }
  },
  css: ['~/assets/scss/main.scss'],
  runtimeConfig: {
    public: {
      gaId: '',
      siteUrl: '',
    },
  },
  nitro: {
    prerender: {
      crawlLinks: false,
      routes: [
        ...PAGE_PATHS,
        '/robots.txt',
        ...(process.env.NUXT_PUBLIC_SITE_URL ? ['/sitemap.xml'] : []),
      ],
    },
  },
  compatibilityDate: '2024-01-01',
})