import { shallowMount } from '@vue/test-utils'
import I18nCollector from '~/tests/testUtils/I18nCollector'
import SearchableIngredientList from '~/components/SearchableList/SearchableIngredientList.ts'
import { Ingredient } from '~/model/meal/Ingredient'
import { IngredientCategory } from '~/model/meal/IngredientCategory'

describe('components/SearchableList/SearchableIngredientList.ts', () => {
  const ingredients = [
    new Ingredient('Foo', '', IngredientCategory.deli),
    new Ingredient('Bar', '', IngredientCategory.deli),
    new Ingredient('Baz', '', IngredientCategory.deli)
  ]

  test('Should render with tags', () => {
    const i18nCollector = new I18nCollector()

    // Generic components don't work for some reason, Typescript doesn't seem to like them.
    // Hence we ignore that the signature doesn't match, because essentially, it does.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    shallowMount(SearchableIngredientList, {
      propsData: {
        items: ingredients
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
    const wrapper = shallowMount(SearchableIngredientList, {
      propsData: {
        items: ingredients
      },
      mocks: {
        $t: (key: string): string => i18nCollector.tMock(key)
      }
    })

    let predicate = wrapper.vm.getFilterPredicate('Foo')
    expect(ingredients.filter(predicate)).toEqual([ingredients[0]])

    predicate = wrapper.vm.getFilterPredicate('ba')
    expect(ingredients.filter(predicate)).toEqual([ingredients[1], ingredients[2]])

    predicate = wrapper.vm.getFilterPredicate('BAZ')
    expect(ingredients.filter(predicate)).toEqual([ingredients[2]])
  })
})
