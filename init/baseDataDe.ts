// Collected from https://www.bbcgoodfood.com/recipes/category/all-everyday

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
  vegerarian: new Tag('Vegetarisch', colors.yellow, '🥕'),
  vegan: new Tag('Vegan', colors.green, '🥗'),
  fast: new Tag('Schnell', colors.red, '🚀'),
  breakfast: new Tag('Frühstück', colors.blue, '🍳'),
  lunch: new Tag('Mittagessen', colors.indigo, '🍱'),
  dinner: new Tag('Abendessen', colors.purple, '🥘'),
  longLife: new Tag('Lange haltbar', colors.pink, '🥫'),
  noCooking: new Tag('Kein kochen', colors.yellow, '😀')
}

/**
 * Ingredients used in the recipes
 */
const ings = {
  eggs: new Ingredient('Eier', 'St.', IngredientCategory.dairyAndEggs),
  bacon: new Ingredient('Speck', 'g', IngredientCategory.meat),
  bread: new Ingredient('Brot', 'St.', IngredientCategory.breadAndBakery),
  cereal: new Ingredient('Frühstücksflocken', 'g', IngredientCategory.cereal),
  milk: new Ingredient('Milch', 'ml', IngredientCategory.dairyAndEggs),
  seasonalFruits: new Ingredient('Saisonale Früchte', 'g', IngredientCategory.fruits),
  coldCuts: new Ingredient('Aufschnitt (Fleisch)', 'g', IngredientCategory.meat),
  cutCheese: new Ingredient('Käse', 'g', IngredientCategory.dairyAndEggs),
  butter: new Ingredient('Butter', 'g', IngredientCategory.dairyAndEggs),
  salad: new Ingredient('Salat', 'g', IngredientCategory.vegetables),
  seasonalVeggies: new Ingredient('Saisonales Gemüse', 'g', IngredientCategory.vegetables),
  spaghetti: new Ingredient('Spaghetti', 'grams', IngredientCategory.pastaAndRice),
  gratedCheese: new Ingredient('Geriebener Käse', 'g', IngredientCategory.dairyAndEggs),
  onions: new Ingredient('Zwiebeln', 'St.', IngredientCategory.vegetables),
  flour: new Ingredient('Mehl', 'g', IngredientCategory.bakingSupplies),
  tomatoPaste: new Ingredient('Tomatenmark', 'g', IngredientCategory.condimentsAndSpices),
  tomatoes: new Ingredient('Tomaten', 'g', IngredientCategory.vegetables),
  chicken: new Ingredient('Hühnchen', 'g', IngredientCategory.meat),
  pizzaDough: new Ingredient('Pizzateig', 'St.', IngredientCategory.breadAndBakery),
  pizzaSauce: new Ingredient('Pizzasauce', 'ml', IngredientCategory.saucesAndOil),
  mozzarella: new Ingredient('Mozzarella', 'g', IngredientCategory.dairyAndEggs)
}

/**
 * Some standard meals
 */
const meals = [
  // Breakfasts
  new Meal('Eier und Speck mit Brot', '', [tags.breakfast, tags.fast, tags.longLife], [
    new MealIngredient(ings.eggs, 4),
    new MealIngredient(ings.bacon, 150),
    new MealIngredient(ings.bread, 4)
  ], ''),
  new Meal('Belegte Brötchen', '', [tags.breakfast, tags.lunch, tags.dinner, tags.fast, tags.longLife], [
    new MealIngredient(ings.bread, 4),
    new MealIngredient(ings.butter, 30),
    new MealIngredient(ings.coldCuts, 80),
    new MealIngredient(ings.cutCheese, 50)
  ], ''),
  new Meal('Frühstücksflocken mit Milch', '', [tags.breakfast, tags.fast, tags.longLife, tags.vegerarian], [
    new MealIngredient(ings.cereal, 35),
    new MealIngredient(ings.milk, 150)
  ], ''),
  new Meal('Rührei', '', [tags.breakfast, tags.lunch, tags.fast, tags.longLife, tags.vegerarian], [
    new MealIngredient(ings.eggs, 4)
  ], ''),
  new Meal('Früchte', '', [tags.breakfast, tags.fast, tags.vegan], [
    new MealIngredient(ings.seasonalFruits, 120)
  ], ''),
  new Meal('Früchte mit Müsli', '', [tags.breakfast, tags.fast, tags.vegan], [
    new MealIngredient(ings.cereal, 35),
    new MealIngredient(ings.seasonalFruits, 120)
  ], ''),

  // Lunches and dinners
  new Meal('Gemischter Salat', '', [tags.lunch, tags.dinner, tags.vegan], [
    new MealIngredient(ings.salad, 200),
    new MealIngredient(ings.seasonalVeggies, 100)
  ], ''),
  new Meal('Spaghetti mit Tomatensauce', '', [tags.lunch, tags.dinner, tags.vegerarian, tags.longLife], [
    new MealIngredient(ings.spaghetti, 65),
    new MealIngredient(ings.tomatoes, 100),
    new MealIngredient(ings.tomatoPaste, 30),
    new MealIngredient(ings.flour, 15),
    new MealIngredient(ings.butter, 30),
    new MealIngredient(ings.onions, 1),
    new MealIngredient(ings.gratedCheese, 50)
  ], ''),
  new Meal('Gebratenes Hühnchen mit Gemüse', '', [tags.lunch, tags.dinner], [
    new MealIngredient(ings.chicken, 240),
    new MealIngredient(ings.seasonalVeggies, 300)
  ], ''),
  new Meal('Gemüsepizza', '', [tags.lunch, tags.dinner, tags.vegerarian], [
    new MealIngredient(ings.pizzaDough, 1),
    new MealIngredient(ings.pizzaSauce, 50),
    new MealIngredient(ings.mozzarella, 120),
    new MealIngredient(ings.seasonalVeggies, 120)
  ], ''),
  new Meal('Reste', '', [tags.lunch, tags.dinner, tags.fast, tags.noCooking], [], 'Aufessen, was im Kühlschrank ist'),
  new Meal('Liefern/Takeaway', '', [tags.lunch, tags.dinner, tags.fast, tags.noCooking], [], 'Lieblingsessen bestellen oder holen')
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
