import TagsPage from '~/pages/tags.vue'
import { Tag } from '~/model/tag/Tag'
import { Color } from '~/model/tag/Color'
import testEditPageFactory from '~/tests/pages/testEditPageFactory'

const tags = [
  new Tag('Foo', new Color(0, 0, 0), ''),
  new Tag('Bar', new Color(0, 0, 0), ''),
  new Tag('Baz', new Color(0, 0, 0), '')
]

const testEditPage = testEditPageFactory<Tag>(
  TagsPage,
  tags,
  new Tag('', new Color(255, 255, 255), ''),
  'tags',
  'tags',
  'SET_TAG',
  'UPDATE_TAG_PROPERTY',
  'DELETE_TAG',
  'tag',
  'tags'
)

describe('pages/tags.ts', () => {
  beforeEach(() => {
    testEditPage.beforeEach()
  })

  test('Renders', () => {
    testEditPage.testRenders()
  })

  test('Deletes tag', () => {
    testEditPage.testDelete()
  })

  test('Updates tag', () => {
    testEditPage.testUpdates('name', 'Hello, World!')
  })

  test('Creates new tag', () => {
    testEditPage.testCreate()
  })
})
