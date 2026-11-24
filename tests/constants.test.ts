import { describe, it, expect } from 'vitest'
import { isNoindexPath } from '../constants'

describe('isNoindexPath', () => {
  it('noindex対象のページはtrueを返す', () => {
    expect(isNoindexPath('/career')).toBe(true)
    expect(isNoindexPath('/career/')).toBe(true)
  })

  it('それ以外のページはfalseを返す', () => {
    expect(isNoindexPath('/')).toBe(false)
    expect(isNoindexPath('/articles/')).toBe(false)
    expect(isNoindexPath('/careers/')).toBe(false)
  })
})
