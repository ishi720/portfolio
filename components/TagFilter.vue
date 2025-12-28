<template>
  <div v-if="tags.length > 0" class="tag-filter">
    <button
      class="tag-filter-btn"
      :class="{ active: modelValue === '' }"
      @click="$emit('update:modelValue', '')"
    >
      すべて
    </button>
    <button
      v-for="tag in tags"
      :key="tag"
      class="tag-filter-btn"
      :class="{ active: modelValue === tag }"
      @click="$emit('update:modelValue', modelValue === tag ? '' : tag)"
    >
      {{ tag }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  tags: string[]
}

defineProps<Props>()
defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
