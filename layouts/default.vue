<template>
  <div class="app">
    <header class="header">
      <div class="header-inner">
        <NuxtLink to="/" class="logo">{{ profile.name }} Portfolio</NuxtLink>
        <nav class="nav" :class="{ active: menuOpen }">
          <NuxtLink to="/" class="nav-link" @click="menuOpen = false">Home</NuxtLink>
          <NuxtLink to="/developments" class="nav-link" @click="menuOpen = false">Developments</NuxtLink>
          <NuxtLink to="/repositories" class="nav-link" @click="menuOpen = false">Repositories</NuxtLink>
          <NuxtLink to="/articles" class="nav-link" @click="menuOpen = false">Articles</NuxtLink>
          <NuxtLink to="/career" class="nav-link" @click="menuOpen = false">Career</NuxtLink>
        </nav>
        <button class="mobile-menu-btn" @click="menuOpen = !menuOpen">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>

    <main class="main">
      <slot />
    </main>

    <footer class="footer">
      <div class="footer-inner">
        <p class="copyright">© 2025 {{ profile.name }} Portfolio All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { usePortfolio } from '~/composables/usePortfolio'

const { profile } = usePortfolio()
const menuOpen = ref(false)
</script>