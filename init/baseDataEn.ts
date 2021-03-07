import { Tag } from '~/model/tag/Tag'
import { Color } from '~/model/tag/Color'
import { Ingredient } from '~/model/meal/Ingredient'
import { Meal } from '~/model/meal/Meal'
import { MealIngredient } from '~/model/meal/MealIngredient'
import { SerializableMealplanSettings } from '~/model/store/SerializableMealplanSettings'
import { Mealplan } from '~/model/store/Mealplan'
import { AllowedTags } from '~/model/store/AllowedTags'
import { Dayplan } from '~/model/store/Dayplan'
import { IngredientCategory } from '~/model/meal/IngredientCategory'

/**
 * Some standard colors for tags, taken from Tailwind's default
 */
const colors = {
  gray: new Color(209, 213, 219),
  red: new Color(252, 165, 165),
  yellow: new Color(252, 211, 77),
  green: new Color(110, 231, 183),
  blue: new Color(147, 197, 253),
  indigo: new Color(165, 180, 252),
  purple: new Color(196, 181, 253),
  pink: new Color(249, 168, 212)
}

/**
 * Some standard tags
 */
const tags = {
  vegerarian: new Tag('Vegetarian', colors.yellow, '🥕'),
  vegan: new Tag('Vegan', colors.green, '🥗'),
  fast: new Tag('Quick', colors.red, '🚀'),
  breakfast: new Tag('Breakfast', colors.blue, '🍳'),
  lunch: new Tag('Lunch', colors.indigo, '🍱'),
  dinner: new Tag('Dinner', colors.purple, '🥘'),
  longLife: new Tag('Long life', colors.pink, '🥫'),
  noCooking: new Tag('No cooking', colors.yellow, '😀')
}

/**
 * Ingredients used in the recipes
 */
const ings = {
  eggs: new Ingredient('Eggs', '', IngredientCategory.dairyAndEggs),
  bacon: new Ingredient('Bacon', 'grams', IngredientCategory.meat),
  bread: new Ingredient('Bread', 'pieces', IngredientCategory.breadAndBakery),
  cereal: new Ingredient('Cereal', 'grams', IngredientCategory.cereal),
  milk: new Ingredient('Milk', 'ml', IngredientCategory.dairyAndEggs),
  seasonalFruits: new Ingredient('Seasonal fruits', 'grams', IngredientCategory.fruits),
  coldCuts: new Ingredient('Cold cuts (meat)', 'grams', IngredientCategory.meat),
  cutCheese: new Ingredient('Cut cheese', 'grams', IngredientCategory.dairyAndEggs),
  butter: new Ingredient('Butter', 'grams', IngredientCategory.dairyAndEggs),
  salad: new Ingredient('Salad', 'grams', IngredientCategory.vegetables),
  seasonalVeggies: new Ingredient('Seasonal veggies', 'grams', IngredientCategory.vegetables),
  spaghetti: new Ingredient('Spaghetti', 'grams', IngredientCategory.pastaAndRice),
  gratedCheese: new Ingredient('Grated cheese', 'grams', IngredientCategory.dairyAndEggs),
  onions: new Ingredient('Onions', '', IngredientCategory.vegetables),
  flour: new Ingredient('Flour', 'grams', IngredientCategory.bakingSupplies),
  tomatoPaste: new Ingredient('Tomato paste', 'grams', IngredientCategory.condimentsAndSpices),
  tomatoes: new Ingredient('Tomatoes', 'grams', IngredientCategory.vegetables),
  chicken: new Ingredient('Chicken meat', 'grams', IngredientCategory.meat),
  pizzaDough: new Ingredient('Pizza doughs', '', IngredientCategory.breadAndBakery),
  pizzaSauce: new Ingredient('Pizza sauce', 'ml', IngredientCategory.saucesAndOil),
  mozzarella: new Ingredient('Mozzarella', 'grams', IngredientCategory.dairyAndEggs)
}

/**
 * Some standard meals
 */
