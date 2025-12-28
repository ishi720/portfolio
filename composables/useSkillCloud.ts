import { ref, computed } from 'vue'
import { usePortfolio } from './usePortfolio'
import { useCareer } from './useCareer'

export interface TagCount {
  text: string
  size: number
}

export const useSkillCloud = () => {
  const { developments, chromeExtensions, npmPackages } = usePortfolio()
  const { careers } = useCareer()

  const articles = ref<Array<{ tags: string }>>([])
  const repos = ref<Array<{ tags: string | string[] }>>([])
  const isLoaded = ref(false)

  // JSONデータを読み込み
  const loadData = async () => {
    try {
      // Nuxtのpublic配下のファイルはbaseURLを考慮
      const baseURL = '/portfolio'
      const [articlesData, reposData] = await Promise.all([
        fetch(`${baseURL}/data/combined_articles.json`).then(res => res.json()),
        fetch(`${baseURL}/data/repos_list.json`).then(res => res.json())
      ])
      articles.value = articlesData || []
      repos.value = reposData || []
      isLoaded.value = true
    } catch (error) {
      console.error('Failed to load data:', error)
      // エラーでもisLoadedをtrueにして、静的データだけでも表示
      isLoaded.value = true
    }
  }

  // タグを集計（大文字小文字を統一）
  const aggregatedTags = computed<TagCount[]>(() => {
    const tagCount: Record<string, number> = {}
    const tagOriginal: Record<string, string> = {} // 元の表記を保持

    // タグを追加するヘルパー関数（大文字小文字を統一）
    const addTag = (tag: string) => {
      const lowerTag = tag.toLowerCase()
      tagCount[lowerTag] = (tagCount[lowerTag] || 0) + 1
      // 最初に出現した表記を保持
      if (!tagOriginal[lowerTag]) {
        tagOriginal[lowerTag] = tag
      }
    }

    // Developmentsのタグを集計
    developments.forEach(dev => {
      dev.techs.forEach(tech => addTag(tech))
    })

    // Chrome Extensionsのタグを集計
    chromeExtensions.forEach(ext => {
      ext.techs.forEach(tech => addTag(tech))
    })

    // npm Packagesのタグを集計
    npmPackages.forEach(pkg => {
      pkg.techs.forEach(tech => addTag(tech))
    })

    // Careerのタグを集計
    careers.forEach(company => {
      company.projects.forEach(project => {
        project.techs.forEach(tech => addTag(tech))
      })
    })

    // Articlesのタグを集計
    articles.value.forEach(article => {
      if (article.tags) {
        const tags = article.tags.split(',').map(t => t.trim()).filter(t => t.length > 0)
        tags.forEach(tag => addTag(tag))
      }
    })

    // Repositoriesのタグを集計
    repos.value.forEach(repo => {
      if (repo.tags) {
        const tags = Array.isArray(repo.tags)
          ? repo.tags
          : [repo.tags]
        tags.forEach(tag => {
          if (tag && tag.length > 0) {
            addTag(tag)
          }
        })
      }
    })

    // 配列に変換してソート（元の表記を使用）
    return Object.entries(tagCount)
      .map(([lowerTag, size]) => ({ text: tagOriginal[lowerTag], size }))
      .sort((a, b) => b.size - a.size)
  })

  return {
    aggregatedTags,
    isLoaded,
    loadData
  }
}