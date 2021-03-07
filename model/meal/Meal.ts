import 'reflect-metadata'
import { Serializable, JsonProperty } from 'typescript-json-serializer'
import { Tag } from '~/model/tag/Tag'
import { MealIngredient } from '~/model/meal/MealIngredient'

@Serializable()
export class Meal {
  @JsonProperty() title: string
  @JsonProperty() url: string
  @JsonProperty({ type: Tag }) tags: Tag[]
  @JsonProperty({ type: MealIngredient }) ingredients: MealIngredient[]
  @JsonProperty() notes: string

  constructor (title: string, url: string, tags: Tag[], ingredients: MealIngredient[], notes: string) {
    this.title = title
    this.url = url
    this.tags = tags
    this.ingredients = ingredients
    this.notes = notes
  }

  /**
   * If the meal's title matches a given search term.
   * @param searchTerm
   */
  doesMatch (searchTerm: string): boolean {
    const lowerSearchTerm = searchTerm.toLowerCase()

    return this.title.toLowerCase().includes(lowerSearchTerm) || this.tags.some((t: Tag) => t.name.toLowerCase().includes(lowerSearchTerm))
  }

  /**
   * If a meal has a given tag.
   * @param tag
   */
  hasTag (tag: Tag): boolean {
    return this.tags.some(t => tag.name === t.name)
  }
}
