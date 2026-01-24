import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Pagination from '../../components/Pagination.vue'

describe('Pagination', () => {
  describe('表示条件', () => {
    it('totalPagesが1以下の場合は表示されない', () => {
      const wrapper = mount(Pagination, {
        props: { modelValue: 1, totalPages: 1 }
      })
      expect(wrapper.find('nav').exists()).toBe(false)
    })

    it('totalPagesが2以上の場合は表示される', () => {
      const wrapper = mount(Pagination, {
        props: { modelValue: 1, totalPages: 2 }
      })
      expect(wrapper.find('nav').exists()).toBe(true)
    })
  })

  describe('visiblePages計算', () => {
    it('7ページ以下の場合は全ページを表示', () => {
      const wrapper = mount(Pagination, {
        props: { modelValue: 1, totalPages: 7 }
      })
      const buttons = wrapper.findAll('.pagination-num')
      expect(buttons.map(b => b.text())).toEqual(['1', '2', '3', '4', '5', '6', '7'])
    })

    it('8ページ以上で先頭付近(1ページ目)の場合', () => {
      const wrapper = mount(Pagination, {
        props: { modelValue: 1, totalPages: 10 }
      })
      const buttons = wrapper.findAll('.pagination-num')
      // 1, 2, ..., 10
      expect(buttons.map(b => b.text())).toEqual(['1', '2', '...', '10'])
    })

    it('8ページ以上で先頭付近(2ページ目)の場合', () => {
      const wrapper = mount(Pagination, {
        props: { modelValue: 2, totalPages: 10 }
      })
      const buttons = wrapper.findAll('.pagination-num')
      // 1, 2, 3, ..., 10
      expect(buttons.map(b => b.text())).toEqual(['1', '2', '3', '...', '10'])
    })

    it('8ページ以上で中央(5ページ目)の場合', () => {
      const wrapper = mount(Pagination, {
        props: { modelValue: 5, totalPages: 10 }
      })
      const buttons = wrapper.findAll('.pagination-num')
      // 1, ..., 4, 5, 6, ..., 10
      expect(buttons.map(b => b.text())).toEqual(['1', '...', '4', '5', '6', '...', '10'])
    })

    it('8ページ以上で末尾付近(9ページ目)の場合', () => {
      const wrapper = mount(Pagination, {
        props: { modelValue: 9, totalPages: 10 }
      })
      const buttons = wrapper.findAll('.pagination-num')
      // 1, ..., 8, 9, 10
      expect(buttons.map(b => b.text())).toEqual(['1', '...', '8', '9', '10'])
    })

    it('8ページ以上で最終ページの場合', () => {
      const wrapper = mount(Pagination, {
        props: { modelValue: 10, totalPages: 10 }
      })
      const buttons = wrapper.findAll('.pagination-num')
      // 1, ..., 9, 10
      expect(buttons.map(b => b.text())).toEqual(['1', '...', '9', '10'])
    })
  })

  describe('ナビゲーションボタン', () => {
    it('1ページ目では「前へ」ボタンが無効', () => {
      const wrapper = mount(Pagination, {
        props: { modelValue: 1, totalPages: 5 }
      })
      const prevButton = wrapper.find('.pagination-prev')
      expect(prevButton.attributes('disabled')).toBeDefined()
    })

    it('最終ページでは「次へ」ボタンが無効', () => {
      const wrapper = mount(Pagination, {
        props: { modelValue: 5, totalPages: 5 }
      })
      const nextButton = wrapper.find('.pagination-next')
      expect(nextButton.attributes('disabled')).toBeDefined()
    })

    it('中間ページでは両方のボタンが有効', () => {
      const wrapper = mount(Pagination, {
        props: { modelValue: 3, totalPages: 5 }
      })
      const prevButton = wrapper.find('.pagination-prev')
      const nextButton = wrapper.find('.pagination-next')
      expect(prevButton.attributes('disabled')).toBeUndefined()
      expect(nextButton.attributes('disabled')).toBeUndefined()
    })
  })

  describe('イベント発火', () => {
    it('ページ番号クリックでupdate:modelValueが発火', async () => {
      const wrapper = mount(Pagination, {
        props: { modelValue: 1, totalPages: 5 }
      })
      await wrapper.findAll('.pagination-num')[2].trigger('click') // 3ページ目
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([3])
    })

    it('ページ番号クリックでchangeイベントも発火', async () => {
      const wrapper = mount(Pagination, {
        props: { modelValue: 1, totalPages: 5 }
      })
      await wrapper.findAll('.pagination-num')[1].trigger('click') // 2ページ目
      expect(wrapper.emitted('change')).toBeTruthy()
      expect(wrapper.emitted('change')![0]).toEqual([2])
    })

    it('「前へ」ボタンクリックで前のページへ', async () => {
      const wrapper = mount(Pagination, {
        props: { modelValue: 3, totalPages: 5 }
      })
      await wrapper.find('.pagination-prev').trigger('click')
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([2])
    })

    it('「次へ」ボタンクリックで次のページへ', async () => {
      const wrapper = mount(Pagination, {
        props: { modelValue: 3, totalPages: 5 }
      })
      await wrapper.find('.pagination-next').trigger('click')
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([4])
    })

    it('省略記号(...)はクリックしてもイベントが発火しない', async () => {
      const wrapper = mount(Pagination, {
        props: { modelValue: 5, totalPages: 10 }
      })
      const ellipsisButton = wrapper.findAll('.pagination-num').find(b => b.text() === '...')
      expect(ellipsisButton).toBeDefined()
      await ellipsisButton!.trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })
  })

  describe('アクティブ状態', () => {
    it('現在のページにactiveクラスが付与される', () => {
      const wrapper = mount(Pagination, {
        props: { modelValue: 3, totalPages: 5 }
      })
      const activeButton = wrapper.find('.pagination-num.active')
      expect(activeButton.text()).toBe('3')
    })

    it('省略記号にはellipsisクラスが付与される', () => {
      const wrapper = mount(Pagination, {
        props: { modelValue: 5, totalPages: 10 }
      })
      const ellipsisButtons = wrapper.findAll('.pagination-num.ellipsis')
      expect(ellipsisButtons.length).toBeGreaterThan(0)
      expect(ellipsisButtons[0].text()).toBe('...')
    })
  })
})
