<template>
  <section id="services" class="services-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">サービス一覧</h2>
        <p class="section-subtitle">Web Services</p>
      </div>
      <div class="swiper-container">
        <Swiper
          :modules="modules"
          :slides-per-view="'auto'"
          :space-between="24"
          :loop="true"
          :autoplay="{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }"
          :pagination="{ clickable: true }"
          :navigation="{ prevEl: '.swiper-btn-prev', nextEl: '.swiper-btn-next' }"
          :grab-cursor="true"
          class="services-swiper"
        >
          <SwiperSlide v-for="service in services" :key="service.title">
            <a :href="service.url" target="_blank" class="slide-card">
              <div class="slide-image">
                <img :src="`/portfolio/images/service/${service.image}`" :alt="service.title" :draggable="false" @error="handleImgError">
                <div class="slide-image-placeholder">{{ service.title }}</div>
              </div>
              <div class="slide-content">
                <h3 class="slide-title">{{ service.title }}</h3>
                <p class="slide-desc">{{ service.description }}</p>
                <div class="slide-techs">
                  <span v-for="tech in service.techs" :key="tech" class="tech-tag">{{ tech }}</span>
                </div>
              </div>
            </a>
          </SwiperSlide>
        </Swiper>
        <button class="swiper-btn-prev">&#8249;</button>
        <button class="swiper-btn-next">&#8250;</button>
      </div>
      <div class="slider-footer">
        <NuxtLink to="/developments#web-services" class="view-all-link">すべて見る →</NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

interface Service {
  title: string
  url: string
  image: string
  description: string
  techs: string[]
}

defineProps<{ services: Service[] }>()

const modules = [Autoplay, Pagination, Navigation]

const handleImgError = (e: Event) => {
  (e.target as HTMLImageElement).style.display = 'none'
}
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;
@use '~/assets/scss/mixins' as *;

.services-section {
  padding: 60px 0 40px;
}

.swiper-container {
  position: relative;
  padding: 0 48px;
  overflow: hidden;
}

.services-swiper {
  padding-bottom: 40px !important;
}

.slide-card {
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 100%;
  background: $card-bg;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.10), 0 1px 4px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  text-decoration: none;
  color: inherit;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.16), 0 4px 12px rgba(0, 0, 0, 0.08);

    .slide-image img {
      transform: scale(1.02);
    }
  }
}

.slide-image {
  position: relative;
  height: 160px;
  background: $bg;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;

    &:not([style*="display: none"]) + .slide-image-placeholder {
      display: none;
    }
  }

  &-placeholder {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    color: $text-light;
    padding: 16px;
    text-align: center;
    background: linear-gradient(135deg, #e8e8e8 0%, #f5f5f5 100%);
  }
}

.slide-content {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.slide-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: $text;
}

.slide-desc {
  font-size: 0.8rem;
  color: $text-light;
  line-height: 1.6;
  flex: 1;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.slide-techs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tech-tag {
  font-size: 0.7rem;
  padding: 2px 8px;
  background: rgba($primary, 0.1);
  color: $primary;
  border-radius: 20px;
  font-weight: 500;
}

.swiper-btn-prev,
.swiper-btn-next {
  position: absolute;
  top: 50%;
  transform: translateY(calc(-50% - 20px));
  z-index: 10;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid $border;
  background: $card-bg;
  color: $text;
  font-size: 1.4rem;
  cursor: pointer;
  transition: $transition;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: $primary;
    border-color: $primary;
    color: $text-white;
  }
}

.swiper-btn-prev { left: 0; }
.swiper-btn-next { right: 0; }

// スライド幅・高さ統一
:deep(.swiper-slide) {
  width: 300px;
  height: auto;
  display: flex;
}

:deep(.swiper-wrapper) {
  align-items: stretch;
}

// ホバー時のはみ出しを許可
:deep(.swiper-wrapper) {
  padding-top: 8px;
}

:deep(.swiper) {
  overflow: visible;
}

// Swiper pagination dots のスタイル上書き
:deep(.swiper-pagination-bullet) {
  background: $border;
  opacity: 1;
  width: 8px;
  height: 8px;
  transition: $transition;
}

:deep(.swiper-pagination-bullet-active) {
  background: $primary;
  width: 24px;
  border-radius: 4px;
}

.slider-footer {
  text-align: center;
  margin-top: 8px;
}

.view-all-link {
  display: inline-block;
  color: $primary;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  padding: 8px 20px;
  border: 1px solid $primary;
  border-radius: 20px;
  transition: $transition;

  &:hover {
    background: $primary;
    color: $text-white;
  }
}

@include mobile {
  .swiper-container {
    padding: 0 40px;
  }

  :deep(.swiper-slide) {
    width: 260px;
  }

  .slide-card {
    width: 260px;
  }
}
</style>
