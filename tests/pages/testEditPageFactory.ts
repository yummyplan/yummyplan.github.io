import Vuex, { Store } from '~/node_modules/vuex'
import I18nCollector from '~/tests/testUtils/I18nCollector'
import { createLocalVue, shallowMount, Wrapper } from '~/node_modules/@vue/test-utils'

export default <T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  component: any,
  items: T[],
  emptyItem: T,
  translationKey: string,
  storeKey: string,
  createMutationName: string,
  updateMutationName: string,
  deleteMutationName: string,
  mutationKeySingular: string,
  mutationKeyPlural: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): { beforeEach: () => void, testRenders: () => void, testDelete: () => void, testCreate: () => void, testUpdates: (key: keyof T, value: any) => void } => {
  let state
  let store: Store<{ [key: string]: T[] }>

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let setMutationSpy: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let updateMutationSpy: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let deleteMutationSpy: any

  const localVue = createLocalVue()
  localVue.use(Vuex)

  return {
    /**
     * Called in beaforeEach
     */
    beforeEach: (): void => {
      state = {
        [storeKey]: items
      }

      setMutationSpy = jest.fn()
      updateMutationSpy = jest.fn()
      deleteMutationSpy = jest.fn()

      store = new Vuex.Store({
        state,
        mutations: {
          [createMutationName]: setMutationSpy,
          [updateMutationName]: updateMutationSpy,
          [deleteMutationName]: deleteMutationSpy
        }
      })
    },

    /**
     * Tests of the given component renders
     */
    testRenders: (): void => {
      const i18nCollector = new I18nCollector()

      const wrapper = shallowMount(component, {
        store,
        localVue,
        mocks: {
          $t: (key: string): string => i18nCollector.tMock(key)
        },
        stubs: {
          EditPage: {
            template: '<div />'
          },
          SearchableTagList: {
            template: '<div />'
          }
        }
      })

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const head = component.options.head.bind(wrapper.vm)

      expect(head()).toEqual({ title: `${translationKey}.title` })
      expect(i18nCollector.translationKeys).toContain(`${translationKey}.title`)
    },

    /**
     * Tests deletion
     */
    testDelete: (): void => {
      const i18nCollector = new I18nCollector()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const wrapper: Wrapper<typeof component & { [key: string]: any }> = shallowMount(component, {
        store,
        localVue,
        mocks: {
          $t: (key: string): string => i18nCollector.tMock(key)
        },
        stubs: {
          EditPage: {
            template: '<div />'
          },
          SearchableTagList: {
            template: '<div />'
          }
        }
      })

      wrapper.vm.deleteItem(items[1])

      expect(deleteMutationSpy).toHaveBeenLastCalledWith({ [mutationKeyPlural]: items }, { [mutationKeySingular]: items[1] })
    },

    /**
     * Tests creating
     */
    testCreate: (): void => {
      const i18nCollector = new I18nCollector()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const wrapper: Wrapper<typeof component & { [key: string]: any }> = shallowMount(component, {
        store,
        localVue,
        mocks: {
          $t: (key: string): string => i18nCollector.tMock(key)
        },
        stubs: {
          EditPage: {
            template: '<div />'
          },
          SearchableTagList: {
            template: '<div />'
          }
        }
      })

      wrapper.vm.createNew()

      expect(setMutationSpy).toHaveBeenLastCalledWith({ [mutationKeyPlural]: items }, {
        index: 3,
        [mutationKeySingular]: emptyItem
      })
    },

    /**
     * Tests updating
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    testUpdates: (key: keyof T, value: any): void => {
      const i18nCollector = new I18nCollector()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const wrapper: Wrapper<typeof component & { [key: string]: any }> = shallowMount(component, {
        store,
        localVue,
        mocks: {
          $t: (key: string): string => i18nCollector.tMock(key)
        },
        stubs: {
          EditPage: {
            template: '<div />'
          },
          SearchableTagList: {
            template: '<div />'
          }
        }
      })

      wrapper.vm.items[2][key] = value

      expect(updateMutationSpy).toHaveBeenLastCalledWith({ [mutationKeyPlural]: items }, {
        index: '2',
        key,
        value,
        [mutationKeySingular]: items[2]
      })
    }
  }
}
