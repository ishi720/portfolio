import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TagFilter from '../../components/TagFilter.vue'

describe('TagFilter', () => {
  const defaultTags = ['Vue', 'React', 'TypeScript']

  describe('表示条件', () => {
    it('タグが空の場合は表示されない', () => {
      const wrapper = mount(TagFilter, {
        props: { modelValue: '', tags: [] }
      })
      expect(wrapper.find('.tag-filter').exists()).toBe(false)
    })

    it('タグがある場合は表示される', () => {
      const wrapper = mount(TagFilter, {
        props: { modelValue: '', tags: defaultTags }
      })
      expect(wrapper.find('.tag-filter').exists()).toBe(true)
    })
  })

  describe('ボタン表示', () => {
    it('「すべて」ボタンが最初に表示される', () => {
      const wrapper = mount(TagFilter, {
        props: { modelValue: '', tags: defaultTags }
      })
      const buttons = wrapper.findAll('.tag-filter-btn')
      expect(buttons[0].text()).toBe('すべて')
    })

    it('タグの数+1個のボタンが表示される', () => {
      const wrapper = mount(TagFilter, {
        props: { modelValue: '', tags: defaultTags }
      })
      const buttons = wrapper.findAll('.tag-filter-btn')
      expect(buttons.length).toBe(4) // すべて + 3タグ
    })

    it('全てのタグがボタンとして表示される', () => {
      const wrapper = mount(TagFilter, {
        props: { modelValue: '', tags: defaultTags }
      })
      const buttons = wrapper.findAll('.tag-filter-btn')
      expect(buttons[1].text()).toBe('Vue')
      expect(buttons[2].text()).toBe('React')
      expect(buttons[3].text()).toBe('TypeScript')
    })
  })

  describe('アクティブ状態', () => {
    it('modelValueが空の場合「すべて」がアクティブ', () => {
      const wrapper = mount(TagFilter, {
        props: { modelValue: '', tags: defaultTags }
      })
      const allButton = wrapper.findAll('.tag-filter-btn')[0]
      expect(allButton.classes()).toContain('active')
    })

    it('modelValueが設定されている場合、該当タグがアクティブ', () => {
      const wrapper = mount(TagFilter, {
        props: { modelValue: 'React', tags: defaultTags }
      })
      const buttons = wrapper.findAll('.tag-filter-btn')
      expect(buttons[0].classes()).not.toContain('active') // すべて
      expect(buttons[1].classes()).not.toContain('active') // Vue
      expect(buttons[2].classes()).toContain('active')     // React
      expect(buttons[3].classes()).not.toContain('active') // TypeScript
    })
  })

  describe('クリックイベント', () => {
    it('「すべて」クリックで空文字が発火', async () => {
      const wrapper = mount(TagFilter, {
        props: { modelValue: 'Vue', tags: defaultTags }
      })
      await wrapper.findAll('.tag-filter-btn')[0].trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([''])
    })

    it('タグクリックでそのタグが発火', async () => {
      const wrapper = mount(TagFilter, {
        props: { modelValue: '', tags: defaultTags }
      })
      await wrapper.findAll('.tag-filter-btn')[2].trigger('click') // React
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['React'])
    })

    it('同じタグを再クリックで空文字が発火（トグル動作）', async () => {
      const wrapper = mount(TagFilter, {
        props: { modelValue: 'React', tags: defaultTags }
      })
      await wrapper.findAll('.tag-filter-btn')[2].trigger('click') // React（既に選択中）
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([''])
    })

    it('異なるタグクリックで新しいタグが発火', async () => {
      const wrapper = mount(TagFilter, {
        props: { modelValue: 'Vue', tags: defaultTags }
      })
      await wrapper.findAll('.tag-filter-btn')[3].trigger('click') // TypeScript
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['TypeScript'])
    })
  })

  describe('タグ1つの場合', () => {
    it('タグ1つでも正しく表示される', () => {
      const wrapper = mount(TagFilter, {
        props: { modelValue: '', tags: ['SingleTag'] }
      })
      const buttons = wrapper.findAll('.tag-filter-btn')
      expect(buttons.length).toBe(2)
      expect(buttons[1].text()).toBe('SingleTag')
    })
  })
})
