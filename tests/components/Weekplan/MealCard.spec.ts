import { shallowMount } from '@vue/test-utils'
import { spy, SinonSpy } from 'sinon'
import { hyphenate as hyphenateDe } from 'hyphen/de'
import { hyphenate as hyphenateEn } from 'hyphen/en'
import MealCard from '~/components/Weekplan/MealCard.vue'
import { Tag } from '~/model/tag/Tag'
import { Color } from '~/model/tag/Color'
import { Meal } from '~/model/meal/Meal'

jest.mock('hyphen/de', () => ({
  hyphenate: spy()
}))
jest.mock('hyphen/en', () => ({
  hyphenate: spy()
}))

afterEach(() => {
  (hyphenateDe as SinonSpy).resetHistory();
  (hyphenateEn as SinonSpy).resetHistory()
})

describe('components/Weekplan/MealCard.vue', () => {
  test('Renders with hyphenated (EN) title and two tags', () => {
    const tag1 = new Tag('Some tag', new Color(0, 0, 0), '🚀')
    const tag2 = new Tag('Some other tag', new Color(255, 255, 255), '😊')

    const meal = new Meal('Some titel that can be hyphenated', '', [tag1, tag2], [], '')

    shallowMount(MealCard, {
      propsData: {
        meal
      },
      mocks: {
        $i18n: {
          locale: 'en'
        }
      }
    })

    expect(hyphenateEn).toBeCalled()
    expect(hyphenateDe).not.toBeCalled()
  })

  test('Renders with hyphenated (DE) title and two tags', () => {
    const tag1 = new Tag('Some tag', new Color(0, 0, 0), '🚀')
    const tag2 = new Tag('Some other tag', new Color(255, 255, 255), '😊')

    const meal = new Meal('Some titel that can be hyphenated', '', [tag1, tag2], [], '')

    shallowMount(MealCard, {
      propsData: {
        meal
      },
      mocks: {
        $i18n: {
          locale: 'de'
        }
      }
    })

    expect(hyphenateDe).toBeCalled()
    expect(hyphenateEn).not.toBeCalled()
  })
})
