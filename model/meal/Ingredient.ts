import 'reflect-metadata'
import { Serializable, JsonProperty } from 'typescript-json-serializer'
import { IngredientCategory } from '~/model/meal/IngredientCategory'

@Serializable()
export class Ingredient {
  @JsonProperty() name: string
  @JsonProperty() unit: string
  @JsonProperty() category: IngredientCategory | null

  constructor (name: string, unit: string, category: IngredientCategory | null) {
    this.name = name
    this.unit = unit
    this.category = category
  }
}
