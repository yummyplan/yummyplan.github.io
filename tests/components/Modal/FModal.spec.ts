import { shallowMount } from '@vue/test-utils'
import FModal from '~/components/Modal/FModal.vue'
import { FModalInterface } from '~/types/modalInterface'
import I18nCollector from '~/tests/testUtils/I18nCollector'

describe('components/Modal/FModal.vue', () => {
  test('Does not render initially, unless shown, does not show anything again when hidden', async () => {
    const i18nCollector = new I18nCollector()

    const msg = 'Hello, World'
    const wrapper = shallowMount(FModal, {
      slots: {
        default: msg
      },
      mocks: {
        $t: (key: string): string => i18nCollector.tMock(key)
      }
    })

    const instance = wrapper.vm as FModalInterface

    expect(wrapper.text()).toMatch('')

    instance.show()
    await instance.$nextTick()

    expect(wrapper.text()).toMatch(msg)

    instance.hide()
    await instance.$nextTick()

    expect(wrapper.text()).toMatch('')
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
