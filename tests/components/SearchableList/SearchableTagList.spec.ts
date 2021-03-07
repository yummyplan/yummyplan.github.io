import { shallowMount } from '@vue/test-utils'
import SearchableTagList from '~/components/SearchableList/SearchableTagList.ts'
import I18nCollector from '~/tests/testUtils/I18nCollector'
import { Tag } from '~/model/tag/Tag'
import { Color } from '~/model/tag/Color'

describe('components/SearchableList/SearchableTagList.ts', () => {
  const tags = [
    new Tag('TagA', new Color(0, 0, 0), ''),
    new Tag('TagB', new Color(0, 0, 0), ''),
    new Tag('TagC', new Color(0, 0, 0), '')
  ]

  test('Should render with tags', () => {
    const i18nCollector = new I18nCollector()

    // Generic components don't work for some reason, Typescript doesn't seem to like them.
    // Hence we ignore that the signature doesn't match, because essentially, it does.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    shallowMount(SearchableTagList, {
      propsData: {
        items: tags
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
    const wrapper = shallowMount(SearchableTagList, {
      propsData: {
        items: tags
      },
      mocks: {
        $t: (key: string): string => i18nCollector.tMock(key)
      }
    })

    let predicate = wrapper.vm.getFilterPredicate('Tag')
    expect(tags.filter(predicate)).toEqual(tags)

    predicate = wrapper.vm.getFilterPredicate('a')
    expect(tags.filter(predicate)).toEqual(tags)

    predicate = wrapper.vm.getFilterPredicate('b')
    expect(tags.filter(predicate)).toEqual([tags[1]])
  })
})
