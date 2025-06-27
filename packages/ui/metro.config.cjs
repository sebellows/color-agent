// Learn more https://docs.expo.io/guides/customizing-metro
// For monorepo support, see https://docs.expo.dev/guides/monorepos/#modify-the-metro-config
const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')
const MetroSymlinksResolver = require('@rnx-kit/metro-resolver-symlinks')

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

// add SVG compatibility
config.transformer = {
    ...config.transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
}
config.resolver = {
    ...config.resolver,
    assetExts: config.resolver.assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...config.resolver.sourceExts, 'svg'],
    unstable_enablePackageExports: true,
    unstable_conditionNames: ['require', 'node', 'import'],
}

const symlinkResolver = MetroSymlinksResolver({
    experimental_retryResolvingFromDisk: 'force',
})

config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (moduleName.startsWith('@ui/')) {
        return context.resolveRequest(context, moduleName, platform)
    }
    return symlinkResolver(context, moduleName, platform)
}

config.transformer.getTransformOptions = async () => ({
    transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
    },
})

module.exports = config
