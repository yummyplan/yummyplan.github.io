import { IngredientCategory } from '~/model/meal/IngredientCategory'
<template>
  <edit-page
    :create-new-entity-function="createNew"
    :delete-entity-function="deleteItem"
    :items="items"
    translation-key="ingredients"
  >
    <template #searchableList="{ editFunction: editFunction }">
      <searchable-ingredient-list v-slot="{ items: items }" :items="items">
        <ul>
          <li
            v-for="(ingredient, key) in items"
            :key="key"
            class="transition-all duration-150 ease-in-out mb-4 p-3 bg-white hover:bg-yellow-100 shadow-lg hover:shadow-xl cursor-pointer"
            @click="editFunction(ingredient)"
          >
            <span class="font-bold mr-4">{{ ingredient.name }}</span> ({{ ingredient.unit }})
          </li>
        </ul>
      </searchable-ingredient-list>
    </template>

    <template #editModalForm="{ editingEntity: editingEntity }">
      <div v-if="editingEntity">
        <div class="mb-8">
          <label class="mb-2 font-bold" for="editTitle">
            {{ $t('ingredients.edit.name') }}
          </label>
          <input
            id="editTitle"
            v-model="editingEntity.name"
            type="text"
            class="p-2 bg-transparent focus:bg-yellow-200 border-b-2 border-black outline-none w-full"
          >
        </div>

        <div class="mb-8">
          <label class="mb-2 font-bold" for="editUrl">
            {{ $t('ingredients.edit.unit') }}
          </label>
          <input
            id="editUrl"
            v-model="editingEntity.unit"
            type="text"
            class="p-2 bg-transparent focus:bg-yellow-200 border-b-2 border-black outline-none w-full"
          >
        </div>

        <div class="mb-8">
          <label class="mb-2 font-bold" for="editCategory">
            {{ $t('ingredients.edit.category') }}
          </label>
          <select
            id="editCategory"
            v-model="editingEntity.category"
            class="border-b-2 border-black bg-transparent focus:bg-yellow-200 p-2 outline-none mr-4 flex-1 w-full"
          >
            <option
              v-for="(ingredient, ingredientIndex) in ingredientCategories"
              :key="`${ingredient}_select_${ingredientIndex}`"
              :value="ingredient"
            >
              {{ $t(`categories.${ingredient}`) }}
            </option>
          </select>
        </div>
      </div>
    </template>
  </edit-page>
</template>

<script lang="ts">
import { Component, Provide, Vue } from 'vue-property-decorator'
import SearchableIngredientList from '~/components/SearchableList/SearchableIngredientList'
import { Ingredient } from '~/model/meal/Ingredient'
import { IngredientCategory } from '~/model/meal/IngredientCategory'
import EditPage from '~/components/Editing/EditPage.vue'

@Component({
  components: { SearchableIngredientList, EditPage },
  head (this: IngredientsPage) {
    return {
      title: this.$t('ingredients.title') as string
    }
  }
})
export default class IngredientsPage extends Vue {
  @Provide() ingredientCategories = IngredientCategory

  /**
   * All ingredients
   */
  get items (): Ingredient[] {
    const handler = {
      get: (target: Ingredient[], index: number): Ingredient => {
        if (typeof target[index] !== 'object' || target[index] === null) {
          return target[index]
        }

        return new Proxy(target[index], {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          get: (target: Ingredient, key: keyof Ingredient): any => {
            return target[key]
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          set: (ingredient: Ingredient, key: keyof Ingredient, value: any): boolean => {
            this.$store.commit('UPDATE_INGREDIENT_PROPERTY', {
              ingredient,
              index,
              key,
              value
            })

            return true
          }
        })
      }
    }

    return new Proxy(this.$store.state.ingredients, handler)
  }

  /**
   * Creates a new empty meal
   */
  createNew (): void {
    const ingredient = new Ingredient('', '', IngredientCategory.uncategorized)

    this.$store.commit('SET_INGREDIENT', {
      index: this.items.length,
      ingredient
    })
  }

  /**
   * Deletes a single ingredient and closes the modal.
   * @param ingredient
   */
  deleteItem (ingredient: Ingredient): void {
    this.$store.commit('DELETE_INGREDIENT', {
      ingredient
    })
  }
}
</script>
