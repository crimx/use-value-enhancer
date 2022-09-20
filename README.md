# use-value-enhancer

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
ReactDOM.createRoot(document.getElementById("root"))
  .render(<App prefix$={prefix$} />);
```
