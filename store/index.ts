import {
  VuexModule,
  Module,
  action,
  mutation
} from 'vuex-class-component'
import { MealplanInterface, SerializableMealplanSettings } from '~/model/store/SerializableMealplanSettings'
import { Tag } from '~/model/tag/Tag'
import { Meal } from '~/model/meal/Meal'
import { Ingredient } from '~/model/meal/Ingredient'
import { WeekdaysType } from '~/model/store/Weekplan'
import { Dayplan, DayTimesType } from '~/model/store/Dayplan'
import { Mealplan } from '~/model/store/Mealplan'
import { AllowedTags } from '~/model/store/AllowedTags'
import { MealIngredient } from '~/model/meal/MealIngredient'
import { GroceryListItem } from '~/model/groceryList/GroceryListItem'

export const saveInLocalStorage = (state: MealplanStore): void => {
  if (localStorage.getItem('cookiesAccepted') !== 'yes') {
    return
  }

  const serializedState = JSON.stringify(new SerializableMealplanSettings(
    state.mealPlan,
    state.allowedTagsInRandom,
    state.meals,
    state.ingredients,
    state.tags
  ))

  localStorage.setItem('state', serializedState)
}

@Module({
  namespacedPath: 'modules/',
  target: 'nuxt'
})
export class MealplanStore extends VuexModule implements MealplanInterface {
  allowedTagsInRandom: AllowedTags
  mealPlan: Mealplan
  meals: Meal[]
  ingredients: Ingredient[]
  tags: Tag[]

  /**
   * Constructor, sets some empty arrays and fields.
   */
  constructor () {
    super()

    this.allowedTagsInRandom = new AllowedTags(
      new Dayplan<Tag[]>([], [], []),
      new Dayplan<Tag[]>([], [], []),
      new Dayplan<Tag[]>([], [], []),
      new Dayplan<Tag[]>([], [], []),
      new Dayplan<Tag[]>([], [], []),
      new Dayplan<Tag[]>([], [], []),
      new Dayplan<Tag[]>([], [], [])
    )

    this.mealPlan = new Mealplan(
      new Dayplan<Meal | null>(null, null, null),
      new Dayplan<Meal | null>(null, null, null),
      new Dayplan<Meal | null>(null, null, null),
      new Dayplan<Meal | null>(null, null, null),
      new Dayplan<Meal | null>(null, null, null),
      new Dayplan<Meal | null>(null, null, null),
      new Dayplan<Meal | null>(null, null, null)
    )

    this.meals = []
    this.ingredients = []
    this.tags = []
  }

  /**
   * Set a meal on a specific day for a specific time.
   * @param value
   * @constructor
   */
  @mutation
  public SET_MEAL_AT_DAY_AND_TIME (value: { day: WeekdaysType, time: DayTimesType, meal: Meal }): void {
    this.mealPlan[value.day][value.time] = value.meal

    saveInLocalStorage(this)
  }

  /**
   * Sets a set of tags on a day and time.
   * @param value
   * @constructor
   */
  @mutation
  public SET_TAGS (value: { day: WeekdaysType, time: DayTimesType, tags: Tag[] }): void {
    this.allowedTagsInRandom[value.day][value.time] = [...new Set(value.tags)]

    saveInLocalStorage(this)
  }

  /**
   * Restore data
   * @param payload
   * @constructor
   */
  @mutation
  public SET_MEALPLANSETTINGS (payload: SerializableMealplanSettings): void {
    this.allowedTagsInRandom = payload.allowedTagsInRandom
    this.mealPlan = payload.mealPlan
    this.meals = payload.meals
    this.ingredients = payload.ingredients
    this.tags = payload.tags

    saveInLocalStorage(this)
  }

  /**
   * Updates a given property of a given meal
   * @param payload
   */
  @mutation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public UPDATE_MEAL_PROPERTY (payload: { index: number, key: keyof Meal, value: any }): void {
    this.meals[payload.index][payload.key] = payload.value

    saveInLocalStorage(this)
  }

