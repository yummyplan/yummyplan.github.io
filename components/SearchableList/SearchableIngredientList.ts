import { Component } from 'vue-property-decorator'
import SearchableList from '~/components/SearchableList/SearchableList.vue'
import { Ingredient } from '~/model/meal/Ingredient'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
@Component
export default class SearchableIngredientList extends SearchableList<Ingredient> {
  /**
   * Search meals by tag or title
   * @param term
   */
  getFilterPredicate (term: string): (items: Ingredient) => boolean {
    const orTerms = term.split(',').map(s => s.trim())

    return (i: Ingredient): boolean => {
      return orTerms.some((t: string) => {
        const andTerms = t.split('&').map(s => s.trim())

        return andTerms.every(t => i.name.toLowerCase().includes(t.toLowerCase()))
      })
    }
  }
}
