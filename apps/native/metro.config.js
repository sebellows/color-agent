// Learn more https://docs.expo.io/guides/customizing-metro
// For monorepo support, see https://docs.expo.dev/guides/monorepos/#modify-the-metro-config
const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')
// const MetroSymlinksResolver = require('@rnx-kit/metro-resolver-symlinks')
const { withReactNativeCSS } = require('@coloragent/core')

// Find the project and workspace directories
const projectRoot = __dirname
// Find the workspace root, this can be replaced with `find-yarn-workspace-root`
const workspaceRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot]
// 2. Force Metro to resolve (sub)dependencies from the folders below
config.resolver.disableHierarchicalLookup = true
// 3. Let Metro know where to resolve packages, and in what order: i.e., first
//    the project root, then the workspace root, and finally the workspace root's
//    `node_modules/.pnpm` folder.
config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'node_modules', '.pnpm', 'node_modules'),
]

module.exports = withReactNativeCSS(config, {
    globalClassNamePolyfill: true,
})
