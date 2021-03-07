<template>
  <div>
    <div class="flex-0">
      <label class="mb-2" for="search">
        <span class="font-bold">{{ $t('search.title') }}</span>
        <span class="text-xs">({{ $t('search.hint') }})</span>
      </label>

      <div class="relative mb-2">
        <input
          id="search"
          v-model="searchTerm"
          type="text"
          class="p-2 bg-transparent focus:bg-yellow-200 border-b-2 border-black outline-none w-full"
        >

        <font-awesome-icon v-if="searchTerm && searchTerm.length > 0" :icon="['fas', 'times']" class="right-0 top-0.5 absolute cursor-pointer delete-icon" @click="searchTerm = ''" />
      </div>

      <p class="text-xs mb-2">
        {{ $t('search.showingXofY', { x: displayableItems ? displayableItems.length : 0, y: items.length }) }}
      </p>
    </div>

    <slot :items="displayableItems" />
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Provide } from 'vue-property-decorator'

export default class SearchableList<T> extends Vue {
  @Prop({ default: [] }) items!: T[]
  @Provide() searchTerm = ''

  /**
   * Returns a filter predicate
   */
  /* istanbul ignore next */
  getFilterPredicate (_: string): (items: T) => boolean {
    throw new Error('Not implemented')
  }

  /**
   * All items, filtered by a given predicate
   */
  /* istanbul ignore next */
  get displayableItems (): T[] {
    // TODO: Find a way to reliably test this.
    return this.items.filter(this.getFilterPredicate(this.searchTerm))
  }
}
</script>

<style scoped>
.delete-icon {
  top: 50%;
  transform: translateY(-50%);
  right: 8px;
}
</style>
