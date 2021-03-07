import { shallowMount } from '@vue/test-utils'
import I18nCollector from '~/tests/testUtils/I18nCollector'
import { Tag } from '~/model/tag/Tag'
import { Color } from '~/model/tag/Color'
import SearchableMealList from '~/components/SearchableList/SearchableMealList.ts'
import { Meal } from '~/model/meal/Meal'

describe('components/SearchableList/SearchableMealList.ts', () => {
  const tags = [
    new Tag('TagA', new Color(0, 0, 0), ''),
    new Tag('TagB', new Color(0, 0, 0), ''),
    new Tag('TagC', new Color(0, 0, 0), '')
  ]

  const meals = [
    new Meal('Foo', '', [tags[0], tags[1]], [], ''),
    new Meal('Bar', '', [tags[1], tags[2]], [], ''),
    new Meal('Baz', '', [tags[1], tags[2]], [], '')
  ]

  test('Should render with tags', () => {
    const i18nCollector = new I18nCollector()

    // Generic components don't work for some reason, Typescript doesn't seem to like them.
    // Hence we ignore that the signature doesn't match, because essentially, it does.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    shallowMount(SearchableMealList, {
      propsData: {
        items: meals
      },
      mocks: {
        $t: (key: string): string => i18nCollector.tMock(key)
      }
    })

    expect(i18nCollector.translationKeys).toContain('search.hint')
  })

  test('Generates a sensible filter predicate', () => {
    const i18nCollector = new I18nCollector()

    // Generic components don't work for some reason, Typescript doesn't seem to like them.
    // Hence we ignore that the signature doesn't match, because essentially, it does.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const wrapper = shallowMount(SearchableMealList, {
      propsData: {
        items: meals
      },
      mocks: {
        $t: (key: string): string => i18nCollector.tMock(key)
      }
    })

    let predicate = wrapper.vm.getFilterPredicate('Tag')
    expect(meals.filter(predicate)).toEqual(meals)

    predicate = wrapper.vm.getFilterPredicate('a')
    expect(meals.filter(predicate)).toEqual(meals)

    predicate = wrapper.vm.getFilterPredicate('b')
    expect(meals.filter(predicate)).toEqual(meals)

    predicate = wrapper.vm.getFilterPredicate('foo')
    expect(meals.filter(predicate)).toEqual([meals[0]])

    predicate = wrapper.vm.getFilterPredicate('BAR')
    expect(meals.filter(predicate)).toEqual([meals[1]])
  })
})
