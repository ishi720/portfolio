<template>
  <div>
    <section class="page-hero">
      <div class="container">
        <h1 class="page-title">Repositories</h1>
        <p class="page-subtitle">GitHubリポジトリ一覧（{{ repos.length }}件）</p>
      </div>
    </section>

    <section class="repos-section">
      <div class="container">
        <!-- フィルター & ソート -->
        <div class="repos-controls">
          <!-- 検索 -->
          <SearchBox
            v-model="searchQuery"
            placeholder="リポジトリを検索..."
          />

          <!-- ソート -->
          <SortControls
            v-model="sortState"
            :options="sortOptions"
          />
        </div>

        <!-- タグフィルター -->
        <div v-if="allTags.length > 0" class="tag-filter">
          <button
            class="tag-filter-btn"
            :class="{ active: selectedTag === '' }"
            @click="selectedTag = ''"
          >
            すべて
          </button>
          <button
            v-for="tag in popularTags"
            :key="tag"
            class="tag-filter-btn"
            :class="{ active: selectedTag === tag }"
            @click="selectedTag = selectedTag === tag ? '' : tag"
          >
            {{ tag }}
          </button>
        </div>

        <!-- 検索結果件数 -->
        <p class="result-count">{{ filteredRepos.length }}件のリポジトリ</p>

        <!-- リポジトリ一覧 -->
        <div class="repos-grid">
          <a
            v-for="repo in paginatedRepos"
            :key="repo.name"
            :href="repo.url"
            target="_blank"
            class="repo-card"
          >
            <div class="repo-header">
              <div class="repo-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                </svg>
              </div>
              <h3 class="repo-name">{{ repo.name }}</h3>
            </div>
            <p class="repo-desc">{{ repo.description || 'No description' }}</p>
            <div class="repo-tags" v-if="getRepoTags(repo.tags).length > 0">
              <span
                v-for="tag in getRepoTags(repo.tags).slice(0, 4)"
                :key="tag"
                class="repo-tag"
              >
                {{ tag }}
              </span>
              <span v-if="getRepoTags(repo.tags).length > 4" class="repo-tag repo-tag-more">
                +{{ getRepoTags(repo.tags).length - 4 }}
              </span>
            </div>
            <div class="repo-footer">
              <span class="repo-date">
                <span class="date-label">更新:</span>
                {{ formatDate(repo.updated_at) }}
              </span>
            </div>
          </a>
        </div>

        <!-- ページネーション -->
        <Pagination
          v-model="currentPage"
          :total-pages="totalPages"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { SortState, SortOption } from '~/components/SortControls.vue'

interface Repo {
  name: string
  url: string
  tags: string | string[]
  description: string
  created_at: string
  updated_at: string
}

const route = useRoute()
const router = useRouter()
const repos = ref<Repo[]>([])
const perPage = 18

// フィルター用のstate
const searchQuery = ref('')
const selectedTag = ref('')

// ソートオプション
const sortOptions: SortOption[] = [
  { key: 'updated_at', label: '更新日' },
  { key: 'created_at', label: '作成日' },
  { key: 'name', label: 'リポジトリ名' }
]

// ソート状態
const sortState = ref<SortState>({
  key: 'updated_at',
  order: 'desc'
})

// URLのクエリパラメータからページ番号を取得
const currentPage = computed({
  get: () => {
    const page = Number(route.query.page) || 1
    return Math.max(1, Math.min(page, totalPages.value || 1))
  },
  set: (value: number) => {
    router.push({ query: { ...route.query, page: value > 1 ? value : undefined } })
  }
})

onMounted(async () => {
  repos.value = await $fetch('/data/repos_list.json')
})

// タグを配列として取得するヘルパー関数
const getRepoTags = (tags: string | string[]): string[] => {
  if (Array.isArray(tags)) {
    return tags
  }
  if (typeof tags === 'string' && tags.length > 0) {
    return [tags]
  }
  return []
}

// 全タグを取得
const allTags = computed(() => {
  const tagSet = new Set<string>()
  repos.value.forEach(repo => {
    getRepoTags(repo.tags).forEach(tag => tagSet.add(tag))
  })
  return Array.from(tagSet).sort()
})

// 人気のタグ（使用回数が多い上位10件）
const popularTags = computed(() => {
  const tagCount: Record<string, number> = {}
  repos.value.forEach(repo => {
    getRepoTags(repo.tags).forEach(tag => {
      tagCount[tag] = (tagCount[tag] || 0) + 1
    })
  })
  return Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag)
})

// フィルタリングされたリポジトリ
const filteredRepos = computed(() => {
  let result = [...repos.value]

  // 検索フィルター
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(repo =>
      repo.name.toLowerCase().includes(query) ||
      (repo.description && repo.description.toLowerCase().includes(query)) ||
      getRepoTags(repo.tags).some(tag => tag.toLowerCase().includes(query))
    )
  }

  // タグフィルター
  if (selectedTag.value) {
    result = result.filter(repo =>
      getRepoTags(repo.tags).includes(selectedTag.value)
    )
  }

  // ソート
  result.sort((a, b) => {
    if (sortState.value.key === 'name') {
      const comparison = a.name.localeCompare(b.name)
      return sortState.value.order === 'desc' ? -comparison : comparison
    } else {
      const key = sortState.value.key as 'updated_at' | 'created_at'
      const dateA = new Date(a[key]).getTime()
      const dateB = new Date(b[key]).getTime()
      return sortState.value.order === 'desc' ? dateB - dateA : dateA - dateB
    }
  })

  return result
})

const totalPages = computed(() => Math.ceil(filteredRepos.value.length / perPage))

const paginatedRepos = computed(() => {
  const start = (currentPage.value - 1) * perPage
  const end = start + perPage
  return filteredRepos.value.slice(start, end)
})

// フィルター変更時は1ページ目に戻る
watch([searchQuery, selectedTag], () => {
  if (currentPage.value !== 1) {
    currentPage.value = 1
  }
})

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
}
</script>

<style lang="scss" scoped>
.repos-section {
  padding: 60px 0 80px;
}

.repos-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.tag-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.tag-filter-btn {
  font-size: 0.8rem;
  padding: 6px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  background: #fff;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #4a90a4;
    color: #4a90a4;
  }

  &.active {
    background: #4a90a4;
    border-color: #4a90a4;
    color: #fff;
  }
}

.result-count {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 20px;
}

.repos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.repo-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  border-left: 3px solid #24292e;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    border-left-color: #4a90a4;
  }
}

.repo-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.repo-icon {
  width: 20px;
  height: 20px;
  color: #666;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
  }
}

.repo-name {
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #24292e;
  margin: 0;
  word-break: break-word;
}

.repo-desc {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 12px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.repo-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.repo-tag {
  font-size: 0.7rem;
  padding: 3px 8px;
  background: #f0f6f9;
  color: #4a90a4;
  border-radius: 4px;

  &.repo-tag-more {
    background: #e0e0e0;
    color: #666;
  }
}

.repo-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.repo-date {
  font-size: 0.75rem;
  color: #999;

  .date-label {
    margin-right: 4px;
  }
}

@media (max-width: 768px) {
  .repos-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .repos-grid {
    grid-template-columns: 1fr;
  }

  .tag-filter {
    justify-content: center;
  }
}
</style>