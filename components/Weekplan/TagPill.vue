<template>
  <div class="px-3 py-1 rounded-full inline-block" :style="style">
    <span class="tag-icon font-nanum">
      {{ tag.icon }}
    </span>
    <template v-if="showName">
      <span class="text-xs">
        {{ tag.name }}
      </span>
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Tag } from '~/model/tag/Tag'

@Component
export default class TagPill extends Vue {
  @Prop() readonly tag!: Tag
  @Prop() readonly showName!: boolean

  get style (): string {
    return `background-color: ${this.tag.color.rgb};`
  }
}
</script>

<style scoped>
.tag-icon {
  text-shadow: 1px 1px 2px black;
}
</style>
