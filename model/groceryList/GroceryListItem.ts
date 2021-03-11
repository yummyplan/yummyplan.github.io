import { IngredientCategory } from '~/model/meal/IngredientCategory'

export class GroceryListItem {
  name: string
  amount: string
  meals: string[]
  category: IngredientCategory

  constructor (name: string, amount: string, meals: string[], category: IngredientCategory) {
    this.name = name
    this.amount = amount
    this.meals = meals
    this.category = category
  }
}
