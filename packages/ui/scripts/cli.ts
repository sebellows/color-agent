// index.js

// Import necessary modules
import fs from 'fs/promises' // For asynchronous file operations
import path from 'path'
import { BaseTokenProperties, MetadataExtension, Token, TokenType } from './types'
import { METADATA_EXTENSION } from './constants'
// import yargs from 'yargs/yargs' // For parsing command-line arguments
// import { hideBin } from 'yargs/helpers'

// Configuration & Constants
const ROOT_PATH = path.resolve(__dirname, '..')
const SRC_PATH = path.resolve(ROOT_PATH, 'src')
const INPUT_DIR_PATH = path.join(__dirname, 'tokens')
const OUTPUT_PATH = path.join(__dirname, 'theme-tokens.json')
const OUTPUT_FILE_PATH = path.join(SRC_PATH, 'theme/tokens-theme.ts')

// Command-Line Argument Parsing
// const argv = yargs(hideBin(process.argv))
//     .option('input', {
//         alias: 'i',
//         type: 'string',
//         description: 'Path to the token JSON file directory',
//         default: DEFAULT_INPUT_DIR_PATH,
//     })
//     .option('output', {
//         alias: 'o',
//         type: 'string',
//         description: 'Path to the output theme.ts file',
//         default: DEFAULT_OUTPUT_FILE_PATH,
//     })
//     .help().argv

type ThemeTokenRecord = { [key: string]: Token }
type ThemeTokenGroup = {
    [key: string]: {
        $type?: TokenType
        $description?: string
        $extensions?: {
            metadata: { 'com.coloragent.metadata': MetadataExtension }
        } & ThemeTokenRecord
    }
}

type TokenJSON = {
    theme: ThemeTokenGroup
}

async function main() {
    // const inputFile = argv.input
    // const outputFile = argv.output
    const inputDir = INPUT_DIR_PATH.split('/').pop() ?? 'tokens'

    // 1. Access directory
    const files = await fs.readdir(INPUT_DIR_PATH).catch(error => {
        if (error.code === 'ENOTDIR') {
            // Specific error for directory not found
            console.error(`Error: The input directory "${inputDir}" does not exist.`)
        } else {
            console.error('Stack:', error.stack)
        }
        process.exit(1) // Exit with a non-zero code to indicate an error
    })

    const tokens: Record<string, ThemeTokenRecord> = {}

    // 1. Read Input
    for await (const file of files) {
        const filePath = path.join(INPUT_DIR_PATH, file)
        const stats = await fs.stat(filePath).catch(error => {
            if (error.code === 'ENOENT') {
                // Specific error for file not found
                console.error(`Error: The input file "${filePath}" does not exist.`)
            } else {
                console.error('Stack:', error.stack)
            }
            process.exit(1) // Exit with a non-zero code to indicate an error
        })

        if (stats.isFile() && path.extname(file) === '.json') {
            console.log(`Reading file: ${filePath}`)
            const contents = await fs.readFile(filePath, 'utf8') // Read file content
            const jsonData = JSON.parse(contents) as TokenJSON // Parse JSON content

            if (tokens.theme === undefined) {
                tokens.theme = {}
            }
            if (jsonData.theme === undefined) {
                console.warn(`Warning: The file "${file}" does not contain a "theme" property`)
                continue
            }
            for (const value of Object.values(jsonData.theme)) {
                const { $type, $description, $extensions, ...group } = value
                for (const [tokenKey, tokenValue] of Object.entries(group as ThemeTokenRecord)) {
                    if ($type && !tokenValue.$type) {
                        tokenValue.$type = $type
                    }
                    if ($extensions && !tokenValue.$extensions) {
                        tokenValue.$extensions = $extensions
                    }
                    if ($description && !tokenValue.$description) {
                        tokenValue.$description = $description
                    }
                    tokens.theme[tokenKey] = tokenValue
                }
            }
        } else {
            console.warn(`Skipping non-JSON file: ${filePath}`)
        }
    }

    await fs.writeFile(OUTPUT_PATH, JSON.stringify(tokens, null, 4), 'utf8')
}

main()
