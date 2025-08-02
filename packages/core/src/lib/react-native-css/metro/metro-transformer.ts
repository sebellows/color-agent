import type {
  JsTransformerConfig,
  JsTransformOptions,
  TransformResponse,
} from "metro-transform-worker";

const worker =
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("@expo/metro-config/build/transform-worker/transform-worker.js") as typeof import("metro-transform-worker");

export function transform(
  config: JsTransformerConfig,
  projectRoot: string,
  filePath: string,
  data: Buffer,
  options: JsTransformOptions,
): Promise<TransformResponse> {
  const isCss = options.type !== "asset" && /\.(s?css|sass)$/.test(filePath);
  const skipCompile =
    options.customTransformOptions &&
    "reactNativeCSSCompile" in options.customTransformOptions &&
    options.customTransformOptions.reactNativeCSSCompile === false;

  if (!isCss || skipCompile) {
    return worker.transform(config, projectRoot, filePath, data, options);
  }

  // TODO - compile the CSS file inline

  return worker.transform(config, projectRoot, filePath, data, options);
}
