import { Templates } from '@react-formgen/zod'
import { BaseArrayTemplate } from './array'
import { BaseBigIntTemplate } from './bigint'
import { BaseBooleanTemplate } from './boolean'
import { BaseDateTemplate } from './date'
import { BaseEnumTemplate } from './enum'
import { BaseNumberTemplate } from './number'
import { BaseObjectTemplate } from './object'
import { BaseStringTemplate } from './string'
import { BaseTupleTemplate } from './tuple'
import { BaseUnionTemplate } from './union'

export const BaseTemplates: Templates = {
  StringTemplate: BaseStringTemplate,
  NumberTemplate: BaseNumberTemplate,
  BooleanTemplate: BaseBooleanTemplate,
  BigIntTemplate: BaseBigIntTemplate,
  DateTemplate: BaseDateTemplate,
  ArrayTemplate: BaseArrayTemplate,
  ObjectTemplate: BaseObjectTemplate,
  UnionTemplate: BaseUnionTemplate,
  TupleTemplate: BaseTupleTemplate,
  EnumTemplate: BaseEnumTemplate,
}
