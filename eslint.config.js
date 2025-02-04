import eslintPluginPrettierRecommended from  "eslint-plugin-prettier/recommended";
export default [
  {
    "languageOptions" : {
      "ecmaVersion": 2022,
      "sourceType": "module",
    },
    "settings": {
      'import/core-modules': ['dayjs'],
    },
    "presets": ["@babel/preset-env"],
    "rules": {},
    "files": ["*.test.js", "**/build/**", "**/node_modules/**"],
    "ignores": ["*.test.js", "**/build/**", "**/node_modules/**"],
  },
  eslintPluginPrettierRecommended
]
