import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchBox from '../../components/SearchBox.vue'

describe('SearchBox', () => {
  describe('初期表示', () => {
    it('modelValueが入力欄に反映される', () => {
      const wrapper = mount(SearchBox, {
        props: { modelValue: 'test' }
      })
      const input = wrapper.find('input')
      expect(input.element.value).toBe('test')
    })

    it('デフォルトのplaceholderが表示される', () => {
      const wrapper = mount(SearchBox, {
        props: { modelValue: '' }
      })
      const input = wrapper.find('input')
      expect(input.attributes('placeholder')).toBe('検索...')
    })

    it('カスタムplaceholderが表示される', () => {
      const wrapper = mount(SearchBox, {
        props: { modelValue: '', placeholder: 'タイトルを検索' }
      })
      const input = wrapper.find('input')
      expect(input.attributes('placeholder')).toBe('タイトルを検索')
    })
  })

  describe('入力イベント', () => {
    it('入力時にupdate:modelValueが発火', async () => {
      const wrapper = mount(SearchBox, {
        props: { modelValue: '' }
      })
      const input = wrapper.find('input')
      await input.setValue('検索クエリ')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['検索クエリ'])
    })

    it('空文字への変更も正しく発火', async () => {
      const wrapper = mount(SearchBox, {
        props: { modelValue: 'test' }
      })
      const input = wrapper.find('input')
      await input.setValue('')
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([''])
    })
  })

  describe('スタイルクラス', () => {
    it('search-boxクラスが存在する', () => {
      const wrapper = mount(SearchBox, {
        props: { modelValue: '' }
      })
      expect(wrapper.find('.search-box').exists()).toBe(true)
    })

    it('search-inputクラスが存在する', () => {
      const wrapper = mount(SearchBox, {
        props: { modelValue: '' }
      })
      expect(wrapper.find('.search-input').exists()).toBe(true)
    })
  })

  describe('入力タイプ', () => {
    it('input typeがtextである', () => {
      const wrapper = mount(SearchBox, {
        props: { modelValue: '' }
      })
      const input = wrapper.find('input')
      expect(input.attributes('type')).toBe('text')
    })
  })
})
