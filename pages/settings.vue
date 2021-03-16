<template>
  <div>
    <h1 class="text-3xl mb-4">
      {{ $t('settings.title') }}
    </h1>

    <h2 class="text-2xl mb-4">
      {{ $t('settings.backupAndRestore') }}
    </h2>

    <p class="mb-4">
      {{ $t('settings.backupAndRestoreText') }}
    </p>

    <div class="flex flex-wrap">
      <f-button class="mr-4 mb-4" @click="download">
        <font-awesome-icon :icon="['fas', 'save']" class="mr-4" />
        {{ $t('settings.downloadData') }}
      </f-button>

      <f-button class="mb-4" @click="$refs.fileupload.click()">
        <font-awesome-icon :icon="['fas', 'file-upload']" class="mr-4" />
        {{ $t('settings.restoreData') }}
      </f-button>

      <input ref="fileupload" type="file" class="hidden" @input="restoreFromFile">
    </div>

    <a id="download-link" ref="downloadLink" class="hidden" href="#" download="yummyplan.txt" />

    <h2 class="text-2xl mb-4">
      {{ $t('settings.randomize') }}
    </h2>

    <p class="mb-4">
      {{ $t('settings.randomizeText') }}
    </p>

    <div class="flex flex-wrap mb-4">
      <div class="w-full md:w-2/3 shadow-md">
        <weekplan-table class="w-full">
          <template v-for="key in dayTimeKeys" #[key]="{ dayKey, timeKey }">
            <draggable
              :key="key"
              v-model="allowedTagsInRandom[dayKey][timeKey]"
              :group="{ name: key, put: true }"
              ghost-class="ghost"
              :sort="true"
              :animation="120"
              class="pt-2 pl-2"
            >
              <tag-pill v-for="tag in allowedTagsInRandom[dayKey][timeKey]" :key="tag.name" :tag="tag" :show-name="true" class="mr-2 mb-2" />
            </draggable>
          </template>
        </weekplan-table>
      </div>

      <div class="w-full md:w-1/3 px-4">
        <p class="mb-4">
          ({{ $t('settings.randomizeHint') }})
        </p>
        <draggable
          v-model="tags"
          :group="{ name: 'tag', pull: 'clone', put: true }"
          ghost-class="ghost"
        >
          <transition-group>
            <tag-pill v-for="tag in tags" :key="tag.name" :tag="tag" :show-name="true" class="mr-2 mb-2" />
          </transition-group>
        </draggable>
      </div>
    </div>

    <h2 class="text-2xl mb-4">
      {{ $t('settings.font.title') }}
    </h2>

    <p class="mb-4">
      {{ $t('settings.font.text') }}
    </p>

    <div class="flex flex-wrap">
      <f-button class="mr-4 mb-4 font-nanum" @click="setFont('nanum')">
        {{ $t('settings.font.nanum') }}
      </f-button>

      <f-button class="mr-4 mb-4 font-opendyslexic" @click="setFont('opendyslexic')">
        {{ $t('settings.font.opendyslexic') }}
      </f-button>
    </div>

    <h2 class="text-2xl mb-4">
      {{ $t('settings.dangerZone') }}
    </h2>

    <p class="mb-4">
      {{ $t('settings.dangerZoneText') }}
    </p>

    <div class="flex flex-wrap">
      <f-button v-if="hasAcceptedCookies" class="mr-4 mb-4" @click="revokeCookies">
        <font-awesome-icon :icon="['fas', 'times']" class="mr-4" />
        {{ $t('settings.revokeCookies') }}
      </f-button>

      <f-button v-else class="mr-4 mb-4" @click="acceptCookies">
        <font-awesome-icon :icon="['fas', 'check']" class="mr-4" />
        {{ $t('settings.acceptCookies') }}
      </f-button>

      <f-button class="mb-4" @click="deleteAllData">
        <font-awesome-icon :icon="['fas', 'trash']" class="mr-4" />
        {{ $t('settings.deleteAllData') }}
      </f-button>
    </div>
  </div>
</template>

