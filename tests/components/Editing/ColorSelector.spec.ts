import { shallowMount } from '@vue/test-utils'
import ColorSelector from '~/components/Editing/ColorSelector.vue'
import { Color } from '~/model/tag/Color'

describe('components/Editing/ColorSelector.vue', () => {
  test('Renders with default value', () => {
    const color = new Color(255, 125, 100)
    const wrapper = shallowMount(ColorSelector, {
      propsData: {
        value: color
      }
    })

    expect((wrapper.find('input').element as HTMLInputElement).value).toEqual('#ff7d64')
  })

  test('Emits a Color instance', () => {
    const color = new Color(255, 125, 100)
    const wrapper = shallowMount(ColorSelector, {
      propsData: {
        value: color
      }
    })

    const inputElement = wrapper.find('input').element as HTMLInputElement

    expect(inputElement.value).toEqual('#ff7d64')

    const expectedNewColor = new Color(255, 102, 0)

    inputElement.value = '#ff6600'
    inputElement.dispatchEvent(new Event('input'))

    const emittedEvent = wrapper.emitted('input')
    expect(emittedEvent).toBeTruthy()
    if (emittedEvent) {
      expect(emittedEvent[0][0].constructor.name).toEqual(Color.name)
      expect(JSON.stringify(emittedEvent[0][0]) === JSON.stringify(expectedNewColor))
    }
  })
})
