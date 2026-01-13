<template>
  <div>
    <section class="page-hero">
      <div class="container">
        <h1 class="page-title">Career</h1>
        <p class="page-subtitle">職務経歴・プロジェクト実績</p>
      </div>
    </section>

    <section class="career-section">
      <div class="container">
        <!-- フィルター -->
        <div class="career-filters">
          <TagFilter
            v-model="selectedTech"
            :tags="popularTechs"
          />
        </div>

        <!-- タイムライン -->
        <div class="career-timeline">
          <div
            v-for="(company, companyIndex) in careers"
            :key="company.name"
            class="timeline-company"
          >
            <!-- 会社ヘッダー -->
            <div class="company-header">
              <div class="company-marker">
                <div class="marker-dot"></div>
              </div>
              <div class="company-info">
                <h2 class="company-name">{{ company.name }}</h2>
                <div class="company-meta">
                  <span class="company-period">{{ company.period }}</span>
                  <span v-if="company.position" class="company-position">{{ company.position }}</span>
                </div>
              </div>
            </div>

            <!-- プロジェクト一覧 -->
            <div class="projects-container">
              <div
                v-for="project in company.projects"
                :key="project.name"
                class="project-card"
                :class="[
                  `project-card-${companyIndex % 6}`,
                  { 'project-card-collapsed': !isProjectMatch(project) }
                ]"
              >
                <!-- 折りたたみ時のヘッダー -->
                <div
                  v-if="!isProjectMatch(project)"
                  class="project-collapsed-header"
                >
                  <h3 class="project-name-collapsed">{{ project.name }}</h3>
                </div>

                <!-- 展開時のコンテンツ -->
                <div
                  v-if="isProjectMatch(project)"
                  class="project-content"
                >
                  <div class="project-header">
                    <h3 class="project-name">{{ project.name }}</h3>
                    <span class="project-industry">{{ project.industry }}</span>
                  </div>
                  <p class="project-description">{{ project.description }}</p>
                  <div class="project-footer">
                    <div class="project-techs">
                      <span
                        v-for="tech in project.techs"
                        :key="tech"
                        class="tech-tag"
                        :class="{ 'tech-tag-active': tech === selectedTech }"
                      >
                        {{ tech }}
                      </span>
                    </div>
                    <span class="project-period">{{ project.period }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCareer } from '~/composables/useCareer'
import type { Project } from '~/composables/useCareer'

const { careers } = useCareer()

const selectedTech = ref('')

// プロジェクトがフィルターに一致するか
const isProjectMatch = (project: Project): boolean => {
  if (!selectedTech.value) return true
  return project.techs.includes(selectedTech.value)
}

// 人気の技術タグ（使用回数が多い上位15件）
const popularTechs = computed(() => {
  const techCount: Record<string, number> = {}
  careers.forEach(company => {
    company.projects.forEach(project => {
      project.techs.forEach(tech => {
        techCount[tech] = (techCount[tech] || 0) + 1
      })
    })
  })
  return Object.entries(techCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([tech]) => tech)
})
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '~/assets/scss/variables' as *;

$radius: $radius-lg; // Override for this page
$shadow: 0 4px 20px rgba(0, 0, 0, 0.08); // Custom shadow for career
$shadow-hover: 0 12px 40px rgba(0, 0, 0, 0.15);
$transition: $transition-smooth;

.career-section {
  padding: 60px 0 100px;
  background: linear-gradient(180deg, $bg 0%, darken($bg, 2%) 100%);
}

.career-filters {
  margin-bottom: 40px;
}

// タイムライン
.career-timeline {
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
}

.timeline-company {
  position: relative;
  margin-bottom: 48px;
  padding-left: 38px;

  &:last-child {
    margin-bottom: 0;
  }

  // タイムラインの縦線（会社間を繋ぐ）
  &:not(:last-child)::before {
    content: '';
    position: absolute;
    top: 13px;
    left: 8px;
    width: 3px;
    height: calc(100% + 48px);
    background: $primary;
    z-index: 1;
  }
}

