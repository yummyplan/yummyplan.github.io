import { shallowMount } from '@vue/test-utils'
import EmojiPickerComponent from 'vue-emoji-picker'
import EmojiSelector from '~/components/Editing/EmojiSelector.vue'
import { Color } from '~/model/tag/Color'
import I18nCollector from '~/tests/testUtils/I18nCollector'

describe('components/Editing/EmojiSelector.vue', () => {
  test('Renders with default value', () => {
    const i18nCollector = new I18nCollector()
    const emoji = '🥫'
    const color = new Color(255, 255, 255)

    const wrapper = shallowMount(EmojiSelector, {
      propsData: {
        color,
        value: emoji
      },
      mocks: {
        $t: (key: string): string => i18nCollector.tMock(key)
      }
    })

    const emojiSelectorValue = wrapper.find('.emoji-selector-value')
    expect(emojiSelectorValue.text()).toEqual(emoji)
    expect(emojiSelectorValue.element.style.backgroundColor).toEqual('rgb(255, 255, 255)')
    expect(i18nCollector.translationKeys).toContain('emoji.open')
  })

  test('Emits a newly selected emoji', () => {
    const i18nCollector = new I18nCollector()
    const emoji = '🥫'
    const newEmoji = '🥡'
    const color = new Color(255, 255, 255)

    const wrapper = shallowMount(EmojiSelector, {
      propsData: {
        color,
        value: emoji
      },
      mocks: {
        $t: (key: string): string => i18nCollector.tMock(key)
      }
    })

    wrapper.findComponent(EmojiPickerComponent).vm.$emit('emoji', newEmoji)

    const emittedEvent = wrapper.emitted('input')
    expect(emittedEvent).toBeTruthy()
    if (emittedEvent) {
      expect(emittedEvent[0][0]).toEqual(newEmoji)
    }
  })
})
