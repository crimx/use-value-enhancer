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

It triggers re-rendering when new value emitted from val (base on val `$version` instead of React's `Object.is` comparison).

```tsx
import { val } from "value-enhancer";
import { useVal } from "use-value-enhancer";

const val$ = val("value");

function Component({ val$ }) {
  const value = useVal(val$);
  return <p>{value}</p>;
}
```

### useDerived

`useDerived` accepts a val from anywhere and returns the latest derived value.

Re-rendering is triggered when the derived value changes.

```tsx
import { val } from "value-enhancer";
import { useDerived } from "use-value-enhancer";

const val$ = val("1");

function Component({ val$ }) {
  const derived = useDerived(val$, value => Number(value));
  return <p>{derived}</p>;
}
```

### useFlatten

`useFlatten` accepts a val from anywhere and returns the latest value from the flatten val.

Re-rendering is triggered when the flatten value changes.

```tsx
import { val } from "value-enhancer";
import { useFlatten } from "use-value-enhancer";

const val$ = val(val("1"));

function Component({ val$ }) {
  const value = useFlatten(val$); // "1"
  return <p>{value}</p>;
}
```

```tsx
import { val } from "value-enhancer";
import { reactiveMap } from "value-enhancer/collections";
import { useFlatten } from "use-value-enhancer";

const map = reactiveMap();
map.set("a", val("1"));

function Component({ map }) {
  const value = useFlatten(map.$, map => map.get("a")); // "1"
  return <p>{value}</p>;
}
```

### useKeys

`useKeys` accepts a reactive collection and returns the latest `keys()` as array.

```tsx
import { reactiveMap } from "value-enhancer/collections";
import { useKeys } from "use-value-enhancer";

const map = reactiveMap();

function Component({ map }) {
  const keys = useKeys(map);
  return keys.map(key => <p key={key}>{key}</p>);
}
```

### useValues

`useValues` accepts a reactive collection and returns the latest `values()` as array.

```tsx
import { reactiveSet } from "value-enhancer/collections";
import { useValues } from "use-value-enhancer";

const set = reactiveSet();

function Component({ set }) {
  const values = useValues(set);
  return values.map(value => <p key={String(value)}>{value}</p>);
}
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
