import { normalizeSiteUrl } from '../../utils/siteUrl'

export default defineEventHandler((event) => {
  const siteUrl = normalizeSiteUrl(useRuntimeConfig(event).public.siteUrl as string)

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return [
    'User-agent: *',
    'Allow: /',
    ...(siteUrl ? ['', `Sitemap: ${siteUrl}/sitemap.xml`] : []),
    '',
  ].join('\n')
})
