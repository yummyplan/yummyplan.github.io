import { shallowMount } from '@vue/test-utils'
import AboutAndDonate from '~/pages/about.vue'
import I18nCollector from '~/tests/testUtils/I18nCollector'

describe('pages/about.vue', () => {
  test('Renders', () => {
    const i18nCollector = new I18nCollector()

    const wrapper = shallowMount(AboutAndDonate, {
      mocks: {
        $t: (key: string): string => i18nCollector.tMock(key)
      }
    })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const head = AboutAndDonate.options.head.bind(wrapper.vm)

    expect(head()).toEqual({ title: 'about.title' })

    expect(i18nCollector.translationKeys).toContain('about.title')
    expect(i18nCollector.translationKeys).toContain('about.text')
    expect(i18nCollector.translationKeys).toContain('about.donate.title')
    expect(i18nCollector.translationKeys).toContain('about.donate.text')
    expect(i18nCollector.translationKeys).toContain('about.donate.paypaltext')
  })
})
