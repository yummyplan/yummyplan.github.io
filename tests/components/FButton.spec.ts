import { shallowMount } from '@vue/test-utils'
import FButton from '~/components/FButton.vue'

describe('components/FButton.vue', () => {
  test('Renders', () => {
    const msg = 'Hello, World'
    const wrapper = shallowMount(FButton, {
      slots: {
        default: msg
      }
    })

    expect(wrapper.text()).toMatch(msg)
  })

  test('Emits a click event', () => {
    const msg = 'Hello, World'
    const wrapper = shallowMount(FButton, {
      slots: {
        default: msg
      }
    })

    // Trigger click on button to see if the entire component is also emitting it.
    wrapper.element.dispatchEvent(new MouseEvent('click'))

    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
