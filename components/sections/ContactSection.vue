<template>
  <section id="contact" class="contact-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">お問い合わせ</h2>
        <p class="section-subtitle">Contact</p>
      </div>
      <a :href="`mailto:${email}`" class="contact-card">
        <div class="contact-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
        </div>
        <div class="contact-info">
          <h3 class="contact-label">Email</h3>
          <span class="contact-email">{{ email }}</span>
        </div>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  email: string
}>()
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;
@use '~/assets/scss/mixins' as *;

$radius: $radius-lg;

.contact-section {
  padding: 60px 0 80px;
}

.contact-card {
  background: $card-bg;
  border-radius: $radius;
  padding: 32px;
  box-shadow: $shadow;
  transition: $transition;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  max-width: 1000px;
  margin: 0 auto;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-hover;

    .contact-icon svg {
      transform: scale(1.1);
    }
  }
}

.contact-icon {
  width: 56px;
  height: 56px;
  color: $primary;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
    transition: $transition;
  }
}

.contact-info {
  text-align: left;
}

.contact-label {
  font-family: $font-en;
  font-size: 1.1rem;
  font-weight: 600;
  color: $text;
  margin: 0 0 4px;
}

.contact-email {
  font-size: 0.9rem;
  color: $primary;
  word-break: break-all;
}

@include mobile {
  .contact-card {
    @include mobile-stack(center);
    text-align: center;

    .contact-info {
      text-align: center;
    }
  }
}
</style>
