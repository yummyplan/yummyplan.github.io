import 'reflect-metadata'
import { Serializable, JsonProperty } from 'typescript-json-serializer'
import { Dayplan } from '~/model/store/Dayplan'
import { DayplanType } from '~/model/store/DayplanType'

/**
 * For object keying
 */
export type WeekdaysType = 'mon'|'tue'|'wed'|'thu'|'fri'|'sat'|'sun'

/**
 * For typehinting
 */
export type WeekplanType<T> = { [key in WeekdaysType]: DayplanType<T> }

/**
 * Represents an entire week worth of Dayplans.
 */
@Serializable()
export class Weekplan<T> implements WeekplanType<T> {
  @JsonProperty({ type: Dayplan }) mon: DayplanType<T>
  @JsonProperty({ type: Dayplan }) tue: DayplanType<T>
  @JsonProperty({ type: Dayplan }) wed: DayplanType<T>
  @JsonProperty({ type: Dayplan }) thu: DayplanType<T>
  @JsonProperty({ type: Dayplan }) fri: DayplanType<T>
  @JsonProperty({ type: Dayplan }) sat: DayplanType<T>
  @JsonProperty({ type: Dayplan }) sun: DayplanType<T>

  constructor (
    mon: DayplanType<T>,
    tue: DayplanType<T>,
    wed: DayplanType<T>,
    thu: DayplanType<T>,
    fri: DayplanType<T>,
    sat: DayplanType<T>,
    sun: DayplanType<T>
  ) {
    this.mon = mon
    this.tue = tue
    this.wed = wed
    this.thu = thu
    this.fri = fri
    this.sat = sat
    this.sun = sun
  }
}
