import fs from 'fs'
import path from 'path'
import { isPlainObject } from '@coloragent/utils'
import type { TokenGroup } from './types'
import {
    TOKENS_INPUT_DIR_PATH,
    PARSED_TOKENS_FILE_PATH,
    TEMP_DIR_PATH,
} from '@core/lib/design-tokens/constants'

type TokenJSON = {
    theme: { [key: string]: TokenGroup }
}

function parseTokens(group: TokenGroup, parentGroup: TokenGroup = {}, themeGroup: TokenGroup = {}) {
    let { $type, $description: _$description, $extensions = {} } = parentGroup as TokenGroup

    if ('$type' in group) {
        $type = group.$type
    }
    if ('$extensions' in group) {
        Object.assign($extensions, group.$extensions)
    }

    for (const [tokenKey, tokenValue] of Object.entries(group)) {
        if (!isPlainObject(tokenValue)) {
            console.warn(`Warning: Level 2 "${tokenKey}" is not a valid token. Skipping.`)
            continue
        }

        themeGroup[tokenKey] = tokenValue
    }
}

export function flattenTokens() {
    const inputDir = TOKENS_INPUT_DIR_PATH.slice().split('/').pop() ?? 'tokens'

    try {
        // 1. Access directory
        const files = fs.readdirSync(TOKENS_INPUT_DIR_PATH)

        const tokens = {
            theme: {} as { [key: string]: TokenGroup },
        }

        // 2. Read Input
        for (const file of files) {
            if (file.includes('.web')) continue // Skip web-specific files

            const filePath = path.join(TOKENS_INPUT_DIR_PATH, file)

            let stats: fs.Stats | undefined

            try {
                stats = fs.statSync(filePath)
            } catch (error) {
                if (error instanceof Error) {
                    if ((error as any)?.code === 'ENOENT') {
                        // Specific error for file not found
                        console.error(`Error: The input file "${filePath}" does not exist.`)
                    } else {
                        console.error('Stack:', error.stack)
                    }
                    process.exit(1) // Exit with a non-zero code to indicate an error
                }
            }

            if (stats?.isFile() && path.extname(file) === '.json') {
                console.log(`Reading file: ${filePath}`)
                const contents = fs.readFileSync(filePath, 'utf8') // Read file content
                const jsonData = JSON.parse(contents) as TokenJSON // Parse JSON content

                if (jsonData.theme === undefined) {
                    console.warn(`Warning: The file "${file}" does not contain a "theme" property`)
                    continue
                }
                // parseTokens(jsonData.theme)
                for (const [groupKey, groupValue] of Object.entries(jsonData.theme)) {
                    const { $type, $description, $extensions, ...group } = groupValue as TokenGroup
                    // console.warn(`TEST: The group "${groupKey}" has a type of "${$type}"`)
                    let themeGroup = {} as TokenGroup
                    const partialGroup = {
                        $type,
                        $description,
                        $extensions: structuredClone($extensions),
                    } as TokenGroup
                    if (
                        isPlainObject(tokens.theme?.[groupKey]) &&
                        !('$value' in tokens.theme[groupKey])
                    ) {
                        themeGroup = groupValue
                    } else {
                        tokens.theme[groupKey] = partialGroup
                        themeGroup = tokens.theme[groupKey]
                    }

                    for (const [tokenKey, tokenValue] of Object.entries(group as TokenGroup)) {
                        if (!isPlainObject(tokenValue)) {
                            console.warn(`Warning: "${tokenKey}" is not a valid token. Skipping.`)
                            continue
                        }
                        if (!('$value' in tokenValue)) {
                            console.warn(
                                `Warning: "${groupKey}.${tokenKey}" is not a valid token. Skipping.`,
                            )
                            parseTokens(tokenValue, groupValue, themeGroup)
                        } else {
                            themeGroup[tokenKey] = tokenValue
                        }
                    }
                }
            } else {
                console.warn(`Skipping non-JSON file: ${filePath}`)
            }
        }

        if (!fs.existsSync(TEMP_DIR_PATH)) {
            fs.mkdirSync(TEMP_DIR_PATH)
        }

        fs.writeFileSync(PARSED_TOKENS_FILE_PATH, JSON.stringify(tokens, null, 4), 'utf8')
    } catch (error) {
        if (error instanceof Error) {
            if ((error as any)?.code === 'ENOTDIR') {
                // Specific error for directory not found
                console.error(`Error: The input directory "${inputDir}" does not exist.`)
            } else {
                console.error('Stack:', error.stack)
            }
            process.exit(1) // Exit with a non-zero code to indicate an error
        }
    }
}
