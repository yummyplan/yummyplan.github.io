import { createLocalVue, shallowMount, Wrapper } from '@vue/test-utils'
import { spy } from 'sinon'
import Vuex from 'vuex'
import Settings from '~/pages/settings.vue'
import I18nCollector from '~/tests/testUtils/I18nCollector'
import { Store } from '~/node_modules/vuex'
import { Tag } from '~/model/tag/Tag'
import { Dayplan } from '~/model/store/Dayplan'
import { Color } from '~/model/tag/Color'
import { FileReaderMock } from '~/tests/testUtils/FileReaderMock'
import { AllowedTags } from '~/model/store/AllowedTags'
import { SerializableMealplanSettings } from '~/model/store/SerializableMealplanSettings'

const localVue = createLocalVue()
localVue.use(Vuex)

const deserializeSpy = spy()
jest.mock('typescript-json-serializer', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deserialize<T> (value: any, typeArg: T): any {
    deserializeSpy(value, typeArg)

    return value
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/ban-types
  Serializable: (): Function => (): void => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/ban-types
  JsonProperty: (): Function => (): void => {}
}))

const allowedTagsInRandom = new AllowedTags(
  new Dayplan<Tag[]>([], [], []),
  new Dayplan<Tag[]>([], [], []),
  new Dayplan<Tag[]>([], [], []),
  new Dayplan<Tag[]>([], [], []),
  new Dayplan<Tag[]>([], [], []),
  new Dayplan<Tag[]>([], [], []),
  new Dayplan<Tag[]>([], [], [])
)

