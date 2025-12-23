<template>
  <div>
    <section class="page-hero">
      <div class="container">
        <h1 class="page-title">Contact</h1>
        <p class="page-subtitle">お問い合わせ</p>
      </div>
    </section>

    <section class="contact-section">
      <div class="container">
        <div class="contact-content">
          <div class="contact-info">
            <h3>Get in Touch</h3>
            <p>お仕事のご依頼やご質問など、お気軽にご連絡ください。</p>
            
            <div class="contact-email">
              <span class="contact-label">Email</span>
              <a :href="`mailto:${profile.email}`" class="email-link">{{ profile.email }}</a>
            </div>
            
            <div class="contact-social">
              <span class="contact-label">SNS</span>
              <div class="social-links">
                <a v-for="social in socials" :key="social.name" :href="social.url" target="_blank" class="social-link">
                  {{ social.name }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { usePortfolio } from '~/composables/usePortfolio'

const { profile, socials } = usePortfolio()
</script>
