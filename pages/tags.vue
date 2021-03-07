<template>
  <edit-page
    :create-new-entity-function="createNew"
    :delete-entity-function="deleteItem"
    :items="items"
    translation-key="tags"
  >
    <template #searchableList="{ editFunction: editFunction }">
      <searchable-tag-list v-slot="{ items: items }" :items="items">
        <ul>
          <li
            v-for="(tag, key) in items"
            :key="key"
            class="mb-4"
            @click="editFunction(tag)"
          >
            <tag-pill :tag="tag" :show-name="true" class="cursor-pointer" />
          </li>
        </ul>
      </searchable-tag-list>
    </template>

    <template #editModalForm="{ editingEntity: editingEntity }">
      <div v-if="editingEntity">
        <div class="mb-8">
          <label class="mb-2 font-bold" for="editTitle">
            {{ $t('tags.edit.name') }}
          </label>
          <input
            id="editTitle"
            v-model="editingEntity.name"
            type="text"
            class="p-2 bg-transparent focus:bg-yellow-200 border-b-2 border-black outline-none w-full"
          >
        </div>

        <div class="mb-8">
          <label class="mb-2 font-bold">
            {{ $t('tags.edit.color') }}
          </label>

          <color-selector v-model="editingEntity.color" />
        </div>

        <div class="mb-8">
          <label class="mb-2 font-bold">
            {{ $t('tags.edit.icon') }}
          </label>

          <emoji-selector v-model="editingEntity.icon" :color="editingEntity.color" />
        </div>
      </div>
    </template>
  </edit-page>
</template>

<script lang="ts">
import { Vue, Component, Provide } from 'vue-property-decorator'
import SearchableTagList from '~/components/SearchableList/SearchableTagList'
import EditPage from '~/components/Editing/EditPage.vue'
import { Tag } from '~/model/tag/Tag'
import { Color } from '~/model/tag/Color'
import TagPill from '~/components/Weekplan/TagPill.vue'
import EmojiSelector from '~/components/Editing/EmojiSelector.vue'
import ColorSelector from '~/components/Editing/ColorSelector.vue'

@Component({
  components: { TagPill, SearchableTagList, EditPage, EmojiSelector, ColorSelector },
  head (this: TagsPage) {
    return {
      title: this.$t('tags.title') as string
    }
  }
})
export default class TagsPage extends Vue {
  @Provide() emojiSearch = ''

  /**
   * All ingredients
   */
  get items (): Tag[] {
    const handler = {
      get: (target: Tag[], index: number): Tag => {
        if (typeof target[index] !== 'object' || target[index] === null) {
          return target[index]
        }

        return new Proxy(target[index], {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          get: (target: Tag, key: keyof Tag): any => {
            return target[key]
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          set: (tag: Tag, key: keyof Tag, value: any): boolean => {
            this.$store.commit('UPDATE_TAG_PROPERTY', {
              tag,
              index,
              key,
              value
            })

            return true
          }
        })
      }
    }

    return new Proxy(this.$store.state.tags, handler)
  }

  /**
   * Creates a new empty tag
   */
  createNew (): void {
    const tag = new Tag('', new Color(255, 255, 255), '')

    this.$store.commit('SET_TAG', {
      index: this.items.length,
      tag
    })
  }

  /**
   * Deletes a single tag and closes the modal.
   * @param tag
   */
  deleteItem (tag: Tag): void {
    this.$store.commit('DELETE_TAG', {
      tag
    })
  }
}
</script>
