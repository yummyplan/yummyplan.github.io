import { DayTimesType } from '~/model/store/Dayplan'

/**
 * For auto complete
 */
export type DayplanType<T> = { [key in DayTimesType]: T }
