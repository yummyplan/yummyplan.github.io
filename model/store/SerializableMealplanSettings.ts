import 'reflect-metadata'
import { Serializable, JsonProperty } from 'typescript-json-serializer'
import { Tag } from '~/model/tag/Tag'
import { Meal } from '~/model/meal/Meal'
import { Ingredient } from '~/model/meal/Ingredient'
import { Mealplan } from '~/model/store/Mealplan'
import { AllowedTags } from '~/model/store/AllowedTags'

export interface MealplanInterface {
  mealPlan: Mealplan
  allowedTagsInRandom: AllowedTags
  meals: Meal[]
  ingredients: Ingredient[]
  tags: Tag[]
}

@Serializable()
export class SerializableMealplanSettings implements MealplanInterface {
  @JsonProperty()
  mealPlan: Mealplan

  @JsonProperty()
  allowedTagsInRandom: AllowedTags

  @JsonProperty({ type: Meal })
  meals: Meal[]

  @JsonProperty({ type: Ingredient })
  ingredients: Ingredient[]

  @JsonProperty({ type: Tag })
  tags: Tag[]

  constructor (mealPlan: Mealplan, allowedTagsInRandom: AllowedTags, meals: Meal[], ingredients: Ingredient[], tags: Tag[]) {
    this.mealPlan = mealPlan
    this.allowedTagsInRandom = allowedTagsInRandom
    this.meals = meals
    this.ingredients = ingredients
    this.tags = tags
  }
}
