import { useHead } from '@unhead/vue'
import { normalizeSiteUrl } from '~/utils/siteUrl'
import { isNoindexPath } from '~/constants'

export const SITE_NAME = 'ishi720 Portfolio'

interface PageSeo {
  title: string
  description: string
  path: string
}

export const usePageSeo = ({ title, description, path }: PageSeo) => {
  const siteUrl = normalizeSiteUrl(useRuntimeConfig().public.siteUrl as string)
  const url = `${siteUrl}${path}`
  const fullTitle = `${title} | ${SITE_NAME}`

  useHead({
    title,
    link: siteUrl ? [{ rel: 'canonical', href: url }] : [],
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:locale', content: 'ja_JP' },
      { name: 'twitter:card', content: 'summary' },
      ...(isNoindexPath(path) ? [{ name: 'robots', content: 'noindex' }] : []),
      ...(siteUrl
        ? [
            { property: 'og:url', content: url },
            { property: 'og:image', content: `${siteUrl}/images/ishi720_profile.jpeg` },
          ]
        : []),
    ],
  })
}
