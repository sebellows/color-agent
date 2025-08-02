export const VAR_SYMBOL = Symbol('coloragent-react-native-css.var')
export const STYLE_FUNCTION_SYMBOL = Symbol('coloragent-react-native-css.styleFunction')

export const ROOT_FONT_SIZE = 16 as const

export const LOCAL_STORAGE_KEY = 'coloragent-async-local-storage' as const

export const INLINE_RULE_SYMBOL = Symbol('coloragent-react-native-css.inlineRule')

export const DEFAULT_CONTAINER_NAME = 'container:___default___' as const

export const DEFAULT_LOGGER_NAME = 'coloragent-react-native-css:metro' as const

export const COMMA_SEPARATOR = Symbol('COMMA_SEPARATOR') // was CommaSeparator

export const RN_CSS_EM_PREFIX = '__rn-css-em' as const
export const RN_ID_PREFIX = '-rn-' as const

export type Noop = () => void
export const noop: Noop = () => {}
