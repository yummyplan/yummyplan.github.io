<template>
  <div class="p-3 bg-yellow-300 shadow-md">
    <p class="break-words">
      {{ hyphenatedTitle }}
    </p>

    <div>
      <tag-pill v-for="(tag, index) in meal.tags" :key="index" :tag="tag" :show-name="false" class="mr-2 mt-2" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Provide } from 'vue-property-decorator'
import { hyphenate as hyphenateDe } from 'hyphen/de'
import { hyphenate as hyphenateEn } from 'hyphen/en'
import { Meal } from '~/model/meal/Meal'
import TagPill from '~/components/Weekplan/TagPill.vue'

@Component({
  components: { TagPill }
})
export default class MealCard extends Vue {
  @Prop() readonly meal!: Meal

  @Provide() hyphenatedTitle = ''

  async mounted (): Promise<void> {
    let hyphenate = hyphenateEn
    if (this.$i18n.locale === 'de') {
      hyphenate = hyphenateDe
    }

    this.hyphenatedTitle = await hyphenate(this.meal.title)
  }
}
</script>
