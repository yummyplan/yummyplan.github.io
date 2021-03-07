import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import { Store } from '~/node_modules/vuex/types/index.d.ts'
import { Ingredient } from '~/model/meal/Ingredient'
import { IngredientCategory } from '~/model/meal/IngredientCategory'
import { MealIngredient } from '~/model/meal/MealIngredient'
import MealIngredientEditor from '~/components/Editing/MealIngredientEditor.vue'
import FButton from '~/components/FButton.vue'
import I18nCollector from '~/tests/testUtils/I18nCollector'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('components/Editing/MealIngredientEditor.vue', () => {
  let state
  let store: Store<{ ingredients: Ingredient[] }>
  let mealIngredients: MealIngredient[]

  beforeEach(() => {
    // Add some wholesomeness to these tests!
    const ingredientA = new Ingredient('Air', 'balloons', IngredientCategory.snacks)
    const ingredientB = new Ingredient('Fun', 'smiles', IngredientCategory.deli)
    const ingredientC = new Ingredient('Happiness', 'smiles', IngredientCategory.deli)

    const mealIngredientA = new MealIngredient(ingredientA, 14)
    const mealIngredientB = new MealIngredient(ingredientB, 13)

    const ingredients = [ingredientA, ingredientB, ingredientC]
    mealIngredients = [mealIngredientA, mealIngredientB]

    state = {
      ingredients
    }

    store = new Vuex.Store({
      state
    })
  })

  test('Renders and shows a list of meal ingredients', () => {
    const i18nCollector = new I18nCollector()

    const wrapper = shallowMount(MealIngredientEditor, {
      store,
      localVue,
      stubs: {
        FontAwesomeIcon: {
          template: '<div />'
        }
      },
      propsData: {
        value: mealIngredients
      },
      mocks: {
        $t: (key: string): string => i18nCollector.tMock(key)
      }
    })

    expect(i18nCollector.translationKeys).toContain('meals.edit.addIngredient')
    expect(i18nCollector.translationKeys).toContain('meals.edit.removeIngredient')
    expect(wrapper.findAll('li').length).toEqual(2)
    expect(wrapper.findAll('li').at(0).text()).toContain('balloons')
    expect(wrapper.findAll('li').at(1).text()).toContain('smiles')
  })

  test('Emits newly added MealIngredient, emits a deletion and emits updating amount and ingredient', async () => {
    const i18nCollector = new I18nCollector()

    const wrapper = shallowMount(MealIngredientEditor, {
      store,
      localVue,
      stubs: {
        FontAwesomeIcon: {
          template: '<div />'
        }
      },
      propsData: {
        value: mealIngredients
      },
      mocks: {
        $t: (key: string): string => i18nCollector.tMock(key)
      }
    })

    wrapper.findAllComponents(FButton).at(0).vm.$emit('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('li').length).toEqual(3)

    let emittedEvents = wrapper.emitted('input')

    expect(emittedEvents).toBeTruthy()
    if (emittedEvents) {
      expect(emittedEvents[0][0].length).toEqual(3)
      expect(emittedEvents[0][0][0].amount).toEqual(0)
      expect(emittedEvents[0][0][0].ingredient.name).toEqual('Air')
    }

    const ingredientSelect = wrapper.findAll('select').at(0)
    ingredientSelect.findAll('option').at(2).setSelected()
    ingredientSelect.trigger('input')

    await wrapper.vm.$nextTick()

    emittedEvents = wrapper.emitted('input')

    expect(emittedEvents).toBeTruthy()
    if (emittedEvents) {
      expect(emittedEvents.length).toEqual(2)
      expect(emittedEvents[1][0].length).toEqual(3)
      expect(emittedEvents[1][0][0].amount).toEqual(0)
      expect(emittedEvents[1][0][0].ingredient.name).toEqual('Happiness')
    }

    const amountInput = wrapper.findAll('input[type="number"]').at(0);
    (amountInput.element as HTMLInputElement).value = '12'
    amountInput.trigger('input')

    await wrapper.vm.$nextTick()

    emittedEvents = wrapper.emitted('input')

    expect(emittedEvents).toBeTruthy()
    if (emittedEvents) {
      expect(emittedEvents.length).toEqual(3)
      expect(emittedEvents[2][0].length).toEqual(3)
      expect(emittedEvents[2][0][0].amount).toEqual(12)
      expect(emittedEvents[2][0][0].ingredient.name).toEqual('Happiness')
    }

    wrapper.findAll('button').at(2).trigger('click')

    await wrapper.vm.$nextTick()

    emittedEvents = wrapper.emitted('input')

    expect(emittedEvents).toBeTruthy()
    if (emittedEvents) {
      expect(emittedEvents.length).toEqual(4)
      expect(emittedEvents[3][0].length).toEqual(2)
      expect(emittedEvents[3][0][0].amount).toEqual(12)
      expect(emittedEvents[3][0][0].ingredient.name).toEqual('Happiness')
      expect(emittedEvents[3][0][1].amount).toEqual(14)
      expect(emittedEvents[3][0][1].ingredient.name).toEqual('Air')
    }
  })
})
