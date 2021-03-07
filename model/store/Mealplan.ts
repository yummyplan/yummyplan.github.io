import 'reflect-metadata'
import { Serializable } from 'typescript-json-serializer'
import { Weekplan } from '~/model/store/Weekplan'
import { Meal } from '~/model/meal/Meal'

/**
 * The entire week.
 */
@Serializable()
export class Mealplan extends Weekplan<Meal | null> {
  get allMeals (): Meal[] {
    return [
      this.mon.breakfast,
      this.mon.lunch,
      this.mon.dinner,
      this.tue.breakfast,
      this.tue.lunch,
      this.tue.dinner,
      this.wed.breakfast,
      this.wed.lunch,
      this.wed.dinner,
      this.thu.breakfast,
      this.thu.lunch,
      this.thu.dinner,
      this.fri.breakfast,
      this.fri.lunch,
      this.fri.dinner,
      this.sat.breakfast,
      this.sat.lunch,
      this.sat.dinner,
      this.sun.breakfast,
      this.sun.lunch,
      this.sun.dinner
    ].filter(Boolean) as Meal[]
  }
}
