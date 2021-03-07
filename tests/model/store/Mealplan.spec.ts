import { Mealplan } from '~/model/store/Mealplan'
import { Dayplan } from '~/model/store/Dayplan'
import { Meal } from '~/model/meal/Meal'

describe('model/store/Mealplan.ts', () => {
  test('Returns an empty set of "all meals"', () => {
    const mealPlan = new Mealplan(
      new Dayplan<Meal | null>(null, null, null),
      new Dayplan<Meal | null>(null, null, null),
      new Dayplan<Meal | null>(null, null, null),
      new Dayplan<Meal | null>(null, null, null),
      new Dayplan<Meal | null>(null, null, null),
      new Dayplan<Meal | null>(null, null, null),
      new Dayplan<Meal | null>(null, null, null)
    )

    expect(mealPlan.allMeals).toEqual([])
  })

  test('Returns a single meal if set somewhere', () => {
    const meal = new Meal('Some meal', '', [], [], '')

    const mealPlan = new Mealplan(
      new Dayplan<Meal | null>(null, null, null),
      new Dayplan<Meal | null>(null, null, null),
      new Dayplan<Meal | null>(null, meal, null),
      new Dayplan<Meal | null>(null, null, null),
      new Dayplan<Meal | null>(null, null, null),
      new Dayplan<Meal | null>(null, null, null),
      new Dayplan<Meal | null>(null, null, null)
    )

    expect(mealPlan.allMeals).toEqual([meal])
  })

  test('Returns several meals if set somewhere', () => {
    const meal = new Meal('Some meal', '', [], [], '')

    const mealPlan = new Mealplan(
      new Dayplan<Meal | null>(null, null, null),
      new Dayplan<Meal | null>(null, null, null),
      new Dayplan<Meal | null>(null, null, null),
      new Dayplan<Meal | null>(null, null, meal),
      new Dayplan<Meal | null>(null, null, null),
      new Dayplan<Meal | null>(meal, null, null),
      new Dayplan<Meal | null>(null, null, null)
    )

    expect(mealPlan.allMeals).toEqual([meal, meal])
  })
})
