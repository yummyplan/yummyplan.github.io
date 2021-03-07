<template>
  <table class="bg-white shadow-md border-white border-8 select-none">
    <thead>
      <tr class="border-b-2 border-gray-400">
        <th class="w-1/7">
          <slot name="corner" />
        </th>
        <th v-for="(dayTime, key) in dayTimes" :key="key" class="w-2/7 border-l-2 border-gray-400 p-4">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span v-html="$t(`daytimes.${dayTime}`)" />
          <slot :name="dayTime" />
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="dayKey in days" :key="dayKey" class="border-b-2 border-gray-400" :class="{ 'bg-green-100': dayKey === currentWeekday && showCurrentDay }">
        <td class="text-center font-bold py-8">
          {{ $t(`weekdays.${dayKey}`) }}
          <slot :name="dayKey" :dayKey="dayKey" />
        </td>
        <td
          v-for="timeKey in dayTimes"
          :key="`${dayKey}/${timeKey}`"
          class="border-l-2 border-gray-400"
          :data-day="dayKey"
          :data-time="timeKey"
        >
          <slot :name="`${dayKey}/${timeKey}`" :dayKey="dayKey" :timeKey="timeKey" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Provide } from '~/node_modules/vue-property-decorator'
import { WeekdaysType } from '~/model/store/Weekplan'
import { DayTimesType } from '~/model/store/Dayplan'

@Component
export default class WeekplanTable extends Vue {
  @Prop({ default: true }) readonly showCurrentDay!: boolean

  @Provide() days: WeekdaysType[] = [
    'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'
  ]

  @Provide() dayTimes: DayTimesType[] = ['breakfast', 'lunch', 'dinner']

  get currentWeekday (): WeekdaysType {
    const weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    const today = new Date()

    return weekdays[today.getDay()] as WeekdaysType
  }
}
</script>
