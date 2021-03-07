import { shallowMount, mount } from '@vue/test-utils'
import { spy } from 'sinon'
import HelloModal from '~/components/Modal/HelloModal.vue'
import FButton from '~/components/FButton.vue'
import { FModalInterface } from '~/types/modalInterface'

describe('components/Modal/HelloModal.vue', () => {
  test('Renders ', () => {
    const msg = 'Hey there, welcome to Yummyplan / Hallo, willkommen beim Yummyplan\n' +
      '   \n' +
      '    English\n' +
      '   \n' +
      '    Yummyplan is an app that helps you plan your meals\n' +
      '    for an entire week! Add new meals and ingredients, tag them, plan them, download your week plan and generate a\n' +
      '    grocery list, all in one!\n' +
      '   \n' +
      '    But before you can get started, you need some default data and we need a bit of consent from your side.\n' +
      '   \n' +
      '    In order to save all your meals, ingredients, tags, settings and meal plans, we need to store them in your browser. No additional\n' +
      '    data is saved, no analytics takes place, we don\'t track you whatsoever. By selecting a language for your\n' +
      '    default data, you agree that this is OK for you. To not show you this thing in the future, we will set a small cookie.\n' +
      '   \n' +
      '    Deutsch\n' +
      '   \n' +
      '    Yummyplan ist eine App, die dir dabei hilft deine\n' +
      '    Mahlzeiten für eine ganze Woche zu planen! Füge neue Menüs und Zutaten hinzu, verpasse ihnen Tags, plane sie,\n' +
      '    lade deinen Wochenplan als PDF herunter und generiere eine EInkaufsliste, alles in einem!\n' +
      '   \n' +
      '    Aber bevor du anfangen kannst, brauchst du ein paar Grunddaten und wir deine Zustimmung.\n' +
      '   \n' +
      '    Um alle deine Menüs, Zutaten, Tags, Einstellungen und Wochenpläne zu sichern, speichern wir sie in deinem Browser.\n' +
      '    Wir speichern keine weiteren Daten ab, machen keine Nutzeranalyse und tracken doch nicht. Wenn du eine Sprache\n' +
      '    für deine Standard-Daten auswählst, bist du damit einverstanden. Um dir dieses Fenster nicht jedes mal zeigen\n' +
      '    zu müssen, speichern wir ein kleines Cookie.\n' +
      '   \n' +
      '      Agree and add english meals, tags and ingredients\n' +
      '       \n' +
      '      Zustimmen und deutschsprachige Menüs, Tags und Zutaten hinzufügen.\n' +
      '       \n' +
      '      Decline / ablehnen'
    const wrapper = shallowMount(HelloModal)

    expect(wrapper.text().replace(/\s+/g, ' ')).toMatch(msg.replace(/\s+/g, ' '))
  })

  test('Emits accept cookie event for EN', () => {
    const wrapper = shallowMount(HelloModal)

    wrapper.findAllComponents(FButton).at(0).vm.$emit('click')

    const emittedEvent = wrapper.emitted('acceptCookies')
    expect(emittedEvent).toBeTruthy()

    if (emittedEvent) {
      expect(emittedEvent[0][0]).toEqual('en')
    }
  })

  test('Emits accept cookie event for DE', () => {
    const wrapper = shallowMount(HelloModal)

    wrapper.findAllComponents(FButton).at(1).vm.$emit('click')

    const emittedEvent = wrapper.emitted('acceptCookies')
    expect(emittedEvent).toBeTruthy()

    if (emittedEvent) {
      expect(emittedEvent[0][0]).toEqual('de')
    }
  })

  test('Emits decline cookie event', () => {
    const wrapper = shallowMount(HelloModal)

    wrapper.findAllComponents(FButton).at(2).vm.$emit('click')

    const emittedEvent = wrapper.emitted('declineCookies')
    expect(emittedEvent).toBeTruthy()
  })

  test('Propagates show and hide events to the underlying modal', () => {
    const showFn = spy()
    const hideFn = spy()

    const wrapper = mount(HelloModal, {
      stubs: {
        FModal: {
          template: '<div />',
          methods: {
            show: showFn,
            hide: hideFn
          }
        }
      }
    })

    const instance = wrapper.vm as FModalInterface

    instance.show()

    expect(showFn).toHaveBeenCalled()

    instance.hide()

    expect(hideFn).toHaveBeenCalled()
  })
})
