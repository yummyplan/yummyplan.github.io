import 'reflect-metadata'
import { Serializable, JsonProperty } from 'typescript-json-serializer'

@Serializable()
export class Color {
  @JsonProperty() r: number
  @JsonProperty() g: number
  @JsonProperty() b: number

  constructor (r: number, g: number, b: number) {
    this.r = r
    this.g = g
    this.b = b
  }

  get rgb (): string {
    return `rgb(${this.r}, ${this.g}, ${this.b})`
  }

  get hex (): string {
    const r = this.r.toString(16).padStart(2, '0')
    const g = this.g.toString(16).padStart(2, '0')
    const b = this.b.toString(16).padStart(2, '0')

    return `#${r}${g}${b}`
  }
}
