module.exports = {
  "extends": [
    "airbnb-typescript",
    "plugin:react-hooks/recommended"
  ],
  "env": {
    "browser": true,
    "commonjs": true,
    "jasmine": true,
    "jest": true,
    "es6": true,
  },
  "rules": {
    "arrow-parens": [
      "error",
      "as-needed",
      { "requireForBlockBody": true }
    ],
    "arrow-body-style": "off",
    "class-methods-use-this": "off",
    "comma-dangle": "off",
    "consistent-return": "off",
    "func-names": "off",
    "import/no-extraneous-dependencies": "off",
    "indent": [
      "error",
      2,
      {
        "SwitchCase": 1,
        "FunctionDeclaration": { "parameters": "first" },
        "FunctionExpression": { "parameters": "first" }
      }
    ],
    "linebreak-style": 0,
    "max-len": [
      "error",
      {
        "code": 170,
        "ignoreComments": true
      }
    ],
    "newline-per-chained-call": "off",
    "no-constant-condition": [
      "error",
      { "checkLoops": false }
    ],
    "no-eq-null": "error",
    "no-mixed-operators": [
      "error",
      { "groups": [["+", "-", "*", "/", "%", "**"]] }
    ],
    "no-multiple-empty-lines": [
      "error",
      { "max": 1 }
    ],
    "no-param-reassign": "off",
    "no-plusplus": [
      "error",
      { "allowForLoopAfterthoughts": true }
    ],
    "no-restricted-globals": [
      "error",
      "Handsontable",
      "window",
      "document",
    ],
    "no-underscore-dangle": "off",
    "no-use-before-define": [
      "error",
      {
        "functions": false,
        "classes": false
      }
    ],
    "no-void": "off",
    "padded-blocks": "off",
    "quotes": [ "error", "single" ],
    "space-before-function-paren": ["error", "never"],
  },
  "overrides": [
    {
      "files": ["cypress/**/*", "src/testbed/cypress/**/*"],
      "rules": {
        "no-undef": "off",
      }
    },
    {
      "files": ["*"],
      "rules": {
        "import/prefer-default-export": "off",
        "import/no-cycle": "off",
        "react/jsx-props-no-spreading": "off",
        "no-console": "off", // disable at least until the end of SpreadsheetViewer beta
        "import/no-unresolved": "off",
        "@typescript-eslint/no-unused-vars": "off", // temporarily disabled, need to discuss
        "react/prop-types": "off", // temporarily disabled, need to discuss
        "no-bitwise": "off", // temporarily disabled, need to discuss
        "no-restricted-globals": "off", // temporarily disabled, need to discuss
        "import/extensions": "off"
      }
    }
  ],
}
