import { createRequire } from "module";
const require = createRequire(import.meta.url);

const nextConfig = require("eslint-config-next");
const nextCoreWebVitals = require("eslint-config-next/core-web-vitals");

// 确保配置是数组格式
const ensureArray = (config) => Array.isArray(config) ? config : [config];

const eslintConfig = [
  ...ensureArray(nextConfig),
  ...ensureArray(nextCoreWebVitals),
];

export default eslintConfig;
