import { AnyRecord } from '@coloragent/utils'
import {
    DefaultValues,
    FieldValues,
    SubmitErrorHandler,
    SubmitHandler,
    UseFormProps,
} from 'react-hook-form'
import { Except, PartialDeep } from 'type-fest'

import { SlottablePressableProps, SlottableTextProps, SlottableViewProps } from '../types'

/**
 * From radix-ui
 */

// type ValidityMap = { [fieldName: string]: ValidityState | undefined }
// type CustomMatcherEntriesMap = { [fieldName: string]: CustomMatcherEntry[] }
// type CustomErrorsMap = { [fieldName: string]: Record<string, boolean> }

// type ValidityStateKey = keyof ValidityState
// type SyncCustomMatcher = (value: string, formData: FormData) => boolean
// type AsyncCustomMatcher = (value: string, formData: FormData) => Promise<boolean>
// type CustomMatcher = SyncCustomMatcher | AsyncCustomMatcher
// type CustomMatcherEntry = { id: string; match: CustomMatcher }
// type SyncCustomMatcherEntry = { id: string; match: SyncCustomMatcher }
// type AsyncCustomMatcherEntry = { id: string; match: AsyncCustomMatcher }
// type CustomMatcherArgs = [string, FormData]

// type ValidationContextValue = {
//     getFieldValidity(fieldName: string): ValidityState | undefined
//     onFieldValidityChange(fieldName: string, validity: ValidityState): void

//     getFieldCustomMatcherEntries(fieldName: string): CustomMatcherEntry[]
//     onFieldCustomMatcherEntryAdd(fieldName: string, matcherEntry: CustomMatcherEntry): void
//     onFieldCustomMatcherEntryRemove(fieldName: string, matcherEntryId: string): void

//     getFieldCustomErrors(fieldName: string): Record<string, boolean>
//     onFieldCustomErrorsChange(fieldName: string, errors: Record<string, boolean>): void

//     onFieldValiditionClear(fieldName: string): void
// }

/**
 * Primitive Form Types
 */

export type RootProps<
    TFormFields extends FieldValues = FieldValues,
    TContext = any,
    TTransformedValues = TFormFields,
> = SlottableViewProps &
    UseFormProps<TFormFields, TContext, TTransformedValues> & {
        onSubmit?: SubmitHandler<TTransformedValues>
        onInvalid?: SubmitErrorHandler<TFormFields>
        onReset?: (event?: React.BaseSyntheticEvent) => unknown | Promise<unknown>
    }

export type LabelProps = SlottableTextProps
export type MessageProps = SlottableTextProps
export type ControlProps = SlottableViewProps
export type ResetProps = SlottablePressableProps
export type SubmitProps = SlottablePressableProps
export type LegendProps = SlottableTextProps
