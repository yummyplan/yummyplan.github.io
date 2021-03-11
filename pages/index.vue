<template>
  <div class="flex flex-wrap font-sans">
    <weekplan-table id="weekplan" class="w-full md:w-2/3 font-sans" :show-current-day="!downloading">
      <template #corner>
        <button v-if="!downloading" class="cursor-pointer" @click="deleteWeek()">
          <font-awesome-icon :icon="['fas', 'trash']" />
          <font-awesome-icon :icon="['fas', 'expand-arrows-alt']" />
        </button>
      </template>

      <template v-for="dayTime in dayTimes" #[dayTime]>
        <div v-if="!downloading" :key="dayTime" class="text-center">
          <button class="cursor-pointer" @click="deleteDayTime(dayTime)">
            <font-awesome-icon :icon="['fas', 'trash']" />
            <font-awesome-icon :icon="['fas', 'arrow-down']" />
          </button>
        </div>
      </template>

      <template v-for="day in days" #[day]>
        <span v-if="!downloading" :key="day" class="block text-center">
          <button class="cursor-pointer" @click="deleteDay(day)">
            <font-awesome-icon :icon="['fas', 'trash']" />
            <font-awesome-icon :icon="['fas', 'arrow-right']" />
          </button>
        </span>
      </template>

      <template v-for="key in dayTimeKeys" #[key]="{ dayKey, timeKey }">
        <div :key="key">
          <draggable
            :key="key"
            v-model="mealPlan[dayKey][timeKey]"
            :group="{ name: key, put: mealPlan[dayKey][timeKey].length === 0 }"
            :sort="false"
            :animation="120"
            ghost-class="ghost"
            @click.native="showDetailModal(mealPlan[dayKey][timeKey][0])"
          >
            <meal-card
              v-if="mealPlan[dayKey][timeKey].length > 0"
              class="m-2 inline-block font-sans"
              :meal="mealPlan[dayKey][timeKey][0]"
            />
          </draggable>
        </div>
      </template>
    </weekplan-table>

    <div class="w-full md:w-1/3 md:px-6 md:pr-0">
      <searchable-meal-list v-slot="{ items: meals }" class="flex flex-col h-full mt-4 md:mt-0" :items="$store.state.meals">
        <div class="mb-4 flex-1 md:overflow-y-auto order-3 md:order-2" style="flex-basis: 1px;">
          <draggable
            :list="meals"
            :group="{ name: 'tag', pull: 'clone', put: true }"
            ghost-class="ghost"
            @add="() => false"
          >
            <transition-group>
              <meal-card v-for="meal in meals" :key="meal.title" :meal="meal" class="mb-2 mr-2 inline-block" />
            </transition-group>
          </draggable>
        </div>

        <div class="flex-0 order-1 md:order-3 mb-4 md:mb-0">
          <f-button class="w-full mb-2" @click="randomize">
            <font-awesome-icon :icon="['fas', 'random']" class="mr-4" />
            {{ $t('plan.random') }}
          </f-button>

          <f-button class="w-full mb-4" @click="$refs.groceryListModal.show()">
            <font-awesome-icon :icon="['fas', 'shopping-basket']" class="mr-4" />
            {{ $t('plan.groceryList') }}
          </f-button>

          <div class="font-bold mb-2">
            {{ $t('plan.download') }}
          </div>

          <div class="flex">
            <div class="w-1/2 pr-2">
              <f-button class="w-full" @click="downloadWeekplanAsPdf()">
                <font-awesome-icon v-if="!downloading" :icon="['fas', 'file-pdf']" class="mr-4" />
                <font-awesome-icon v-else :icon="['fas', 'spinner']" class="mr-4 animate-spin" />
                {{ $t('plan.downloadPdf') }}
              </f-button>
            </div>

            <div class="w-1/2 pl-2">
              <f-button class="w-full" @click="downloadWeekplanAsPng()">
                <font-awesome-icon v-if="!downloading" :icon="['fas', 'file-image']" class="mr-4" />
                <font-awesome-icon v-else :icon="['fas', 'spinner']" class="mr-4 animate-spin" />
                {{ $t('plan.downloadPng') }}
              </f-button>
            </div>
          </div>
        </div>
      </searchable-meal-list>
    </div>

    <f-modal ref="groceryListModal">
      <div class="flex items-center">
        <h2 class="text-xl mb-4 flex-1">
          {{ $t('plan.groceryList') }}
        </h2>
        <f-button class="flex-0" @click="downloadGroceryListAsPdf">
          <font-awesome-icon v-if="!downloading" :icon="['fas', 'file-pdf']" class="mr-4" />
          <font-awesome-icon v-else :icon="['fas', 'spinner']" class="mr-4 animate-spin" />
          {{ $t('plan.downloadPdf') }}
        </f-button>
      </div>

      <section v-for="groceryItemCategory in Object.keys(categorizedGroceryList)" :key="groceryItemCategory">
        <h3
          v-if="categorizedGroceryList[groceryItemCategory].length > 0"
          class="font-bold text-lg mb-4 mt-6"
        >
          {{ $t(`categories.${groceryItemCategory}`) }}
        </h3>

        <ul v-if="categorizedGroceryList[groceryItemCategory].length > 0" class="list-disc">
          <li
            v-for="groceryItem in categorizedGroceryList[groceryItemCategory]"
            :key="groceryItem.name"
            class="ml-6 mb-2"
            :class="{
              'line-through': tickedOffGroceryItems.includes(groceryItem),
              'text-gray-600': tickedOffGroceryItems.includes(groceryItem),
            }"
          >
            <label :for="`grocery_item_${groceryItem.name}`" class="cursor-pointer">
              <input :id="`grocery_item_${groceryItem.name}`" type="checkbox" @change="toggleGroceryListItemTicked(groceryItem)">
              <span class="font-bold ml-4">{{ groceryItem.amount }}</span> {{ groceryItem.name }}
              <span class="text-xs ml-4">({{ groceryItem.meals.join(' / ') }})</span>
            </label>
          </li>
        </ul>
      </section>
    </f-modal>

    <f-modal v-if="mealDetail" ref="mealDetailModal" @close="mealDetail = null">
      <h2 class="text-xl mb-4">
        {{ mealDetail.title }}
      </h2>

      <tag-pill v-for="(tag, index) in mealDetail.tags" :key="index" :tag="tag" :show-name="true" class="mr-2 mt-2" />

      <p class="my-4">
        <a v-if="mealDetail.url" :href="mealDetail.url" class="text-yellow-700">
          {{ mealDetail.url }}
        </a>
      </p>

      <p v-if="mealDetail.notes" class="my-4">
        {{ mealDetail.notes }}
      </p>

      <h3 class="font-bold">
        {{ $t('plan.ingredients') }}
      </h3>

      <p v-if="mealDetail.ingredients.length === 0">
        {{ $t('plan.noIngredients') }}
      </p>
      <ul v-else class="list-disc ml-6 mb-2">
        <li v-for="(ingredient, key) in mealDetail.ingredients" :key="`ingredient${key}`">
          {{ ingredient.amount }} {{ ingredient.ingredient.unit }} {{ ingredient.ingredient.name }}
        </li>
      </ul>
    </f-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins, Provide } from 'vue-property-decorator'
