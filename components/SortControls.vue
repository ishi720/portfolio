<template>
  <div class="sort-controls">
    <div class="sort-group">
      <label class="sort-label">並び替え:</label>
      <button
        v-for="option in options"
        :key="option.key"
        class="sort-btn"
        :class="{ active: modelValue.key === option.key }"
        @click="handleSort(option.key)"
      >
        {{ option.label }}
        <span class="sort-icon">
          {{ modelValue.key === option.key ? (modelValue.order === 'desc' ? '↓' : '↑') : '　' }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SortOption, SortState } from '~/types/models'

export type { SortOption, SortState }

interface Props {
  modelValue: SortState
  options: SortOption[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: SortState]
}>()

const handleSort = (key: string) => {
  if (props.modelValue.key === key) {
    // 同じキーなら順序を切り替え
    emit('update:modelValue', {
      key,
      order: props.modelValue.order === 'desc' ? 'asc' : 'desc'
    })
  } else {
    // 違うキーなら新しいキーで降順からスタート
    emit('update:modelValue', {
      key,
      order: 'desc'
    })
  }
}
</script>
