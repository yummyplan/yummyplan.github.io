import { shallowMount } from '@vue/test-utils'
import I18nCollector from '~/tests/testUtils/I18nCollector'
import WeekplanTable from '~/components/Weekplan/WeekplanTable.vue'

describe('components/weekplan/WeekplanTable.vue', () => {
  test('Renders with all week days and day times', () => {
    const i18nCollector = new I18nCollector()

    shallowMount(WeekplanTable, {
      mocks: {
        $t: (key: string): string => i18nCollector.tMock(key)
      }
    })

    expect(i18nCollector.translationKeys).toContain('daytimes.breakfast')
    expect(i18nCollector.translationKeys).toContain('daytimes.lunch')
    expect(i18nCollector.translationKeys).toContain('daytimes.dinner')
    expect(i18nCollector.translationKeys).toContain('weekdays.mon')
    expect(i18nCollector.translationKeys).toContain('weekdays.tue')
    expect(i18nCollector.translationKeys).toContain('weekdays.wed')
    expect(i18nCollector.translationKeys).toContain('weekdays.thu')
    expect(i18nCollector.translationKeys).toContain('weekdays.fri')
    expect(i18nCollector.translationKeys).toContain('weekdays.sat')
    expect(i18nCollector.translationKeys).toContain('weekdays.sun')
  })
})
