export default defineNuxtPlugin(() => {
  const gaId = useRuntimeConfig().public.gaId

  // 環境変数が未設定なら何もしない（ローカル開発など）
  if (!gaId) return

  useHead({
    script: [
      { src: `https://www.googletagmanager.com/gtag/js?id=${gaId}`, async: true },
      {
        innerHTML: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { send_page_view: false });
        `,
      },
    ],
  })

  // SPA のルート遷移ごとに page_view を送信
  const router = useRouter()
  router.afterEach((to) => {
    if (typeof window.gtag !== 'function') return
    window.gtag('event', 'page_view', {
      page_path: to.fullPath,
      page_location: window.location.href,
      page_title: document.title,
    })
  })
})

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}
