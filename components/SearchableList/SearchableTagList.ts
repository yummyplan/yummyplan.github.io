import { Component } from 'vue-property-decorator'
import SearchableList from '~/components/SearchableList/SearchableList.vue'
import { Tag } from '~/model/tag/Tag'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
@Component
export default class SearchableTagList extends SearchableList<Tag> {
  /**
   * Search meals by tag or title
   * @param term
   */
  getFilterPredicate (term: string): (items: Tag) => boolean {
    const orTerms = term.split(',').map(s => s.trim())

    return (tag: Tag): boolean => {
      return orTerms.some((t: string) => {
        const andTerms = t.split('&').map(s => s.trim())

        return andTerms.every(t => tag.name.toLowerCase().includes(t.toLowerCase()))
      })
    }
  }
}
