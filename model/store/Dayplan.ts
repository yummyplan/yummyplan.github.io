import 'reflect-metadata'
import { Serializable, JsonProperty, deserialize } from 'typescript-json-serializer'
import { Tag } from '~/model/tag/Tag'
import { Meal } from '~/model/meal/Meal'
import { DayplanType } from '~/model/store/DayplanType'

/**
 * For object keying.
 */
export type DayTimesType = 'breakfast'|'lunch'|'dinner'

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
export const deserializer = (value: any): any => {
  if (Array.isArray(value)) {
    return value.map(v => deserialize<Tag>(v, Tag))
  }

  return deserialize<Meal>(value, Meal)
}

@Serializable()
export class Dayplan<T> implements DayplanType<T> {
  @JsonProperty({
    afterDeserialize: deserializer
  })
  breakfast: T

  @JsonProperty({
    afterDeserialize: deserializer
  })
  lunch: T

  @JsonProperty({
    afterDeserialize: deserializer
  })
  dinner: T

  constructor (breakfast: T, lunch: T, dinner: T) {
    this.breakfast = breakfast
    this.lunch = lunch
    this.dinner = dinner
  }
}
