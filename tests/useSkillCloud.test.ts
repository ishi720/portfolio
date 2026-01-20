import { describe, it, expect } from 'vitest'
import { containsJapanese } from '../composables/useSkillCloud'

describe('containsJapanese', () => {
  describe('ひらがな', () => {
    it('ひらがなを含む場合はtrueを返す', () => {
      expect(containsJapanese('あいうえお')).toBe(true)
      expect(containsJapanese('TypeScriptあ')).toBe(true)
      expect(containsJapanese('あTypeScript')).toBe(true)
    })
  })

  describe('カタカナ', () => {
    it('カタカナを含む場合はtrueを返す', () => {
      expect(containsJapanese('アイウエオ')).toBe(true)
      expect(containsJapanese('TypeScriptア')).toBe(true)
      expect(containsJapanese('タイプスクリプト')).toBe(true)
    })
  })

  describe('漢字', () => {
    it('漢字を含む場合はtrueを返す', () => {
      expect(containsJapanese('日本語')).toBe(true)
      expect(containsJapanese('TypeScript開発')).toBe(true)
      expect(containsJapanese('開発環境')).toBe(true)
    })
  })

  describe('英数字・記号のみ', () => {
    it('英字のみの場合はfalseを返す', () => {
      expect(containsJapanese('TypeScript')).toBe(false)
      expect(containsJapanese('Vue.js')).toBe(false)
      expect(containsJapanese('Node.js')).toBe(false)
    })

    it('数字のみの場合はfalseを返す', () => {
      expect(containsJapanese('12345')).toBe(false)
    })

    it('記号を含む場合でも日本語がなければfalseを返す', () => {
      expect(containsJapanese('C++')).toBe(false)
      expect(containsJapanese('C#')).toBe(false)
      expect(containsJapanese('node-sass')).toBe(false)
      expect(containsJapanese('@vue/test-utils')).toBe(false)
    })

    it('空文字の場合はfalseを返す', () => {
      expect(containsJapanese('')).toBe(false)
    })
  })

  describe('混合ケース', () => {
    it('英数字と日本語が混在する場合はtrueを返す', () => {
      expect(containsJapanese('React入門')).toBe(true)
      expect(containsJapanese('Vue3の使い方')).toBe(true)
    })
  })
})
