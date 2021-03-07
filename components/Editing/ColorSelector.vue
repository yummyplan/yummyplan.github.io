<template>
  <div>
    <input type="color" :value="value.hex" @input="setColor">
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import EmojiPicker from 'vue-emoji-picker'
import FButton from '~/components/FButton.vue'
import { Color } from '~/model/tag/Color'

@Component({
  components: { FButton, EmojiPicker }
})
export default class ColorSelector extends Vue {
  @Prop() value!: Color

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setColor (e: { target: { value: string } }): void {
    const value = e.target.value

    this.$emit('input', new Color(
      parseInt(value.slice(1, 3), 16),
      parseInt(value.slice(3, 5), 16),
      parseInt(value.slice(5, 7), 16)
    ))
  }
}
</script>
