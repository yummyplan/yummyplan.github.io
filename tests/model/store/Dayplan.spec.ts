import { spy } from 'sinon'
import { deserializer } from '~/model/store/Dayplan'
import { Tag } from '~/model/tag/Tag'
import { Meal } from '~/model/meal/Meal'

const deserializeSpy = spy()

jest.mock('typescript-json-serializer', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deserialize<T> (value: any, typeArg: T): any {
    deserializeSpy(value, typeArg)
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/ban-types
  Serializable: (): Function => (): void => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/ban-types
  JsonProperty: (): Function => (): void => {}
}))

describe('model/store/Dayplan.ts', () => {
  test('Should deserialize arrays into tags', () => {
    deserializeSpy.resetHistory()

    deserializer(['a'])

    expect(deserializeSpy).toBeCalledWith('a', Tag)
  })

  test('Should deserialize arrays into tags', () => {
    deserializeSpy.resetHistory()

    deserializer('a')

    expect(deserializeSpy).toBeCalledWith('a', Meal)
  })
})