import Draggable from 'vuedraggable'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { Meal } from '~/model/meal/Meal'
import MealCard from '~/components/Weekplan/MealCard.vue'
import FButton from '~/components/FButton.vue'
import FModal from '~/components/Modal/FModal.vue'
import TagPill from '~/components/Weekplan/TagPill.vue'
import { FModalInterface } from '~/types/modalInterface'
import { WeekdaysType } from '~/model/store/Weekplan'
import { DayTimesType } from '~/model/store/Dayplan'
import { Mealplan } from '~/model/store/Mealplan'
import WeekplanTable from '~/components/Weekplan/WeekplanTable.vue'
import SearchableMealList from '~/components/SearchableList/SearchableMealList.ts'
import { DayplanType } from '~/model/store/DayplanType'
import { IngredientCategory } from '~/model/meal/IngredientCategory'
import DownloadMixin from '~/mixins/DownloadMixin.ts'
import { GroceryListItem } from '~/model/groceryList/GroceryListItem'

@Component({
  components: { WeekplanTable, FModal, MealCard, FButton, TagPill, SearchableMealList, Draggable, FontAwesomeIcon },
  mixins: [DownloadMixin],
  head (this: Index) {
    return {
      title: this.$t('index.title') as string
    }
  }
})
export default class Index extends Mixins(DownloadMixin) {
  $refs!: {
    mealDetailModal: FModalInterface,
    groceryListModal: FModalInterface,
    helloModal: FModalInterface
  }

