<template>
  <div class="bg-gray-100 min-h-screen">
    <div class="container mx-auto px-4">
      <header-navigation class="mb-6" />

      <nuxt />

      <footer-navigation class="mt-12" />

      <hello-modal
        ref="helloModal"
        @acceptCookies="e => acceptCookies(e)"
        @declineCookies="e => declineCookies(e)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { deserialize } from 'typescript-json-serializer'
import HeaderNavigation from '~/components/Frame/HeaderNavigation.vue'
import FooterNavigation from '~/components/Frame/FooterNavigation.vue'
import HelloModal from '~/components/Modal/HelloModal.vue'
import FButton from '~/components/FButton.vue'
import { SerializableMealplanSettings } from '~/model/store/SerializableMealplanSettings'
import { FModalInterface } from '~/types/modalInterface'
import baseDataDe from '~/init/baseDataDe'
import baseDataEn from '~/init/baseDataEn'

@Component({
  components: { HeaderNavigation, FooterNavigation, HelloModal, FButton }
})
export default class DefaultLayout extends Vue {
  $refs!: {
    helloModal: FModalInterface
  }

  mounted (): void {
    const data = localStorage.getItem('state')

    if (data) {
      const parsedData = JSON.parse(data)
      const state = deserialize<SerializableMealplanSettings>(parsedData, SerializableMealplanSettings)
      this.$store.commit('SET_MEALPLANSETTINGS', state)
    } else {
      this.$refs.helloModal.show()
    }

    this.$forceUpdate()
  }

  acceptCookies (lang: string): void {
    localStorage.setItem('cookiesAccepted', 'yes')

    if (lang === 'de') {
      this.$store.commit('SET_MEALPLANSETTINGS', baseDataDe)
      this.$router.push('/de')
    }

    if (lang === 'en') {
      this.$store.commit('SET_MEALPLANSETTINGS', baseDataEn)
    }

    this.$refs.helloModal.hide()
  }

  declineCookies (): void {
    localStorage.setItem('cookiesAccepted', 'no')
    this.$refs.helloModal.hide()
  }
}
</script>

<style scoped>
.default-enter-active,
.default-leave-active {
  transition-property: opacity;
  transition-timing-function: ease-in-out;
  transition-duration: 200ms;
}
.default-enter,
.default-leave-to {
  opacity: 0;
}
</style>
