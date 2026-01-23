<template>
  <section class="hero">
    <div class="hero-content">
      <h1 class="hero-title">Welcome To<br><span>{{ name }} Portfolio</span></h1>
      <div class="scroll-indicator">
        <span>scroll</span>
        <div class="scroll-line"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  name: string
}>()
</script>
