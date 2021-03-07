<template>
  <transition name="fade">
    <div v-if="modalShowing" class="fixed h-full w-full top-0 left-0 right-0 bottom-0 z-40 flex flex-row items-center bg-opacity-50 bg-gray-700 backdrop-blur" @click="modalShowing = false">
      <div class="container mx-auto px-4 py-4 md:py-10 px-4" @click.stop>
        <div class="px-4 pt-10 pb-4 md:py-10 px-4 shadow-2xl my-10 max-h-screen overflow-auto bg-white relative">
          <slot />

          <button :aria-label="$t('modal.close')" class="text-xl absolute top-0 right-0 px-4 py-3" @click="hide">
            <font-awesome-icon :icon="['fas', 'times']" />
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Vue, Component, Provide } from 'vue-property-decorator'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { FModalInterface } from '~/types/modalInterface'

@Component({
  components: { FontAwesomeIcon }
})
export default class FModal extends Vue implements FModalInterface {
  @Provide() modalShowing = false

  public show (): void {
    this.modalShowing = true
  }

  public hide (): void {
    this.modalShowing = false
    this.$emit('close')
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