// 会社ヘッダー
.company-header {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 24px;
  margin-left: -38px;
}

.company-marker {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  padding-top: 4px;
}

.marker-dot {
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, $primary 0%, $primary-dark 100%);
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba($primary, 0.2), 0 4px 12px rgba($primary, 0.3);
  position: relative;
  z-index: 2;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    background: $text-white;
    border-radius: 50%;
  }
}

.company-info {
  flex: 1;
}

.company-name {
  font-family: $font-ja;
  font-size: 1.5rem;
  font-weight: 700;
  color: $text;
  margin: 0 0 8px;
  letter-spacing: 0.02em;
}

.company-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.company-period {
  font-family: $font-en;
  font-size: 0.9rem;
  color: $text-light;
  font-weight: 500;
}

.company-position {
  font-size: 0.85rem;
  color: $primary;
  background: rgba($primary, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 500;
}

// プロジェクトカード
.projects-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-left: 20px;
}

.project-card {
  border-radius: $radius;
  background: #fff;
  color: $text;
  transition: $transition;
  position: relative;
  box-shadow: $shadow;
  border-left: 4px solid $primary;
  overflow: hidden;

  &:not(.project-card-collapsed) {
    padding: 24px;

    &:hover {
      transform: translateY(-4px);
      box-shadow: $shadow-hover;

      .project-name::after {
        width: 100%;
      }
    }
  }

  &.project-card-collapsed {
    padding: 0;
    opacity: 0.7;

    &:hover {
      opacity: 1;
    }
  }

  // 会社ごとの左ボーダーカラー
  @each $index, $color in $company-colors {
    &.project-card-#{$index} {
      border-left-color: $color;

      .project-industry {
        background: $color;
        color: #fff;
      }

      .tech-tag-active {
        background: rgba($color, 0.15);
        border-color: $color;
        color: color.adjust($color, $lightness: -15%);
      }
    }
  }
}

// 折りたたみヘッダー
.project-collapsed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
}

.project-name-collapsed {
  font-family: $font-ja;
  font-size: 0.95rem;
  font-weight: 500;
  color: $text-light;
  margin: 0;
}

// 展開コンテンツ
.project-content {
  .project-card-collapsed & {
    padding: 0 24px 24px;
  }
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 12px;
}

.project-name {
  font-family: $font-ja;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  position: relative;
  display: inline-block;
  color: $text;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: $primary;
    transition: width 0.3s ease;
    border-radius: 2px;
  }
}

.project-industry {
  font-size: 0.7rem;
  background: $primary;
  color: #fff;
  padding: 4px 10px;
  border-radius: 4px;
  white-space: nowrap;
  font-weight: 500;
}

.project-description {
  font-size: 0.9rem;
  line-height: 1.7;
  margin: 0 0 16px;
  color: $text-light;
}

.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
}

.project-techs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

// tech-tag-active は選択中のタグ用（会社カラーで上書きされる）
.tech-tag-active {
  background: rgba($primary, 0.15);
  color: $primary-dark;
  font-weight: 600;
}

.project-period {
  font-family: $font-en;
  font-size: 0.8rem;
  color: $text-light;
  white-space: nowrap;
}

// レスポンシブ
@media (max-width: 768px) {
  .career-section {
    padding: 40px 0 60px;
  }

  .company-header {
    gap: 16px;
  }

  .company-name {
    font-size: 1.25rem;
  }

  .company-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .projects-container {
    padding-left: 16px;
  }

  .project-card:not(.project-card-collapsed) {
    padding: 20px;
  }

  .project-collapsed-header {
    padding: 14px 20px;
  }

  .project-content {
    .project-card-collapsed & {
      padding: 0 20px 20px;
    }
  }

  .project-header {
    flex-direction: column;
    gap: 8px;
  }

  .project-name {
    font-size: 1.05rem;
  }

  .project-footer {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>