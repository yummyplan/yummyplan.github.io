import { Component } from 'vue-property-decorator'
import { Meal } from '~/model/meal/Meal'
import SearchableList from '~/components/SearchableList/SearchableList.vue'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
@Component
export default class SearchableMealList extends SearchableList<Meal> {
  /**
   * Search meals by tag or title
   * @param term
   */
  getFilterPredicate (term: string): (items: Meal) => boolean {
    const orTerms = term.split(',').map(s => s.trim())

    return (m: Meal): boolean => {
      return orTerms.some((t: string) => {
        const andTerms = t.split('&').map(s => s.trim())

        return andTerms.every(t => m.doesMatch(t))
      })
    }
  }
}
