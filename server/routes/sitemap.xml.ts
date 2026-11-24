import { PAGE_PATHS } from '../../constants'
import { normalizeSiteUrl } from '../../utils/siteUrl'

export default defineEventHandler((event) => {
  const siteUrl = normalizeSiteUrl(useRuntimeConfig(event).public.siteUrl as string)
  const urls = PAGE_PATHS
    .map(path => `  <url><loc>${siteUrl}${path === '/' ? '/' : `${path}/`}</loc></url>`)
    .join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
})
