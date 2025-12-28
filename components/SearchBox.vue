<template>
  <div class="search-box">
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      type="text"
      :placeholder="placeholder"
      class="search-input"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  placeholder?: string
}

withDefaults(defineProps<Props>(), {
  placeholder: '検索...'
})

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<style lang="scss" scoped>
.search-box {
  flex: 1;
  min-width: 200px;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 10px 16px;
  font-size: 0.9rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4a90a4;
    box-shadow: 0 0 0 3px rgba(74, 144, 164, 0.1);
  }
}

@media (max-width: 768px) {
  .search-box {
    max-width: none;
  }
}
</style>
