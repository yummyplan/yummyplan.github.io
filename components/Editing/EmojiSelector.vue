<template>
  <emoji-picker :search="search" class="emoji-selector" @emoji="selectEmoji">
    <div slot="emoji-invoker" slot-scope="{ events }" class="emoji-invoker" v-on="events">
      <div class="flex">
        <div class="border-2 border-black text-2xl mr-4 px-2 emoji-selector-value" :style="`background-color: ${color.rgb}`">
          {{ value }}
        </div>

        <f-button class="emoji-selector-open-trigger">
          <font-awesome-icon :icon="['fas', 'icons']" class="mr-4" />
          {{ $t('emoji.open') }}
        </f-button>
      </div>
    </div>
    <div slot="emoji-picker" slot-scope="{ emojis, insert }" class="emoji-picker p-3 m-6 shadow-lg border border-gray-200">
      <div>
        <div>
          <input v-model="search" type="text" class="p-2 bg-transparent focus:bg-yellow-200 border-b-2 border-black outline-none w-full">
        </div>
        <div>
          <div v-for="(emojiGroup, category) in emojis" :key="category" class="emoji-category">
            <h5 class="pb-2 pt-4 font-bold">
              {{ $t(`emoji.${category.toLowerCase().replace(' ', '')}`) }}
            </h5>
            <div class="flex flex-wrap justify-between">
              <span
                v-for="(emoji, emojiName) in emojiGroup"
                :key="emojiName"
                :title="emojiName"
                class="cursor-pointer p-2 text-lg"
                @click="insert(emoji)"
              >
                {{ emoji }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </emoji-picker>
</template>

<script lang="ts">
import { Vue, Component, Prop, Provide } from 'vue-property-decorator'
import EmojiPicker from 'vue-emoji-picker'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import FButton from '~/components/FButton.vue'
import { Color } from '~/model/tag/Color'

@Component({
  components: { FButton, EmojiPicker, FontAwesomeIcon }
})
export default class EmojiSelector extends Vue {
  @Prop() value!: string
  @Prop() color!: Color

  @Provide() search = ''

  /**
   * Emits the newly selected emoji
   * @param emoji
   */
  selectEmoji (emoji: string): void {
    this.$emit('input', emoji)
  }
}
</script>

<style scoped>
.emoji-picker {
  max-height: 300px;
  width: 300px;
  max-width: 300px;
  overflow: auto;
}
</style>