const meals = [
  // Breakfasts
  new Meal('Bacon and eggs with bread', '', [tags.breakfast, tags.fast, tags.longLife], [
    new MealIngredient(ings.eggs, 4),
    new MealIngredient(ings.bacon, 150),
    new MealIngredient(ings.bread, 4)
  ], ''),
  new Meal('Sandwiches', '', [tags.breakfast, tags.lunch, tags.dinner, tags.fast, tags.longLife], [
    new MealIngredient(ings.bread, 4),
    new MealIngredient(ings.butter, 30),
    new MealIngredient(ings.coldCuts, 80),
    new MealIngredient(ings.cutCheese, 50)
  ], ''),
  new Meal('Cereal and milk', '', [tags.breakfast, tags.fast, tags.longLife, tags.vegerarian], [
    new MealIngredient(ings.cereal, 35),
    new MealIngredient(ings.milk, 150)
  ], ''),
  new Meal('Scrambled eggs', '', [tags.breakfast, tags.lunch, tags.fast, tags.longLife, tags.vegerarian], [
    new MealIngredient(ings.eggs, 4)
  ], ''),
  new Meal('Fruits', '', [tags.breakfast, tags.fast, tags.vegan], [
    new MealIngredient(ings.seasonalFruits, 120)
  ], ''),
  new Meal('Fruits with cereal', '', [tags.breakfast, tags.fast, tags.vegan], [
    new MealIngredient(ings.cereal, 35),
    new MealIngredient(ings.seasonalFruits, 120)
  ], ''),

  // Lunches and dinners
  new Meal('Mixed salad', '', [tags.lunch, tags.dinner, tags.vegan], [
    new MealIngredient(ings.salad, 200),
    new MealIngredient(ings.seasonalVeggies, 100)
  ], ''),
  new Meal('Spaghetti with tomato sauce', '', [tags.lunch, tags.dinner, tags.vegerarian, tags.longLife], [
    new MealIngredient(ings.spaghetti, 65),
    new MealIngredient(ings.tomatoes, 100),
    new MealIngredient(ings.tomatoPaste, 30),
    new MealIngredient(ings.flour, 15),
    new MealIngredient(ings.butter, 30),
    new MealIngredient(ings.onions, 1),
    new MealIngredient(ings.gratedCheese, 50)
  ], ''),
  new Meal('Fried chicken breast with veggies', '', [tags.lunch, tags.dinner], [
    new MealIngredient(ings.chicken, 240),
    new MealIngredient(ings.seasonalVeggies, 300)
  ], ''),
  new Meal('Veggie pizza', '', [tags.lunch, tags.dinner, tags.vegerarian], [
    new MealIngredient(ings.pizzaDough, 1),
    new MealIngredient(ings.pizzaSauce, 50),
    new MealIngredient(ings.mozzarella, 120),
    new MealIngredient(ings.seasonalVeggies, 120)
  ], ''),
  new Meal('Leftovers', '', [tags.lunch, tags.dinner, tags.fast, tags.noCooking], [], 'Use whatever is in the fridge'),
  new Meal('Takeout', '', [tags.lunch, tags.dinner, tags.fast, tags.noCooking], [], 'Order favorite food or grab at favorite restaurant')
]

/**
 * Empty meal plan
 */
const mealPlan = new Mealplan(
  new Dayplan<Meal | null>(null, null, null),
  new Dayplan<Meal | null>(null, null, null),
  new Dayplan<Meal | null>(null, null, null),
  new Dayplan<Meal | null>(null, null, null),
  new Dayplan<Meal | null>(null, null, null),
  new Dayplan<Meal | null>(null, null, null),
  new Dayplan<Meal | null>(null, null, null)
)

const tagsBreakfast = [tags.breakfast, tags.fast]
const tagsLunch = [tags.lunch, tags.noCooking]
const tagsDinner = [tags.dinner, tags.noCooking]

/**
 * Standard tag config
 */
const allowedTagsInRandom = new AllowedTags(
  new Dayplan<Tag[]>(tagsBreakfast, tagsLunch, tagsDinner),
  new Dayplan<Tag[]>(tagsBreakfast, tagsLunch, tagsDinner),
  new Dayplan<Tag[]>(tagsBreakfast, tagsLunch, tagsDinner),
  new Dayplan<Tag[]>(tagsBreakfast, tagsLunch, tagsDinner),
  new Dayplan<Tag[]>(tagsBreakfast, tagsLunch, tagsDinner),
  new Dayplan<Tag[]>(tagsBreakfast, tagsLunch, tagsDinner),
  new Dayplan<Tag[]>(tagsBreakfast, tagsLunch, tagsDinner)
)

export default new SerializableMealplanSettings(
  mealPlan,
  allowedTagsInRandom,
  meals,
  Object.values(ings),
  Object.values(tags)
)
