import { Meal } from '~/model/meal/Meal'
import { Tag } from '~/model/tag/Tag'
import { Color } from '~/model/tag/Color'
import { Ingredient } from '~/model/meal/Ingredient'
import { IngredientCategory } from '~/model/meal/IngredientCategory'
import { MealIngredient } from '~/model/meal/MealIngredient'

describe('model/meal/Meal.ts', () => {
  test('Matches title', () => {
    const meal = new Meal('Hello, World!', '', [], [], '')

    expect(meal.doesMatch('hello')).toBeTruthy()
    expect(meal.doesMatch('world')).toBeTruthy()
    expect(meal.doesMatch('Hello, World')).toBeTruthy()
    expect(meal.doesMatch('Hello, World!')).toBeTruthy()
    expect(meal.doesMatch('HELLO, WORLD')).toBeTruthy()
    expect(meal.doesMatch('hello world')).toBeFalsy()
    expect(meal.doesMatch('foobar')).toBeFalsy()
    expect(meal.doesMatch('FOOBAR')).toBeFalsy()
    expect(meal.doesMatch('Hello, World!!')).toBeFalsy()
  })

  test('Matches tag', () => {
    const tag = new Tag('some tag', new Color(0, 0, 0), '')

    const meal = new Meal('', '', [tag], [], '')

    expect(meal.doesMatch('some')).toBeTruthy()
    expect(meal.doesMatch('tag')).toBeTruthy()
    expect(meal.doesMatch('some tag')).toBeTruthy()
    expect(meal.doesMatch('Some Tag')).toBeTruthy()
    expect(meal.doesMatch('Some')).toBeTruthy()
    expect(meal.doesMatch('Tag')).toBeTruthy()
    expect(meal.doesMatch('SOME TAG')).toBeTruthy()
    expect(meal.doesMatch('hello, world')).toBeFalsy()
    expect(meal.doesMatch('some taaag')).toBeFalsy()
  })

  test('Matches tag and title', () => {
    const tag = new Tag('some tag', new Color(0, 0, 0), '')

    const meal = new Meal('some meal', '', [tag], [], '')

    expect(meal.doesMatch('some')).toBeTruthy()
    expect(meal.doesMatch('meal')).toBeTruthy()
    expect(meal.doesMatch('tag')).toBeTruthy()
    expect(meal.doesMatch('some meal')).toBeTruthy()
    expect(meal.doesMatch('some tag')).toBeTruthy()
    expect(meal.doesMatch('SOME')).toBeTruthy()
    expect(meal.doesMatch('Some')).toBeTruthy()
    expect(meal.doesMatch('MEAL')).toBeTruthy()
    expect(meal.doesMatch('TAG')).toBeTruthy()
    expect(meal.doesMatch('hello')).toBeFalsy()
  })

  test('Does not match ingredients', () => {
    const ingredient = new Ingredient('some ingredient', '', IngredientCategory.dairyAndEggs)

    const mealIngredient = new MealIngredient(ingredient, 1)

    const meal = new Meal('some meal', '', [], [mealIngredient], '')

    expect(meal.doesMatch('ingredient')).toBeFalsy()
    expect(meal.doesMatch('Ingredient')).toBeFalsy()
    expect(meal.doesMatch('INGR')).toBeFalsy()
    expect(meal.doesMatch('INGREDIENT')).toBeFalsy()
  })

  test('Does not match notes', () => {
    const meal = new Meal('', '', [], [], 'Hello, World!')

    expect(meal.doesMatch('hello')).toBeFalsy()
    expect(meal.doesMatch('world')).toBeFalsy()
    expect(meal.doesMatch('Hello, World')).toBeFalsy()
    expect(meal.doesMatch('Hello, World!')).toBeFalsy()
    expect(meal.doesMatch('HELLO, WORLD')).toBeFalsy()
    expect(meal.doesMatch('hello world')).toBeFalsy()
    expect(meal.doesMatch('foobar')).toBeFalsy()
    expect(meal.doesMatch('FOOBAR')).toBeFalsy()
    expect(meal.doesMatch('Hello, World!!')).toBeFalsy()
  })

  test('Has a certain tag', () => {
    const tag1 = new Tag('tag1', new Color(0, 0, 0), '')
    const tag2 = new Tag('tag2', new Color(1, 1, 1), '')

    const meal = new Meal('', '', [tag1], [], '')

    expect(meal.hasTag(tag1)).toBeTruthy()
    expect(meal.hasTag(tag2)).toBeFalsy()
  })
})
