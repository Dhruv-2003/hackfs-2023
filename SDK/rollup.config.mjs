import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import postcss from "rollup-plugin-postcss";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import sucrase from "@rollup/plugin-sucrase";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";

import packageJson from "./package.json" assert { type: "json" };

export default [
  {
    input: "sdk/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      json(),
      sucrase({
        exclude: ["node_modules/**"],
        transforms: ["typescript", "jsx"],
      }),
      postcss(),
      terser(),
    ],
    external: [
      "next",
      "wagmi",
      "viem"
    ],
  },
  {
    input: "dist/esm/types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts.default()],

    external: [/\.css$/],
  },
];