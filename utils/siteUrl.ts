export const normalizeSiteUrl = (value: string | undefined | null): string => {
  const trimmed = (value ?? '').trim().replace(/\/+$/, '')
  if (!trimmed) return ''
  return /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`
}