describe('pages/settings.vue', () => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  let state: { allowedTagsInRandom: AllowedTags } = { allowedTagsInRandom }

  let store: Store<typeof state>
  const serializableGetterData = { someKey: 'Some value' }
  const fileReader = new FileReaderMock()
  jest.spyOn(window, 'FileReader').mockImplementation(() => fileReader)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let setSettingsMutation: any

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let setTagsMutation: any

  beforeEach(() => {
    state = { allowedTagsInRandom }
    setSettingsMutation = spy()
    setTagsMutation = spy()
    jest.clearAllMocks()
    deserializeSpy.resetHistory()

    store = new Vuex.Store({
      state,
      getters: {
        serializable: (): typeof serializableGetterData => serializableGetterData
      },
      mutations: {
        SET_MEALPLANSETTINGS: setSettingsMutation,
        SET_TAGS: setTagsMutation
      }
    })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    localStorage.setItem.mockClear()
  })

  test('Renders', () => {
    const i18nCollector = new I18nCollector()

    const wrapper = shallowMount(Settings, {
      store,
      localVue,
      mocks: {
        $t: (key: string): string => i18nCollector.tMock(key)
      }
    })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const head = Settings.options.head.bind(wrapper.vm)

    expect(head()).toEqual({ title: 'settings.title' })

    expect(i18nCollector.translationKeys).toContain('settings.title')
    expect(i18nCollector.translationKeys).toContain('settings.backupAndRestore')
    expect(i18nCollector.translationKeys).toContain('settings.backupAndRestoreText')
    expect(i18nCollector.translationKeys).toContain('settings.downloadData')
    expect(i18nCollector.translationKeys).toContain('settings.restoreData')
    expect(i18nCollector.translationKeys).toContain('settings.randomize')
    expect(i18nCollector.translationKeys).toContain('settings.randomizeText')
    expect(i18nCollector.translationKeys).toContain('settings.randomizeHint')
  })

  test('Downloads data', async () => {
    const i18nCollector = new I18nCollector()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapper: Wrapper<Settings & { [key: string]: any }> = shallowMount(Settings, {
      store,
      localVue,
      mocks: {
        $t: (key: string): string => i18nCollector.tMock(key)
      }
    })

    const expectedHref = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(serializableGetterData))

    wrapper.vm.download()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('#download-link').attributes().href).toEqual(expectedHref)
  })

  test('Does not restore from no file', () => {
    const i18nCollector = new I18nCollector()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapper: Wrapper<Settings & { [key: string]: any }> = shallowMount(Settings, {
      store,
      localVue,
      mocks: {
        $t: (key: string): string => i18nCollector.tMock(key)
      }
    })

    wrapper.vm.restoreFromFile({ target: { files: [] } })

    expect(setSettingsMutation).not.toBeCalled()
  })

  test('Does not restore from empty file', () => {
    const i18nCollector = new I18nCollector()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapper: Wrapper<Settings & { [key: string]: any }> = shallowMount(Settings, {
      store,
      localVue,
      mocks: {
        $t: (key: string): string => i18nCollector.tMock(key)
      }
    })

    const file = new File([new ArrayBuffer(1)], 'file.txt')

    wrapper.vm.restoreFromFile({ target: { files: [file] } })
    fileReader.onload({
      target: {
        result: ''
      }
    })

    expect(deserializeSpy).not.toBeCalled()
    expect(setSettingsMutation).not.toBeCalled()
  })

  test('Does restore from file', () => {
    const i18nCollector = new I18nCollector()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapper: Wrapper<Settings & { [key: string]: any }> = shallowMount(Settings, {
      store,
      localVue,
      mocks: {
        $t: (key: string): string => i18nCollector.tMock(key)
      }
    })

    const file = new File([new ArrayBuffer(1)], 'file.txt')

    wrapper.vm.restoreFromFile({ target: { files: [file] } })
    fileReader.onload({
      target: {
        result: '"some content"'
      }
    })

    expect(deserializeSpy).toBeCalledWith('some content', SerializableMealplanSettings)
    expect(setSettingsMutation).toBeCalledWith(state, 'some content')
  })

  test('Sets tags to right day and time via proxy', () => {
    const i18nCollector = new I18nCollector()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapper: Wrapper<Settings & { [key: string]: any }> = shallowMount(Settings, {
      store,
      localVue,
      mocks: {
        $t: (key: string): string => i18nCollector.tMock(key)
      }
    })

    const tags = [
      new Tag('Tag A', new Color(0, 0, 0), ''),
      new Tag('Tag B', new Color(0, 0, 0), '')
    ]

    expect(wrapper.vm.allowedTagsInRandom.mon).toEqual(state.allowedTagsInRandom.mon)

    wrapper.vm.allowedTagsInRandom.mon.lunch = tags

    expect(setTagsMutation).toBeCalledWith(state, {
      day: 'mon',
      time: 'lunch',
      tags
    })
  })

  test('Revokes consent and wipes data', () => {
    localStorage.setItem('cookiesAccepted', 'yes')
    localStorage.setItem('state', '{}')

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    localStorage.setItem.mockClear()

    const i18nCollector = new I18nCollector()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapper: Wrapper<Settings & { [key: string]: any }> = shallowMount(Settings, {
      store,
      localVue,
      mocks: {
        $t: (key: string): string => i18nCollector.tMock(key)
      }
    })

    expect(wrapper.vm.hasAcceptedCookies).toBeTruthy()

    wrapper.vm.revokeCookies()

    expect(localStorage.setItem).toHaveBeenCalledWith('cookiesAccepted', 'no')
    expect(localStorage.setItem).toHaveBeenCalledWith('state', '')
    expect(wrapper.vm.hasAcceptedCookies).toBeFalsy()
  })

  test('Deletes all data', () => {
    localStorage.setItem('cookiesAccepted', 'yes')
    localStorage.setItem('state', '{}')

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    localStorage.setItem.mockClear()

    const i18nCollector = new I18nCollector()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapper: Wrapper<Settings & { [key: string]: any }> = shallowMount(Settings, {
      store,
      localVue,
      mocks: {
        $t: (key: string): string => i18nCollector.tMock(key)
      }
    })

    expect(wrapper.vm.hasAcceptedCookies).toBeTruthy()

    wrapper.vm.deleteAllData()

    expect(localStorage.setItem).not.toHaveBeenCalledWith('cookiesAccepted', 'no')
    expect(localStorage.setItem).toHaveBeenCalledWith('state', '')
    expect(wrapper.vm.hasAcceptedCookies).toBeTruthy()
  })

  test('Deletes no data if no data is present', () => {
    localStorage.setItem('cookiesAccepted', 'yes')

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    localStorage.setItem.mockClear()

    const i18nCollector = new I18nCollector()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapper: Wrapper<Settings & { [key: string]: any }> = shallowMount(Settings, {
      store,
      localVue,
      mocks: {
        $t: (key: string): string => i18nCollector.tMock(key)
      }
    })

    expect(wrapper.vm.hasAcceptedCookies).toBeTruthy()

    wrapper.vm.deleteAllData()

    expect(localStorage.setItem).not.toHaveBeenCalledWith('cookiesAccepted', 'no')
    expect(localStorage.setItem).not.toHaveBeenCalledWith('state', '')
    expect(wrapper.vm.hasAcceptedCookies).toBeTruthy()
  })

  test('Grants consent', () => {
    localStorage.setItem('cookiesAccepted', 'no')

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    localStorage.setItem.mockClear()

    const i18nCollector = new I18nCollector()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapper: Wrapper<Settings & { [key: string]: any }> = shallowMount(Settings, {
      store,
      localVue,
      mocks: {
        $t: (key: string): string => i18nCollector.tMock(key)
      }
    })

    expect(wrapper.vm.hasAcceptedCookies).toBeFalsy()

    wrapper.vm.acceptCookies()

    expect(localStorage.setItem).toHaveBeenCalledWith('cookiesAccepted', 'yes')
    expect(wrapper.vm.hasAcceptedCookies).toBeTruthy()
  })
})
