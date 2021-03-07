import 'reflect-metadata'
import { Serializable, JsonProperty } from 'typescript-json-serializer'
import { Ingredient } from '~/model/meal/Ingredient'

@Serializable()
export class MealIngredient {
  @JsonProperty() ingredient: Ingredient
  @JsonProperty() amount: number

  constructor (ingredient: Ingredient, amount: number) {
    this.ingredient = ingredient
    this.amount = amount
  }
}
