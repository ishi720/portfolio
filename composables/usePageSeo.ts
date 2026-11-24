import { useHead } from '@unhead/vue'

export const SITE_URL = 'https://ishi720.github.io/portfolio'
export const SITE_NAME = 'ishi720 Portfolio'
const OG_IMAGE = `${SITE_URL}/images/ishi720_profile.jpeg`

interface PageSeo {
  title: string
  description: string
  path: string
}

export const usePageSeo = ({ title, description, path }: PageSeo) => {
  const url = `${SITE_URL}${path}`
  const fullTitle = `${title} | ${SITE_NAME}`

  useHead({
    title,
    link: [{ rel: 'canonical', href: url }],
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:image', content: OG_IMAGE },
      { property: 'og:locale', content: 'ja_JP' },
      { name: 'twitter:card', content: 'summary' },
    ],
  })
}
