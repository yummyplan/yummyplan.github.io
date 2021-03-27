<template>
  <div class="meal-ingredient-editor">
    <f-button class="w-full mb-2" @click="addIngredient">
      <font-awesome-icon :icon="['fas', 'cart-plus']" class="mr-4" />
      {{ $t('meals.edit.addIngredient') }}
    </f-button>

    <ul>
      <li v-for="(mealIngredient, index) in innerValue" :key="mealIngredient.ingredient.name + index" class="flex items-center shadow-lg mb-4 p-1 bg-gray-100">
        <button :aria-label="$t('meals.edit.removeIngredient')" class="text-xl px-4 py-3" @click="removeIngredient(index)">
          <font-awesome-icon :icon="['fas', 'times']" />
        </button>
        <input
          :id="`${mealIngredient.ingredient.name}_${index}_amount`"
          :value="mealIngredient.amount"
          type="number"
          class="p-2 bg-transparent focus:bg-yellow-200 border-b-2 border-black outline-none flex-1 amount-input"
          @input="e => updateAmount(index, e)"
        >
        <span class="mr-4">
          {{ mealIngredient.ingredient.unit }}
        </span>
        <model-select
          class="search-select"
          :value="JSON.stringify(mealIngredient.ingredient)"
          :options="sortedIngredientsOptions"
          @input="e => updateIngredient(index, e)"
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide, Prop } from 'vue-property-decorator'
import { deserialize } from 'typescript-json-serializer'
import { ModelSelect } from 'vue-search-select'
import { MealIngredient } from '~/model/meal/MealIngredient'
import { Ingredient } from '~/model/meal/Ingredient'
import FButton from '~/components/FButton.vue'
import { IngredientCategory } from '~/model/meal/IngredientCategory'

@Component({
  components: { FButton, ModelSelect }
})
export default class IngredientEditor extends Vue {
  @Prop({ required: true }) readonly value!: MealIngredient[]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Provide() innerValue: MealIngredient[] = this.createDeepCopy(this.value)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Provide() ingredients: Ingredient[] = this.$store.state.ingredients

  /**
   * All ingredients, sorted alphabetically.
   */
  get sortedIngredients (): Ingredient[] {
    return [...this.ingredients].sort((a: Ingredient, b: Ingredient): number => {
      const textA = a.name.toUpperCase()
      const textB = b.name.toUpperCase()

      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
    })
  }

  /**
   * Sorted ingredients as a list for vue-search-select.
   */
  get sortedIngredientsOptions (): { value: string, text: string }[] {
    return this.sortedIngredients.map((i: Ingredient) => ({
      value: JSON.stringify(i),
      text: i.name
    }))
  }

  /**
   * Set a new ingredient
   * @param index Index of the meal ingredient
   * @param value
   */
  updateIngredient (index: number, value: string): void {
    const parsedValue: { name: string, unit: string, category: string } = JSON.parse(value)

    // Make the JSON an Ingredient again
    this.innerValue[index].ingredient = new Ingredient(parsedValue.name, parsedValue.unit, parsedValue.category as IngredientCategory)
    this.emitChange()
  }

  /**
   * Change the amount of an ingredient
   * @param index
   * @param e
   */
  updateAmount (index: number, e: { target: { value: string } }): void {
    this.innerValue[index].amount = parseFloat(e.target.value)
    this.emitChange()
  }

  /**
   * Removes a single ingredient
   * @param index
   */
  removeIngredient (index: number): void {
    this.innerValue.splice(index, 1)
    this.emitChange()
  }

  /**
   * Add a new ingredient
   */
  addIngredient (): void {
    this.innerValue = [
      new MealIngredient(
        this.ingredients[0],
        0
      ),
      ...this.innerValue
    ]

    this.emitChange()
  }

  /**
   * Emits a copy of the changed list in order to avoid vuex binding it.
   */
  emitChange (): void {
    this.$emit('input', this.createDeepCopy(this.innerValue))
  }

  /**
   * Creates a deep copy of a given list of MealIngredients
   * @param items
   */
  createDeepCopy (items: MealIngredient[]): MealIngredient[] {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return JSON.parse(JSON.stringify(items)).map((el: Object) => deserialize<MealIngredient>(el, MealIngredient))
  }
}
</script>

<style scoped>
.amount-input {
  max-width: 60px;
}
</style>
