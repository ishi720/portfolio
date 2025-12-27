<template>
  <nav v-if="totalPages > 1" class="pagination">
    <button
      class="pagination-btn pagination-prev"
      :disabled="modelValue === 1"
      @click="goToPage(modelValue - 1)"
    >
      ← 前へ
    </button>

    <div class="pagination-numbers">
      <button
        v-for="page in visiblePages"
        :key="page"
        class="pagination-num"
        :class="{ active: page === modelValue, ellipsis: page === '...' }"
        :disabled="page === '...'"
        @click="page !== '...' && goToPage(page as number)"
      >
        {{ page }}
      </button>
    </div>

    <button
      class="pagination-btn pagination-next"
      :disabled="modelValue === totalPages"
      @click="goToPage(modelValue + 1)"
    >
      次へ →
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Propsの型定義
interface Props {
  modelValue: number // 現在のページ番号
  totalPages: number // 総ページ数
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: number]
  'change': [value: number]
}>()

// 表示するページ番号のリストを計算
const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = props.totalPages
  const current = props.modelValue

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) pages.push(i)

    if (current < total - 2) pages.push('...')
    pages.push(total)
  }

  return pages
})

// ページ移動のハンドラ
const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('update:modelValue', page)
    emit('change', page)
  }
}
</script>