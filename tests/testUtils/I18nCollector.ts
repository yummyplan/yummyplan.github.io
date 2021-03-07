export default class I18nCollector {
  /**
   * Collection of translation keys to check against
   */
  translationKeys: string[]

  constructor () {
    this.translationKeys = []
  }

  /**
   * Mocks the $t function
   * @param key
   */
  tMock (key: string): string {
    this.translationKeys.push(key)

    return key
  }
}
