import 'reflect-metadata'
import { Serializable, JsonProperty } from 'typescript-json-serializer'
import { Color } from '~/model/tag/Color'

@Serializable()
export class Tag {
  @JsonProperty() name: string
  @JsonProperty() color: Color
  @JsonProperty() icon: string

  constructor (name: string, color: Color, icon: string) {
    this.name = name
    this.color = color
    this.icon = icon
  }
}
