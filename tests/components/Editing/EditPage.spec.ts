import { mount } from '@vue/test-utils'
import { spy } from 'sinon'
import EditPage from '~/components/Editing/EditPage.vue'
import FButton from '~/components/FButton.vue'
import I18nCollector from '~/tests/testUtils/I18nCollector'

describe('components/Editing/EditPage.vue', () => {
  test('Renders', () => {
    const i18nCollector = new I18nCollector()

    const showModalFn = spy()
    const hideModalFn = spy()
    const createNewFn = spy()
    const deleteFn = spy()

    const wrapper = mount(EditPage, {
      stubs: {
        FModal: {
          template: '<div></div>',
          methods: {
            show: showModalFn,
            hide: hideModalFn
          }
        },
        FontAwesomeIcon: {
          template: '<span />'
        }
      },
      propsData: {
        translationKey: 'mocked',
        createNewEntityFunction: createNewFn,
        deleteEntityFunction: deleteFn
      },
      slots: {
        searchableList: 'Searchable list'
      },
      mocks: {
        $t: (key: string): string => i18nCollector.tMock(key)
      }
    })

    expect(i18nCollector.translationKeys).toContain('mocked.title')
    expect(i18nCollector.translationKeys).toContain('mocked.introduction')
    expect(i18nCollector.translationKeys).toContain('mocked.edit.new')

    expect(wrapper.html()).toContain('Searchable list')
  })

  test('Calls "create new" function and opens the modal, deletes and closes again, opens on edit', async () => {
    const i18nCollector = new I18nCollector()

    const showModalFn = spy()
    const hideModalFn = spy()
    const createNewFn = spy()
    const deleteFn = spy()
    const items = [0, 1, 2, 3]

    const wrapper = mount(EditPage, {
      stubs: {
        FModal: {
          template: '<div></div>',
          methods: {
            show: showModalFn,
            hide: hideModalFn
          }
        },
        FontAwesomeIcon: {
          template: '<span />'
        }
      },
      propsData: {
        translationKey: 'mocked',
        createNewEntityFunction: createNewFn,
        deleteEntityFunction: deleteFn,
        items
      },
      slots: {
        searchableList: 'Searchable list'
      },
      mocks: {
        $t: (key: string): string => i18nCollector.tMock(key)
      }
    })

    await wrapper.findAllComponents(FButton).at(0).trigger('click')

    expect(createNewFn).toBeCalled()
    expect(showModalFn).toBeCalled()

    expect(wrapper.vm.$data.editingEntity).toBeTruthy()
    expect(wrapper.vm.$data.editingEntity).toEqual(3)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const instance = wrapper.vm as EditPage<number>

    instance.deleteEntity(3)

    expect(deleteFn).toBeCalledWith(3)
    expect(hideModalFn).toBeCalled()

    instance.edit(3)

    expect(showModalFn).toBeCalled()
    expect(instance.editingEntity).toEqual(3)
  })
})
