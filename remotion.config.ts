import path from "node:path";

import { Config } from "@remotion/cli/config";
import webpack from "webpack";

Config.setEntryPoint("./remotion/index.ts");

const remotionFonts = path.resolve(process.cwd(), "remotion/fonts.ts");

Config.overrideWebpackConfig((currentConfiguration) => ({
  ...currentConfiguration,
  resolve: {
    ...currentConfiguration.resolve,
    alias: {
      ...(currentConfiguration.resolve?.alias ?? {}),
      "@": path.resolve(process.cwd()),
      "@/lib/home/fonts": remotionFonts,
      "@/lib/home/fonts.ts": remotionFonts,
    },
  },
  plugins: [
    ...(currentConfiguration.plugins ?? []),
    new webpack.NormalModuleReplacementPlugin(/lib\/home\/fonts(?:\.ts)?$/, remotionFonts),
  ],
}));
