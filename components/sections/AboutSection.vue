<template>
  <section id="about-me" class="about-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">自己紹介</h2>
        <p class="section-subtitle">About Me</p>
      </div>
      <div class="about-card">
        <div class="about-content">
          <div class="about-image">
            <img :src="profile.avatar" :alt="profile.name">
          </div>
          <div class="about-text">
            <div class="about-name-row">
              <h3>{{ profile.name }}</h3>
              <span class="about-role">フルスタックエンジニア</span>
            </div>
            <p class="about-bio">{{ profile.bio }}</p>
            <div class="about-sns">
              <a v-for="social in socials" :key="social.name" :href="social.url" target="_blank" class="about-sns-link">
                <img :src="getSnsIcon(social.name)" alt="">
                <span class="about-sns-label">{{ social.name }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Profile {
  name: string
  avatar: string
  bio: string
}

interface Social {
  name: string
  url: string
}

defineProps<{
  profile: Profile
  socials: Social[]
}>()

const getSnsIcon = (name: string): string => {
  const icons: Record<string, string> = {
    'GitHub': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg',
    'Qiita': 'https://cdn.simpleicons.org/qiita/55C500',
    'Zenn': 'https://cdn.simpleicons.org/zenn/3EA8FF',
    'Note': 'https://cdn.simpleicons.org/note/000000',
    'npm': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/npm/npm-original-wordmark.svg',
    'LINE Store': 'https://cdn.simpleicons.org/line/06C755',
    'VS Marketplace': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg',
  }
  return icons[name] || 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/devicon/devicon-original.svg'
}
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;
@use '~/assets/scss/mixins' as *;

$radius: $radius-lg;

.about-section {
  padding: 60px 0 40px;
}

.about-card {
  background: $card-bg;
  border-radius: $radius;
  padding: 32px;
  box-shadow: $shadow;
  max-width: 1000px;
  margin: 0 auto;
}

.about-name-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;

  h3 {
    font-family: $font-en;
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }
}

.about-role {
  font-size: 0.85rem;
  color: $primary;
  background: rgba($primary, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 500;
}

.about-bio {
  color: $text-light;
  line-height: 1.8;
  margin-bottom: 20px;
}

.about-sns {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.about-sns-link {
  height: 40px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px 0 10px;
  background: $bg;
  border-radius: 20px;
  transition: $transition;

  img {
    width: 22px;
    height: 22px;
    object-fit: contain;
    transition: $transition;
  }

  &:hover {
    background: $primary;
    transform: translateY(-2px);

    img {
      filter: brightness(0) invert(1);
    }

    .about-sns-label {
      color: #fff;
    }
  }
}

.about-sns-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: $text;
  white-space: nowrap;
  transition: $transition;
}

@include mobile {
  .about-name-row {
    @include mobile-stack;
    gap: 8px;
  }

  .about-sns {
    justify-content: flex-start;
  }
}
</style>
