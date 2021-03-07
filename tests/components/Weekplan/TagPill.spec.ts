import { shallowMount } from '@vue/test-utils'
import TagPill from '~/components/Weekplan/TagPill.vue'
import { Tag } from '~/model/tag/Tag'
import { Color } from '~/model/tag/Color'

describe('components/Weekplan/TagPill.vue', () => {
  test('Renders with emoji icon', () => {
    const tag = new Tag('Some tag', new Color(255, 102, 0), '🚀')

    const wrapper = shallowMount(TagPill, {
      propsData: {
        tag
      }
    })

    expect(wrapper.text()).toEqual('🚀')
    expect(wrapper.find('div').attributes().style).toEqual('background-color: rgb(255, 102, 0);')
  })

  test('Renders with tag text', () => {
    const tag = new Tag('Some tag', new Color(255, 102, 0), '🚀')

    const wrapper = shallowMount(TagPill, {
      propsData: {
        tag,
        showName: true
      }
    })

    expect(wrapper.text().replace(/\s+/g, ' ')).toEqual('🚀 Some tag')
    expect(wrapper.find('div').attributes().style).toEqual('background-color: rgb(255, 102, 0);')
  })
})
