<template>
  <div>
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
        <select
          :id="`${mealIngredient.ingredient.name}_${index}_ingredient`"
          class="border-b-2 border-black bg-transparent focus:bg-yellow-200 p-2 outline-none mr-4 flex-1 w-full"
          @input="e => updateIngredient(index, e)"
        >
          <option
            v-for="(ingredient, ingredientIndex) in sortedIngredients"
            :key="`${ingredient.name}_select_${index}_${ingredientIndex}`"
            :selected="ingredient.name === mealIngredient.ingredient.name"
            :value="ingredientIndex"
          >
            {{ ingredient.name }}
          </option>
        </select>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide, Prop } from 'vue-property-decorator'
import { deserialize } from 'typescript-json-serializer'
import { MealIngredient } from '~/model/meal/MealIngredient'
import { Ingredient } from '~/model/meal/Ingredient'
import FButton from '~/components/FButton.vue'

@Component({
  components: { FButton }
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
    return this.ingredients.sort((a: Ingredient, b: Ingredient): number => {
      const textA = a.name.toUpperCase()
      const textB = b.name.toUpperCase()

      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
    })
  }

  /**
   * Set a new ingredient
   * @param index Index of the meal ingredient
   * @param e
   */
  updateIngredient (index: number, e: { target: { value: string } }): void {
    this.innerValue[index].ingredient = this.ingredients[parseInt(e.target.value)]
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
