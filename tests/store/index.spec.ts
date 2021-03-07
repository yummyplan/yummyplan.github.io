import { spy } from 'sinon'
import { MealplanStore, saveInLocalStorage } from '~/store'
import { Dayplan, DayTimesType } from '~/model/store/Dayplan'
import { WeekdaysType } from '~/model/store/Weekplan'
import { SerializableMealplanSettings } from '~/model/store/SerializableMealplanSettings'
import { Meal } from '~/model/meal/Meal'
import { Tag } from '~/model/tag/Tag'
import { Color } from '~/model/tag/Color'
import { Ingredient } from '~/model/meal/Ingredient'
import { IngredientCategory } from '~/model/meal/IngredientCategory'
import { Mealplan } from '~/model/store/Mealplan'
import { AllowedTags } from '~/model/store/AllowedTags'
import { MealIngredient } from '~/model/meal/MealIngredient'

const dayTimes: DayTimesType[] = ['breakfast', 'lunch', 'dinner']
const days: WeekdaysType[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

const mockedStore = {
  commit: spy(),
  state: {},
  getters: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  replaceState: (): void => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-explicit-any
  dispatch: (() => {}) as any,
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-explicit-any
  subscribe: (() => {}) as any,
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-explicit-any
  registerModule: (() => {}) as any,
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-explicit-any
  unregisterModule: (() => {}) as any,
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-explicit-any
  subscribeAction: (() => {}) as any,
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-explicit-any
  watch: (() => {}) as any,
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-explicit-any
  hasModule: (() => {}) as any,
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-explicit-any
  hotUpdate: (() => {}) as any,
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-explicit-any
  app: (() => {}) as any,
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-explicit-any
  $i18n: (() => {}) as any,
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-explicit-any
  $router: (() => {}) as any
}

describe('store/index.ts', () => {
  beforeEach(() => {
    localStorage.setItem('cookiesAccepted', 'yes')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    localStorage.setItem.mockClear()

    mockedStore.commit.resetHistory()
  })

  test('saveInLocalStorage should not save if cookies are not accepted', () => {
    localStorage.setItem('cookiesAccepted', 'no')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    localStorage.setItem.mockClear()

    const store = new MealplanStore()

    saveInLocalStorage(store)

    expect(localStorage.setItem).not.toBeCalled()
  })

  test('saveInLocalStorage should save in localStorage if cookies accepted', () => {
    localStorage.setItem('cookiesAccepted', 'yes')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    localStorage.setItem.mockClear()

    const store = new MealplanStore()
    const expectedState = JSON.stringify(new SerializableMealplanSettings(
      store.mealPlan,
      store.allowedTagsInRandom,
      store.meals,
      store.ingredients,
      store.tags
    ))

    saveInLocalStorage(store)

    expect(localStorage.setItem).toBeCalledWith('state', expectedState)
  })

  test('Initializes empty', () => {
    const store = new MealplanStore()

    expect(store.tags).toEqual([])
    expect(store.ingredients).toEqual([])
    expect(store.meals).toEqual([])

    dayTimes.forEach((time: DayTimesType) => {
      days.forEach((day: WeekdaysType) => {
        expect(store.mealPlan[day][time]).toEqual(null)
        expect(store.allowedTagsInRandom[day][time]).toEqual([])
      })
    })
  })

  test('SET_MEAL_AT_DAY_AND_TIME updates MealPlan and attempts save to localStorage', () => {
    const store = new MealplanStore()

    const meal = new Meal('', '', [], [], '')

    store.SET_MEAL_AT_DAY_AND_TIME({
      day: 'mon',
      time: 'lunch',
      meal
    })

    expect(store.mealPlan.mon.lunch).toEqual(meal)
    expect(localStorage.setItem).toHaveBeenCalled()
  })

  test('SET_TAGS updates allowed tags and attempts save to localStorage', () => {
    const store = new MealplanStore()

    const tag = new Tag('Tag A', new Color(0, 0, 0), '')

    store.SET_TAGS({
      day: 'mon',
      time: 'lunch',
      tags: [tag, tag, tag]
    })

    expect(store.allowedTagsInRandom.mon.lunch).toEqual([tag])
    expect(localStorage.setItem).toHaveBeenCalled()
  })

  test('SET_MEALPLANSETTINGS sets the entire store from an object and attempts save to localStorage', () => {
    const tags = [new Tag('Tag A', new Color(0, 0, 0), '')]
    const meals = [new Meal('Some meal', '', [], [], '')]
    const ingredients = [new Ingredient('Some ingredient', 'some unit', IngredientCategory.deli)]
    const mealPlan = new Mealplan(
      new Dayplan<Meal|null>(meals[0], null, meals[0]),
      new Dayplan<Meal|null>(null, meals[0], null),
      new Dayplan<Meal|null>(meals[0], null, meals[0]),
      new Dayplan<Meal|null>(null, meals[0], null),
      new Dayplan<Meal|null>(meals[0], null, meals[0]),
      new Dayplan<Meal|null>(null, meals[0], null),
      new Dayplan<Meal|null>(meals[0], null, meals[0])
    )
    const allowedTags = new AllowedTags(
      new Dayplan<Tag[]>(tags, [], tags),
      new Dayplan<Tag[]>([], tags, []),
      new Dayplan<Tag[]>(tags, [], tags),
      new Dayplan<Tag[]>([], tags, []),
      new Dayplan<Tag[]>(tags, [], tags),
      new Dayplan<Tag[]>([], tags, []),
      new Dayplan<Tag[]>(tags, [], tags)
    )

    const serializableMealPlan = new SerializableMealplanSettings(mealPlan, allowedTags, meals, ingredients, tags)

    const store = new MealplanStore()
    store.SET_MEALPLANSETTINGS(serializableMealPlan)

    expect(store.mealPlan).toEqual(mealPlan)
    expect(store.allowedTagsInRandom).toEqual(allowedTags)
    expect(store.meals).toEqual(meals)
    expect(store.tags).toEqual(tags)
    expect(store.ingredients).toEqual(ingredients)

    expect(localStorage.setItem).toHaveBeenCalled()
  })

  test('UPDATE_MEAL_PROPERTY updates the appropriate meal and property and attempts save to localStorage', () => {
    const store = new MealplanStore()
    store.meals = [new Meal('Some meal', '', [], [], '')]

    store.UPDATE_MEAL_PROPERTY({
      index: 0,
      key: 'title',
      value: 'Some other name'
    })

    expect(store.meals[0].title).toEqual('Some other name')
    expect(localStorage.setItem).toHaveBeenCalled()
  })

  test('SET_MEAL overwrites an existing meal and attempts save to localStorage', () => {
    const store = new MealplanStore()
    store.meals = [new Meal('Some meal', '', [], [], '')]

    const newMeal = new Meal('Some other meal', '', [], [], '')

    store.SET_MEAL({ index: 0, meal: newMeal })

    expect(store.meals[0]).toEqual(newMeal)
    expect(localStorage.setItem).toHaveBeenCalled()
  })

  test('SET_MEAL adds new meal uf index is out of bounds and attempts save to localStorage', () => {
    const store = new MealplanStore()
    const oldMeal = new Meal('Some meal', '', [], [], '')
    store.meals = [oldMeal]

    const newMeal = new Meal('Some other meal', '', [], [], '')

    store.SET_MEAL({ index: 1, meal: newMeal })

    expect(store.meals[0]).toEqual(oldMeal)
    expect(store.meals[1]).toEqual(newMeal)
    expect(localStorage.setItem).toHaveBeenCalled()
  })

  test('DELETE_MEAL deletes an existing meal and attempts save to localStorage', () => {
    const store = new MealplanStore()
    const mealA = new Meal('Meal A', '', [], [], '')
    const mealB = new Meal('Meal B', '', [], [], '')
    const mealC = new Meal('Meal C', '', [], [], '')
    store.meals = [mealA, mealB, mealC]

    expect(store.meals.length).toEqual(3)

    store.DELETE_MEAL({ meal: mealB })

    expect(store.meals.length).toEqual(2)
    expect(store.meals[0]).toEqual(mealA)
    expect(store.meals[1]).toEqual(mealC)
    expect(localStorage.setItem).toHaveBeenCalled()
  })

  test('DELETE_MEAL does not delete a non-existing meal', () => {
    const store = new MealplanStore()
    const mealA = new Meal('Meal A', '', [], [], '')
    const mealB = new Meal('Meal B', '', [], [], '')
    const mealC = new Meal('Meal C', '', [], [], '')
    const mealD = new Meal('Meal D', '', [], [], '')
    store.meals = [mealA, mealB, mealC]

    expect(store.meals.length).toEqual(3)

    store.DELETE_MEAL({ meal: mealD })

    expect(store.meals.length).toEqual(3)
    expect(store.meals[0]).toEqual(mealA)
    expect(store.meals[1]).toEqual(mealB)
    expect(store.meals[2]).toEqual(mealC)
    expect(localStorage.setItem).not.toHaveBeenCalled()
  })

  test('UPDATE_INGREDIENT_PROPERTY updates a property everywhere', () => {
    const ingredientToChange = new Ingredient('Some ingredient', 'some unit', IngredientCategory.deli)
    const otherIngredient = new Ingredient('Some other ingredient', 'some unit', IngredientCategory.deli)

    const mealA = new Meal('', '', [], [new MealIngredient(ingredientToChange, 12)], '')
    const mealB = new Meal('', '', [], [new MealIngredient(ingredientToChange, 12), new MealIngredient(otherIngredient, 12)], '')

    const store = new MealplanStore()
    store.meals = [mealA]
    store.ingredients = [ingredientToChange]
    store.mealPlan.mon.lunch = mealB

    const newName = 'Some new name'

    store.UPDATE_INGREDIENT_PROPERTY({
      ingredient: ingredientToChange,
      key: 'name',
      index: 0,
      value: newName
    })

    expect(store.ingredients[0].name).toEqual(newName)
    expect(store.meals[0].ingredients[0].ingredient.name).toEqual(newName)
    expect(store.mealPlan.mon.lunch.ingredients[0].ingredient.name).toEqual(newName)

    expect(localStorage.setItem).toHaveBeenCalled()
  })

  test('SET_INGREDIENT overwrites an existing ingredient and attempts save to localStorage', () => {
    const store = new MealplanStore()
    const oldIngredient = new Ingredient('Name', 'unit', IngredientCategory.deli)
    store.ingredients = [oldIngredient]

    const newIngredient = new Ingredient('Some other', 'unit', IngredientCategory.deli)

    store.SET_INGREDIENT({ index: 0, ingredient: newIngredient })

    expect(store.ingredients[0]).toEqual(newIngredient)
    expect(localStorage.setItem).toHaveBeenCalled()
  })

  test('SET_INGREDIENT adds new ingredient uf index is out of bounds and attempts save to localStorage', () => {
    const store = new MealplanStore()
    const oldIngredient = new Ingredient('Name', 'unit', IngredientCategory.deli)
    store.ingredients = [oldIngredient]

    const newIngredient = new Ingredient('Some other', 'unit', IngredientCategory.deli)

    store.SET_INGREDIENT({ index: 1, ingredient: newIngredient })

    expect(store.ingredients[0]).toEqual(oldIngredient)
    expect(store.ingredients[1]).toEqual(newIngredient)
    expect(localStorage.setItem).toHaveBeenCalled()
  })

  test('DELETE_INGREDIENT does not delete an unknown ingredient anywhere', () => {
    const oldIngredient = new Ingredient('Name', 'unit', IngredientCategory.deli)

    const mealA = new Meal('', '', [], [new MealIngredient(oldIngredient, 12)], '')
    const mealB = new Meal('', '', [], [new MealIngredient(oldIngredient, 12)], '')

    const store = new MealplanStore()
    store.meals = [mealA]
    store.ingredients = [oldIngredient]
    store.mealPlan.mon.lunch = mealB

    const newIngredient = new Ingredient('Some other', 'unit', IngredientCategory.deli)

    store.DELETE_INGREDIENT({ ingredient: newIngredient })

    expect(store.meals[0].ingredients[0].ingredient).toEqual(oldIngredient)
    expect(store.ingredients[0]).toEqual(oldIngredient)
    expect(store.mealPlan.mon.lunch.ingredients[0].ingredient).toEqual(oldIngredient)

    expect(localStorage.setItem).not.toHaveBeenCalled()
  })

  test('DELETE_INGREDIENT delets an ingredient everywhere and attempts save to localStorage', () => {
    const oldIngredient = new Ingredient('Name', 'unit', IngredientCategory.deli)

    const mealA = new Meal('', '', [], [new MealIngredient(oldIngredient, 12)], '')
    const mealB = new Meal('', '', [], [new MealIngredient(oldIngredient, 12)], '')

    const store = new MealplanStore()
    store.meals = [mealA]
    store.ingredients = [oldIngredient]
    store.mealPlan.mon.lunch = mealB

    store.DELETE_INGREDIENT({ ingredient: oldIngredient })

    expect(store.meals[0].ingredients.length).toEqual(0)
    expect(store.ingredients.length).toEqual(0)
    expect(store.mealPlan.mon.lunch.ingredients.length).toEqual(0)

    expect(localStorage.setItem).toHaveBeenCalled()
  })

  test('UPDATE_TAG_PROPERTY updates a given tag everywhere', () => {
    const tagToChange = new Tag('Some tag', new Color(0, 0, 0), '')

    const mealA = new Meal('', '', [tagToChange], [], '')
    const mealB = new Meal('', '', [tagToChange], [], '')

    const store = new MealplanStore()
    store.meals = [mealA]
    store.tags = [tagToChange]
    store.mealPlan.mon.lunch = mealB

    const newName = 'Some new name'

    store.UPDATE_TAG_PROPERTY({
      tag: tagToChange,
      key: 'name',
      index: 0,
      value: newName
    })

    expect(store.tags[0].name).toEqual(newName)
    expect(store.meals[0].tags[0].name).toEqual(newName)
    expect(store.mealPlan.mon.lunch.tags[0].name).toEqual(newName)

    expect(localStorage.setItem).toHaveBeenCalled()
  })

  test('DELETE_TAG does not delete an unknown tag anywhere', () => {
    const oldTag = new Tag('Some tag', new Color(0, 0, 0), '')

    const mealA = new Meal('', '', [oldTag], [], '')
    const mealB = new Meal('', '', [oldTag], [], '')

    const store = new MealplanStore()
    store.meals = [mealA]
    store.tags = [oldTag]
    store.mealPlan.mon.lunch = mealB

    const newTag = new Tag('Some other tag', new Color(0, 0, 0), '')

    store.DELETE_TAG({ tag: newTag })

    expect(store.meals[0].tags[0]).toEqual(oldTag)
    expect(store.tags[0]).toEqual(oldTag)
    expect(store.mealPlan.mon.lunch.tags[0]).toEqual(oldTag)

    expect(localStorage.setItem).not.toHaveBeenCalled()
  })

  test('DELETE_TAG delets a tag everywhere and attempts save to localStorage', () => {
    const oldTag = new Tag('Some tag', new Color(0, 0, 0), '')

    const mealA = new Meal('', '', [oldTag], [], '')
    const mealB = new Meal('', '', [oldTag], [], '')

    const store = new MealplanStore()
    store.meals = [mealA]
    store.tags = [oldTag]
    store.mealPlan.mon.lunch = mealB

    store.DELETE_TAG({ tag: oldTag })

    expect(store.meals[0].tags.length).toEqual(0)
    expect(store.tags.length).toEqual(0)
    expect(store.mealPlan.mon.lunch.tags.length).toEqual(0)

    expect(localStorage.setItem).toHaveBeenCalled()
  })

  test('SET_TAG overwrites an existing tag and attempts save to localStorage', () => {
    const store = new MealplanStore()
    const oldTag = new Tag('Some tag', new Color(0, 0, 0), '')
    store.tags = [oldTag]

    const newTag = new Tag('Some new tag', new Color(0, 0, 0), '')

    store.SET_TAG({ index: 0, tag: newTag })

    expect(store.tags[0]).toEqual(newTag)
    expect(localStorage.setItem).toHaveBeenCalled()
  })

  test('SET_TAG adds new tag uf index is out of bounds and attempts save to localStorage', () => {
    const store = new MealplanStore()
    const oldTag = new Tag('Some tag', new Color(0, 0, 0), '')
    store.tags = [oldTag]

    const newTag = new Tag('Some new tag', new Color(0, 0, 0), '')

    store.SET_TAG({ index: 1, tag: newTag })

    expect(store.tags[0]).toEqual(oldTag)
    expect(store.tags[1]).toEqual(newTag)
    expect(localStorage.setItem).toHaveBeenCalled()
  })

  test('randomize does not do anything on a set mealplan', () => {
    const meals = [new Meal('Some meal', '', [], [], '')]
    const mealPlan = new Mealplan(
      new Dayplan<Meal|null>(meals[0], meals[0], meals[0]),
      new Dayplan<Meal|null>(meals[0], meals[0], meals[0]),
      new Dayplan<Meal|null>(meals[0], meals[0], meals[0]),
      new Dayplan<Meal|null>(meals[0], meals[0], meals[0]),
      new Dayplan<Meal|null>(meals[0], meals[0], meals[0]),
      new Dayplan<Meal|null>(meals[0], meals[0], meals[0]),
      new Dayplan<Meal|null>(meals[0], meals[0], meals[0])
    )

    const store = new MealplanStore()
    store.$store = mockedStore
    store.mealPlan = mealPlan

    store.randomize()

    expect(store.mealPlan).toEqual(mealPlan)
    expect(store.$store.commit).not.toBeCalled()
  })

  test('randomize does not do anything on if there are no meals', () => {
    const mealPlan = new Mealplan(
      new Dayplan<Meal|null>(null, null, null),
      new Dayplan<Meal|null>(null, null, null),
      new Dayplan<Meal|null>(null, null, null),
      new Dayplan<Meal|null>(null, null, null),
      new Dayplan<Meal|null>(null, null, null),
      new Dayplan<Meal|null>(null, null, null),
      new Dayplan<Meal|null>(null, null, null)
    )

    const store = new MealplanStore()
    store.$store = mockedStore
    store.mealPlan = mealPlan

    store.randomize()

    expect(store.mealPlan).toEqual(mealPlan)
    expect(store.$store.commit).not.toBeCalled()
  })

  test('randomize fills only with allowed tags', () => {
    const tagA = new Tag('Tag A', new Color(0, 0, 0), '')
    const tagB = new Tag('Tag B', new Color(0, 0, 0), '')
    const tagC = new Tag('Tag B', new Color(0, 0, 0), '')

    const meals = [
      new Meal('Meal A', '', [tagA], [], ''),
      new Meal('Meal B', '', [tagB], [], '')
    ]

    const mealPlan = new Mealplan(
      new Dayplan<Meal|null>(null, null, null),
      new Dayplan<Meal|null>(null, null, null),
      new Dayplan<Meal|null>(null, null, null),
      new Dayplan<Meal|null>(null, null, null),
      new Dayplan<Meal|null>(null, null, null),
      new Dayplan<Meal|null>(null, null, null),
      new Dayplan<Meal|null>(null, null, null)
    )

    const allowedTags = new AllowedTags(
      new Dayplan<Tag[]>([tagA], [tagB], [tagC]),
      new Dayplan<Tag[]>([tagB], [tagC], [tagA]),
      new Dayplan<Tag[]>([tagC], [tagA], [tagB]),
      new Dayplan<Tag[]>([tagA], [tagB], [tagC]),
      new Dayplan<Tag[]>([tagB], [tagC], [tagA]),
      new Dayplan<Tag[]>([tagC], [tagA], [tagB]),
      new Dayplan<Tag[]>([tagA], [tagB], [tagC])
    )

    const store = new MealplanStore()

    store.$store = mockedStore
    store.mealPlan = mealPlan
    store.allowedTagsInRandom = allowedTags
    store.meals = meals

    store.randomize()

    expect(store.$store.commit).toBeCalledWith('SET_MEAL_AT_DAY_AND_TIME', { day: 'mon', time: 'breakfast', meal: meals[0] })
    expect(store.$store.commit).toBeCalledWith('SET_MEAL_AT_DAY_AND_TIME', { day: 'mon', time: 'lunch', meal: meals[1] })
    expect(store.$store.commit).toBeCalledWith('SET_MEAL_AT_DAY_AND_TIME', { day: 'tue', time: 'dinner', meal: meals[0] })
    expect(store.$store.commit).toBeCalledWith('SET_MEAL_AT_DAY_AND_TIME', { day: 'tue', time: 'breakfast', meal: meals[1] })
    expect(store.$store.commit).toBeCalledWith('SET_MEAL_AT_DAY_AND_TIME', { day: 'wed', time: 'lunch', meal: meals[0] })
    expect(store.$store.commit).toBeCalledWith('SET_MEAL_AT_DAY_AND_TIME', { day: 'wed', time: 'dinner', meal: meals[1] })
    expect(store.$store.commit).toBeCalledWith('SET_MEAL_AT_DAY_AND_TIME', { day: 'thu', time: 'breakfast', meal: meals[0] })
    expect(store.$store.commit).toBeCalledWith('SET_MEAL_AT_DAY_AND_TIME', { day: 'thu', time: 'lunch', meal: meals[1] })
    expect(store.$store.commit).toBeCalledWith('SET_MEAL_AT_DAY_AND_TIME', { day: 'fri', time: 'dinner', meal: meals[0] })
    expect(store.$store.commit).toBeCalledWith('SET_MEAL_AT_DAY_AND_TIME', { day: 'fri', time: 'breakfast', meal: meals[1] })
    expect(store.$store.commit).toBeCalledWith('SET_MEAL_AT_DAY_AND_TIME', { day: 'sat', time: 'lunch', meal: meals[0] })
    expect(store.$store.commit).toBeCalledWith('SET_MEAL_AT_DAY_AND_TIME', { day: 'sat', time: 'dinner', meal: meals[1] })
    expect(store.$store.commit).toBeCalledWith('SET_MEAL_AT_DAY_AND_TIME', { day: 'sun', time: 'breakfast', meal: meals[0] })
    expect(store.$store.commit).toBeCalledWith('SET_MEAL_AT_DAY_AND_TIME', { day: 'sun', time: 'lunch', meal: meals[1] })
  })

  test('groceryList is empty if no meal is set', () => {
    const store = new MealplanStore()

    expect(store.groceryList).toEqual([])
  })

  test('Creates a consolidated groceryList', () => {
    const ingredietA = new Ingredient('A', 'a', IngredientCategory.deli)
    const ingredietB = new Ingredient('B', 'b', IngredientCategory.deli)
    const ingredietC = new Ingredient('C', 'c', IngredientCategory.breadAndBakery)
    const ingredietD = new Ingredient('D', 'd', IngredientCategory.uncategorized)

    const mealA = new Meal('A', '', [], [
      new MealIngredient(ingredietA, 100)
    ], '')

    const mealB = new Meal('B', '', [], [
      new MealIngredient(ingredietB, 100)
    ], '')

    const mealC = new Meal('C', '', [], [
      new MealIngredient(ingredietA, 100),
      new MealIngredient(ingredietC, 100)
    ], '')

    const mealD = new Meal('D', '', [], [
      new MealIngredient(ingredietD, 100)
    ], '')

    const mealPlan = new Mealplan(
      new Dayplan<Meal | null>(mealA, mealB, mealC),
      new Dayplan<Meal | null>(mealA, mealB, mealC),
      new Dayplan<Meal | null>(mealD, mealD, mealD),
      new Dayplan<Meal | null>(null, null, null),
      new Dayplan<Meal | null>(null, null, null),
      new Dayplan<Meal | null>(null, null, null),
      new Dayplan<Meal | null>(null, null, null)
    )

    const store = new MealplanStore()
    store.mealPlan = mealPlan
    store.ingredients = [ingredietA, ingredietB, ingredietC, ingredietD]
    store.meals = [mealA, mealB, mealC, mealD]

    expect(store.groceryList).toEqual([{
      name: 'A',
      amount: '400 a',
      meals: ['A', 'C'],
      category: 'deli'
    },
    { name: 'B', amount: '200 b', meals: ['B'], category: 'deli' },
    {
      name: 'C',
      amount: '200 c',
      meals: ['C'],
      category: 'breadAndBakery'
    },
    {
      name: 'D',
      amount: '300 d',
      meals: ['D'],
      category: 'uncategorized'
    }])
  })

  test('Creates an empty grocery list if all meals do not have any ingredients', () => {
    const ingredietA = new Ingredient('A', 'a', IngredientCategory.deli)
    const ingredietB = new Ingredient('B', 'b', IngredientCategory.deli)
    const ingredietC = new Ingredient('C', 'c', IngredientCategory.breadAndBakery)
    const ingredietD = new Ingredient('D', 'd', IngredientCategory.uncategorized)

    const mealA = new Meal('A', '', [], [], '')
    const mealB = new Meal('B', '', [], [], '')
    const mealC = new Meal('C', '', [], [], '')
    const mealD = new Meal('D', '', [], [], '')

    const mealPlan = new Mealplan(
      new Dayplan<Meal | null>(mealA, mealB, mealC),
      new Dayplan<Meal | null>(mealA, mealB, mealC),
      new Dayplan<Meal | null>(mealD, mealD, mealD),
      new Dayplan<Meal | null>(null, null, null),
      new Dayplan<Meal | null>(null, null, null),
      new Dayplan<Meal | null>(null, null, null),
      new Dayplan<Meal | null>(null, null, null)
    )

    const store = new MealplanStore()
    store.mealPlan = mealPlan
    store.ingredients = [ingredietA, ingredietB, ingredietC, ingredietD]
    store.meals = [mealA, mealB, mealC, mealD]

    expect(store.groceryList).toEqual([])
  })

  test('serializable returns a serializable instance', () => {
    const tags = [new Tag('Tag A', new Color(0, 0, 0), '')]
    const meals = [new Meal('Some meal', '', [], [], '')]
    const ingredients = [new Ingredient('Some ingredient', 'some unit', IngredientCategory.deli)]
    const mealPlan = new Mealplan(
      new Dayplan<Meal|null>(meals[0], null, meals[0]),
      new Dayplan<Meal|null>(null, meals[0], null),
      new Dayplan<Meal|null>(meals[0], null, meals[0]),
      new Dayplan<Meal|null>(null, meals[0], null),
      new Dayplan<Meal|null>(meals[0], null, meals[0]),
      new Dayplan<Meal|null>(null, meals[0], null),
      new Dayplan<Meal|null>(meals[0], null, meals[0])
    )
    const allowedTags = new AllowedTags(
      new Dayplan<Tag[]>(tags, [], tags),
      new Dayplan<Tag[]>([], tags, []),
      new Dayplan<Tag[]>(tags, [], tags),
      new Dayplan<Tag[]>([], tags, []),
      new Dayplan<Tag[]>(tags, [], tags),
      new Dayplan<Tag[]>([], tags, []),
      new Dayplan<Tag[]>(tags, [], tags)
    )

    const serializableMealPlan = new SerializableMealplanSettings(mealPlan, allowedTags, meals, ingredients, tags)

    const store = new MealplanStore()
    store.meals = meals
    store.tags = tags
    store.ingredients = ingredients
    store.mealPlan = mealPlan
    store.allowedTagsInRandom = allowedTags

    expect(store.serializable).toEqual(serializableMealPlan)
  })
})
