import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  {
    ignores: [".next/**", ".next-app/**", ".next-app_stale_20260324_3/**", "build/**", "node_modules/**", "tmp/**"]
  },
  ...nextVitals,
  ...nextTypescript
];

export default config;
