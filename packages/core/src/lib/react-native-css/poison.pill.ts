throw new Error(`react-native-css has encountered a setup error. 

┌─────-─┐
| Metro | 
└─────-─┘

Either your metro.config.js is missing the 'withReactNativeCSS' wrapper OR
the resolver.resolveRequest function of your config is being overridden, and not calling the parent resolver.

When using 3rd party libraries, please use withReactNativeCSS as the innermost function when composing Metro configs.

\`\`\`ts
const config = getDefaultConfig(__dirname);
module.exports = with3rdPartyPlugin(
  withReactNativeCSS(config)
)
\`\`\`

┌─────----------─┐
| Other bundlers | 
└─────----------─┘

If you are using another bundler (Vite, Webpack, etc), or non-Metro framework (Next.js, Remix, etc), please ensure you have included 'react-native-css/babel' as a babel preset.
`)

export {}
