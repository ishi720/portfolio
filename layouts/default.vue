<template>
  <div class="app">
    <header class="header">
      <div class="header-inner">
        <NuxtLink to="/" class="logo">{{ profile.name }} Portfolio</NuxtLink>
        <nav class="nav" :class="{ active: menuOpen }">
          <!-- Home with dropdown -->
          <div class="nav-dropdown">
            <NuxtLink
              to="/"
              class="nav-link"
              :class="{ 'router-link-active': isHomeActive }"
              @click="closeMenus"
            >
              Home
              <span class="dropdown-arrow">▼</span>
            </NuxtLink>
            <div class="dropdown-menu">
              <NuxtLink to="/#about-me" class="dropdown-item" @click="closeMenus">
                About Me
              </NuxtLink>
              <NuxtLink to="/#future-goals" class="dropdown-item" @click="closeMenus">
                Future Goals
              </NuxtLink>
              <NuxtLink to="/#achievements" class="dropdown-item" @click="closeMenus">
                Achievements
              </NuxtLink>
              <NuxtLink to="/#skills" class="dropdown-item" @click="closeMenus">
                Skills
              </NuxtLink>
              <NuxtLink to="/#contact" class="dropdown-item" @click="closeMenus">
                Contact
              </NuxtLink>
            </div>
          </div>

          <!-- Developments with dropdown -->
          <div class="nav-dropdown">
            <NuxtLink
              to="/developments"
              class="nav-link"
              :class="{ 'router-link-active': isDevelopmentsActive }"
              @click="closeMenus"
            >
              Developments
              <span class="dropdown-arrow">▼</span>
            </NuxtLink>
            <div class="dropdown-menu">
              <NuxtLink to="/developments#npm-packages" class="dropdown-item" @click="closeMenus">
                Npm Packages
              </NuxtLink>
              <NuxtLink to="/developments#chrome-extensions" class="dropdown-item" @click="closeMenus">
                Chrome Extensions
              </NuxtLink>
              <NuxtLink to="/developments#web-services" class="dropdown-item" @click="closeMenus">
                Web Services
              </NuxtLink>
            </div>
          </div>

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
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePortfolio } from '~/composables/usePortfolio'

const { profile } = usePortfolio()
const route = useRoute()
const menuOpen = ref(false)

const isHomeActive = computed(() => {
  return route.path === '/'
})

const isDevelopmentsActive = computed(() => {
  return route.path === '/developments' || route.path.startsWith('/developments')
})

const closeMenus = () => {
  menuOpen.value = false
}
</script>

<style lang="scss" scoped>
$primary: #4a90a4;
$bg-dark: #1a1a2e;
$text-white: #fff;
$transition: all 0.3s ease;

// Dropdown styles
.nav-dropdown {
  position: relative;

  .nav-link {
    display: flex;
    align-items: center;
    gap: 6px;
  }
}

.dropdown-arrow {
  font-size: 0.6rem;
  transition: $transition;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 180px;
  background: rgba(26, 26, 46, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 8px 0;
  margin-top: 8px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: $transition;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 1001;
}

.dropdown-item {
  display: block;
  padding: 10px 20px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  transition: $transition;

  &:hover {
    color: $text-white;
    background: rgba(255, 255, 255, 0.1);
  }
}

// Desktop hover behavior
@media (min-width: 769px) {
  .nav-dropdown:hover {
    .dropdown-menu {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .dropdown-arrow {
      transform: rotate(180deg);
    }
  }
}

// Mobile styles
@media (max-width: 768px) {
  .nav-dropdown {
    width: 100%;

    .nav-link {
      width: 100%;
      justify-content: space-between;
    }

    .dropdown-menu {
      position: static;
      opacity: 1;
      visibility: visible;
      transform: none;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
      margin: 4px 0 0 0;
      padding: 8px 0;
      box-shadow: none;
    }
  }

  .dropdown-item {
    padding: 10px 24px;
    font-size: 0.85rem;
  }
}
</style>