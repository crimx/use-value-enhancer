# use-value-enhancer

[![Build Status](https://github.com/crimx/use-value-enhancer/actions/workflows/build.yml/badge.svg)](https://github.com/crimx/use-value-enhancer/actions/workflows/build.yml)
[![npm-version](https://img.shields.io/npm/v/use-value-enhancer.svg)](https://www.npmjs.com/package/use-value-enhancer)
[![Coverage Status](https://img.shields.io/coveralls/github/crimx/use-value-enhancer/main)](https://coveralls.io/github/crimx/use-value-enhancer?branch=main)
[![minified-size](https://img.shields.io/bundlephobia/minzip/use-value-enhancer)](https://bundlephobia.com/package/use-value-enhancer)

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?maxAge=2592000)](http://commitizen.github.io/cz-cli/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-brightgreen.svg?maxAge=2592000)](https://conventionalcommits.org)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

React hooks for [value-enhancer](https://github.com/crimx/value-enhancer).

### Install

```bash
npm add use-value-enhancer value-enhancer react
```

### Usage

```ts
import { useVal } from "use-value-enhancer";

const value = useVal(val$);
```

### Example

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { val } from "value-enhancer";
import { useVal } from "use-value-enhancer";

export const App = ({ prefix$ }) => {
  const prefix = useVal(prefix$);
  return <div>{prefix} World!</div>;
};

const prefix$ = val("Hello");
ReactDOM.createRoot(document.getElementById("root")).render(
  <App prefix$={prefix$} />
);
```