  /**
   * Replaces a meal
   * @param payload
   */
  @mutation
  SET_MEAL (payload: { index: number, meal: Meal }): void {
    if (this.meals.length <= payload.index) {
      this.meals.push(payload.meal)
    } else {
      this.meals[payload.index] = payload.meal
    }

    saveInLocalStorage(this)
  }

  /**
   * Delets a meal
   * @param payload
   */
  @mutation
  DELETE_MEAL (payload: { meal: Meal }): void {
    const index = this.meals.map(m => JSON.stringify(m)).indexOf(JSON.stringify(payload.meal))

    if (index === -1) {
      return
    }

    this.meals.splice(index, 1)

    saveInLocalStorage(this)
  }

  /**
   * Updates a given ingredient everywhere (including meal plan and menus)
   * @param payload
   */
  @mutation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  UPDATE_INGREDIENT_PROPERTY (payload: { ingredient: Ingredient, index: number, key: keyof Ingredient, value: any }): void {
    /**
     * Adjusts the ingredients of a given meal.
     * @param meal
     */
    const adjustMealIngredients = (meal: Meal): void => {
      meal.ingredients.forEach((mealIngredient: MealIngredient) => {
        if (mealIngredient.ingredient.name === payload.ingredient.name) {
          mealIngredient.ingredient[payload.key] = payload.value
        }
      })
    }

    this.meals.forEach(adjustMealIngredients)
    this.mealPlan.allMeals.forEach(adjustMealIngredients)

    this.ingredients[payload.index][payload.key] = payload.value

    saveInLocalStorage(this)
  }

  /**
   * Replaces a meal
   * @param payload
   */
  @mutation
  SET_INGREDIENT (payload: { index: number, ingredient: Ingredient }): void {
    if (this.ingredients.length <= payload.index) {
      this.ingredients.push(payload.ingredient)
    } else {
      this.ingredients[payload.index] = payload.ingredient
    }

    saveInLocalStorage(this)
  }

  /**
   * Deletes an ingredient everywhere
   * @param payload
   * @constructor
   */
  @mutation
  DELETE_INGREDIENT (payload: { ingredient: Ingredient }): void {
    const stringifiedIngredient = JSON.stringify(payload.ingredient)

    const index = this.ingredients.map(i => JSON.stringify(i)).indexOf(stringifiedIngredient)

    if (index === -1) {
      return
    }

    this.ingredients.splice(index, 1)

    /**
     * Removes an ingredient from a given meal.
     * @param meal
     */
    const removeIngredient = (meal: Meal): void => {
      meal.ingredients = meal.ingredients.filter((mealIngredient: MealIngredient) => {
        return JSON.stringify(mealIngredient.ingredient) !== stringifiedIngredient
      })
    }

    this.meals.forEach(removeIngredient)
    this.mealPlan.allMeals.forEach(removeIngredient)

    saveInLocalStorage(this)
  }

  /**
   * Updates a given tags property
   * @param payload
   * @constructor
   */
  @mutation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  UPDATE_TAG_PROPERTY (payload: { tag: Tag, index: number, key: keyof Tag, value: any }): void {
    this.tags[payload.index][payload.key] = payload.value

    const stringifiedTag = JSON.stringify(payload.tag)

    const updateTagInMeal = (meal: Meal): void => {
      meal.tags.filter((tag: Tag) => JSON.stringify(tag) === stringifiedTag).forEach((tag: Tag) => {
        tag[payload.key] = payload.value
      })
    }

    this.meals.forEach(updateTagInMeal)
    this.mealPlan.allMeals.forEach(updateTagInMeal)

    saveInLocalStorage(this)
  }

