import 'reflect-metadata'
import { Serializable } from 'typescript-json-serializer'
import { Weekplan } from '~/model/store/Weekplan'
import { Tag } from '~/model/tag/Tag'

@Serializable()
export class AllowedTags extends Weekplan<Array<Tag>> {}
