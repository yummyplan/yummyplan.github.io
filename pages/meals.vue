<template>
  <edit-page
    :create-new-entity-function="createNew"
    :delete-entity-function="deleteItem"
    :items="items"
    translation-key="meals"
  >
    <template #searchableList="{ editFunction: editFunction }">
      <searchable-meal-list v-slot="{ items: items }" :items="items">
        <ul>
          <li
            v-for="meal in items"
            :key="meal.title"
            class="transition-all duration-150 ease-in-out mb-4 p-3 bg-white hover:bg-yellow-100 shadow-lg hover:shadow-xl cursor-pointer"
            @click="editFunction(meal)"
          >
            <span class="mr-4">
              {{ meal.title }}
            </span>

            <tag-pill v-for="tag in meal.tags" :key="`${tag.name}_${meal.title}`" :tag="tag" :show-name="false" class="mr-2" />
          </li>
        </ul>
      </searchable-meal-list>
    </template>

    <template #editModalForm="{ editingEntity: editingEntity }">
      <div v-if="editingEntity">
        <div class="mb-8">
          <label class="mb-2 font-bold" for="editTitle">
            {{ $t('meals.edit.title') }}
          </label>
          <input
            id="editTitle"
            v-model="editingEntity.title"
            type="text"
            class="p-2 bg-transparent focus:bg-yellow-200 border-b-2 border-black outline-none w-full"
          >
        </div>

        <div class="mb-8">
          <label class="mb-2 font-bold" for="editUrl">
            {{ $t('meals.edit.url') }}
          </label>
          <input
            id="editUrl"
            v-model="editingEntity.url"
            type="text"
            class="p-2 bg-transparent focus:bg-yellow-200 border-b-2 border-black outline-none w-full"
          >
        </div>

        <div class="mb-8">
          <label class="mb-2 font-bold" for="editNotes">
            {{ $t('meals.edit.notes') }}
          </label>
          <input
            id="editNotes"
            v-model="editingEntity.notes"
            type="text"
            class="p-2 bg-transparent focus:bg-yellow-200 border-b-2 border-black outline-none w-full"
          >
        </div>

        <div class="mb-8">
          <p class="mb-2 font-bold">
            {{ $t('meals.edit.tags') }}
          </p>

          <p class="mb-2">
            {{ $t('meals.edit.tagsHint') }}
          </p>

          <div class="pt-2 pl-2 mb-2 bg-yellow-200 border-b-2 border-black">
            <span class="mb-2 inline-block">
              {{ $t('meals.edit.assignedTags') }}
            </span>
            <draggable
              v-model="editingEntity.tags"
              :group="{ name: 'tag', put: true }"
            >
              <tag-pill v-for="tag in editingEntity.tags" :key="tag.name" :tag="tag" :show-name="true" class="mr-2 mb-2" />
            </draggable>
          </div>

          <span class="mb-2 inline-block">
            {{ $t('meals.edit.allTags') }}
          </span>
          <draggable
            :group="{ name: 'tag', pull: 'clone', put: true }"
            :list="[...tags]"
          >
            <tag-pill v-for="tag in tags" :key="tag.name" :tag="tag" :show-name="true" class="mr-2 mb-2" />
          </draggable>
        </div>

        <div class="mb-8">
          <p class="mb-2 font-bold">
            {{ $t('meals.edit.ingredients') }}
          </p>

          <meal-ingredient-editor v-model="editingEntity.ingredients" />
        </div>
      </div>
    </template>
  </edit-page>
</template>

<script lang="ts">
import { Vue, Component, Provide } from 'vue-property-decorator'
import SearchableMealList from '~/components/SearchableList/SearchableMealList'
import { Ingredient } from '~/model/meal/Ingredient'
import EditPage from '~/components/Editing/EditPage.vue'
import { Meal } from '~/model/meal/Meal'
import TagPill from '~/components/Weekplan/TagPill.vue'
import MealIngredientEditor from '~/components/Editing/MealIngredientEditor.vue'

@Component({
  components: { SearchableMealList, EditPage, TagPill, MealIngredientEditor },
  head (this: MealsPage) {
    return {
      title: this.$t('meals.title') as string
    }
  }
})
export default class MealsPage extends Vue {
  @Provide() tags = this.$store.state.tags

  /**
   * All ingredients
   */
  get items (): Ingredient[] {
    const handler = {
      get: (target: Meal[], index: number): Meal => {
        /* istanbul ignore if */
        if (typeof target[index] !== 'object' || target[index] === null) {
          return target[index]
        }

        return new Proxy(target[index], {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          get: (target: Meal, key: keyof Meal): any => {
            return target[key]
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          set: (meal: Meal, key: keyof Meal, value: any): boolean => {
            if (Array.isArray(value)) {
              value = [...new Set(value)]
            }

            this.$store.commit('UPDATE_MEAL_PROPERTY', {
              index,
              key,
              meal,
              value
            })

            return true
          }
        })
      }
    }

    return new Proxy(this.$store.state.meals, handler)
  }

  /**
   * Creates a new empty meal
   */
  createNew (): void {
    const meal = new Meal('', '', [], [], '')

    this.$store.commit('SET_MEAL', {
      index: this.items.length,
      meal
    })
  }

  /**
   * Deletes a single meal and closes the modal.
   * @param meal
   */
  deleteItem (meal: Meal): void {
    this.$store.commit('DELETE_MEAL', {
      meal
    })
  }
}
</script>
