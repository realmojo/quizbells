// eslint.config.js (또는 .ts)
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 1. next + typescript 설정 확장
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 2. 그 위에 추가 설정 (덮어쓰기 가능)
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      // ✅ any 허용: 완전히 끄기
      "@typescript-eslint/no-explicit-any": "off",

      // 또는 다음과 같이 경고만 띄우고 빌드 실패는 막을 수도 있음
      // "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];

export default eslintConfig;