  /**
   * Deletes a tag everywhere
   * @param payload
   * @constructor
   */
  @mutation
  DELETE_TAG (payload: { tag: Tag }): void {
    const stringifiedTag = JSON.stringify(payload.tag)

    const index = this.tags.map(i => JSON.stringify(i)).indexOf(stringifiedTag)

    if (index === -1) {
      return
    }

    this.tags.splice(index, 1)

    /**
     * Removes a tag from a given meal.
     * @param meal
     */
    const removeTag = (meal: Meal): void => {
      meal.tags = meal.tags.filter((t: Tag) => {
        return JSON.stringify(t) !== stringifiedTag
      })
    }

    this.meals.forEach(removeTag)
    this.mealPlan.allMeals.forEach(removeTag)

    saveInLocalStorage(this)
  }

  /**
   * Replaces a meal
   * @param payload
   */
  @mutation
  SET_TAG (payload: { index: number, tag: Tag }): void {
    if (this.tags.length <= payload.index) {
      this.tags.push(payload.tag)
    } else {
      this.tags[payload.index] = payload.tag
    }

    saveInLocalStorage(this)
  }

  /**
   * Randomizes all empty fields on the week plan with regards to allowed tags
   */
  @action
  public randomize (): Promise<() => void> {
    const days: WeekdaysType[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
    const times: DayTimesType[] = ['breakfast', 'lunch', 'dinner']

    days.forEach((day: WeekdaysType) => {
      times.forEach((time: DayTimesType) => {
        if (this.mealPlan[day][time]) {
          return
        }

        const allowedTags = this.allowedTagsInRandom[day][time]

        let allowedMeals = this.meals

        if (allowedTags.length > 0) {
          allowedMeals = allowedMeals.filter((meal) => {
            return allowedTags.map(tag => meal.hasTag(tag)).every(Boolean)
          })
        }

        if (allowedMeals.length === 0) {
          return
        }

        this.$store.commit('SET_MEAL_AT_DAY_AND_TIME', {
          day, time, meal: allowedMeals[Math.floor(Math.random() * allowedMeals.length)]
        })
      })
    })

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return Promise.resolve(() => {})
  }

  /**
   * Builds an array of all used ingredients in the mealPlan.
   */
  get groceryList (): GroceryListItem[] {
    const allMeals = [...this.mealPlan.allMeals]

    if (allMeals.length === 0) {
      return []
    }

    const ingredients = allMeals.map(meal => meal.ingredients.map(ingredient => ({
      mealIngredient: ingredient,
      mealTitle: meal.title
    }))).flat()

    if (ingredients.length === 0) {
      return []
    }

    const groceryMap = new Map()

    ingredients.forEach((newIngredient) => {
      const ingredientName = newIngredient.mealIngredient.ingredient.name
      const ingredientUnit = newIngredient.mealIngredient.ingredient.unit
      const ingredientCategory = newIngredient.mealIngredient.ingredient.category
      const ingredientAmount = newIngredient.mealIngredient.amount
      const existingIngredient: { value: number, unit: string, meals: string[] } | null = groceryMap.has(ingredientName) ? groceryMap.get(ingredientName) : null

      let currentAmount = 0
      let currentMeals: string[] = []
      if (existingIngredient) {
        currentAmount = existingIngredient.value
        currentMeals = existingIngredient.meals
      }

      currentAmount = currentAmount + ingredientAmount
      groceryMap.set(ingredientName, {
        value: currentAmount,
        unit: ingredientUnit,
        category: ingredientCategory,
        meals: [...new Set([...currentMeals, newIngredient.mealTitle])]
      })
    })

    const groceryList: GroceryListItem[] = []
    groceryMap.forEach((value, key) => {
      groceryList.push(new GroceryListItem(key, value.value + ' ' + value.unit, value.meals, value.category))
    })

    return groceryList
  }

  /**
   * Serializable version of the meal plan state.
   */
  get serializable (): SerializableMealplanSettings {
    return new SerializableMealplanSettings(
      this.mealPlan,
      this.allowedTagsInRandom,
      this.meals,
      this.ingredients,
      this.tags
    )
  }
}

export default MealplanStore.ExtractVuexModule(MealplanStore)
