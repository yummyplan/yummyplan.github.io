import { createLocalVue, shallowMount, Wrapper } from '@vue/test-utils'
import { spy } from 'sinon'
import Vuex from 'vuex'
import Index from '~/pages/index.vue'
import I18nCollector from '~/tests/testUtils/I18nCollector'
import { Store } from '~/node_modules/vuex'
import { Meal } from '~/model/meal/Meal'
import { Mealplan } from '~/model/store/Mealplan'
import { Tag } from '~/model/tag/Tag'
import { Dayplan } from '~/model/store/Dayplan'
import { Ingredient } from '~/model/meal/Ingredient'
import { IngredientCategory } from '~/model/meal/IngredientCategory'
import { Color } from '~/model/tag/Color'
import { MealIngredient } from '~/model/meal/MealIngredient'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('pages/index.vue', () => {
  let state: { meals: Meal[], tags: Tag[], mealPlan: Mealplan }
  let store: Store<typeof state>

  const setMutationSpy = jest.fn()
  const randomizeActionSpy = jest.fn()

  const createPngSpy = spy()
  const downloadAsPdfSpy = spy()

  let groceryList: { name: string, meals: string[], amount: string, category: IngredientCategory }[] = []

  const mealPlan = new Mealplan(
    new Dayplan<Meal | null>(null, null, null),
    new Dayplan<Meal | null>(null, null, null),
    new Dayplan<Meal | null>(null, null, null),
    new Dayplan<Meal | null>(null, null, null),
    new Dayplan<Meal | null>(null, null, null),
    new Dayplan<Meal | null>(null, null, null),
    new Dayplan<Meal | null>(null, null, null)
  )

  const ingredients = [
    new Ingredient('Ingredient A', '', IngredientCategory.deli),
    new Ingredient('Ingredient B', '', IngredientCategory.snacks),
    new Ingredient('Ingredient C', '', IngredientCategory.beverages)
  ]

  const tags = [
    new Tag('Tag A', new Color(0, 0, 0), ''),
    new Tag('Tag B', new Color(0, 0, 0), ''),
    new Tag('Tag C', new Color(0, 0, 0), '')
  ]

  const meals = [
    new Meal('Meal A', '', [tags[0], tags[1]], [new MealIngredient(ingredients[0], 10), new MealIngredient(ingredients[1], 5)], ''),
    new Meal('Meal B', '', [tags[1], tags[2]], [new MealIngredient(ingredients[1], 11), new MealIngredient(ingredients[2], 6)], ''),
    new Meal('Meal C', '', [tags[2]], [new MealIngredient(ingredients[0], 12), new MealIngredient(ingredients[2], 7)], '')
  ]

  jest.mock('~/mixins/DownloadMixin.ts', () => ({
    createPng: createPngSpy,
    downloadSelectorAsPdf: downloadAsPdfSpy
  }))

  beforeEach(() => {
    state = {
      meals,
      tags,
      mealPlan
    }

    store = new Vuex.Store({
      state,
      getters: {
        groceryList: (): typeof groceryList => groceryList
      },
      mutations: {
        SET_MEAL_AT_DAY_AND_TIME: setMutationSpy
      },
      actions: {
        randomize: randomizeActionSpy
      }
    })
  })

  test('Renders', () => {
    const i18nCollector = new I18nCollector()

    const wrapper = shallowMount(Index, {
      store,
      localVue,
      mocks: {
        $t: (key: string): string => i18nCollector.tMock(key)
      }
    })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const head = Index.options.head.bind(wrapper.vm)

    expect(head()).toEqual({ title: 'index.title' })

    expect(i18nCollector.translationKeys).toContain('plan.groceryList')
    expect(i18nCollector.translationKeys).toContain('index.title')
  })

  test('Updates grocery list', () => {
    const i18nCollector = new I18nCollector()

    groceryList = [
      { name: 'Grocery Item A', meals: ['Meal A'], amount: '100', category: IngredientCategory.deli },
      { name: 'Grocery Item B', meals: ['Meal A', 'Meal B'], amount: '200', category: IngredientCategory.deli },
      { name: 'Grocery Item C', meals: ['Meal C', 'Meal B'], amount: '300', category: IngredientCategory.snacks }
    ]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapper: Wrapper<Index & { [key: string]: any }> = shallowMount(Index, {
      store,
      localVue,
      mocks: {
        $t: (key: string): string => i18nCollector.tMock(key)
      }
    })

    const expectedGroceryList = {
      uncategorized: [],
      fruits: [],
      vegetables: [],
      cannedFood: [],
      frozenGoods: [],
      meat: [],
      fish: [],
      deli:
        [{
          name: 'Grocery Item A',
          meals: ['Meal A'],
          amount: '100',
          category: 'deli'
        },
        {
          name: 'Grocery Item B',
          meals: ['Meal A', 'Meal B'],
          amount: '200',
          category: 'deli'
        }],
      dairyAndEggs: [],
      condimentsAndSpices: [],
      saucesAndOil: [],
      snacks:
        [{
          name: 'Grocery Item C',
          meals: ['Meal C', 'Meal B'],
          amount: '300',
          category: 'snacks'
        }],
      breadAndBakery: [],
      beverages: [],
      pastaAndRice: [],
      cereal: [],
      bakingSupplies: []
    }

    expect(wrapper.vm.categorizedGroceryList).toEqual(expectedGroceryList)
  })

  test('Updates meal plan in store', () => {
    const i18nCollector = new I18nCollector()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapper: Wrapper<Index & { [key: string]: any }> = shallowMount(Index, {
      store,
      localVue,
      mocks: {
        $t: (key: string): string => i18nCollector.tMock(key)
      }
    })

    expect(wrapper.vm.mealPlan.mon).toEqual(new Dayplan<Meal[] | null>([], [], []))

    // Drag&Drop ignores TS as well and simply assigns an array, so we do the same here.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    wrapper.vm.mealPlan.mon.breakfast = [meals[0]]

    expect(setMutationSpy).toHaveBeenLastCalledWith(state, {
      day: 'mon',
      meal: meals[0],
      time: 'breakfast'
    })

    wrapper.vm.mealPlan.mon.breakfast = null

    expect(setMutationSpy).toHaveBeenLastCalledWith(state, {
      day: 'mon',
      meal: undefined,
      time: 'breakfast'
    })
  })

  test('Unassigns an entire day', () => {
    const i18nCollector = new I18nCollector()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapper: Wrapper<Index & { [key: string]: any }> = shallowMount(Index, {
      store,
      localVue,
      mocks: {
        $t: (key: string): string => i18nCollector.tMock(key)
      }
    })

    wrapper.vm.deleteDay('mon');

    ['breakfast', 'lunch', 'dinner'].forEach((time: string) => {
      expect(setMutationSpy).toHaveBeenCalledWith(state, {
        day: 'mon',
        meal: undefined,
        time
      })
    })
  })

  test('Unassigns an entire day time', () => {
    const i18nCollector = new I18nCollector()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapper: Wrapper<Index & { [key: string]: any }> = shallowMount(Index, {
      store,
      localVue,
      mocks: {
        $t: (key: string): string => i18nCollector.tMock(key)
      }
    })

    wrapper.vm.deleteDayTime('lunch');

    ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].forEach((day: string) => {
      expect(setMutationSpy).toHaveBeenCalledWith(state, {
        day,
        meal: undefined,
        time: 'lunch'
      })
    })
  })

  test('Unassigns the entire week', () => {
    const i18nCollector = new I18nCollector()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapper: Wrapper<Index & { [key: string]: any }> = shallowMount(Index, {
      store,
      localVue,
      mocks: {
        $t: (key: string): string => i18nCollector.tMock(key)
      }
    })

    wrapper.vm.deleteWeek();

    ['breakfast', 'lunch', 'dinner'].forEach((time: string) => {
      ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].forEach((day: string) => {
        expect(setMutationSpy).toHaveBeenCalledWith(state, {
          day,
          meal: undefined,
          time
        })
      })
    })
  })

  test('Download weekplan as PDF', () => {
    const i18nCollector = new I18nCollector()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapper: Wrapper<Index & { [key: string]: any }> = shallowMount(Index, {
      store,
      localVue,
      mocks: {
        $t: (key: string): string => i18nCollector.tMock(key)
      }
    })

    wrapper.vm.downloadSelectorAsPdf = spy()

    wrapper.vm.downloadWeekplanAsPdf()

    expect(wrapper.vm.downloadSelectorAsPdf).toHaveBeenCalledWith('#weekplan', 'yummyplan')
  })

  test('Download weekplan as PNG', async () => {
    const i18nCollector = new I18nCollector()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapper: Wrapper<Index & { [key: string]: any }> = shallowMount(Index, {
      store,
      localVue,
      mocks: {
        $t: (key: string): string => i18nCollector.tMock(key)
      }
    })

    wrapper.vm.createPng = spy((selector: string) => {
      return Promise.resolve({
        img: selector,
        imageHeight: 0,
        imageWidth: 0
      })
    })

    await wrapper.vm.downloadWeekplanAsPng()

    expect(wrapper.vm.createPng).toHaveBeenCalledWith('#weekplan')
  })

  test('Shows detail modal', async () => {
    const i18nCollector = new I18nCollector()
    const showFn = spy()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapper: Wrapper<Index & { [key: string]: any }> = shallowMount(Index, {
      store,
      localVue,
      mocks: {
        $t: (key: string): string => i18nCollector.tMock(key)
      },
      stubs: {
        FModal: {
          template: '<div />',
          methods: {
            show: showFn
          }
        }
      }
    })

    expect(wrapper.vm.mealDetail).toEqual(null)

    wrapper.vm.showDetailModal(meals[1])
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.mealDetail).toEqual(meals[1])
    expect(showFn).toBeCalled()
  })

  test('Dispatches randomize', () => {
    const i18nCollector = new I18nCollector()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapper: Wrapper<Index & { [key: string]: any }> = shallowMount(Index, {
      store,
      localVue,
      mocks: {
        $t: (key: string): string => i18nCollector.tMock(key)
      }
    })

    wrapper.vm.randomize()

    expect(randomizeActionSpy).toBeCalled()
  })
})
