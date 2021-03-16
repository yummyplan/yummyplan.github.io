import { shallowMount } from '@vue/test-utils'
import { spy } from 'sinon'
import Vuex, { Store } from 'vuex'
import DefaultLayout from '~/layouts/default.vue'
import { createLocalVue, Wrapper } from '~/node_modules/@vue/test-utils'
import HelloModal from '~/components/Modal/HelloModal.vue'
import { SerializableMealplanSettings } from '~/model/store/SerializableMealplanSettings'
import { Mealplan } from '~/model/store/Mealplan'
import { Dayplan } from '~/model/store/Dayplan'
import { AllowedTags } from '~/model/store/AllowedTags'
import { Tag } from '~/model/tag/Tag'
import { Meal } from '~/model/meal/Meal'

const localVue = createLocalVue()
localVue.use(Vuex)

jest.mock('~/init/baseDataEn', () => 'data-en')
jest.mock('~/init/baseDataDe', () => 'data-de')

describe('layout/default.vue', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let store: Store<any>
  let returnData: string | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mutationSpy: any
  const showFn = spy()
  const hideFn = spy()

  beforeEach(() => {
    showFn.resetHistory()
    hideFn.resetHistory()
    mutationSpy = jest.fn()

    store = new Vuex.Store({
      mutations: {
        SET_MEALPLANSETTINGS: mutationSpy
      }
    })

    if (returnData) {
      localStorage.setItem('state', returnData)
    }
  })

  test('Renders with modal initally shown', () => {
    returnData = null

    shallowMount(DefaultLayout, {
      store,
      localVue,
      mocks: {
        $nuxt: {
          $on: spy()
        }
      },
      stubs: {
        nuxt: {
          template: '<div />'
        },
        HelloModal: {
          template: '<div></div>',
          methods: {
            show: showFn,
            hide: hideFn
          }
        }
      }
    })

    expect(showFn).toBeCalled()
  })

  test('Accepts cookies and data for EN and writes data to local storage', () => {
    returnData = null

    const wrapper = shallowMount(DefaultLayout, {
      store,
      localVue,
      mocks: {
        $nuxt: {
          $on: spy()
        }
      },
      stubs: {
        nuxt: {
          template: '<div />'
        },
        HelloModal: {
          template: '<div></div>',
          methods: {
            show: showFn,
            hide: hideFn
          }
        }
      }
    })

    expect(showFn).toBeCalled()

    wrapper.findComponent(HelloModal).vm.$emit('acceptCookies', 'en')

    expect(localStorage.setItem).toHaveBeenLastCalledWith('cookiesAccepted', 'yes')
    expect(mutationSpy).toHaveBeenLastCalledWith({}, 'data-en')
  })

  test('Accepts cookies and data for DE and writes data to local storage', () => {
    returnData = null

    const routerData: string[] = []

    const wrapper = shallowMount(DefaultLayout, {
      store,
      localVue,
      mocks: {
        $nuxt: {
          $on: spy()
        },
        $router: routerData
      },
      stubs: {
        nuxt: {
          template: '<div />'
        },
        HelloModal: {
          template: '<div></div>',
          methods: {
            show: showFn,
            hide: hideFn
          }
        }
      }
    })

    expect(showFn).toBeCalled()

    wrapper.findComponent(HelloModal).vm.$emit('acceptCookies', 'de')

    expect(localStorage.setItem).toHaveBeenLastCalledWith('cookiesAccepted', 'yes')
    expect(mutationSpy).toHaveBeenLastCalledWith({}, 'data-de')
    expect(routerData.length).toEqual(1)
    expect(routerData).toContain('/de')
  })

  test('Declines cookies writes data to local storage', () => {
    returnData = null

    const wrapper = shallowMount(DefaultLayout, {
      store,
      localVue,
      mocks: {
        $nuxt: {
          $on: spy()
        }
      },
      stubs: {
        nuxt: {
          template: '<div />'
        },
        HelloModal: {
          template: '<div></div>',
          methods: {
            show: showFn,
            hide: hideFn
          }
        }
      }
    })

    expect(showFn).toBeCalled()

    wrapper.findComponent(HelloModal).vm.$emit('declineCookies', 'en')

    expect(localStorage.setItem).toHaveBeenLastCalledWith('cookiesAccepted', 'no')
  })

  test('Renders without modal being shown', () => {
    returnData = JSON.stringify({
      meals: [],
      ingredients: [],
      tags: [],
      allowedTagsInRandom: {
        mon: { breakfast: [], lunch: [], dinner: [] },
        tue: { breakfast: [], lunch: [], dinner: [] },
        wed: { breakfast: [], lunch: [], dinner: [] },
        thu: { breakfast: [], lunch: [], dinner: [] },
        fri: { breakfast: [], lunch: [], dinner: [] },
        sat: { breakfast: [], lunch: [], dinner: [] },
        sun: { breakfast: [], lunch: [], dinner: [] }
      },
      mealPlan: {
        mon: { breakfast: null, lunch: null, dinner: null },
        tue: { breakfast: null, lunch: null, dinner: null },
        wed: { breakfast: null, lunch: null, dinner: null },
        thu: { breakfast: null, lunch: null, dinner: null },
        fri: { breakfast: null, lunch: null, dinner: null },
        sat: { breakfast: null, lunch: null, dinner: null },
        sun: { breakfast: null, lunch: null, dinner: null }
      }
    })

    localStorage.setItem('state', returnData)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    localStorage.setItem.mockClear()

    shallowMount(DefaultLayout, {
      store,
      localVue,
      mocks: {
        $nuxt: {
          $on: spy()
        }
      },
      stubs: {
        nuxt: {
          template: '<div />'
        },
        HelloModal: {
          template: '<div></div>',
          methods: {
            show: showFn,
            hide: hideFn
          }
        }
      }
    })

    const expectedMealPlan = new SerializableMealplanSettings(
      new Mealplan(
        new Dayplan<Meal | null>(null, null, null),
        new Dayplan<Meal | null>(null, null, null),
        new Dayplan<Meal | null>(null, null, null),
        new Dayplan<Meal | null>(null, null, null),
        new Dayplan<Meal | null>(null, null, null),
        new Dayplan<Meal | null>(null, null, null),
        new Dayplan<Meal | null>(null, null, null)
      ),
      new AllowedTags(
        new Dayplan<Tag[]>([], [], []),
        new Dayplan<Tag[]>([], [], []),
        new Dayplan<Tag[]>([], [], []),
        new Dayplan<Tag[]>([], [], []),
        new Dayplan<Tag[]>([], [], []),
        new Dayplan<Tag[]>([], [], []),
        new Dayplan<Tag[]>([], [], [])
      ),
      [],
      [],
      []
    )

    expect(showFn).not.toBeCalled()
    expect(mutationSpy).toHaveBeenLastCalledWith({}, expectedMealPlan)
  })

  test('Sets font correctly to nanum as default', () => {
    const onSpy = spy()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapper: Wrapper<DefaultLayout & { [key: string]: any }> = shallowMount(DefaultLayout, {
      store,
      localVue,
      mocks: {
        $nuxt: {
          $on: onSpy
        }
      },
      stubs: {
        nuxt: {
          template: '<div />'
        },
        HelloModal: {
          template: '<div></div>',
          methods: {
            show: showFn,
            hide: hideFn
          }
        }
      }
    })

    expect(localStorage.getItem).toHaveBeenCalledWith('font')
    expect(wrapper.vm.chosenFont).toEqual('nanum')
    expect(onSpy).toHaveBeenCalled()
  })

  test('Reads nanum from set font in localStorage', () => {
    const onSpy = spy()

    localStorage.setItem('font', 'nanum')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    localStorage.setItem.mockClear()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapper: Wrapper<DefaultLayout & { [key: string]: any }> = shallowMount(DefaultLayout, {
      store,
      localVue,
      mocks: {
        $nuxt: {
          $on: onSpy
        }
      },
      stubs: {
        nuxt: {
          template: '<div />'
        },
        HelloModal: {
          template: '<div></div>',
          methods: {
            show: showFn,
            hide: hideFn
          }
        }
      }
    })

    expect(localStorage.getItem).toHaveBeenCalledWith('font')
    expect(wrapper.vm.chosenFont).toEqual('nanum')
    expect(onSpy).toHaveBeenCalled()
  })

  test('Reads opendyslexic from set font in localStorage', () => {
    const onSpy = spy()

    localStorage.setItem('font', 'opendyslexic')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    localStorage.setItem.mockClear()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapper: Wrapper<DefaultLayout & { [key: string]: any }> = shallowMount(DefaultLayout, {
      store,
      localVue,
      mocks: {
        $nuxt: {
          $on: onSpy
        }
      },
      stubs: {
        nuxt: {
          template: '<div />'
        },
        HelloModal: {
          template: '<div></div>',
          methods: {
            show: showFn,
            hide: hideFn
          }
        }
      }
    })

    expect(localStorage.getItem).toHaveBeenCalledWith('font')
    expect(wrapper.vm.chosenFont).toEqual('opendyslexic')
    expect(onSpy).toHaveBeenCalled()
  })

  test('Sets font from event', () => {
    const onSpy = spy()

    localStorage.setItem('font', 'opendyslexic')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    localStorage.setItem.mockClear()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    let onCallback: ((font: string) => void) | null = null

    const wrapper: Wrapper<DefaultLayout & { [key: string]: any }> = shallowMount(DefaultLayout, {
      store,
      localVue,
      mocks: {
        $nuxt: {
          $on: (event: string, callback: (font: string) => void): void => {
            expect(event).toEqual('setFont')
            onCallback = callback
          }
        }
      },
      stubs: {
        nuxt: {
          template: '<div />'
        },
        HelloModal: {
          template: '<div></div>',
          methods: {
            show: showFn,
            hide: hideFn
          }
        }
      }
    })

    expect(localStorage.getItem).toHaveBeenCalledWith('font')
    expect(wrapper.vm.chosenFont).toEqual('opendyslexic')
    expect(onCallback).not.toBeNull()

    if (onCallback !== null) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      onCallback('nanum')
    }

    expect(wrapper.vm.chosenFont).toEqual('nanum')

    if (onCallback !== null) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      onCallback('opendyslexic')
    }

    expect(wrapper.vm.chosenFont).toEqual('opendyslexic')
  })
})
