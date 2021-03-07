import testEditPageFactory from '~/tests/pages/testEditPageFactory'
import { Meal } from '~/model/meal/Meal'
import MealsPage from '~/pages/meals.vue'
import { Tag } from '~/model/tag/Tag'
import { Color } from '~/model/tag/Color'

const meals = [
  new Meal('Meal A', '', [], [], ''),
  new Meal('Meal B', '', [], [], ''),
  new Meal('Meal C', '', [], [], '')
]

const testEditPage = testEditPageFactory<Meal>(
  MealsPage,
  meals,
  new Meal('', '', [], [], ''),
  'meals',
  'meals',
  'SET_MEAL',
  'UPDATE_MEAL_PROPERTY',
  'DELETE_MEAL',
  'meal',
  'meals'
)

describe('pages/meals.ts', () => {
  beforeEach(() => {
    testEditPage.beforeEach()
  })

  test('Renders', () => {
    testEditPage.testRenders()
  })

  test('Deletes meal', () => {
    testEditPage.testDelete()
  })

  test('Updates meal title', () => {
    testEditPage.testUpdates('title', 'Hello, World!')
  })

  test('Updates meal tags', () => {
    testEditPage.testUpdates('tags', [new Tag('Some tag', new Color(0, 0, 0), '')])
  })

  test('Creates new meal', () => {
    testEditPage.testCreate()
  })
})