  @Provide() days: WeekdaysType[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  @Provide() dayTimes: DayTimesType[] = ['breakfast', 'lunch', 'dinner']

  @Provide() searchTerm = ''
  @Provide() meals = this.$store.state.meals
  @Provide() tags = this.$store.state.tags

  @Provide() mealDetail: Meal | null = null

  @Provide() downloading = false

  @Provide() tickedOffGroceryItems: GroceryListItem[] = []

  /**
   * Keys for weekday table slots.
   */
  get dayTimeKeys (): string[] {
    const keys: string[] = []
    this.dayTimes.forEach(timeKey => this.days.forEach((dayKey) => {
      keys.push(`${dayKey}/${timeKey}`)
    }))

    return keys
  }

  categorizeGroceryItems (items: GroceryListItem[]): { [key in IngredientCategory]: GroceryListItem[] } {
    const categorized: { [key in IngredientCategory]: GroceryListItem[] } = {
      uncategorized: [],
      fruits: [],
      vegetables: [],
      cannedFood: [],
      frozenGoods: [],
      meat: [],
      fish: [],
      deli: [],
      dairyAndEggs: [],
      condimentsAndSpices: [],
      saucesAndOil: [],
      snacks: [],
      breadAndBakery: [],
      beverages: [],
      pastaAndRice: [],
      cereal: [],
      bakingSupplies: []
    }

    items.forEach((item: GroceryListItem) => {
      categorized[item.category].push(item)
    })

    return categorized
  }

  /**
   * Grocery list by categories
   */
  get categorizedGroceryList (): { [key in IngredientCategory]: GroceryListItem[] } {
    return this.categorizeGroceryItems(this.$store.getters.groceryList)
  }

  get untickedCategorizedGroceryList (): { [key in IngredientCategory]: GroceryListItem[] } {
    const filteredGroceryList = this.$store.getters.groceryList.filter((item: GroceryListItem) => {
      return !this.tickedOffGroceryItems.includes(item)
    })

    return this.categorizeGroceryItems(filteredGroceryList)
  }

  /**
   * Returns a nested proxy for v-model setting.
   */
  get mealPlan (): Mealplan {
    const mealPlan = this.$store.state.mealPlan

    const handler = {
      get: (target: Mealplan, day: WeekdaysType): DayplanType<Meal | null> => {
        // istanbul ignore if
        if (typeof target[day] !== 'object' || target[day] === null) {
          return target[day]
        }

        return new Proxy(target[day], {
          set: (_: DayplanType<Meal | null>, time: DayTimesType, meals: Meal[]): boolean => {
            if (meals && meals.length > 0) {
              this.assign(day, time, meals[0])
            } else {
              this.unassign(day, time)
            }

            return true
          },
          get: (target: DayplanType<Meal | null>, time: DayTimesType): Meal[] => {
            return [target[time]].filter(Boolean) as Meal[]
          }
        })
      }
    }

    return new Proxy(mealPlan, handler)
  }

  /**
   * Deletes the menus of an entire day.
   * @param day
   */
  deleteDay (day: WeekdaysType): void {
    this.unassign(day, 'breakfast')
    this.unassign(day, 'lunch')
    this.unassign(day, 'dinner')
  }

  /**
   * Deletes all meals in a given time.
   */
  deleteDayTime (time: DayTimesType): void {
    this.unassign('mon', time)
    this.unassign('tue', time)
    this.unassign('wed', time)
    this.unassign('thu', time)
    this.unassign('fri', time)
    this.unassign('sat', time)
    this.unassign('sun', time)
  }

  deleteWeek (): void {
    this.deleteDay('mon')
    this.deleteDay('tue')
    this.deleteDay('wed')
    this.deleteDay('thu')
    this.deleteDay('fri')
    this.deleteDay('sat')
    this.deleteDay('sun')
  }

  /**
   * Assigns a meal to a day and time.
   * @param day
   * @param time
   * @param meal
   */
  assign (day: WeekdaysType, time: DayTimesType, meal: Meal): void {
    this.tickedOffGroceryItems = []

    this.$store.commit('SET_MEAL_AT_DAY_AND_TIME', {
      day,
      time,
      meal
    })
  }

  /**
   * Remove a meal from a day.
   * @param day
   * @param time
   */
  unassign (day: WeekdaysType, time: DayTimesType): void {
    this.tickedOffGroceryItems = []

    this.$store.commit('SET_MEAL_AT_DAY_AND_TIME', {
      day,
      time,
      meal: undefined
    })
  }

  /**
   * Shows the detail modal of a menu.
   * @param meal
   */
  showDetailModal (meal: Meal): void {
    this.mealDetail = meal
    this.$nextTick(() => {
      this.$refs.mealDetailModal.show()
    })
  }

  /**
   * Sets random meals to empty fields, respecting the allowed tags
   */
  randomize (): void {
    this.$store.dispatch('randomize')
    this.$nextTick(() => {
      this.$forceUpdate()
    })
  }

  /**
   * Downloads the weekplan as PDF
   */
  downloadWeekplanAsPdf (): Promise<void> /* istanbul ignore next */ {
    return this.downloadSelectorAsPdf('#weekplan', 'yummyplan')
  }

  downloadGroceryListAsPdf (): void {
    this.downloadCatgeorizedGroceryItemsAsPdf(this.untickedCategorizedGroceryList)
  }

  /**
   * Downloads the week plan as PNG
   */
  async downloadWeekplanAsPng (): Promise<void> /* istanbul ignore next */ {
    const { img } = await this.createPng('#weekplan')

    const download = document.createElement('a')
    download.href = img as string
    download.download = 'yummyplan.png'
    download.click()
  }

  /**
   * Toggles if an item on the grocery list is ticked off (either bought or available)
   * @param groceryItem
   */
  toggleGroceryListItemTicked (groceryItem: GroceryListItem): void {
    const index = this.tickedOffGroceryItems.indexOf(groceryItem)

    if (index !== -1) {
      this.tickedOffGroceryItems.splice(index, 1)
    } else {
      this.tickedOffGroceryItems.push(groceryItem)
    }
  }
}
</script>

<style>
.ghost-class {
  background: transparent;
}
</style>
