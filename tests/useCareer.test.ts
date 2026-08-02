import { describe, it, expect } from 'vitest'
import { useCareer } from '../composables/useCareer'

describe('useCareer', () => {
  it('careers配列を返す', () => {
    const { careers } = useCareer()

    expect(Array.isArray(careers)).toBe(true)
    expect(careers.length).toBeGreaterThan(0)
  })

  it('各企業がname・period・projectsを持つ', () => {
    const { careers } = useCareer()

    careers.forEach(company => {
      expect(typeof company.name).toBe('string')
      expect(company.name.length).toBeGreaterThan(0)
      expect(typeof company.period).toBe('string')
      expect(Array.isArray(company.projects)).toBe(true)
    })
  })

  it('positionは省略可能なフィールドとして扱われる', () => {
    const { careers } = useCareer()

    const withoutPosition = careers.find(company => company.position === undefined)
    const withPosition = careers.find(company => typeof company.position === 'string')

    expect(withPosition).toBeDefined()
    // 少なくとも1社はpositionが未設定でも構造が壊れないことを確認
    if (withoutPosition) {
      expect(withoutPosition.position).toBeUndefined()
    }
  })

  it('各企業は最低1件のプロジェクトを持つ', () => {
    const { careers } = useCareer()

    careers.forEach(company => {
      expect(company.projects.length).toBeGreaterThan(0)
    })
  })

  it('各プロジェクトがname・description・techs・industryを持つ', () => {
    const { careers } = useCareer()

    careers.forEach(company => {
      company.projects.forEach(project => {
        expect(typeof project.name).toBe('string')
        expect(project.name.length).toBeGreaterThan(0)
        expect(typeof project.description).toBe('string')
        expect(Array.isArray(project.techs)).toBe(true)
        expect(project.techs.length).toBeGreaterThan(0)
        expect(typeof project.industry).toBe('string')
        expect(project.industry.length).toBeGreaterThan(0)
      })
    })
  })

  it('techsは全て空文字でない文字列である', () => {
    const { careers } = useCareer()

    careers.forEach(company => {
      company.projects.forEach(project => {
        project.techs.forEach(tech => {
          expect(typeof tech).toBe('string')
          expect(tech.length).toBeGreaterThan(0)
        })
      })
    })
  })

  it('呼び出すたびに新しい配列インスタンスを返す', () => {
    const first = useCareer()
    const second = useCareer()

    expect(first.careers).not.toBe(second.careers)
    expect(first.careers).toEqual(second.careers)
  })

  it('会社名に重複がない', () => {
    const { careers } = useCareer()

    const names = careers.map(c => c.name)
    const uniqueNames = new Set(names)

    expect(uniqueNames.size).toBe(names.length)
  })
})
