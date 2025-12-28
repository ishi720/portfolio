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
            v-for="(company, companyIndex) in filteredCareers"
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
                v-for="project in getFilteredProjects(company.projects)"
                :key="project.name"
                class="project-card"
                :class="`project-card-${companyIndex % 6}`"
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
                      class="tech-badge"
                      :class="{ 'tech-badge-active': tech === selectedTech }"
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

        <!-- 結果なしメッセージ -->
        <div v-if="filteredCareers.length === 0" class="no-results">
          <p>該当するプロジェクトがありません</p>
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

// 選択された技術タグでフィルタリングされた経歴
const filteredCareers = computed(() => {
  if (!selectedTech.value) {
    return careers
  }

  return careers
    .map(company => ({
      ...company,
      projects: company.projects.filter(
        project => project.techs.includes(selectedTech.value)
      )
    }))
    .filter(company => company.projects.length > 0)
})

// プロジェクトのフィルタリング
const getFilteredProjects = (projects: Project[]): Project[] => {
  if (!selectedTech.value) {
    return projects
  }
  return projects.filter(project => project.techs.includes(selectedTech.value))
}
</script>

<style lang="scss" scoped>
// Variables
$primary: #4a90a4;
$primary-dark: #3a7a8a;
$primary-light: #5ba8bf;
$accent: #e8b44a;
$bg: #f5f5f5;
$text: #333;
$text-light: #666;
$text-white: #fff;
$card-bg: #fff;
$border: #e0e0e0;
$shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
$shadow-hover: 0 12px 40px rgba(0, 0, 0, 0.15);
$radius: 12px;
$transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
$font-ja: 'Noto Sans JP', sans-serif;
$font-en: 'Poppins', sans-serif;

// 会社ごとのアクセントカラー（左ボーダーのみ）
$company-colors: (
  0: #667eea,
  1: #4facfe,
  2: #02bb3f,
  3: #f5576c,
  4: #f093fb,
  5: #fbbf24,
);

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
  padding: 24px;
  background: #fff;
  color: $text;
  transition: $transition;
  position: relative;
  box-shadow: $shadow;
  border-left: 4px solid $primary;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-hover;

    .project-name::after {
      width: 100%;
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

      .tech-badge-active {
        background: rgba($color, 0.15);
        border-color: $color;
        color: darken($color, 15%);
      }
    }
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
  gap: 8px;
}

.tech-badge {
  font-family: $font-en;
  font-size: 0.7rem;
  font-weight: 500;
  padding: 4px 10px;
  background: $bg;
  border: 1px solid $border;
  border-radius: 4px;
  color: $text-light;
  transition: $transition;

  &.tech-badge-active {
    background: rgba($primary, 0.1);
    border-color: $primary;
    color: $primary;
    font-weight: 600;
  }
}

.project-period {
  font-family: $font-en;
  font-size: 0.8rem;
  color: $text-light;
  white-space: nowrap;
}

// 結果なし
.no-results {
  text-align: center;
  padding: 60px 20px;
  color: $text-light;
  font-size: 1rem;
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

  .project-card {
    padding: 20px;
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