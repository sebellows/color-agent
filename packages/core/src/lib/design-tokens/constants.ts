import path from 'path'

export const METADATA_EXTENSION = 'com.coloragent.metadata'

export const ROOT_PATH = path.resolve(__dirname, '..')
export const SRC_PATH = path.resolve(ROOT_PATH, 'src')
export const TOKENS_INPUT_DIR_PATH = path.join(__dirname, 'tokens')
export const TEMP_DIR_PATH = path.join(__dirname, '.tmp')
export const PARSED_TOKENS_FILE_PATH = path.join(TEMP_DIR_PATH, 'parsed-tokens.json')
// export const TOKENS_OUTPUT_TEST_PATH = path.join(__dirname, '__test-tokens.css')
export const TOKENS_OUTPUT_FILE_PATH = path.join(SRC_PATH, 'tailwind.css')
// export const MISC_TAILWIND_AT_RULES_FILE_PATH = path.join(__dirname, 'tailwind-directives.json')
