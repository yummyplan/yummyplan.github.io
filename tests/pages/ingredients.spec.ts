import testEditPageFactory from '~/tests/pages/testEditPageFactory'
import { Ingredient } from '~/model/meal/Ingredient'
import { IngredientCategory } from '~/model/meal/IngredientCategory'
import IngredientsPage from '~/pages/ingredients.vue'

const ingredients = [
  new Ingredient('Ingredient A', '', IngredientCategory.deli),
  new Ingredient('Ingredient B', '', IngredientCategory.deli),
  new Ingredient('Ingredient C', '', IngredientCategory.deli)
]

const testEditPage = testEditPageFactory<Ingredient>(
  IngredientsPage,
  ingredients,
  new Ingredient('', '', IngredientCategory.uncategorized),
  'ingredients',
  'ingredients',
  'SET_INGREDIENT',
  'UPDATE_INGREDIENT_PROPERTY',
  'DELETE_INGREDIENT',
  'ingredient',
  'ingredients'
)

describe('pages/ingredients.ts', () => {
  beforeEach(() => {
    testEditPage.beforeEach()
  })

  test('Renders', () => {
    testEditPage.testRenders()
  })

  test('Deletes ingredient', () => {
    testEditPage.testDelete()
  })

  test('Updates ingredient', () => {
    testEditPage.testUpdates('name', 'Hello, World!')
  })

  test('Creates new ingredient', () => {
    testEditPage.testCreate()
  })
})