<script lang="ts">
import { deserialize } from 'typescript-json-serializer'
import { Vue, Component, Provide } from 'vue-property-decorator'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Draggable from 'vuedraggable'
import FButton from '~/components/FButton.vue'
import WeekplanTable from '~/components/Weekplan/WeekplanTable.vue'
import TagPill from '~/components/Weekplan/TagPill.vue'
import { Tag } from '~/model/tag/Tag'
import { AllowedTags } from '~/model/store/AllowedTags'
import { DayTimesType } from '~/model/store/Dayplan'
import { WeekdaysType } from '~/model/store/Weekplan'
import { SerializableMealplanSettings } from '~/model/store/SerializableMealplanSettings'
import { DayplanType } from '~/model/store/DayplanType'

@Component({
  components: { TagPill, WeekplanTable, FButton, Draggable, FontAwesomeIcon },
  head (this: Settings) {
    return {
      title: this.$t('settings.title') as string
    }
  }
})
export default class Settings extends Vue {
  $refs!: {
    downloadLink: HTMLLinkElement
    fileupload: HTMLInputElement
  }

  @Provide() meals = this.$store.state.meals
  @Provide() ingredients = this.$store.state.ingredients

  @Provide() days: WeekdaysType[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  @Provide() dayTimes: DayTimesType[] = ['breakfast', 'lunch', 'dinner']

  @Provide() hasAcceptedCookies = localStorage.getItem('cookiesAccepted') === 'yes'

  get tags (): Tag[] {
    return this.$store.state.tags
  }

  set tags (_: Tag[]) {
    // noop
  }

  /**
   * Returns a nested proxy for v-model setting.
   */
  get allowedTagsInRandom (): AllowedTags {
    const allowedTagsInRandom = this.$store.state.allowedTagsInRandom

    const handler = {
      /**
       * Wrap individual weekday in a Proxy as well to allow for nested setting.
       */
      get: (target: AllowedTags, day: WeekdaysType): DayplanType<Tag[]> => {
        /* istanbul ignore if */
        if (typeof target[day] !== 'object' || target[day] === null) {
          return target[day]
        }

        return new Proxy(target[day], {
          set: (_: DayplanType<Tag[]>, time: DayTimesType, tags: Tag[]): boolean => {
            this.$store.commit('SET_TAGS', {
              day, time, tags
            })

            return true
          }
        })
      }
    }

    return new Proxy(allowedTagsInRandom, handler)
  }

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

  /**
   * Downloads the entire store as JSON
   */
  download (): void {
    const data = encodeURIComponent(JSON.stringify(this.$store.getters.serializable))
    const download = this.$refs.downloadLink
    download.setAttribute('href', `data:text/json;charset=utf-8,${data}`)
    download.click()
  }

  /**
   * Actually restores the state from file.
   * @param e
   */
  restoreFromFile (e: { target: { files: Blob[] } }): void {
    const files = e.target.files

    if (files.length === 0) {
      return
    }

    const reader = new FileReader()
    reader.onload = (event: ProgressEvent<FileReader>): void => {
      const data = event?.target?.result as string

      if (data) {
        const parsedData = JSON.parse(data)
        const state = deserialize<SerializableMealplanSettings>(parsedData, SerializableMealplanSettings)

        this.$store.commit('SET_MEALPLANSETTINGS', state)
        this.$refs.fileupload.value = ''
      }
    }

    reader.readAsText(files[0])
  }

  /**
   * Deletes all data
   */
  deleteAllData (): void {
    const data = localStorage.getItem('state')

    if (data) {
      localStorage.setItem('state', '')
    }
  }

  /**
   * Accepts cookies
   */
  acceptCookies (): void {
    localStorage.setItem('cookiesAccepted', 'yes')
    this.hasAcceptedCookies = true
  }

  /**
   * Revokes cookies
   */
  revokeCookies (): void {
    localStorage.setItem('cookiesAccepted', 'no')
    this.hasAcceptedCookies = false
    this.deleteAllData()
  }

  /**
   * Sets the desired font
   * @param font
   */
  setFont (font: string): void {
    localStorage.setItem('font', font)

    this.$nuxt.$emit('setFont', font)
  }
}
</script>

<style>
.ghost-class {
  background: transparent;
}
</style>
