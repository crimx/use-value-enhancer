# use-value-enhancer

<p align="center">
  <img width="200" src="https://raw.githubusercontent.com/crimx/value-enhancer/main/assets/value-enhancer.svg">
</p>

[![Build Status](https://github.com/crimx/use-value-enhancer/actions/workflows/build.yml/badge.svg)](https://github.com/crimx/use-value-enhancer/actions/workflows/build.yml)
[![npm-version](https://img.shields.io/npm/v/use-value-enhancer.svg)](https://www.npmjs.com/package/use-value-enhancer)
[![Coverage Status](https://img.shields.io/coveralls/github/crimx/use-value-enhancer/main)](https://coveralls.io/github/crimx/use-value-enhancer?branch=main)
[![minified-size](https://img.shields.io/bundlephobia/minzip/use-value-enhancer)](https://bundlephobia.com/package/use-value-enhancer)

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?maxAge=2592000)](http://commitizen.github.io/cz-cli/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-brightgreen.svg?maxAge=2592000)](https://conventionalcommits.org)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

React hooks for [value-enhancer](https://github.com/crimx/value-enhancer).

## Install

```bash
npm add use-value-enhancer value-enhancer react
```

## Usage

### useVal

`useVal` accepts a val from anywhere and returns the latest value.

It only triggers re-rendering when new value emitted from val (base on `val.compare` not `Object.is` comparison from React `useState`).

```ts
import { useVal } from "use-value-enhancer";

const value = useVal(val$);
```

### Example

```jsx
import React, { createContext, useContext } from "react";
import ReactDOM from "react-dom/client";
import { val } from "value-enhancer";
import { useVal } from "use-value-enhancer";

const valFromProps$ = val("Props");
const valFromContext$ = val("Context");
const valFromExternal = val("External");

const ValContext = createContext(valFromContext$);

export const App = ({ valFromProps$ }) => {
  const valFromProps = useVal(valFromProps$);

  const valFromContext$ = useContext(ValContext);
  const valFromContext = useVal(valFromContext$);

  const valFromExternal = useVal(valFromExternal$);

  return (
    <>
      <p>
        {valFromProps}, {valFromContext}, {valFromExternal}
      </p>
      <p>Props, Context, External</p>
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <ValContext.Provider value={valFromContext$}>
    <App valFromProps$={valFromProps$} />
  </ValContext.Provider>
);
```

### useDerived

`useDerived` accepts a val from anywhere and returns the latest derived value.

Re-rendering is triggered when the derived value changes (`Object.is` comparison from React `useState`).

```ts
import { useDerived } from "use-value-enhancer";

const value = useDerived(val$, value => Number(value));
```
