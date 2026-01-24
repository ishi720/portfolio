import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SortControls from '../../components/SortControls.vue'
import type { SortOption, SortState } from '../../types/models'

describe('SortControls', () => {
  const defaultOptions: SortOption[] = [
    { key: 'date', label: '日付' },
    { key: 'title', label: 'タイトル' },
    { key: 'likes', label: 'いいね数' }
  ]

  const defaultState: SortState = { key: 'date', order: 'desc' }

  describe('表示', () => {
    it('ラベル「並び替え:」が表示される', () => {
      const wrapper = mount(SortControls, {
        props: { modelValue: defaultState, options: defaultOptions }
      })
      expect(wrapper.find('.sort-label').text()).toBe('並び替え:')
    })

    it('全てのオプションがボタンとして表示される', () => {
      const wrapper = mount(SortControls, {
        props: { modelValue: defaultState, options: defaultOptions }
      })
      const buttons = wrapper.findAll('.sort-btn')
      expect(buttons.length).toBe(3)
    })

    it('オプションのラベルが正しく表示される', () => {
      const wrapper = mount(SortControls, {
        props: { modelValue: defaultState, options: defaultOptions }
      })
      const buttons = wrapper.findAll('.sort-btn')
      expect(buttons[0].text()).toContain('日付')
      expect(buttons[1].text()).toContain('タイトル')
      expect(buttons[2].text()).toContain('いいね数')
    })
  })

  describe('アクティブ状態', () => {
    it('現在のソートキーにactiveクラスが付与される', () => {
      const wrapper = mount(SortControls, {
        props: { modelValue: { key: 'title', order: 'asc' }, options: defaultOptions }
      })
      const buttons = wrapper.findAll('.sort-btn')
      expect(buttons[0].classes()).not.toContain('active') // date
      expect(buttons[1].classes()).toContain('active')     // title
      expect(buttons[2].classes()).not.toContain('active') // likes
    })
  })

  describe('ソートアイコン', () => {
    it('降順の場合は↓が表示される', () => {
      const wrapper = mount(SortControls, {
        props: { modelValue: { key: 'date', order: 'desc' }, options: defaultOptions }
      })
      const activeButton = wrapper.find('.sort-btn.active')
      expect(activeButton.find('.sort-icon').text()).toBe('↓')
    })

    it('昇順の場合は↑が表示される', () => {
      const wrapper = mount(SortControls, {
        props: { modelValue: { key: 'date', order: 'asc' }, options: defaultOptions }
      })
      const activeButton = wrapper.find('.sort-btn.active')
      expect(activeButton.find('.sort-icon').text()).toBe('↑')
    })

    it('非アクティブなボタンにはアイコンが表示されない', () => {
      const wrapper = mount(SortControls, {
        props: { modelValue: { key: 'date', order: 'desc' }, options: defaultOptions }
      })
      const buttons = wrapper.findAll('.sort-btn')
      // 非アクティブボタン（title, likes）のアイコンは空白
      expect(buttons[1].find('.sort-icon').text().trim()).toBe('')
      expect(buttons[2].find('.sort-icon').text().trim()).toBe('')
    })
  })

  describe('クリックイベント', () => {
    it('同じキーをクリックすると順序が切り替わる（desc→asc）', async () => {
      const wrapper = mount(SortControls, {
        props: { modelValue: { key: 'date', order: 'desc' }, options: defaultOptions }
      })
      await wrapper.findAll('.sort-btn')[0].trigger('click') // date
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([{ key: 'date', order: 'asc' }])
    })

    it('同じキーをクリックすると順序が切り替わる（asc→desc）', async () => {
      const wrapper = mount(SortControls, {
        props: { modelValue: { key: 'date', order: 'asc' }, options: defaultOptions }
      })
      await wrapper.findAll('.sort-btn')[0].trigger('click') // date
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([{ key: 'date', order: 'desc' }])
    })

    it('異なるキーをクリックすると新しいキーで降順になる', async () => {
      const wrapper = mount(SortControls, {
        props: { modelValue: { key: 'date', order: 'asc' }, options: defaultOptions }
      })
      await wrapper.findAll('.sort-btn')[1].trigger('click') // title
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([{ key: 'title', order: 'desc' }])
    })

    it('3番目のオプションをクリックしても正しく動作', async () => {
      const wrapper = mount(SortControls, {
        props: { modelValue: { key: 'date', order: 'desc' }, options: defaultOptions }
      })
      await wrapper.findAll('.sort-btn')[2].trigger('click') // likes
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([{ key: 'likes', order: 'desc' }])
    })
  })

  describe('オプション1つの場合', () => {
    it('オプション1つでも正しく表示・動作する', async () => {
      const singleOption: SortOption[] = [{ key: 'date', label: '日付' }]
      const wrapper = mount(SortControls, {
        props: { modelValue: { key: 'date', order: 'desc' }, options: singleOption }
      })
      const buttons = wrapper.findAll('.sort-btn')
      expect(buttons.length).toBe(1)

      await buttons[0].trigger('click')
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([{ key: 'date', order: 'asc' }])
    })
  })
})
