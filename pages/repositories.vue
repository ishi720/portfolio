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
        <TagFilter
          v-model="selectedTag"
          :tags="popularTags"
        />

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
            <div class="repo-tags" v-if="parseTags(repo.tags).length > 0">
              <span
                v-for="tag in parseTags(repo.tags)"
                :key="tag"
                class="tech-tag"
              >
                {{ tag }}
              </span>
            </div>
            <div class="repo-footer">
              <div class="repo-stats">
                <span class="repo-stat" title="コミット数">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M10.5 7.75a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm1.43.75a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"/>
                  </svg>
                  {{ repo.commit_count || 0 }}
                </span>
                <span class="repo-stat" title="サイズ">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M3.5 3.75v8.5h9v-8.5h-9Zm0-1.5h9A1.5 1.5 0 0 1 14 3.75v8.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 12.25v-8.5A1.5 1.5 0 0 1 3.5 2.25Z"/>
                  </svg>
                  {{ formatSize(repo.size_kb) }}
                </span>
              </div>
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
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { SortState, SortOption, Repo } from '~/types/models'
import { formatDate, parseTags } from '~/composables/useUtils'
import { usePagination, getInitialSortState } from '~/composables/usePagination'
import { useFetchData } from '~/composables/useFetchData'
import { ITEMS_PER_PAGE, TOP_TAGS_COUNT } from '~/constants'

const route = useRoute()
const { data: repos, fetchData } = useFetchData<Repo[]>([])

// ソートオプション
const sortOptions: SortOption[] = [
  { key: 'updated_at', label: '更新日' },
  { key: 'created_at', label: '作成日' },
  { key: 'commit_count', label: 'コミット数' },
  { key: 'size_kb', label: 'サイズ' },
  { key: 'name', label: 'リポジトリ名' }
]

// フィルター用のstate（URLクエリから初期化）
const searchQuery = ref((route.query.q as string) || '')
const selectedTag = ref((route.query.tag as string) || '')
const sortState = ref<SortState>(getInitialSortState('updated_at'))

onMounted(() => {
  fetchData('/data/repos_list.json')
})

// 人気のタグ（使用回数が多い上位10件）
const popularTags = computed(() => {
  const tagCount: Record<string, number> = {}
  repos.value.forEach(repo => {
    parseTags(repo.tags).forEach(tag => {
      tagCount[tag] = (tagCount[tag] || 0) + 1
    })
  })
  return Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_TAGS_COUNT)
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
      parseTags(repo.tags).some(tag => tag.toLowerCase().includes(query))
    )
  }

  // タグフィルター
  if (selectedTag.value) {
    result = result.filter(repo =>
      parseTags(repo.tags).includes(selectedTag.value)
    )
  }

  // ソート
  result.sort((a, b) => {
    if (sortState.value.key === 'name') {
      const comparison = a.name.localeCompare(b.name)
      return sortState.value.order === 'desc' ? -comparison : comparison
    } else if (sortState.value.key === 'commit_count') {
      const countA = a.commit_count || 0
      const countB = b.commit_count || 0
      return sortState.value.order === 'desc' ? countB - countA : countA - countB
    } else if (sortState.value.key === 'size_kb') {
      const sizeA = a.size_kb || 0
      const sizeB = b.size_kb || 0
      return sortState.value.order === 'desc' ? sizeB - sizeA : sizeA - sizeB
    } else {
      const key = sortState.value.key as 'updated_at' | 'created_at'
      const dateA = new Date(a[key]).getTime()
      const dateB = new Date(b[key]).getTime()
      return sortState.value.order === 'desc' ? dateB - dateA : dateA - dateB
    }
  })

  return result
})

// ページネーション
const {
  currentPage,
  totalPages,
  paginatedItems: paginatedRepos
} = usePagination({
  filteredItems: filteredRepos,
  perPage: ITEMS_PER_PAGE,
  defaultSortKey: 'updated_at',
  sortState,
  buildQueryFields: () => {
    const query: Record<string, string | undefined> = {}
    if (searchQuery.value) query.q = searchQuery.value
    if (selectedTag.value) query.tag = selectedTag.value
    return query
  },
  watchTargets: [searchQuery, selectedTag]
})

const formatSize = (sizeKb?: number) => {
  if (!sizeKb || sizeKb === 0) return '0 KB'
  if (sizeKb >= 1024) {
    return `${(sizeKb / 1024).toFixed(1)} MB`
  }
  return `${sizeKb} KB`
}
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;
@use '~/assets/scss/mixins' as *;

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
    border-left-color: $primary;
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

.repo-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.repo-stats {
  display: flex;
  gap: 12px;
}

.repo-stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: #666;

  svg {
    width: 14px;
    height: 14px;
  }
}

.repo-date {
  font-size: 0.75rem;
  color: #999;

  .date-label {
    margin-right: 4px;
  }
}

@include mobile {
  .repos-controls {
    @include mobile-stack(stretch);
  }

  .repos-grid {
    @include mobile-grid-single;
  }

  .repo-footer {
    @include mobile-stack;
    gap: 8px;
  }
}
</style>