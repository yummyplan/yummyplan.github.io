<template>
  <f-modal ref="helloModal">
    <h1 class="mb-4 pb-4 text-3xl border-b border-gray-400">
      Hey there, welcome to Yummyplan / Hallo, willkommen beim Yummyplan
    </h1>

    <h2 class="mb-4 text-2xl">
      English
    </h2>

    <p class="mb-4">
      Yummyplan is an app that helps you plan your meals
      for an entire week! Add new meals and ingredients, tag them, plan them, download your week plan and generate a
      grocery list, all in one!
    </p>

    <p class="mb-4">
      But before you can get started, you need some default data and we need a bit of consent from your side.
    </p>

    <p class="mb-4 pb-4 border-b border-gray-400 font-bold">
      In order to save all your meals, ingredients, tags, settings and meal plans, we need to store them in your browser. No additional
      data is saved, no analytics takes place, we don't track you whatsoever. By selecting a language for your
      default data, you agree that this is OK for you. To not show you this thing in the future, we will set a small cookie.
    </p>

    <h2 class="mb-4 text-2xl">
      Deutsch
    </h2>

    <p class="mb-4">
      Yummyplan ist eine App, die dir dabei hilft deine
      Mahlzeiten für eine ganze Woche zu planen! Füge neue Menüs und Zutaten hinzu, verpasse ihnen Tags, plane sie,
      lade deinen Wochenplan als PDF herunter und generiere eine EInkaufsliste, alles in einem!
    </p>

    <p class="mb-4">
      Aber bevor du anfangen kannst, brauchst du ein paar Grunddaten und wir deine Zustimmung.
    </p>

    <p class="mb-4 pb-4 border-b border-gray-400 font-bold">
      Um alle deine Menüs, Zutaten, Tags, Einstellungen und Wochenpläne zu sichern, speichern wir sie in deinem Browser.
      Wir speichern keine weiteren Daten ab, machen keine Nutzeranalyse und tracken doch nicht. Wenn du eine Sprache
      für deine Standard-Daten auswählst, bist du damit einverstanden. Um dir dieses Fenster nicht jedes mal zeigen
      zu müssen, speichern wir ein kleines Cookie.
    </p>

    <div class="flex flex-wrap">
      <div class="w-full md:w-1/3 px-4 pb-4">
        <f-button class="w-full accept-en" @click="acceptCookies('en')">
          Agree and add english meals, tags and ingredients
        </f-button>
      </div>

      <div class="w-full md:w-1/3 px-4 pb-4">
        <f-button class="w-full accept-de" @click="acceptCookies('de')">
          Zustimmen und deutschsprachige Menüs, Tags und Zutaten hinzufügen.
        </f-button>
      </div>

      <div class="w-full md:w-1/3 px-4 pb-4">
        <f-button class="w-full decline" @click="declineCookies">
          Decline / ablehnen
        </f-button>
      </div>
    </div>
  </f-modal>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import FModal from '~/components/Modal/FModal.vue'
import FButton from '~/components/FButton.vue'
import { FModalInterface } from '~/types/modalInterface'

@Component({
  components: { FModal, FButton }
})
export default class HelloModal extends Vue implements FModalInterface {
  $refs!: {
    helloModal: FModalInterface
  }

  /**
   * Shows the modal
   */
  show (): void {
    this.$refs.helloModal.show()
  }

  /**
   * Hides the modal
   */
  hide (): void {
    this.$refs.helloModal.hide()
  }

  /**
   * Accept cookies
   * @param langName
   */
  acceptCookies (langName: string): void {
    this.$emit('acceptCookies', langName)
  }

  /**
   * Decline cookies
   */
  declineCookies (): void {
    this.$emit('declineCookies')
  }
}
</script>
